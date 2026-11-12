// Smart Ledger agent library: the orb, the waveform, the result pop-up and icons.
// Specification: design/agent-library/README.md. Plain script, no dependencies.
const AL=(()=>{
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const lerp=(a,b,t)=>a+(b-a)*t;
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const ORB=['#8fc0f0','#c1a1d9','#f1b3db'].map(hex);   // README: orb gradient
const TINT={pass:hex('#46c98a'),fail:hex('#ef6170')};
const mix=(a,b,t)=>a.map((v,i)=>Math.round(lerp(v,b[i],t)));
const grad=y=>y<0?mix(ORB[0],ORB[1],y+1):mix(ORB[1],ORB[2],y);   // y in -1..1, top to bottom

// ---- Icons: 24-unit line glyphs, drawn with .ic ----
const paths={
 settings:'<path d="M4 7h9m4 0h3M4 17h3m4 0h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
 arrow:'<path d="M7 17 17 7M9 7h8v8"/>',
 play:'<path d="M5 9v6h4l5 4V5L9 9H5zM17 9a4 4 0 0 1 0 6"/>',
 sheet:'<path d="M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h5"/>',
 note:'<path d="M5 4h14v12l-4 4H5zM15 20v-4h4M8 9h8M8 13h5"/>',
 ledger:'<path d="M4 6h16M12 6v13"/>',
 globe:'<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.5 2.5 2.5 13.5 0 16M12 4c-2.5 2.5-2.5 13.5 0 16"/>',
 cash:'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6.5 9.5v5M17.5 9.5v5"/>',
 bank:'<path d="M3 9 12 4l9 5M5 10v7M9.5 10v7M14.5 10v7M19 10v7M3 20h18"/>',
 inventory:'<path d="M4 8 12 4l8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8"/>',
 equipment:'<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
 receivable:'<path d="M12 4v10M8 10l4 4 4-4M5 18h14"/>',
 payable:'<path d="M12 14V4M8 8l4-4 4 4M5 18h14"/>',
 capital:'<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M12 9v-1M15 12h1"/>',
 drawings:'<path d="M4 8h13a3 3 0 0 1 3 3v6H4zM4 8l10-4 2 4M16 13h1"/>',
 sales:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
 rent:'<path d="M4 11 12 4l8 7M6 9.5V20h12V9.5M10 20v-5h4v5"/>',
 delivery:'<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
 check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
 cross:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
 heading:'<path d="M5 5h14M12 5v14M8 19h8"/>',
 compare:'<rect x="3" y="5" width="7" height="14" rx="1.5"/><rect x="14" y="5" width="7" height="14" rx="1.5"/><path d="M10 12h4"/>',
 hide:'<path d="M3 12s3.5-6 9-6c2 0 3.7.8 5 1.8M21 12s-3.5 6-9 6c-2 0-3.7-.8-5-1.8M4 4l16 16"/>',
 voice:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
 sound:'<path d="M4 9v6h4l5 4V5L8 9H4zM16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>',
 read:'<path d="M3 18 8 6l5 12M5 14h6M16 9.5a3.5 3.5 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10"/>',
 restart:'<path d="M5 12a7 7 0 1 0 2.1-5M5 4v4h4"/>'
};
const icon=(n,cls='')=>'<svg class="ic '+cls+'" viewBox="0 0 24 24" aria-hidden="true">'+paths[n]+'</svg>';
// Curriculum order (content.js accounts), so the tile layout gives nothing away.
const accountIcons=['cash','bank','inventory','equipment','receivable','payable','capital','drawings','sales','rent','delivery'];

// ---- Orb ----
const STATES={idle:{rot:.39,scatter:0,morph:0,pulse:.02},working:{rot:1.7,scatter:.3,morph:0,pulse:.06},building:{rot:1,scatter:.05,morph:1,pulse:.05},pass:{rot:.6,scatter:.08,morph:0,pulse:.08},fail:{rot:.6,scatter:.08,morph:0,pulse:.08}};
const orbs=new Set();let raf=0,last=0;
class Orb{
 constructor(el,state='idle'){
  this.el=el;el.classList.add('orb');el.setAttribute('aria-hidden','true');
  this.c=document.createElement('canvas');el.replaceChildren(this.c);this.ctx=this.c.getContext('2d');
  this.size=el.clientWidth||36;const n=this.size<=28?56:this.size<=60?120:300;
  const g=Math.PI*(3-Math.sqrt(5));
  this.pts=Array.from({length:n},(_,i)=>{const y=1-2*(i+.5)/n,r=Math.sqrt(1-y*y),a=i*g,p=[Math.cos(a)*r,y,Math.sin(a)*r],m=Math.max(...p.map(Math.abs));return {p,c:p.map(v=>v/m*.82),s:.3+.7*Math.random(),ph:Math.random()*6.28}});
  this.cur={...STATES.idle};this.angle=Math.random()*6;this.t=0;this.tint=null;this.tintT=0;
  this.resize();this.set(state);orbs.add(this);
  if(!reduced())loop();else this.draw();
 }
 resize(){const d=Math.min(2,devicePixelRatio||1);this.c.width=this.c.height=Math.round(this.size*d);this.ctx.setTransform(d,0,0,d,0,0)}
 // hold: keep a pass/fail colour until told otherwise (used by the result pop-up).
 set(state,hold=false){
  this.state=state;this.el.dataset.state=state;this.hold=hold;clearTimeout(this.back);
  if(state==='pass'||state==='fail'){this.tint=TINT[state];this.tintT=1;if(!hold)this.back=setTimeout(()=>this.set('idle'),900)}
  if(reduced())this.draw();
 }
 step(dt){
  const k=1-Math.exp(-dt*5),tg=STATES[this.state];
  for(const key in tg)this.cur[key]=lerp(this.cur[key],tg[key],k);
  this.angle+=this.cur.rot*dt;this.t+=dt;
  if(this.tintT>0&&!this.hold){this.tintT=Math.max(0,this.tintT-dt/0.9)}
  this.draw();
 }
 draw(){
  const {ctx,size:S}=this,c=S/2,R=S*.4,still=reduced();
  const cur=still?STATES[this.state]:this.cur,breathe=1+cur.pulse*Math.sin(this.t*(this.state==='idle'?1.6:5));
  ctx.clearRect(0,0,S,S);
  const tint=this.tint&&(still?(this.state==='pass'||this.state==='fail'):this.tintT>0)?[this.tint,still?1:this.tintT]:null;
  // Soft body behind the particles (R1 orb dot)
  const body=ctx.createRadialGradient(c-R*.3,c-R*.3,R*.1,c,c,R*1.1);
  const top=tint?mix(ORB[0],tint[0],tint[1]):ORB[0],bot=tint?mix(ORB[2],tint[0],tint[1]):ORB[2];
  body.addColorStop(0,`rgba(${top},.55)`);body.addColorStop(1,`rgba(${bot},${S<=28?.85:.12})`);
  // The backing morphs with the particles: a disc for the globe, a rounded square while building.
  const m=cur.morph,rr=R*(S<=28?1.05:1)*breathe,half=rr*lerp(1,.86,m);
  ctx.fillStyle=body;ctx.beginPath();if(ctx.roundRect)ctx.roundRect(c-half,c-half,half*2,half*2,lerp(rr,rr*.28,m));else ctx.arc(c,c,rr,0,6.283);ctx.fill();
  const ca=Math.cos(this.angle),sa=Math.sin(this.angle),tilt=lerp(.38,.12,cur.morph),ct=Math.cos(tilt),st=Math.sin(tilt);
  const dot=S<=28?.9:S<=60?1.2:1.7;
  for(const q of this.pts){
   let [x,y,z]=[lerp(q.p[0],q.c[0],m),lerp(q.p[1],q.c[1],m),lerp(q.p[2],q.c[2],m)];
   const sc=breathe*(1+cur.scatter*q.s*(.55+.45*Math.sin(this.t*3+q.ph)));x*=sc;y*=sc;z*=sc;
   [x,z]=[x*ca-z*sa,x*sa+z*ca];[y,z]=[y*ct-z*st,y*st+z*ct];
   const f=1/(1.9-z*.45),depth=(z+1)/2;
   let col=grad(Math.max(-1,Math.min(1,y)));if(tint)col=mix(col,tint[0],tint[1]*.85);
   ctx.fillStyle=`rgba(${col},${.3+.7*depth})`;ctx.beginPath();ctx.arc(c+x*R*f*1.5,c+y*R*f*1.5,dot*(.55+.9*depth),0,6.283);ctx.fill();
  }
 }
 destroy(){orbs.delete(this);clearTimeout(this.back)}
}
function loop(){if(raf)return;last=performance.now();const tick=now=>{const dt=Math.min(.05,(now-last)/1000);last=now;for(const o of orbs){if(!o.el.isConnected){o.destroy();continue}o.step(dt)}raf=orbs.size&&!reduced()?requestAnimationFrame(tick):0};raf=requestAnimationFrame(tick)}

// ---- Waveform: a horizontal ripple in a fixed-height box ----
const waves=new Set();let wraf=0,wlast=0;
class Wave{
 constructor(canvas,{color='#ffffff',gradient=false}={}){
  this.c=canvas;this.ctx=canvas.getContext('2d');this.color=color;this.gradient=gradient;this.amp=0;this.active=false;this.t=0;waves.add(this);this.fit();
  if(reduced())this.draw();else wloop();
 }
 fit(){const d=Math.min(2,devicePixelRatio||1),r=this.c.getBoundingClientRect();this.w=r.width||200;this.h=r.height||32;this.c.width=Math.round(this.w*d);this.c.height=Math.round(this.h*d);this.ctx.setTransform(d,0,0,d,0,0)}
 set(active){this.active=active;if(reduced()){this.amp=active?1:0;this.draw()}}
 step(dt){this.t+=dt;this.amp=lerp(this.amp,this.active?1:0,1-Math.exp(-dt*6));this.draw()}
 draw(){
  const {ctx,w,h}=this;if(!w)return;ctx.clearRect(0,0,w,h);const mid=h/2,A=(h/2-2)*this.amp;
  const layers=[[1,.9,1.6,0],[1.7,.5,1.3,1.9],[.6,.3,1.1,3.4]];
  let stroke=this.color;
  if(this.gradient){stroke=ctx.createLinearGradient(0,0,w,0);stroke.addColorStop(0,'#8fc0f0');stroke.addColorStop(.5,'#c1a1d9');stroke.addColorStop(1,'#f1b3db')}
  for(const [k,a,lw,ph] of layers){
   ctx.beginPath();ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.globalAlpha=this.amp<.02?.3:a;
   for(let x=0;x<=w;x+=2){const env=Math.sin(Math.PI*x/w);const y=mid+A*env*Math.sin(x/w*Math.PI*2*(2.2*k)-this.t*4.2*k+ph);x?ctx.lineTo(x,y):ctx.moveTo(x,y)}
   ctx.stroke();if(this.amp<.02)break;
  }
  ctx.globalAlpha=1;
 }
}
function wloop(){if(wraf)return;wlast=performance.now();const tick=now=>{const dt=Math.min(.05,(now-wlast)/1000);wlast=now;for(const w of waves){if(!w.c.isConnected){waves.delete(w);continue}w.step(dt)}wraf=waves.size&&!reduced()?requestAnimationFrame(tick):0};wraf=requestAnimationFrame(tick)}

// ---- Result pop-up: the only feedback surface ----
let open=null;
function result(text,tone='pass',ms=2800){
 close(true);
 const el=document.createElement('div');el.className='result';el.setAttribute('role','status');el.setAttribute('aria-live','polite');
 el.innerHTML='<span></span><p></p>';el.querySelector('p').textContent=text;document.body.append(el);
 const orb=new Orb(el.querySelector('span'),'idle');requestAnimationFrame(()=>orb.set(tone,true));
 let done;const p=new Promise(r=>done=r);
 open={el,done,timer:setTimeout(()=>close(),ms)};
 el.addEventListener('click',()=>close(),{once:true});
 return p;
}
function close(instant){
 if(!open)return;const {el,done,timer}=open;open=null;clearTimeout(timer);
 if(instant||reduced()){el.remove();done();return}
 el.classList.add('out');setTimeout(()=>{el.remove();done()},360);
}
addEventListener('keydown',e=>{if(e.key==='Escape')close()});

// ---- Icon bar: icons that open into a labelled pill (hover, focus, or a brief flash after a click) ----
function flash(btn,text,ms=1600){
 const lab=btn.querySelector('.ibl');if(!lab)return;if(text)lab.textContent=text;
 btn.classList.add('open');clearTimeout(btn.flashT);btn.flashT=setTimeout(()=>{btn.classList.remove('open');if(btn.dataset.label)lab.textContent=btn.dataset.label},ms);
}
const iconButton=({act,icon:i,label,on=null})=>'<button type="button" class="ibtn'+(on?' on':'')+'" data-do="'+act+'" data-label="'+label+'"'+(on===null?'':' aria-pressed="'+on+'"')+' aria-label="'+label+'"><span class="ibi">'+icon(i)+'</span><span class="ibl" aria-hidden="true">'+label+'</span></button>';

// ---- Attention dust: orb particles drifting round the edge of the one control waiting for the learner ----
const dusts=new Set();let draf=0,dlast=0;
class Dust{
 constructor(host){
  this.host=host;this.c=document.createElement('canvas');this.c.className='attnDust';this.c.setAttribute('aria-hidden','true');host.append(this.c);
  this.ctx=this.c.getContext('2d');this.t=0;this.fit();
  const n=Math.max(10,Math.min(28,Math.round(this.len/16)));
  this.p=Array.from({length:n},(_,i)=>({d:i/n,v:.018+Math.random()*.02,o:3+Math.random()*7,s:.7+Math.random()*1.1,ph:Math.random()*6.28}));
  dusts.add(this);if(reduced())this.draw();else dloop();
 }
 fit(){const d=Math.min(2,devicePixelRatio||1),r=this.c.getBoundingClientRect();this.w=r.width;this.h=r.height;this.c.width=Math.round(this.w*d);this.c.height=Math.round(this.h*d);this.ctx.setTransform(d,0,0,d,0,0);
  const bw=this.w-24,bh=this.h-24,rad=Math.min(bh/2,parseFloat(getComputedStyle(this.host).borderTopLeftRadius)||0);this.box=[bw,bh,rad];this.len=2*(bw+bh)-8*rad+2*Math.PI*rad}
 // A point on the rounded-rectangle edge, distance f (0..1) round it, pushed out by off px.
 at(f,off){
  const [w,h,r]=this.box,straight=[w-2*r,h-2*r],arc=Math.PI*r/2;let d=(f%1+1)%1*this.len;
  const segs=[['line',straight[0],[r,0],[1,0],[0,-1]],['arc',arc,[w-r,r],-Math.PI/2],['line',straight[1],[w,r],[0,1],[1,0]],['arc',arc,[w-r,h-r],0],['line',straight[0],[w-r,h],[-1,0],[0,1]],['arc',arc,[r,h-r],Math.PI/2],['line',straight[1],[0,h-r],[0,-1],[-1,0]],['arc',arc,[r,r],Math.PI]];
  for(const sg of segs){if(d>sg[1]&&sg!==segs[7]){d-=sg[1];continue}
   if(sg[0]==='line'){const [,,p0,dir,n]=sg;return [12+p0[0]+dir[0]*d+n[0]*off,12+p0[1]+dir[1]*d+n[1]*off]}
   const [,,c0,a0]=sg,a=a0+(r?d/r:0);return [12+c0[0]+Math.cos(a)*(r+off),12+c0[1]+Math.sin(a)*(r+off)]}
  return [12,12];
 }
 step(dt){this.t+=dt;for(const q of this.p)q.d+=q.v*dt;this.draw()}
 draw(){
  const {ctx}=this;ctx.clearRect(0,0,this.w,this.h);
  for(const q of this.p){const [x,y]=this.at(q.d,q.o*(.75+.25*Math.sin(this.t*1.3+q.ph))),tw=.35+.35*Math.sin(this.t*2+q.ph);
   const col=grad(Math.sin(q.d*6.283));ctx.fillStyle=`rgba(${col},${Math.max(.08,tw)})`;ctx.beginPath();ctx.arc(x,y,q.s,0,6.283);ctx.fill()}
 }
}
function dloop(){if(draf)return;dlast=performance.now();const tick=now=>{const dt=Math.min(.05,(now-dlast)/1000);dlast=now;for(const d of dusts){if(!d.host.isConnected||!d.host.classList.contains('attn')){d.c.remove();dusts.delete(d);continue}d.step(dt)}draf=dusts.size&&!reduced()?requestAnimationFrame(tick):0};draf=requestAnimationFrame(tick)}
// Give every visible .attn element its dust, and clear it from elements that no longer need attention.
function attend(root=document){
 root.querySelectorAll('.attnDust').forEach(c=>{if(!c.parentElement.classList.contains('attn')){c.remove();for(const d of dusts)if(d.c===c)dusts.delete(d)}});
 root.querySelectorAll('.attn').forEach(el=>{if(!el.querySelector(':scope>.attnDust')&&el.getClientRects().length)new Dust(el)});
}

// Mount every [data-orb] and [data-wave] inside a root.
function mount(root=document){
 root.querySelectorAll('[data-orb]').forEach(el=>{if(!el.orb)el.orb=new Orb(el,el.dataset.orb||'idle')});
 root.querySelectorAll('canvas[data-wave]').forEach(c=>{if(!c.wave)c.wave=new Wave(c,{gradient:c.dataset.wave==='gradient'})});
}
// ---- Grid overlay (README section 3): ?grid in the address, or Alt+Shift+G. Never shown to learners. ----
let overlay=null;
function drawGrid(){
 if(!overlay)return;const cols=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cols'))||12;
 overlay.innerHTML='<div class="wrap"><div class="grid12">'+'<i></i>'.repeat(cols)+'</div></div>';
}
function grid(on=!overlay){
 if(on&&!overlay){overlay=document.createElement('div');overlay.className='gridOverlay';overlay.setAttribute('aria-hidden','true');document.body.append(overlay);drawGrid()}
 else if(!on&&overlay){overlay.remove();overlay=null}
 return !!overlay;
}
addEventListener('keydown',e=>{if(e.altKey&&e.shiftKey&&e.code==='KeyG'){e.preventDefault();grid()}});
if(new URLSearchParams(location.search).has('grid'))addEventListener('DOMContentLoaded',()=>grid(true));
addEventListener('resize',()=>{waves.forEach(w=>{w.fit();w.draw()});drawGrid()});
return {Orb,Wave,result,close,icon,accountIcons,mount,grid,flash,iconButton,attend};
})();
