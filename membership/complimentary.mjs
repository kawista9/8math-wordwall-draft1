export async function complimentaryAccess(user,env,now=Math.floor(Date.now()/1000)){
 let row;
 try{row=await env.DB.prepare('SELECT expires_at,revoked FROM complimentary_access WHERE user_id=?').bind(user).first();}
 catch(error){if(/no such table/i.test(error.message||''))return null;throw error;}
 return row&&!row.revoked&&(row.expires_at===null||row.expires_at>now)?row:null;
}
export async function complimentaryAPI(path,body,user,env){
 const reply=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
 if(!env.OWNER_USER_ID||user!==env.OWNER_USER_ID)return reply({error:'Only the owner can manage complimentary access.'},403);
 try{await env.DB.prepare('SELECT user_id FROM complimentary_access LIMIT 1').first();}
 catch(error){if(/no such table/i.test(error.message||''))return reply({error:'Apply the complimentary access database setup first.'},503);throw error;}
 if(path==='/api/complimentary/list'){
  const rows=await env.DB.prepare('SELECT user_id,label,expires_at,revoked,created_at FROM complimentary_access ORDER BY created_at DESC LIMIT 500').all();
  return reply({grants:rows.results});
 }
 const learner=typeof body.userId==='string'?body.userId.trim():'';
 if(!/^user_[a-zA-Z0-9]{1,100}$/.test(learner)||learner===env.OWNER_USER_ID)return reply({error:'Copy the individual learner’s User ID from Clerk.'},400);
 if(path==='/api/complimentary/grant'){
  const expiry=body.expiresAt===null?null:Number(body.expiresAt),now=Math.floor(Date.now()/1000);
  if(expiry!==null&&(!Number.isInteger(expiry)||expiry<=now))return reply({error:'Choose a future expiration time or ongoing access.'},400);
  const label=typeof body.label==='string'?body.label.trim().slice(0,120):'';
  await env.DB.prepare('INSERT INTO complimentary_access(user_id,label,expires_at,revoked,created_at,granted_by) VALUES(?,?,?,0,?,?) ON CONFLICT(user_id) DO UPDATE SET label=excluded.label,expires_at=excluded.expires_at,revoked=0,created_at=excluded.created_at,granted_by=excluded.granted_by').bind(learner,label,expiry,now,user).run();
  return reply({saved:true});
 }
 if(path==='/api/complimentary/revoke'){
  await env.DB.prepare('UPDATE complimentary_access SET revoked=1 WHERE user_id=?').bind(learner).run();return reply({saved:true});
 }
 return reply({error:'Not found'},404);
}
