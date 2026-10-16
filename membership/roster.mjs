import {SEAT_LIMIT} from './billing.mjs';
export const JOIN_SQL = `INSERT INTO learners(teacher_id,learner_id,display_name,joined_at)
SELECT ?,?,?,? WHERE (SELECT COUNT(*) FROM learners WHERE teacher_id=?) < ?
ON CONFLICT(teacher_id,learner_id) DO NOTHING`;
export async function hashCode(code){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(code)))].map(x=>x.toString(16).padStart(2,'0')).join('');}
export async function createJoinLink(teacher,env){
 return `${env.SITE_URL}/account?join=${await classCode(teacher,env,true)}`;
}
export async function joinClass(user,body,env,teacherActive){
 const code=String(body.code || '').trim().replace(/[\s-]/g,'');
 const normalized=/^[a-f0-9]{64}$/.test(code)?code:code.toUpperCase();
 if(!/^(?:[a-f0-9]{64}|[A-HJ-NP-Z2-9]{12})$/.test(normalized))return {error:'Enter the 12-character class code from your teacher.',status:400};
 const classroom=await env.DB.prepare('SELECT teacher_id FROM classrooms WHERE join_hash=?').bind(await hashCode(normalized)).first();
 if(!classroom || classroom.teacher_id===user || !await teacherActive(classroom.teacher_id,env))return {error:'This class is not available. Ask your teacher for a current class code.',status:403};
 const name=String(body.displayName || '').trim().slice(0,80);
 if(!name)return {error:'Enter a name your teacher will recognize.',status:400};
 await env.DB.prepare(JOIN_SQL).bind(classroom.teacher_id,user,name,Math.floor(Date.now()/1000),classroom.teacher_id,SEAT_LIMIT).run();
 const joined=await env.DB.prepare('SELECT learner_id FROM learners WHERE teacher_id=? AND learner_id=?').bind(classroom.teacher_id,user).first();
 if(!joined)return {error:'This class has reached its 150 learner limit. Please contact your teacher.',status:409};
 return {joined:true};
}

// Additive tables keep existing invitation links and enrolled learners working.
export async function ensureRosterTables(env) {
 await env.DB.prepare(`CREATE TABLE IF NOT EXISTS class_codes (
 teacher_id TEXT PRIMARY KEY, code TEXT NOT NULL UNIQUE)`).run();
 await env.DB.prepare(`CREATE TABLE IF NOT EXISTS roster_uploads (
 teacher_id TEXT NOT NULL, email TEXT NOT NULL, first_name TEXT NOT NULL,
 last_name TEXT NOT NULL, PRIMARY KEY(teacher_id,email))`).run();
}
export async function classCode(teacher,env,rotate=false) {
 await ensureRosterTables(env);
 const existing=await env.DB.prepare('SELECT code FROM class_codes WHERE teacher_id=?').bind(teacher).first();
 if(existing && !rotate)return existing.code;
 const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
 const code=[...crypto.getRandomValues(new Uint8Array(12))].map(n=>alphabet[n%32]).join('');
 // One transaction keeps the displayed code and its joining hash consistent.
 await env.DB.batch([
  env.DB.prepare('INSERT INTO class_codes(teacher_id,code) VALUES (?,?) ON CONFLICT(teacher_id) DO UPDATE SET code=excluded.code').bind(teacher,code),
  env.DB.prepare('INSERT INTO classrooms(teacher_id,join_hash) VALUES (?,?) ON CONFLICT(teacher_id) DO UPDATE SET join_hash=excluded.join_hash').bind(teacher,await hashCode(code))
 ]);
 return code;
}
export function validateRoster(rows) {
 if(!Array.isArray(rows) || !rows.length || rows.length>SEAT_LIMIT)throw new Error('Upload between 1 and 150 learners.');
 const emails=new Set();
 return rows.map((r,i)=>{
  const firstName=String(r.firstName || '').trim(),lastName=String(r.lastName || '').trim(),email=String(r.email || '').trim().toLowerCase();
  if(!firstName || !lastName || firstName.length>80 || lastName.length>80)throw new Error(`Row ${i+2}: enter first and last names (80 characters maximum each).`);
  if(email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error(`Row ${i+2}: enter a valid school email address.`);
  if(emails.has(email))throw new Error(`Row ${i+2}: this email appears more than once.`);
  emails.add(email);return {firstName,lastName,email};
 });
}
export async function uploadRoster(teacher,body,env) {
 let rows;try{rows=validateRoster(body.rows);}catch(e){return {error:e.message,status:400};}
 await ensureRosterTables(env);
 const statements=[env.DB.prepare('DELETE FROM roster_uploads WHERE teacher_id=?').bind(teacher)];
 // Keep each D1 statement below its binding limit, including full 150-row rosters.
 for(let i=0;i<rows.length;i+=20){
  const chunk=rows.slice(i,i+20);
  statements.push(env.DB.prepare('INSERT INTO roster_uploads(teacher_id,email,first_name,last_name) VALUES '+chunk.map(()=>'(?,?,?,?)').join(',')).bind(...chunk.flatMap(r=>[teacher,r.email,r.firstName,r.lastName])));
 }
 await env.DB.batch(statements);
 return {saved:rows.length};
}
