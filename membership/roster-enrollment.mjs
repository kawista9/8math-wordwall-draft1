import {createClerkClient} from '@clerk/backend';
import {ensureRosterTables} from './roster.mjs';
import {SEAT_LIMIT} from './billing.mjs';

export async function ensureEnrollmentTables(env) {
 await ensureRosterTables(env);
 await env.DB.batch([
  env.DB.prepare(`CREATE TABLE IF NOT EXISTS roster_enrollments (
   teacher_id TEXT NOT NULL, email TEXT NOT NULL, learner_id TEXT NOT NULL,
   PRIMARY KEY(teacher_id,email))`),
  env.DB.prepare(`CREATE TABLE IF NOT EXISTS roster_removals (
   teacher_id TEXT NOT NULL, learner_id TEXT NOT NULL,
   PRIMARY KEY(teacher_id,learner_id))`),
  env.DB.prepare('CREATE INDEX IF NOT EXISTS roster_uploads_email ON roster_uploads(email)')
 ]);
}

// The profile must come from Clerk's authenticated backend lookup, never request JSON.
export function verifiedEmails(profile,user) {
 if(profile?.id!==user || profile.banned || profile.locked)return [];
 return [...new Set((profile.emailAddresses || [])
  .filter(address=>address.verification?.status==='verified')
  .map(address=>String(address.emailAddress || '').trim().toLowerCase())
  .filter(Boolean))];
}

export async function enrollVerifiedLearner(user,profile,env,teacherActive) {
 await ensureEnrollmentTables(env);
 const emails=verifiedEmails(profile,user);
 const result={state:'ready',matched:0,enrolled:0,full:false};
 if(!emails.length)return {...result,state:'unverified'};
 const rows=await env.DB.prepare(`SELECT r.* FROM roster_uploads r
  WHERE r.email IN (${emails.map(()=>'?').join(',')}) AND r.teacher_id<>?
  AND NOT EXISTS (SELECT 1 FROM roster_removals b WHERE b.teacher_id=r.teacher_id AND b.learner_id=?)
  ORDER BY r.teacher_id,r.email`).bind(...emails,user,user).all();
 for(const row of rows.results) {
  if(!await teacherActive(row.teacher_id,env))continue;
  result.matched++;
  // Recheck roster and removal state at insertion time, and retain the atomic seat cap.
  await env.DB.batch([
   env.DB.prepare(`INSERT INTO learners(teacher_id,learner_id,display_name,joined_at)
    SELECT teacher_id,?,first_name || ' ' || last_name,? FROM roster_uploads r
    WHERE teacher_id=? AND email=?
    AND NOT EXISTS (SELECT 1 FROM roster_removals b WHERE b.teacher_id=r.teacher_id AND b.learner_id=?)
    AND (SELECT COUNT(*) FROM learners WHERE teacher_id=r.teacher_id) < ?
    ON CONFLICT(teacher_id,learner_id) DO NOTHING`)
    .bind(user,Math.floor(Date.now()/1000),row.teacher_id,row.email,user,SEAT_LIMIT),
   env.DB.prepare(`INSERT INTO roster_enrollments(teacher_id,email,learner_id)
    SELECT r.teacher_id,r.email,? FROM roster_uploads r
    WHERE r.teacher_id=? AND r.email=?
    AND EXISTS (SELECT 1 FROM learners l WHERE l.teacher_id=r.teacher_id AND l.learner_id=?)
    ON CONFLICT(teacher_id,email) DO UPDATE SET learner_id=excluded.learner_id`)
    .bind(user,row.teacher_id,row.email,user)
  ]);
  const joined=await env.DB.prepare('SELECT learner_id FROM learners WHERE teacher_id=? AND learner_id=?').bind(row.teacher_id,user).first();
  if(joined)result.enrolled++;else result.full=true;
 }
 return result;
}

export async function autoEnroll(user,env,teacherActive) {
 if(!env.CLERK_SECRET_KEY)return {state:'unavailable'};
 try {
  const clerk=createClerkClient({secretKey:env.CLERK_SECRET_KEY});
  const profile=await clerk.users.getUser(user);
  return await enrollVerifiedLearner(user,profile,env,teacherActive);
 } catch(error) {
  console.error('Roster enrollment check failed',error.name);
  return {state:'error'};
 }
}

export async function removeLearner(teacher,learner,env) {
 await ensureEnrollmentTables(env);
 await env.DB.batch([
  env.DB.prepare('INSERT OR IGNORE INTO roster_removals(teacher_id,learner_id) VALUES (?,?)').bind(teacher,learner),
  env.DB.prepare('DELETE FROM learners WHERE teacher_id=? AND learner_id=?').bind(teacher,learner)
 ]);
}

export async function rosterWithStatus(teacher,env) {
 await ensureEnrollmentTables(env);
 const rows=await env.DB.prepare(`SELECT r.first_name,r.last_name,r.email,
  CASE WHEN l.learner_id IS NOT NULL THEN 'Active'
   WHEN b.learner_id IS NOT NULL THEN 'Removed' ELSE 'Awaiting first sign-in' END AS enrollment_status
  FROM roster_uploads r
  LEFT JOIN roster_enrollments e ON e.teacher_id=r.teacher_id AND e.email=r.email
  LEFT JOIN learners l ON l.teacher_id=e.teacher_id AND l.learner_id=e.learner_id
  LEFT JOIN roster_removals b ON b.teacher_id=e.teacher_id AND b.learner_id=e.learner_id
  WHERE r.teacher_id=? ORDER BY r.last_name,r.first_name`).bind(teacher).all();
 return rows.results;
}
