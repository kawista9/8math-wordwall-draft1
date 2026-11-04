export async function complimentaryAccess(user,env,now=Math.floor(Date.now()/1000)){
 let row;
 try{row=await env.DB.prepare('SELECT expires_at,revoked FROM complimentary_access WHERE user_id=?').bind(user).first();}
 catch(error){if(/no such table/i.test(error.message||''))return null;throw error;}
 return row&&!row.revoked&&(row.expires_at===null||row.expires_at>now)?row:null;
}
export async function complimentaryTeacherAccess(user,env,now=Math.floor(Date.now()/1000)){
 const grant=await complimentaryAccess(user,env,now);
 if(!grant)return null;
 try{
  const role=await env.DB.prepare('SELECT plan FROM complimentary_roles WHERE user_id=?').bind(user).first();
  return role?.plan==='teacher'?grant:null;
 }catch(error){if(/no such table/i.test(error.message||''))return null;throw error;}
}
export async function complimentaryAPI(path,body,user,env){
 const reply=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
 if(!env.OWNER_USER_ID||user!==env.OWNER_USER_ID)return reply({error:'Only the owner can manage complimentary access.'},403);
 try{await env.DB.prepare('SELECT user_id FROM complimentary_access LIMIT 1').first();}
 catch(error){if(/no such table/i.test(error.message||''))return reply({error:'Apply the complimentary access database setup first.'},503);throw error;}
 if(path==='/api/complimentary/list'){
  const rows=await env.DB.prepare('SELECT user_id,label,expires_at,revoked,created_at FROM complimentary_access ORDER BY created_at DESC LIMIT 500').all();
  let roles=[];
  try{roles=(await env.DB.prepare('SELECT user_id,plan FROM complimentary_roles').all()).results;}
  catch(error){if(!/no such table/i.test(error.message||''))throw error;}
  const plans=new Map(roles.map(row=>[row.user_id,row.plan]));
  return reply({grants:rows.results.map(row=>({...row,plan:plans.get(row.user_id)||'individual'}))});
 }
 const learner=typeof body.userId==='string'?body.userId.trim():'';
 if(!/^user_[a-zA-Z0-9]{1,100}$/.test(learner)||learner===env.OWNER_USER_ID)return reply({error:'Copy the account’s User ID from Clerk.'},400);
 if(path==='/api/complimentary/grant'){
  const plan=body.plan??'individual';
  if(!['individual','teacher'].includes(plan))return reply({error:'Choose individual or teacher access.'},400);
  const expiry=body.expiresAt===null?null:Number(body.expiresAt),now=Math.floor(Date.now()/1000);
  if(expiry!==null&&(!Number.isInteger(expiry)||expiry<=now))return reply({error:'Choose a future expiration time or ongoing access.'},400);
  const label=typeof body.label==='string'?body.label.trim().slice(0,120):'';
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS complimentary_roles (user_id TEXT PRIMARY KEY,plan TEXT NOT NULL CHECK(plan IN ('individual','teacher')))").run();
  await env.DB.batch([
   env.DB.prepare('INSERT INTO complimentary_access(user_id,label,expires_at,revoked,created_at,granted_by) VALUES(?,?,?,0,?,?) ON CONFLICT(user_id) DO UPDATE SET label=excluded.label,expires_at=excluded.expires_at,revoked=0,created_at=excluded.created_at,granted_by=excluded.granted_by').bind(learner,label,expiry,now,user),
   env.DB.prepare('INSERT INTO complimentary_roles(user_id,plan) VALUES (?,?) ON CONFLICT(user_id) DO UPDATE SET plan=excluded.plan').bind(learner,plan)
  ]);
  return reply({saved:true});
 }
 if(path==='/api/complimentary/revoke'){
  await env.DB.prepare('UPDATE complimentary_access SET revoked=1 WHERE user_id=?').bind(learner).run();return reply({saved:true});
 }
 return reply({error:'Not found'},404);
}
