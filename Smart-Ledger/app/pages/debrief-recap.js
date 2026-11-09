// Two-slide visual recap shown once, before the detailed debrief.
// Headings, explanations and figures are live HTML; the pictures and the store loop are replaceable files:
//   assets/debrief/trace-difference.webp, assets/debrief/test-system.webp,
//   assets/video/zuri-store-loop.mp4, assets/video/zuri-store-poster.webp
// Continue never waits for media: a missing image leaves a tinted frame, a failed video leaves the poster.
const recapSlides=[
 {img:'assets/debrief/trace-difference.webp',alt:'Supplier invoices and the sales notebook on the Zuri Home Supplies counter.',title:'Trace the difference',
  text:()=>'You compared the ledger with its source records and corrected the errors behind the <strong>'+cash(14100)+'</strong> difference.',
  facts:()=>['Difference · '+cash(14100)+' debit short','Suspense · '+balance(suspense(s))]},
 {img:'assets/debrief/test-system.webp',alt:'Grace Achieng reviewing the ledger on a laptop at her shop counter.',title:'Test beyond the totals',
  text:()=>'Equal debit and credit totals can still hide a wrong-account posting. Your tests checked both the amounts and the accounts.',
  facts:()=>[(s.report||[]).filter(a=>a.pass).length+' of 10 cases pass','Routines repaired · '+s.repairs.length+' of 3']}
];
const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function recapPage(){
 const at=ui.recap||0;
 const slides=recapSlides.map((r,i)=>'<section class="recapSlide'+(i===at?' on':'')+'" id="recap'+i+'" aria-labelledby="recapTitle'+i+'"><figure><img src="'+r.img+'" alt="'+escapeHTML(r.alt)+'" width="1200" height="800" decoding="async"></figure><div class="recapText"><p class="over">Debrief · '+(i+1)+' of '+recapSlides.length+'</p><h1 id="recapTitle'+i+'" tabindex="-1">'+r.title+'</h1><p>'+r.text()+'</p><ul class="recapFacts">'+r.facts().map(f=>'<li>'+escapeHTML(f)+'</li>').join('')+'</ul><div class="tools">'+(i===0?button('recapNext','Next →'):choice('recapBack','← Back')+button('recapDone','View my results →'))+'</div></div></section>').join('');
 return '<main class="recap"><video id="recapVideo" class="recapBg" muted loop playsinline '+(reducedMotion()?'':'autoplay ')+'preload="metadata" poster="assets/video/zuri-store-poster.webp" aria-hidden="true"><source src="assets/video/zuri-store-loop.mp4" type="video/mp4"></video><div class="recapShade" aria-hidden="true"></div><div class="heroTop"><span>BBM 1104 &nbsp; / &nbsp; PRINCIPLES OF ACCOUNTING</span><button type="button" class="recapControl" data-do="toggleRecap">Play background</button></div><div class="recapStage">'+slides+'</div></main>';
}
function mountRecap(){
 const video=byId('recapVideo'),control=root.querySelector('.recapControl');
 const sync=()=>control.textContent=video.paused?'Play background':'Pause background';
 const unavailable=()=>{control.hidden=true};
 video.addEventListener('play',sync);video.addEventListener('pause',sync);
 video.addEventListener('error',unavailable);video.querySelector('source').addEventListener('error',unavailable);
 root.querySelectorAll('.recapSlide img').forEach(img=>img.addEventListener('error',()=>{const f=img.closest('figure');f.classList.add('missing');f.setAttribute('role','img');f.setAttribute('aria-label',img.alt)}));
 if(!reducedMotion())video.play().catch(sync);else video.pause();
 sync();startMusic();recapVoice(ui.recap||0);
}
function showRecap(i){
 ui.recap=i;
 root.querySelectorAll('.recapSlide').forEach((el,j)=>el.classList.toggle('on',j===i));
 byId('recapTitle'+i)?.focus({preventScroll:true});
 recapVoice(i);
}
function toggleRecap(){
 const video=byId('recapVideo'),control=root.querySelector('.recapControl');if(!video)return;
 const label=()=>control.textContent=video.paused?'Play background':'Pause background';
 if(video.paused){control.textContent='Pause background';video.play().catch(label)}else{video.pause();label()}
}
