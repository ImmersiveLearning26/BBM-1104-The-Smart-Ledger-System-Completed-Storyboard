// Grid check (design/agent-library/README.md section 3).
// Fails if anything on a page drifts off the 4 px unit or off the column lines.
//   node verification/grid.cjs [page.html ...]   (default: agent-library.html and index.html)
// Run with the same Playwright setup as browser.cjs.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path');
const app=path.join(__dirname,'../app');
const pages=process.argv.slice(2).length?process.argv.slice(2):['agent-library.html','index.html'];
const widths=[[1280,800],[900,900],[390,844]];

const {audit}=require('./grid-audit.cjs');

(async()=>{
 const b=await chromium.launch({headless:true,...(process.env.LEDGER_BROWSER?{executablePath:process.env.LEDGER_BROWSER}:{})});
 const failures=[];let checked=0;
 for(const page of pages)for(const [w,h] of widths){
  const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+path.join(app,page));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
  const r=await p.evaluate(audit);checked++;
  const expect=w>=1024?[12,40]:w>=768?[8,32]:[4,16];
  assert.deepEqual([r.cols,r.margin],expect,page+' at '+w+'px uses the wrong column set');
  for(const x of [...r.bad,...errs])failures.push(page+' @'+w+'px: '+x);
  // Self-test: a block nudged 7 px, and one pushed off its column, must both be caught.
  if(w===1280){
   const nudged=await p.evaluate(a=>{const el=document.querySelector('.composer,.obj,.grid12>*');el.style.marginTop='7px';const k=new Function('return ('+a+')()')();el.style.marginTop='';return k.bad},audit.toString());
   assert(nudged.some(x=>/marginTop 7px/.test(x)),'grid check must catch a 7 px nudge');
   const shifted=await p.evaluate(a=>{const el=document.querySelector('.grid12>.col-7-12,.grid12>*');el.style.marginLeft='7px';const k=new Function('return ('+a+')()')();el.style.marginLeft='';return k.bad},audit.toString());
   assert(shifted.some(x=>/off a column line/.test(x)),'grid check must catch a block 7 px off its column');
  }
  // The overlay draws the same columns as the page.
  await p.evaluate(()=>AL.grid(true));
  assert.equal(await p.locator('.gridOverlay i').count(),expect[0]);
  await p.close();
 }
 await b.close();
 if(failures.length){console.error(failures.slice(0,60).join('\n')+(failures.length>60?'\n… '+(failures.length-60)+' more':''));console.error('FAIL: '+failures.length+' off-grid values');process.exit(1)}
 console.log('PASS: grid on '+pages.join(', ')+' at 1280, 900 and 390 px ('+checked+' layouts): 4 px unit, component heights and tops, column lines, overlay, and the check itself catches a 7 px nudge.');
})().catch(e=>{console.error(e);process.exit(1)});
