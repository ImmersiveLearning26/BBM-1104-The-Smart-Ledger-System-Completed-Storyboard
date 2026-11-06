// Run with the same Playwright setup as browser.cjs. Optional argument: extracted app directory.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path');
const app=path.resolve(process.argv[2]||path.join(__dirname,'../app')),out=process.argv[3]||require('node:fs').mkdtempSync(path.join(require('node:os').tmpdir(),'ledger-recap-'));
(async()=>{
const b=await chromium.launch({headless:true,...(process.env.LEDGER_BROWSER?{executablePath:process.env.LEDGER_BROWSER}:{})});
const seed=async p=>{await p.goto('file://'+app+'/index.html');await p.evaluate(()=>{const x=fresh();Object.assign(x,{mappings:Object.fromEntries(rules.map((r,i)=>[i,[r[1],r[2]]])),page:'debrief',name:'Alex',posted:[0,1],repairs:['F1','F2','F3'],summary:0,marks:[true,true,true],rationale:['a','b','c']});x.report=cases.map((_,i)=>entry(x,i));localStorage.setItem(SAVE,JSON.stringify(x))});await p.reload();await p.locator('#recapTitle0').waitFor()};
const faults=[];
for(const mode of ['normal','reduced','blocked','mobile']){
 const p=await b.newPage({viewport:mode==='mobile'?{width:390,height:844}:{width:1440,height:900},reducedMotion:mode==='reduced'?'reduce':'no-preference'});
 p.on('pageerror',e=>faults.push(mode+': '+e));
 if(mode==='blocked')await p.route(/assets\/(debrief|video)\//,r=>r.abort());
 await seed(p);
 const v=p.locator('#recapVideo');
 if(mode==='normal'){await p.waitForFunction(()=>document.querySelector('#recapVideo').currentTime>.1);assert.equal(await p.locator('.recapControl').textContent(),'Pause background');await p.locator('.recapControl').click();assert(await v.evaluate(v=>v.paused));assert.equal(await p.locator('.recapControl').textContent(),'Play background');await p.locator('.recapControl').click();await p.waitForFunction(()=>!document.querySelector('#recapVideo').paused);
  // facts come from the learner record
  assert.match(await p.locator('.recapSlide.on').textContent(),/KSh 14,100.*Suspense · Nil/s);
  await p.screenshot({path:out+'/recap-1440-slide1.png'});
  await p.locator('[data-do=recapNext]').click();await p.waitForTimeout(120);
  const mid=await p.evaluate(()=>[...document.querySelectorAll('.recapSlide')].map(e=>+getComputedStyle(e).opacity));
  assert(mid[0]>0&&mid[0]<1,'crossfade in progress '+mid);
  await p.waitForTimeout(400);assert.deepEqual(await p.evaluate(()=>[...document.querySelectorAll('.recapSlide')].map(e=>+getComputedStyle(e).opacity)),[0,1]);
  assert.equal(await p.evaluate(()=>document.activeElement.id),'recapTitle1');
  assert.match(await p.locator('.recapSlide.on').textContent(),/10 of 10 cases pass/);
  // hidden slide is out of tab order
  assert.equal(await p.locator('#recap0 [data-do=recapNext]').isVisible(),false);
  await p.screenshot({path:out+'/recap-1440-slide2.png'});
  await p.reload();await p.locator('#recapTitle0').waitFor();assert(await p.locator('#recap0').evaluate(e=>e.classList.contains('on')),'reload restarts recap');
  await p.locator('[data-do=recapNext]').click();await p.locator('[data-do=recapBack]').click();await p.waitForTimeout(400);assert(await p.locator('#recap0').evaluate(e=>e.classList.contains('on')));
  await p.locator('[data-do=recapNext]').click();await p.locator('[data-do=recapDone]').click();
  assert(await p.getByText('Strand scores').isVisible());await p.reload();assert(await p.getByText('Strand scores').isVisible(),'results after reload');
  await p.locator('[data-do=finish]').click();await p.locator('[data-do=review]').click();assert(await p.getByText('Strand scores').isVisible(),'review skips recap');
 }
 if(mode==='reduced'){assert(await v.evaluate(v=>v.paused&&v.currentTime===0&&!v.autoplay));assert.equal(await p.locator('.recapControl').textContent(),'Play background');await p.locator('.recapControl').click();await p.waitForFunction(()=>!document.querySelector('#recapVideo').paused);}
 if(mode==='blocked'){await p.waitForTimeout(500);assert(await p.locator('.recapControl').isHidden(),'control hidden when video fails');await p.screenshot({path:out+'/recap-blocked.png'});await p.locator('[data-do=recapNext]').click();await p.locator('[data-do=recapDone]').click();assert(await p.getByText('Strand scores').isVisible())}
 if(mode==='mobile'){assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal scroll');await p.screenshot({path:out+'/recap-390.png',fullPage:true});await p.locator('[data-do=recapNext]').click();await p.waitForTimeout(400);await p.screenshot({path:out+'/recap-390-slide2.png',fullPage:true});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))}
 await p.close();
}
// splash logo
const p=await b.newPage({viewport:{width:1440,height:900}});await p.goto('file://'+app+'/index.html');await p.evaluate(()=>localStorage.clear());await p.reload();
const logo=p.locator('.splash img');assert(await logo.evaluate(i=>i.complete&&i.naturalWidth>0));assert.equal(await logo.getAttribute('alt'),'MIVA Open University');await p.screenshot({path:out+'/splash.png'});
assert.deepEqual(faults,[]);console.log('PASS: recap playback, pause/play, crossfade, focus, learner facts, reload, back, results, review, reduced motion, blocked media, 390px, splash logo.');
await b.close();})().catch(e=>{console.error(e);process.exit(1)});
