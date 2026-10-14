const VIDEO_ID=/^[A-Za-z0-9_-]{11}$/;
const DEFAULT_CHANNEL_URL='https://www.youtube.com/@MyelinatedMelanin';
const now=()=>Math.floor(Date.now()/1000);
const schemas=new WeakMap();

export function youtubeVideoId(value) {
 if(typeof value!=='string')return '';
 const text=value.trim();if(VIDEO_ID.test(text))return text;
 try {
  const url=new URL(text);
  if(url.protocol!=='https:' || url.username || url.password)return '';
  const host=url.hostname.toLowerCase();let id='';
  if(host==='youtu.be')id=url.pathname.slice(1);
  else if(['youtube.com','www.youtube.com','m.youtube.com','www.youtube-nocookie.com'].includes(host)){
   id=url.pathname==='/watch'?url.searchParams.get('v'):url.pathname.match(/^\/(?:live|embed|shorts)\/([^/]+)\/?$/)?.[1];
  }
  return VIDEO_ID.test(id || '')?id:'';
 }catch{return '';}
}

export function youtubeChannelUrl(value) {
 if(!value)return '';
 try {
  const url=new URL(String(value).trim());
  if(url.protocol!=='https:' || url.username || url.password || !['youtube.com','www.youtube.com'].includes(url.hostname))return '';
  const match=url.pathname.match(/^\/(@[\p{L}\p{N}_.%-]+|channel\/UC[A-Za-z0-9_-]{22})(?:\/(?:streams|videos|featured))?\/?$/u);
  return match?'https://www.youtube.com/'+match[1]:'';
 }catch{return '';}
}

export async function ensureYoutubeTables(env) {
 if(schemas.has(env.DB))return schemas.get(env.DB);
 const setup=env.DB.batch([
  env.DB.prepare(`CREATE TABLE IF NOT EXISTS youtube_settings (id INTEGER PRIMARY KEY CHECK(id=1), channel_url TEXT NOT NULL DEFAULT '')`),
  env.DB.prepare('INSERT OR IGNORE INTO youtube_settings(id) VALUES(1)'),
  env.DB.prepare(`CREATE TABLE IF NOT EXISTS youtube_videos (
   video_id TEXT PRIMARY KEY, title TEXT NOT NULL DEFAULT 'Math tutorial',
   state TEXT NOT NULL DEFAULT 'unknown', starts_at INTEGER, ended_at INTEGER,
   embeddable INTEGER NOT NULL DEFAULT 0, hidden INTEGER NOT NULL DEFAULT 0,
   checked_at INTEGER NOT NULL DEFAULT 0)`),
  env.DB.prepare(`CREATE TABLE IF NOT EXISTS youtube_sync (
   id INTEGER PRIMARY KEY CHECK(id=1), next_check INTEGER NOT NULL DEFAULT 0,
   lock_token TEXT, lock_until INTEGER NOT NULL DEFAULT 0,
   last_checked INTEGER NOT NULL DEFAULT 0, state TEXT NOT NULL DEFAULT 'pending')`),
  env.DB.prepare('INSERT OR IGNORE INTO youtube_sync(id) VALUES(1)')
 ]).catch(error=>{schemas.delete(env.DB);throw error;});
 schemas.set(env.DB,setup);return setup;
}

function timestamp(value) {const time=Date.parse(value);return Number.isFinite(time)?Math.floor(time/1000):null;}
export function classifyVideo(item) {
 const details=item?.liveStreamingDetails || {};
 const available=item?.status?.privacyStatus!=='private' && ['processed','uploaded'].includes(item?.status?.uploadStatus);
 let state='unavailable';
 if(available){
  if(details.actualEndTime)state='completed';
  else if(details.actualStartTime && item.snippet?.liveBroadcastContent==='live')state='live';
  else if(item.snippet?.liveBroadcastContent==='upcoming' || details.scheduledStartTime)state='upcoming';
  else if(!details.actualStartTime)state='video';
 }
 return {state,title:String(item?.snippet?.title || 'Math tutorial').slice(0,200),
  startsAt:timestamp(details.actualStartTime || details.scheduledStartTime || item?.snippet?.publishedAt),
  endedAt:timestamp(details.actualEndTime),embeddable:available && item.status?.embeddable===true};
}

export async function refreshYoutube(env) {
 await ensureYoutubeTables(env);
 if(!env.YOUTUBE_API_KEY)return;
 const time=now(),token=crypto.randomUUID();
 const claim=await env.DB.prepare(`UPDATE youtube_sync SET lock_token=?,lock_until=?
  WHERE id=1 AND next_check<=? AND lock_until<=?`).bind(token,time+20,time,time).run();
 if(!claim.meta?.changes && !claim.changes)return;
 try {
  const current=await env.DB.prepare('SELECT video_id FROM live_settings WHERE id=1').first();
  if(current?.video_id)await env.DB.prepare('INSERT OR IGNORE INTO youtube_videos(video_id) VALUES(?)').bind(current.video_id).run();
  const tracked=await env.DB.prepare(`SELECT video_id FROM youtube_videos
   WHERE state IN ('unknown','live','upcoming') OR checked_at<?
   ORDER BY checked_at LIMIT 49`).bind(time-86400).all();
  const ids=[...new Set([current?.video_id,...tracked.results.map(r=>r.video_id)].filter(Boolean))];
  if(!ids.length){await env.DB.prepare("UPDATE youtube_sync SET state='idle',next_check=?,lock_until=0 WHERE lock_token=?").bind(time+60,token).run();return;}
  const url=new URL('https://www.googleapis.com/youtube/v3/videos');
  url.searchParams.set('part','snippet,liveStreamingDetails,status');url.searchParams.set('id',ids.join(','));
  // Keep the API key out of URLs, browser responses and logs.
  const response=await fetch(url,{headers:{'X-Goog-Api-Key':env.YOUTUBE_API_KEY},signal:AbortSignal.timeout(8000)});
  if(!response.ok)throw new Error('YouTube lookup failed');
  const payload=await response.json();if(!Array.isArray(payload.items))throw new Error('Invalid YouTube response');
  const updates=ids.map(id=>{
   const item=payload.items.find(video=>video.id===id);
   const data=classifyVideo(item);
   return env.DB.prepare(`UPDATE youtube_videos SET title=?,state=?,starts_at=?,ended_at=?,embeddable=?,checked_at=?
    WHERE video_id=? AND EXISTS(SELECT 1 FROM youtube_sync WHERE lock_token=?)`)
    .bind(data.title,data.state,data.startsAt,data.endedAt,Number(data.embeddable),time,id,token);
  });
  updates.push(env.DB.prepare("UPDATE youtube_sync SET state='ready',last_checked=?,next_check=?,lock_until=0 WHERE lock_token=?").bind(time,time+60,token));
  await env.DB.batch(updates);
 }catch(error){
  await env.DB.prepare("UPDATE youtube_sync SET state='error',next_check=?,lock_until=0 WHERE lock_token=?").bind(time+60,token).run();
  console.error('YouTube status check failed',error.name);
 }
}

export async function youtubePublicData(env) {
 await refreshYoutube(env);
 const settings=await env.DB.prepare('SELECT video_id,starts_at FROM live_settings WHERE id=1').first();
 const channel=await env.DB.prepare('SELECT channel_url FROM youtube_settings WHERE id=1').first();
 const sync=await env.DB.prepare('SELECT state,last_checked FROM youtube_sync WHERE id=1').first();
 const current=settings?.video_id?await env.DB.prepare('SELECT * FROM youtube_videos WHERE video_id=?').bind(settings.video_id).first():null;
 const live=!!env.YOUTUBE_API_KEY && sync?.state==='ready' && current?.state==='live' && current.checked_at>=now()-90;
 const replays=await env.DB.prepare("SELECT video_id,title,starts_at,embeddable FROM youtube_videos WHERE hidden=0 AND state IN ('completed','video') ORDER BY COALESCE(starts_at,checked_at) DESC LIMIT 100").all();
 return {settings:{video_id:settings?.video_id || '',starts_at:current?.state==='upcoming'?(current.starts_at || settings?.starts_at):settings?.starts_at>now()?settings.starts_at:null,
   is_live:live?1:0,title:current?.title || 'Math Help Live',embeddable:current?.embeddable===1,
   state:current?.state || 'unknown',checked_at:current?.checked_at || 0},
  channel_url:channel?.channel_url || DEFAULT_CHANNEL_URL,replays:replays.results,
  detection:{configured:!!env.YOUTUBE_API_KEY,state:env.YOUTUBE_API_KEY?sync.state:'unconfigured'}};
}

export async function saveYoutubeSettings(body,env) {
 const id=youtubeVideoId(body.videoId),channel=youtubeChannelUrl(body.channelUrl);
 if(body.videoId && !id)throw new Error('Paste a valid YouTube video link or 11-character video ID.');
 if(body.channelUrl && !channel)throw new Error('Paste your YouTube channel link, using its @handle or channel ID.');
 const start=body.startsAt===null?null:Number(body.startsAt);
 if(start!==null && (!Number.isInteger(start) || start<0))throw new Error('Choose a valid session time.');
 await ensureYoutubeTables(env);
 const statements=[
  env.DB.prepare('UPDATE live_settings SET video_id=?,is_live=0,starts_at=? WHERE id=1').bind(id,start),
  env.DB.prepare('UPDATE youtube_settings SET channel_url=? WHERE id=1').bind(channel),
  env.DB.prepare("UPDATE youtube_sync SET next_check=0,state='pending' WHERE id=1")
 ];
 if(id)statements.push(env.DB.prepare('INSERT OR IGNORE INTO youtube_videos(video_id) VALUES(?)').bind(id));
 await env.DB.batch(statements);
}

export async function saveReplay(body,env) {
 const id=youtubeVideoId(body.videoId);
 if(!id)throw new Error('Paste a valid YouTube tutorial link.');
 if(!env.YOUTUBE_API_KEY)throw new Error('Connect YouTube live detection before adding tutorials.');
 await ensureYoutubeTables(env);
 await env.DB.batch([
  env.DB.prepare("INSERT INTO youtube_videos(video_id) VALUES(?) ON CONFLICT(video_id) DO UPDATE SET hidden=0,state='unknown',checked_at=0").bind(id),
  env.DB.prepare('UPDATE youtube_sync SET next_check=0 WHERE id=1')
 ]);
}

export async function hideReplay(body,env) {
 const id=youtubeVideoId(body.videoId);if(!id)throw new Error('Choose a tutorial to remove.');
 await ensureYoutubeTables(env);
 await env.DB.prepare('UPDATE youtube_videos SET hidden=1 WHERE video_id=?').bind(id).run();
}
