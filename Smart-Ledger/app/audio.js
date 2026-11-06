// Recorded voices and shop sound. Nothing in the simulation waits on audio:
// captions and timed cues run on their own, and a clip that cannot load or play
// falls back to the device voice (when that setting is on) or to silence.
const voiceEl=new Audio(),ambienceEl=new Audio();
voiceEl.preload='auto';ambienceEl.loop=true;ambienceEl.preload='none';
let voiceToken=0,voiceFallback='',sfxTimers=[],fadeTimer;
const recordedOn=()=>s.media.recorded!==false;
const soundsOn=()=>s.media.ambience!==false;

function stopVoice(){voiceToken++;voiceEl.onended=voiceEl.onerror=null;voiceEl.pause()}
// Play clips in order. fallback is the same words for the device voice.
function playVoice(clips,fallback){
 stopVoice();if(supportedSpeech())speechSynthesis.cancel();
 clips=(clips||[]).filter(Boolean);voiceFallback=fallback||'';
 if(!recordedOn()||!clips.length){say(fallback);return}
 const token=voiceToken;let i=0;
 const fail=()=>{if(token!==voiceToken)return;voiceToken++;say(voiceFallback)};
 const next=()=>{if(token!==voiceToken||i>=clips.length)return;voiceEl.src=clips[i++].src;voiceEl.play().catch(fail)};
 voiceEl.onended=next;voiceEl.onerror=fail;next();
}
function pauseVoice(){voiceEl.pause()}
function resumeVoice(){if(recordedOn()&&voiceEl.onended&&voiceEl.src&&!voiceEl.ended&&voiceEl.currentTime>0)voiceEl.play().catch(()=>{})}
const introVoice=i=>playVoice([voiceClips.intro[i]],intro[i][1]);
const briefVoice=i=>playVoice(voiceClips.brief[i],briefings[i].join(' '));
const closingVoice=()=>playVoice([voiceClips.closing],'Thank you for staying with the numbers until they made sense.');
// Recorded intro lines may set a longer hold than the default cue timing.
const cueHold=(i,base)=>Math.max(base,recordedOn()&&voiceClips.intro[i]?voiceClips.intro[i].dur*1000+900:0);

function sfx(name,delay=0,volume=.6){
 if(!soundsOn())return;
 sfxTimers.push(setTimeout(()=>{const a=new Audio(soundClips[name]);a.volume=volume;a.play().catch(()=>{})},delay));
}
function startAmbience(){
 if(!soundsOn())return;
 if(!ambienceEl.src)ambienceEl.src=soundClips.ambience;
 clearInterval(fadeTimer);ambienceEl.volume=0;ambienceEl.play().then(()=>{
  fadeTimer=setInterval(()=>{ambienceEl.volume=Math.min(.35,ambienceEl.volume+.035);if(ambienceEl.volume>=.35)clearInterval(fadeTimer)},120);
 }).catch(()=>{});
}
function pauseAmbience(){clearInterval(fadeTimer);ambienceEl.pause()}
function resumeAmbience(){if(!soundsOn()||!['intro','title'].includes(s.page))return;if(!ambienceEl.src)startAmbience();else ambienceEl.play().catch(()=>{})}
function stopShopSound(){sfxTimers.forEach(clearTimeout);sfxTimers=[];pauseAmbience()}
// Opening beats from production/Media.md: door chime, till, phone.
function introSounds(i){if(i===0){startAmbience();sfx('chime',250)}if(i===1)sfx('till',200,.5);if(i===2)sfx('phone',600,.55)}
