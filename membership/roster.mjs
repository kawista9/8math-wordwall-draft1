import {SEAT_LIMIT} from './billing.mjs';
export const JOIN_SQL = `INSERT INTO learners(teacher_id,learner_id,display_name,joined_at)
SELECT ?,?,?,? WHERE (SELECT COUNT(*) FROM learners WHERE teacher_id=?) < ?
ON CONFLICT(teacher_id,learner_id) DO NOTHING`;
export async function hashCode(code){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(code)))].map(x=>x.toString(16).padStart(2,'0')).join('');}
export async function createJoinLink(teacher,env){
 const token=[...crypto.getRandomValues(new Uint8Array(32))].map(x=>x.toString(16).padStart(2,'0')).join('');
 await env.DB.prepare('INSERT INTO classrooms(teacher_id,join_hash) VALUES (?,?) ON CONFLICT(teacher_id) DO UPDATE SET join_hash=excluded.join_hash').bind(teacher,await hashCode(token)).run();
 return `${env.SITE_URL}/account?join=${token}`;
}
export async function joinClass(user,body,env,teacherActive){
 if(!/^[a-f0-9]{64}$/.test(body.code || ''))return {error:'This class link is invalid.',status:400};
 const classroom=await env.DB.prepare('SELECT teacher_id FROM classrooms WHERE join_hash=?').bind(await hashCode(body.code)).first();
 if(!classroom || classroom.teacher_id===user || !await teacherActive(classroom.teacher_id,env))return {error:'This class is not available. Ask your teacher for a current link.',status:403};
 const name=String(body.displayName || '').trim().slice(0,80);
 if(!name)return {error:'Enter a name your teacher will recognize.',status:400};
 await env.DB.prepare(JOIN_SQL).bind(classroom.teacher_id,user,name,Math.floor(Date.now()/1000),classroom.teacher_id,SEAT_LIMIT).run();
 const joined=await env.DB.prepare('SELECT learner_id FROM learners WHERE teacher_id=? AND learner_id=?').bind(classroom.teacher_id,user).first();
 if(!joined)return {error:'This class has reached its 150 learner limit. Please contact your teacher.',status:409};
 return {joined:true};
}
