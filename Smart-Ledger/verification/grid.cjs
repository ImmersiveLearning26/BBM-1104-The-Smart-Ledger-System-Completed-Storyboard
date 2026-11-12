// Grid check (design/agent-library/README.md section 3).
// Fails if anything on a page drifts off the 4 px unit or off the column lines.
//   node verification/grid.cjs [page.html ...]   (default: agent-library.html)
// Run with the same Playwright setup as browser.cjs.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path');
const app=path.join(__dirname,'../app');
const pages=process.argv.slice(2).length?process.argv.slice(2):['agent-library.html'];
const widths=[[1280,800],[900,900],[390,844]];

// Runs inside the page. Returns a list of human-readable problems.
function audit(){
 const U=4,EPS=.51,bad=[];
 const off=v=>{const r=((v%U)+U)%U;return Math.min(r,U-r)>EPS};
 const name=el=>el.tagName.toLowerCase()+(el.id?'#'+el.id:'')+(el.classList.length?'.'+[...el.classList].join('.'):'');
 const visible=el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(el).visibility!=='hidden'};
 // Not checked: decoration drawn inside canvases and SVG, the overlay itself, the fixed result pop-up, and screen-reader-only text.
 const skip=el=>el.closest('svg,canvas,.gridOverlay,.result,.sr');
 const px=v=>/^-?[\d.]+px$/.test(v)?parseFloat(v):null;
 const props=['paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginBottom','rowGap','columnGap','lineHeight',
  'borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius'];
 const sideMargins=el=>!el.matches('.wrap');   // .wrap centres itself with auto margins
 // Components whose height must snap, and fixed squares whose width must snap too.
 const heightOf='.hdr,.btn-ink,.btn-glass,.btn-raised,.chip,.pill,.token,.tile,.row,.objBar,.story,.composer,.line,.send,.icon-glass,.av,.orb,.appTile,.wave,.t>div,.src,.sw i';
 const square='.send,.icon-glass,.av,.orb,.appTile';
 const docTop=-document.documentElement.getBoundingClientRect().top;
 for(const el of document.body.querySelectorAll('*')){
  if(skip(el)||!visible(el))continue;
  const cs=getComputedStyle(el);
  for(const p of props){const v=px(cs[p]);if(v===null||v>=999)continue;if(off(v))bad.push(name(el)+' '+p+' '+cs[p])}
  if(sideMargins(el))for(const p of ['marginLeft','marginRight']){const v=px(cs[p]);if(v!==null&&off(v))bad.push(name(el)+' '+p+' '+cs[p])}
  if(el.matches(heightOf)){
   const r=el.getBoundingClientRect();
   if(off(r.height))bad.push(name(el)+' height '+r.height.toFixed(2));
   if(el.matches(square)&&off(r.width))bad.push(name(el)+' width '+r.width.toFixed(2));
   if(cs.position!=='fixed'&&off(r.top+docTop))bad.push(name(el)+' top '+(r.top+docTop).toFixed(2));
  }
 }
 // Columns: each .grid12 fills its .wrap, and each block starts and ends on a column line.
 const root=getComputedStyle(document.documentElement),cols=parseInt(root.getPropertyValue('--cols')),gutter=parseFloat(root.getPropertyValue('--gutter')),margin=parseFloat(root.getPropertyValue('--margin'));
 for(const g of document.querySelectorAll('.grid12')){
  if(skip(g)||!visible(g))continue;
  const wrap=g.closest('.wrap');if(!wrap){bad.push(name(g)+' is outside a .wrap');continue}
  const w=wrap.getBoundingClientRect(),gr=g.getBoundingClientRect(),inner=[w.left+margin,w.right-margin];
  if(Math.abs(gr.left-inner[0])>EPS||Math.abs(gr.right-inner[1])>EPS){bad.push(name(g)+' does not fill its .wrap ('+gr.left.toFixed(1)+'–'+gr.right.toFixed(1)+' vs '+inner[0].toFixed(1)+'–'+inner[1].toFixed(1)+')');continue}
  const cw=(gr.width-gutter*(cols-1))/cols,starts=[],ends=[];
  for(let i=0;i<cols;i++){starts.push(gr.left+i*(cw+gutter));ends.push(gr.left+i*(cw+gutter)+cw)}
  for(const c of g.children){
   if(!visible(c))continue;const r=c.getBoundingClientRect();
   if(!starts.some(x=>Math.abs(x-r.left)<EPS))bad.push(name(c)+' starts off a column line at '+r.left.toFixed(1));
   if(getComputedStyle(c).justifySelf!=='start'&&!ends.some(x=>Math.abs(x-r.right)<EPS)&&!el_inline(c))bad.push(name(c)+' ends off a column line at '+r.right.toFixed(1));
  }
 }
 function el_inline(c){return /^(inline|inline-flex|inline-block)$/.test(getComputedStyle(c).display)}
 return {bad:[...new Set(bad)],cols,margin};
}

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
