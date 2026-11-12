// Run with the same Playwright setup as browser.cjs. Optional argument: extracted app directory.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path');
const app=path.resolve(process.argv[2]||path.join(__dirname,'../app'));
(async()=>{
const b=await chromium.launch({headless:true,...(process.env.LEDGER_BROWSER?{executablePath:process.env.LEDGER_BROWSER}:{})});
const faults=[];
const st=p=>p.evaluate(()=>({v:voiceEl.src.split('/').pop(),vp:voiceEl.paused,a:ambienceEl.src.split('/').pop(),ap:ambienceEl.paused,cue:ui.cue,page:s.page}));
const enter=async p=>{await p.goto('file://'+app+'/review.html');await p.evaluate(()=>localStorage.clear());await p.reload();await p.locator('[data-do=advanceSplash]').click();await p.locator('[data-do=enterCover]').click();await p.fill('#name','Alex');await p.locator('form button').click()};
// 1. normal intro
let p=await b.newPage();p.on('pageerror',e=>faults.push('normal: '+e));
const played=[];await p.exposeFunction('logPlay',x=>played.push(x));
await p.addInitScript(()=>{const o=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){window.logPlay&&window.logPlay(String(this.currentSrc||this.src).split('/').pop());return o.call(this)}});
await enter(p);await p.waitForTimeout(800);
let x=await st(p);assert.equal(x.v,'intro-0.mp3');assert.equal(x.vp,false,'voice playing');assert.equal(x.a,'shop-ambience.mp3');assert.equal(x.ap,false,'ambience playing');assert(played.includes('door-chime.mp3'),'chime '+played);
assert.match(await p.locator('.caption').textContent(),/Welcome to Zuri/);
await p.locator('[data-do=pause]').click();x=await st(p);assert(x.vp&&x.ap,'paused both');const t=await p.evaluate(()=>voiceEl.currentTime);
await p.waitForTimeout(600);assert.equal(await p.evaluate(()=>voiceEl.currentTime),t,'held position');
await p.locator('[data-do=pause]').click();await p.waitForTimeout(300);x=await st(p);assert(!x.vp&&!x.ap,'resumed both');
// settings modal pauses, close resumes
await p.locator('[data-do=settings]').click();x=await st(p);assert(x.vp&&x.ap,'settings pauses');await p.keyboard.press('Escape');await p.waitForTimeout(300);x=await st(p);assert(!x.vp,'close resumes');
// cue advance after the hold (14.5s minus elapsed)
await p.waitForFunction(()=>ui.cue===1,null,{timeout:20000});await p.waitForTimeout(500);x=await st(p);assert.equal(x.v,'intro-1.mp3');assert(played.includes('till.mp3'),'till');
assert.match(await p.locator('.caption').textContent(),/Grace/);
await p.locator('[data-do=skip]').click();x=await st(p);assert.equal(x.page,'title');assert(x.vp,'skip stops voice');assert(!x.ap,'ambience continues on title');
await p.locator('[data-do=start]').click();await p.waitForTimeout(400);x=await st(p);assert.equal(x.page,'audit');assert(x.ap,'ambience stops in workspace');assert.equal(x.v,'brief-0-grace.mp3');assert(!x.vp);
await p.waitForFunction(()=>voiceEl.src.endsWith('brief-0-narrator.mp3'),null,{timeout:12000});
// briefing button replays, closing stops it
await p.locator('[data-do=brief]').click();await p.waitForTimeout(300);x=await st(p);assert.equal(x.v,'brief-0-grace.mp3');assert(!x.vp);await p.locator('dialog [data-do=close]').click();await p.waitForTimeout(200);x=await st(p);assert(x.vp,'close briefing stops voice');
// rule sheet does not stop a briefing
await p.locator('[data-do=brief]').click();await p.locator('dialog [data-do=close]').click();
// settings off
await p.locator('[data-do=settings]').click();await p.locator('#recorded').uncheck();await p.locator('#ambience').uncheck();await p.keyboard.press('Escape');
assert.deepEqual(await p.evaluate(()=>[s.media.recorded,s.media.ambience]),[false,false]);
await p.evaluate(()=>{voiceEl.removeAttribute('src')});await p.locator('[data-do=brief]').click();await p.waitForTimeout(300);assert.equal(await p.evaluate(()=>voiceEl.getAttribute('src')),null,'no recording when off');await p.locator('dialog [data-do=close]').click();
await p.reload();assert.deepEqual(await p.evaluate(()=>[s.media.recorded,s.media.ambience]),[false,false],'settings persist');
await p.close();
// 2. audio blocked: simulation continues, captions intact
p=await b.newPage();p.on('pageerror',e=>faults.push('blocked: '+e));await p.route(/assets\/audio\//,r=>r.abort());
await enter(p);await p.waitForTimeout(800);assert.match(await p.locator('.caption').textContent(),/Welcome to Zuri/);
await p.locator('[data-do=skip]').click();await p.locator('[data-do=start]').click();assert.equal(await p.evaluate(()=>s.page),'audit');await p.close();
// 3. closing line on Finish
p=await b.newPage();p.on('pageerror',e=>faults.push('finish: '+e));await p.goto('file://'+app+'/review.html');
await p.evaluate(()=>{const x=fresh();Object.assign(x,{mappings:Object.fromEntries(rules.map((r,i)=>[i,[r[1],r[2]]])),page:'debrief',recapDone:true,name:'Alex',posted:[0,1],repairs:['F1','F2','F3'],summary:0,marks:[true,true,true],rationale:['a','b','c']});x.report=cases.map((_,i)=>entry(x,i));localStorage.setItem(SAVE,JSON.stringify(x))});
await p.reload();await p.locator('[data-do=finish]').click();await p.waitForTimeout(300);x=await st(p);assert.equal(x.v,'closing-grace.mp3');
// old saves without the new media keys default to on
await p.evaluate(()=>{const x=JSON.parse(localStorage.getItem(SAVE));x.media={captions:true,voice:false};localStorage.setItem(SAVE,JSON.stringify(x))});await p.reload();assert.deepEqual(await p.evaluate(()=>[recordedOn(),soundsOn()]),[true,true]);
// 4. feedback segments, answer cues, recorded-vs-device fallback, recap narration
p=await b.newPage();p.on('pageerror',e=>faults.push('feedback: '+e));
const plays=[];await p.exposeFunction('logPlay2',x=>plays.push(x));
await p.addInitScript(()=>{const o=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){window.logPlay2&&window.logPlay2(String(this.currentSrc||this.src).split('/').pop());return o.call(this)};
 window.__spoken=[];window.speechSynthesis&&(speechSynthesis.speak=u=>window.__spoken.push(u.text))});
await p.goto('file://'+app+'/review.html');
const seg=await p.evaluate(()=>[segmentLine('Check the debit account (asset). Hint: '+rules[0][3]),segmentLine('Saved. '+rules[5][3]),segmentLine('This sentence is not in the script.')]);
assert.equal(seg[0].length,3,'debit check + Hint + rule');assert.equal(seg[1].length,2,'Saved + rule');assert.equal(seg[2],null,'unknown text is not voiced');
// answer cues
await p.evaluate(()=>{record(s,'map',0,'x',true);record(s,'map',1,'x',false);record(s,'hint',0,'x',true)});await p.waitForTimeout(200);
assert(plays.includes('confirm.mp3')&&plays.includes('correction.mp3'),'cues '+plays);assert.equal(plays.filter(x=>/confirm|correction/.test(x)).length,2,'hints make no cue');
await p.evaluate(()=>{s.media.ambience=false});plays.length=0;await p.evaluate(()=>record(s,'map',2,'x',true));await p.waitForTimeout(150);assert.equal(plays.length,0,'cues follow the sounds switch');
// feedback voice off by default: nothing spoken
await p.evaluate(()=>say('Saved.'));assert.deepEqual(await p.evaluate(()=>window.__spoken),[]);
// voice on, line not recorded yet -> device voice
await p.evaluate(()=>{s.media.voice=true;say('Choose another entry.')});assert.deepEqual(await p.evaluate(()=>window.__spoken),['Choose another entry.']);
// voice on, every segment recorded -> recorded clips in order (after a click, as feedback always follows one)
await p.locator('[data-do=advanceSplash]').click();
await p.evaluate(()=>{feedbackClips['Saved.']={src:'assets/audio/voice/intro-4.mp3'};feedbackClips[rules[5][3]]={src:'assets/audio/voice/closing-grace.mp3'};say('Saved. '+rules[5][3])});
await p.waitForTimeout(300);assert.equal(await p.evaluate(()=>voiceEl.src.split('/').pop()),'intro-4.mp3');
await p.waitForFunction(()=>voiceEl.src.endsWith('closing-grace.mp3'),null,{timeout:8000});
// recap narration with no recording and voice off: silent, no error
await p.evaluate(()=>{s.media.voice=false;stopVoice();window.__spoken.length=0;recapVoice(0);recapVoice(1)});assert.deepEqual(await p.evaluate(()=>window.__spoken),[]);
await p.close();
assert.deepEqual(faults,[]);console.log('PASS: intro voice+chime+ambience, pause/resume holds position, settings pause, cue advance+till, skip, briefing sequence, briefing modal, toggles+persistence, blocked audio, closing line, old-save defaults, feedback segmenting, answer cues, recorded/device feedback fallback, recap narration.');
await b.close();})().catch(e=>{console.error(e);process.exit(1)});
