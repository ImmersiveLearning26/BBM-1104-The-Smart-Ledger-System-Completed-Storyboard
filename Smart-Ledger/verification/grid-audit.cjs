// Grid audit shared by grid.cjs and agent.cjs (design/agent-library/README.md section 3).
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
 const heightOf='.ibtn,.msg,.hdr,.btn-ink,.btn-glass,.btn-raised,.chip,.pill,.token,.tile,.row,.objBar,.story,.composer,.line,.send,.icon-glass,.av,.orb,.appTile,.wave,.t>div,.src,.sw i';
 const square='.send,.icon-glass,.av,.orb,.appTile';
 const docTop=-document.documentElement.getBoundingClientRect().top;
 // Pinned surfaces (sticky or fixed) move with scrolling: their sizes are checked, their page position is not.
 const pinned=el=>{for(let e=el;e&&e!==document.body;e=e.parentElement){const p=getComputedStyle(e).position;if(p==='sticky'||p==='fixed')return true}return false};
 for(const el of document.body.querySelectorAll('*')){
  if(skip(el)||!visible(el))continue;
  const cs=getComputedStyle(el);
  for(const p of props){const v=px(cs[p]);if(v===null||v>=999)continue;if(off(v))bad.push(name(el)+' '+p+' '+cs[p])}
  if(sideMargins(el))for(const p of ['marginLeft','marginRight']){const v=px(cs[p]);if(v!==null&&off(v))bad.push(name(el)+' '+p+' '+cs[p])}
  if(el.matches(heightOf)){
   const r=el.getBoundingClientRect();
   if(off(r.height))bad.push(name(el)+' height '+r.height.toFixed(2));
   if(el.matches(square)&&off(r.width))bad.push(name(el)+' width '+r.width.toFixed(2));
   if(!pinned(el)&&off(r.top+docTop))bad.push(name(el)+' top '+(r.top+docTop).toFixed(2));
  }
 }
 // Columns: each .grid12 fills its .wrap, and each block starts and ends on a column line.
 const root=getComputedStyle(document.documentElement),cols=parseInt(root.getPropertyValue('--cols')),gutter=parseFloat(root.getPropertyValue('--gutter')),margin=parseFloat(root.getPropertyValue('--margin'));
 for(const g of document.querySelectorAll('.grid12')){
  if(skip(g)||!visible(g))continue;
  const wrap=g.closest('.wrap');if(!wrap){bad.push(name(g)+' is outside a .wrap');continue}
  // Content boxes: a .wrap's margin is its padding; an element can be both the .wrap and the grid.
  const box=el=>{const r=el.getBoundingClientRect(),c=getComputedStyle(el);return [r.left+parseFloat(c.paddingLeft),r.right-parseFloat(c.paddingRight)]};
  const w=wrap.getBoundingClientRect(),inner=[w.left+margin,w.right-margin],gr=box(g);
  if(Math.abs(gr[0]-inner[0])>EPS||Math.abs(gr[1]-inner[1])>EPS){bad.push(name(g)+' does not fill its .wrap ('+gr[0].toFixed(1)+'–'+gr[1].toFixed(1)+' vs '+inner[0].toFixed(1)+'–'+inner[1].toFixed(1)+')');continue}
  const cw=(gr[1]-gr[0]-gutter*(cols-1))/cols,starts=[],ends=[];
  for(let i=0;i<cols;i++){starts.push(gr[0]+i*(cw+gutter));ends.push(gr[0]+i*(cw+gutter)+cw)}
  for(const c of g.children){
   if(!visible(c))continue;const r=c.getBoundingClientRect();
   if(!starts.some(x=>Math.abs(x-r.left)<EPS))bad.push(name(c)+' starts off a column line at '+r.left.toFixed(1));
   if(getComputedStyle(c).justifySelf!=='start'&&!ends.some(x=>Math.abs(x-r.right)<EPS)&&!el_inline(c))bad.push(name(c)+' ends off a column line at '+r.right.toFixed(1));
  }
 }
 function el_inline(c){return /^(inline|inline-flex|inline-block)$/.test(getComputedStyle(c).display)}
 return {bad:[...new Set(bad)],cols,margin};
}
module.exports={audit};
