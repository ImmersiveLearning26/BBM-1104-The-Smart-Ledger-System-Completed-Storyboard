// Run with the same Playwright setup as browser.cjs. Optional argument: extracted app directory.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const app=path.resolve(process.argv[2]||path.join(__dirname,'../app'));
 const opts=process.env.LEDGER_BROWSER?{executablePath:process.env.LEDGER_BROWSER,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--no-zygote']}:{};
 const browser=await chromium.launch({headless:true,...opts});
 try{
  for(const mode of ['normal','reduced','unavailable']){
   const page=await browser.newPage({viewport:{width:mode==='reduced'?390:1366,height:mode==='reduced'?844:768},reducedMotion:mode==='reduced'?'reduce':'no-preference'});
   if(mode==='unavailable')await page.route(/product-loop\.(mp4|webm)$/,route=>route.abort());
   await page.goto('file://'+app+'/review.html');
   const start=page.locator('[data-do=enterCover]');await start.waitFor();
   assert(await start.evaluate(b=>b.getBoundingClientRect().bottom<=innerHeight));
   if(mode==='normal'){
    await page.waitForFunction(()=>document.querySelector('video')?.currentTime>.08);
    await page.locator('[data-do=toggleCover]').click();
    assert(await page.locator('video').evaluate(v=>v.paused));
    await page.locator('[data-do=toggleCover]').click();
    await page.waitForFunction(()=>!document.querySelector('video').paused);
   }else if(mode==='reduced')assert(await page.locator('video').evaluate(v=>v.paused&&v.currentTime===0));
   await start.click();await page.locator('#name').fill('Demo');
   await page.locator('form button').click();await page.locator('[data-do=skip]').click();
   await page.locator('[data-do=start]').click();await page.locator('[data-do=sheet]').click();
   await page.keyboard.press('Escape');assert(!await page.locator('dialog').isVisible());
   await page.locator('.sampleRow').nth(2).click();
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.close();
  }
  console.log('PASS: normal playback, live pause/resume, reduced motion, unavailable clip, visible CTA, briefing skip and laptop/mobile audit.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
