// Recorded voices and shop sound. Nothing in the simulation waits on audio:
// captions and timed cues run on their own, and a clip that cannot load or play
// falls back to the device voice (when that setting is on) or to silence.
const voiceEl=new Audio(),ambienceEl=new Audio(),musicEl=new Audio();
voiceEl.preload='auto';ambienceEl.loop=true;ambienceEl.preload='none';musicEl.loop=true;musicEl.preload='none';
let voiceToken=0,voiceFallback='',sfxTimers=[],fadeTimer;
const recordedOn=()=>s.media.recorded!==false;
const soundsOn=()=>s.media.ambience!==false;

function stopVoice(){voiceToken++;voiceEl.onended=voiceEl.onerror=null;voiceEl.pause()}
// Play clips in order. fallback is the same words for the device voice.
function playVoice(clips,fallback){
 stopVoice();if(supportedSpeech())speechSynthesis.cancel();
 clips=(clips||[]).filter(Boolean);voiceFallback=fallback||'';
 if(!recordedOn()||!clips.length){deviceSay(fallback);return}
 const token=voiceToken;let i=0;
 const fail=()=>{if(token!==voiceToken)return;voiceToken++;deviceSay(voiceFallback)};
 const next=()=>{if(token!==voiceToken||i>=clips.length)return;voiceEl.src=clips[i++].src;voiceEl.play().catch(fail)};
 voiceEl.onended=next;voiceEl.onerror=fail;next();
}
function pauseVoice(){voiceEl.pause()}
function resumeVoice(){if(recordedOn()&&voiceEl.onended&&voiceEl.src&&!voiceEl.ended&&voiceEl.currentTime>0)voiceEl.play().catch(()=>{})}
const introVoice=i=>playVoice([voiceClips.intro[i]],intro[i][1]);
const briefVoice=i=>playVoice(voiceClips.brief[i],briefings[i].join(' '));
const closingVoice=()=>playVoice([voiceClips.closing],'Thank you for staying with the numbers until they made sense.');
// Recorded intro lines may set a longer hold than the default cue timing.
const cueHold=(i,base)=>Math.max(base,recordedOn()&&voiceClips.intro[i]?.dur?voiceClips.intro[i].dur*1000+900:0);
const recapVoice=i=>{const r=recapSlides[i];if(recordedOn())playVoice([voiceClips.recap[i]],r.title+'. '+r.text().replace(/<[^>]+>/g,''))};
// Split a feedback message into recorded segments, longest match first. null = some part has no script line.
const feedbackKeys=Object.keys(feedbackClips).sort((a,b)=>b.length-a.length);
function segmentLine(line){const keys=[];let rest=String(line||'').trim();while(rest){const k=feedbackKeys.find(k=>rest.startsWith(k));if(!k)return null;keys.push(k);rest=rest.slice(k.length).trim()}return keys}

function sfx(name,delay=0,volume=.6){
 if(!soundsOn()||!soundClips[name])return;
 if(!delay){const a=new Audio(soundClips[name]);a.volume=volume;a.play().catch(()=>{});return}
 sfxTimers.push(setTimeout(()=>{const a=new Audio(soundClips[name]);a.volume=volume;a.play().catch(()=>{})},delay));
}
function startAmbience(){
 if(!soundsOn()||!soundClips.ambience)return;
 if(!ambienceEl.src)ambienceEl.src=soundClips.ambience;
 clearInterval(fadeTimer);ambienceEl.volume=0;ambienceEl.play().then(()=>{
  fadeTimer=setInterval(()=>{ambienceEl.volume=Math.min(.35,ambienceEl.volume+.035);if(ambienceEl.volume>=.35)clearInterval(fadeTimer)},120);
 }).catch(()=>{});
}
function pauseAmbience(){clearInterval(fadeTimer);ambienceEl.pause()}
function resumeAmbience(){if(!soundsOn()||!['intro','title'].includes(s.page))return;if(!ambienceEl.src)startAmbience();else ambienceEl.play().catch(()=>{})}
function stopShopSound(){sfxTimers.forEach(clearTimeout);sfxTimers=[];pauseAmbience();musicEl.pause()}
// Music bed under the debrief recap (slot: assets/audio/music/debrief-bed.mp3).
function startMusic(){if(!soundsOn()||!soundClips.music)return;if(!musicEl.src)musicEl.src=soundClips.music;musicEl.volume=.18;musicEl.play().catch(()=>{})}
// Soft confirm/correction cue on every graded answer.
const gradedTasks=['audit','map','column','difference','type','post','predict','repair','regression','summary'];
onRecord=(task,ok)=>{if(gradedTasks.includes(task))sfx(ok?'confirm':'correction',0,.35)};
// Opening beats from production/Media.md: door chime, till, phone.
function introSounds(i){if(i===0){startAmbience();sfx('chime',250)}if(i===1)sfx('till',200,.5);if(i===2)sfx('phone',600,.55)}
