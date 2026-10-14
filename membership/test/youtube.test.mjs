import test,{mock} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {database} from './db.mjs';
import {youtubeVideoId,youtubeChannelUrl,classifyVideo,saveYoutubeSettings,saveReplay,hideReplay,youtubePublicData} from '../youtube.mjs';
import {liveAPI} from '../live.mjs';
import {livePage} from '../live-page.mjs';
import {page as accountPage} from '../page.mjs';

const id='AbCdEfGh123',other='ZyXwVuTs987';
const now=()=>Math.floor(Date.now()/1000);
const env=()=>({DB:database(),YOUTUBE_API_KEY:'test-key',OWNER_USER_ID:'owner'});
const video=(state='live',videoId=id)=>({id:videoId,snippet:{title:'Math tutorial',liveBroadcastContent:state==='live'?'live':state==='upcoming'?'upcoming':'none',publishedAt:'2026-10-01T00:00:00Z'},status:{privacyStatus:'public',uploadStatus:'processed',embeddable:true},liveStreamingDetails:state==='video'?undefined:{scheduledStartTime:'2026-10-14T18:00:00Z',...(state==='upcoming'?{}:{actualStartTime:'2026-10-14T18:01:00Z'}),...(state==='completed'?{actualEndTime:'2026-10-14T19:00:00Z'}:{})}});
const save=e=>saveYoutubeSettings({videoId:'https://youtu.be/'+id,channelUrl:'https://www.youtube.com/@MyelinatedMelanin',startsAt:null},e);
const due=e=>e.DB.raw.prepare('UPDATE youtube_sync SET next_check=0').run();

test('learner live page embeds lessons and keeps playback links on-site; login page carries the live badge',async()=>{
 const lesson=livePage(),login=accountPage({}),client=await readFile(new URL('../live-client.js',import.meta.url),'utf8');
 assert.match(client,/youtube-nocookie\.com\/embed/);
 assert.doesNotMatch(lesson,/id="watch-youtube"|id="youtube-channel"|Watch on YouTube|open it on YouTube/);
 assert.match(login,/live-badge\.js/);
 assert.match(lesson,/href="\/account\?preview-live=1"/);
});

test('YouTube inputs allow genuine video and channel links only',()=>{
 for(const input of [id,`https://youtu.be/${id}?si=test`,`https://www.youtube.com/watch?v=${id}`,`https://youtube.com/live/${id}`])assert.equal(youtubeVideoId(input),id);
 for(const input of ['https://youtube.com.evil.test/watch?v='+id,'javascript:alert(1)','https://evil.test/'+id,'https://user:pass@youtube.com/watch?v='+id])assert.equal(youtubeVideoId(input),'');
 assert.equal(youtubeChannelUrl('https://youtube.com/@MyelinatedMelanin/streams'),'https://www.youtube.com/@MyelinatedMelanin');
 assert.equal(youtubeChannelUrl('https://evil.test/@MyelinatedMelanin'),'');
 assert.equal(youtubeChannelUrl('https://youtube.com/watch?v='+id),'');
});

test('scheduled and completed videos are never marked live; private or deleted videos are unavailable',()=>{
 assert.equal(classifyVideo(video()).state,'live');
 assert.equal(classifyVideo(video('upcoming')).state,'upcoming');
 assert.equal(classifyVideo(video('completed')).state,'completed');
 assert.equal(classifyVideo(video('video')).state,'video');
 assert.equal(classifyVideo({...video(),status:{privacyStatus:'private',uploadStatus:'processed'}}).state,'unavailable');
 assert.equal(classifyVideo(null).state,'unavailable');
});

test('live flag requires YouTube confirmation; repeated viewers reuse one server lookup',async()=>{
 const e=env();await save(e);let calls=0;
 const fetch=mock.method(globalThis,'fetch',async(url,options)=>{calls++;assert.equal(new URL(url).hostname,'www.googleapis.com');assert.equal(new URL(url).searchParams.has('key'),false);assert.equal(options.headers['X-Goog-Api-Key'],'test-key');return Response.json({items:[video()]});});
 try{const data=await youtubePublicData(e);assert.equal(data.settings.is_live,1);assert.equal(data.settings.embeddable,true);assert.equal(data.replays.length,0);assert.equal(JSON.stringify(data).includes('test-key'),false);await youtubePublicData(e);assert.equal(calls,1);}finally{fetch.mock.restore();}
});

test('ending a broadcast removes live status and automatically adds its replay; hidden replays stay hidden',async()=>{
 const e=env();await save(e);let state='live';
 const fetch=mock.method(globalThis,'fetch',async()=>Response.json({items:[video(state)]}));
 try{
  assert.equal((await youtubePublicData(e)).settings.is_live,1);
  state='completed';due(e);const ended=await youtubePublicData(e);assert.equal(ended.settings.is_live,0);assert.equal(ended.replays[0].video_id,id);
  await hideReplay({videoId:id},e);due(e);assert.equal((await youtubePublicData(e)).replays.length,0);
  await saveReplay({videoId:id},e);assert.equal((await youtubePublicData(e)).replays.length,1);
 }finally{fetch.mock.restore();}
});

test('missing key and old manual flags cannot announce a live broadcast',async()=>{
 const e=env();delete e.YOUTUBE_API_KEY;await save(e);e.DB.raw.prepare('UPDATE live_settings SET is_live=1').run();
 const data=await youtubePublicData(e);assert.equal(data.settings.is_live,0);assert.equal(data.detection.configured,false);
});

test('YouTube failures immediately hide live status and are throttled; a stale active lease also fails closed',async()=>{
 const e=env();await save(e);let fail=false,calls=0;
 const fetch=mock.method(globalThis,'fetch',async()=>{calls++;return fail?Response.json({error:'quota'},{status:403}):Response.json({items:[video()]});});
 try{
  assert.equal((await youtubePublicData(e)).settings.is_live,1);fail=true;due(e);
  const data=await youtubePublicData(e);assert.equal(data.settings.is_live,0);assert.equal(data.detection.state,'error');
  await youtubePublicData(e);assert.equal(calls,2);
  e.DB.raw.prepare("UPDATE youtube_sync SET state='ready',lock_until=?,next_check=0").run(now()+20);
  e.DB.raw.prepare('UPDATE youtube_videos SET checked_at=?').run(now()-100);
  assert.equal((await youtubePublicData(e)).settings.is_live,0);assert.equal(calls,2);
 }finally{fetch.mock.restore();}
});

test('non-embeddable videos retain their YouTube link metadata and missing videos disappear from replays',async()=>{
 const e=env();await save(e);let items=[{...video('completed'),status:{privacyStatus:'public',uploadStatus:'processed',embeddable:false}}];
 const fetch=mock.method(globalThis,'fetch',async()=>Response.json({items}));
 try{const data=await youtubePublicData(e);assert.equal(data.settings.embeddable,false);assert.equal(data.replays.length,1);items=[];due(e);assert.equal((await youtubePublicData(e)).replays.length,0);}finally{fetch.mock.restore();}
});

test('previous scheduled broadcasts remain tracked after the next broadcast is selected',async()=>{
 const e=env();await save(e);await saveYoutubeSettings({videoId:other,startsAt:null},e);
 const fetch=mock.method(globalThis,'fetch',async url=>{assert.ok(new URL(url).searchParams.get('id').includes(id));return Response.json({items:[video('completed'),video('upcoming',other)]});});
 try{const data=await youtubePublicData(e);assert.equal(data.settings.is_live,0);assert.equal(data.settings.video_id,other);assert.equal(data.replays[0].video_id,id);}finally{fetch.mock.restore();}
});

test('only owner can change channel, live source or replays; a forged manual live flag has no effect',async()=>{
 const e=env(),api=(path,body,user)=>liveAPI(path,body,user,e,{},async()=>true,async()=> 'customer');
 for(const path of ['/api/live/settings','/api/live/replay-save','/api/live/replay-hide'])assert.equal((await api(path,{videoId:id},'student')).status,403);
 delete e.YOUTUBE_API_KEY;
 assert.equal((await api('/api/live/settings',{videoId:id,startsAt:null,isLive:true},'owner')).status,200);
 assert.equal((await api('/api/live/question',{kind:'chat',body:'Question'},'student')).status,409);
 assert.equal((await api('/api/live/question',{kind:'advance',body:'Question'},'student')).status,200);
});
