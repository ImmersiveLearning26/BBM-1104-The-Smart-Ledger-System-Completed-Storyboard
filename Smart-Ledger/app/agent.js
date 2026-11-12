// Agent-led flow: the opening through the six posting rules, built only from the agent library
// (design/agent-library/README.md, app/agent-library.css and .js).
// Layout: Grace on one side; a chat with Smart Ledger on the other, with the input box pinned at the bottom.
// Each step: the agent asks -> Grace's screen arrives as a card -> the learner picks -> the agent runs it and reveals.
// State, scoring, log and save key are the same as app.js, so an attempt can continue in index.html.
let s;
try{s=JSON.parse(localStorage.getItem(SAVE));if(!s||s.v!==1)throw Error()}catch{s=fresh()}
const newAgent=()=>({scene:s.started?4:0,flags:{},fix:Object.keys(s.mappings).length>0});
s.agent=s.agent||newAgent();
let ui={pick:[null,null],slot:0,busy:false,saved:null,approach:null,sheet:false,armed:false,failedStorage:false};
let runTimer,armTimer,lastStep='';
const root=document.querySelector('#app');
const byId=id=>document.getElementById(id);
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportedSpeech=()=>typeof speechSynthesis!=='undefined'&&typeof SpeechSynthesisUtterance!=='undefined';
const count=()=>Object.keys(s.mappings).length;
const ic=AL.icon;
// Feedback and hints: same rules as app.js, so the voice script covers both views.
function say(line){
 const k=segmentLine(line);if(!k)console.debug('[unvoiced]',line);
 if(!s.media.voice)return;
 const clips=recordedOn()&&k&&k.map(x=>feedbackClips[x]);
 if(clips&&clips.length&&clips.every(Boolean))playVoice(clips,line);else deviceSay(line);
}
function deviceSay(line){
 if(!line||!s.media.voice||!supportedSpeech())return;
 stopVoice();speechSynthesis.cancel();
 const voice=new SpeechSynthesisUtterance(line);voice.lang='en-KE';
 const match=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase()==='en-ke');
 if(match)voice.voice=match;speechSynthesis.speak(voice);
}
function save(){try{localStorage.setItem(SAVE,JSON.stringify(s))}catch{ui.failedStorage=true}}

// ---- Curriculum helpers (all values come from content.js) ----
const sampleLabels=['Cash sale','Rent paid by bank','Customer payment','Owner withdrawal','Stock bought on credit'];
const findings={'S-02':'Sides reversed','S-03':'Customer debt remains open. Sales counted twice.','S-04':'Drawings recorded as an expense.'};
const sampleWrong=i=>{const a=samples[i],r=rules[a[5]];return a[3]!==r[1]||a[4]!==r[2]};
const nextSample=()=>samples.findIndex((_,j)=>!s.seen.includes(j));
const testAmount=i=>(samples.find(a=>a[5]===i)||[])[2]??cases.find(c=>c[5]===i)[1];
const sheetRows=[['Assets','Cash, Bank, Inventory, Equipment, Trade Receivables','Debit'],['Expenses','Rent, Delivery','Debit'],['Drawings','Owner withdrawals','Debit'],['Liabilities','Trade Payables','Credit'],['Capital','Owner investment','Credit'],['Income','Sales','Credit']];
const approachIcons=['heading','compare','hide'];
const flowPages=['splash','cover','identity','intro','title','audit','action','mapping'];
const pairText=p=>'Debit '+accounts[p[0]]+' · Credit '+accounts[p[1]];
function stage(){
 if(!flowPages.includes(s.page))return 'end';
 if(s.agent.scene<4)return 'open';
 if(nextSample()!==-1)return 'review';
 if(!s.agent.fix)return 'approach';
 if(count()<6||ui.saved!==null)return 'rules';
 return 'end';
}

// ---- Cards: Grace's Smart Ledger screen, posted into the chat ----
const objBar=(title,sub='June ledger')=>'<div class="objBar"><span class="appTile">'+ic('ledger')+'</span><div><b>'+title+'</b><small>'+sub+'</small></div>'+ic('globe','end')+'</div>';
const ledgerCard=(title,body,sub)=>objBar(title,sub)+'<div class="objBody">'+body+'</div>';
const tAccount=(d,c,amount)=>'<div class="t"><div><small>Debit</small><b>'+d+'</b>'+(amount?'<span>'+money(amount)+'</span>':'')+'</div><div><small>Credit</small><b>'+c+'</b>'+(amount?'<span>'+money(amount)+'</span>':'')+'</div></div>';
const row=(label,right,cls='')=>'<li class="row '+cls+'"><span>'+label+'</span><small>'+right+'</small></li>';
const mini=(label,right)=>'<div class="obj mini"><ul class="rows">'+row(label,right)+'</ul></div>';
const sheetCard=()=>ledgerCard('Rule sheet','<ul class="rows">'+sheetRows.map(([k,eg,side])=>'<li class="row"><span><b>'+k+'</b><small class="eg">'+eg+'</small></span><small>'+side+'</small></li>').join('')+'</ul><p class="objLabel sheetNote">Each posting has equal debits and credits.</p>','Account types');
function postingCard(i){const a=samples[i];return ledgerCard('Draft postings','<p class="objLabel">'+a[0]+(i===2?' · Payment for an earlier credit sale':'')+'</p><p class="objTitle">'+sampleLabels[i]+'</p><p class="objAmount">'+cash(a[2])+'</p>'+tAccount(accounts[a[3]],accounts[a[4]]))}
function comparisonCard(){
 return ledgerCard('Posting comparison','<ul class="rows">'+samples.map((a,i)=>{
  const call=i in s.agent.flags?'You said '+(s.agent.flags[i]?'wrong':'right'):'';
  if(!sampleWrong(i))return row('<b>'+a[0]+'</b> '+sampleLabels[i],'Matches'+(call?' · '+call:''));
  const r=rules[a[5]];
  return '<li class="row open"><span><b>'+a[0]+'</b> '+sampleLabels[i]+'</span><small>'+call+'</small><p class="was">Posted <s>'+accounts[a[3]]+' / '+accounts[a[4]]+'</s></p><p class="is">Rule sheet <b>'+accounts[r[1]]+' / '+accounts[r[2]]+'</b></p><p class="why">'+findings[a[0]]+'</p></li>'}).join('')+'</ul>');
}
function rulesCard(){
 const cur=stage()==='rules'&&ui.saved===null?count():-1;
 const rows=rules.map((r,i)=>s.mappings[i]&&ui.saved!==i?row(r[0],accounts[s.mappings[i][0]]+' · '+accounts[s.mappings[i][1]]):i===cur||ui.saved===i?row(r[0],ui.saved===i?accounts[s.mappings[i][0]]+' · '+accounts[s.mappings[i][1]]:(ui.pick[0]===null?'Debit ?':accounts[ui.pick[0]])+' · '+(ui.pick[1]===null?'Credit ?':accounts[ui.pick[1]]),'now'):'').join('');
 const test=ui.saved!==null?'<div class="objOk enter"><p class="objLabel">Test posting · '+cash(testAmount(ui.saved))+'</p>'+tAccount(accounts[s.mappings[ui.saved][0]],accounts[s.mappings[ui.saved][1]],testAmount(ui.saved))+'</div>':'';
 return ledgerCard('Posting rules','<ul class="rows">'+rows+'</ul>'+test);
}
function currentCard(){
 const st=stage();
 if(st==='review')return postingCard(nextSample());
 if(st==='approach')return s.compared?comparisonCard():sheetCard();
 return rulesCard();
}

// ---- The chat: rebuilt from saved state, so a reload restores the whole conversation ----
function thread(){
 const st=stage(),items=[],A=(html,o={})=>items.push({who:'agent',html,...o}),L=html=>items.push({who:'me',html});
 items.push({who:'grace',html:'“'+briefings[0][0]+'”'});
 for(const i of s.seen){A('Does this posting look right to you?',{card:mini(samples[i][0]+' '+sampleLabels[i],accounts[samples[i][3]]+' / '+accounts[samples[i][4]])});L(s.agent.flags[i]?'Looks wrong':'Looks right')}
 if(st==='review'){A('Does this posting look right to you?',{cur:true});return items}
 if(st==='approach'&&!s.compared){A('Before I change anything, how should I check them?',{cur:true});return items}
 A('Before I change anything, how should I check them?');L(auditOptions[1]);
 if(st==='approach'){A('I compared each posting with its rule.',{cur:true});return items}
 A('I compared each posting with its rule.',{card:mini('Draft postings','Three differ from the rules')});
 for(let j=0;j<count();j++){if(j===ui.saved)continue;A(rules[j][0]+'.');L(pairText(s.mappings[j]))}
 if(st==='rules'){A('<b>'+rules[ui.saved??count()][0]+'.</b> Which account do I debit, and which do I credit?',{cur:true});if(ui.saved!==null)L(pairText(s.mappings[ui.saved]));return items}
 A('All six rules are saved. The June ledger is next.',{cur:true});
 return items;
}
function threadHTML(){
 const me=(s.name||'?').trim()[0]?.toUpperCase()||'?';
 const items=thread(),out=[];
 for(const m of items){
  const av=m.who==='grace'?'<span class="av grace" aria-hidden="true"></span>':m.who==='me'?'<span class="av me" aria-hidden="true">'+escapeHTML(me)+'</span>':m.cur?'<span class="av" data-orb id="agentOrb"></span>':'<span class="av dot" aria-hidden="true"></span>';
  const who=m.who==='grace'?'Grace':m.who==='me'?'You':'Smart Ledger';
  const body='<p class="t-message"'+(m.cur?' id="ask" tabindex="-1"':'')+'><span class="sr">'+who+': </span>'+m.html+'</p>'+(m.cur?'<div class="obj" id="obj">'+currentCard()+'</div>':m.card||'');
  out.push('<li class="msg '+m.who+(m.cur?' cur':' past')+'">'+av+'<div class="body">'+body+'</div></li>');
  // The rule sheet, when asked for, arrives as its own card under the current question.
  if(m.cur&&ui.sheet&&!(stage()==='approach'&&!s.compared))out.push('<li class="msg agent cur sheetMsg"><span class="av dot" aria-hidden="true"></span><div class="body"><p class="t-message">Here is the rule sheet.</p><div class="obj">'+sheetCard()+'</div></div></li>');
 }
 return out.join('');
}

// ---- The input box, pinned at the bottom ----
const tile=(label,icon,val,on=false,act='pick')=>'<button type="button" class="tile'+(on?' on':'')+'" data-do="'+act+'" data-val="'+val+'" '+(ui.busy?'disabled':'')+'>'+ic(icon)+'<span>'+label+'</span>'+(on?'<i class="dot" aria-hidden="true"></i>':'')+'</button>';
function compose(){
 const st=stage();
 if(st==='review')return '<span class="placeholder">Looks right or looks wrong?</span>';
 if(st==='approach')return ui.approach===null?'<span class="placeholder">Choose how I should check</span>':'<span class="token on"><b>'+auditOptions[ui.approach]+'</b></span>';
 if(ui.pick.every(v=>v===null)&&ui.slot===0)return '<span class="placeholder">Pick the debit account</span>';
 return ['Debit','Credit'].map((x,k)=>'<button type="button" class="token'+(ui.slot===k?' on':'')+(ui.pick[k]===null?' empty':'')+'" data-do="slot" data-val="'+k+'" aria-pressed="'+(ui.slot===k)+'" '+(ui.busy?'disabled':'')+'><small>'+x+'</small><b>'+(ui.pick[k]===null?'—':accounts[ui.pick[k]])+'</b></button>').join('');
}
function tileOptions(){
 const st=stage();
 if(st==='review')return '<div class="tiles two" role="group" aria-label="Your call">'+tile('Looks right','check',0,false,'flag')+tile('Looks wrong','cross',1,false,'flag')+'</div>';
 if(st==='approach')return '<div class="tiles list" role="group" aria-label="How to check">'+auditOptions.map((x,i)=>tile(escapeHTML(x),approachIcons[i],i,ui.approach===i,'approach')).join('')+'</div>';
 return '<div class="tiles" role="group" aria-label="Accounts">'+accounts.map((a,j)=>tile(a,AL.accountIcons[j],j,ui.pick.includes(j),'acct')).join('')+'</div>';
}
function after(){
 const st=stage();
 if(st==='approach'&&s.compared)return '<button type="button" class="btn-ink attn" data-do="fix">Fix the rules</button>';
 if(st==='rules'&&ui.saved!==null)return '<button type="button" class="btn-ink attn" data-do="nextRule">'+(count()===6?'Finish the rules':'Next rule')+'</button>';
 if(st==='end')return '<button type="button" class="btn-ink attn" data-do="handoff">Open the June ledger</button>';
 return '';
}

// ---- Settings as icons that open in place ----
function iconbar(){
 return '<div class="iconbar">'+[
  {act:'recorded',icon:'voice',label:'Recorded voices',on:recordedOn()},
  {act:'ambience',icon:'sound',label:'Sounds',on:soundsOn()},
  {act:'voice',icon:'read',label:'Read feedback aloud',on:!!s.media.voice},
  {act:'restart',icon:'restart',label:'Start again'}
 ].map(AL.iconButton).join('')+'</div>';
}
function setting(key,btn){
 if(key==='voice'&&!supportedSpeech()){AL.flash(btn,'Not available on this device');return}
 const on=!(key==='voice'?s.media.voice:key==='recorded'?recordedOn():soundsOn());
 s.media[key]=on;save();
 if(!on&&key==='recorded')stopVoice();if(!on&&key==='ambience')stopShopSound();if(!on&&key==='voice'&&supportedSpeech())speechSynthesis.cancel();
 btn.classList.toggle('on',on);btn.setAttribute('aria-pressed',on);AL.flash(btn,btn.dataset.label+(on?' on':' off'));
}

// ---- Opening: Grace, then her problem on her own screen, then the learner's role ----
function sceneBody(){
 const n=s.agent.scene,next=(label,act='next')=>'<button type="button" class="btn-raised attn" data-do="'+act+'">'+label+'</button>';
 if(n===0)return '<p class="t-caption over">BBM 1104 · Principles of Accounting</p><h1 class="t-display" tabindex="-1">Month-end<br>at Zuri.</h1>'+next('Begin','begin');
 if(n===1)return '<div class="cap" tabindex="-1"><p class="t-caption">Zuri Home Supplies · Nairobi</p><p class="t-message">'+intro[0][1]+'</p></div>'+next('Continue');
 if(n===2)return '<div class="obj win">'+ledgerCard('June month-end','<ul class="rows">'+row('Trial balance','Does not balance')+row('Suspense account','Open')+row('Month-end close','Blocked')+'</ul>','Smart Ledger')+'</div><div class="cap" tabindex="-1"><p class="t-caption">Grace Achieng · Owner</p><p class="t-message">“'+intro[1][1]+'”</p></div>'+next('Continue');
 return '<div class="cap" tabindex="-1"><p class="t-caption">Your role</p><p class="t-message">'+intro[2][1]+'</p></div><form id="join" class="pill attn"><span data-orb></span><label class="sr" for="name">Your name</label><input id="name" required maxlength="60" autocomplete="given-name" placeholder="Your name"><button class="send" type="submit" aria-label="Join Grace"><span>'+ic('arrow','arrow')+'</span></button></form><p class="t-caption fine">Speed is not scored. All figures are fictional.</p>';
}

// ---- Shells: fixed skeletons, so video, orb and waveform keep running between steps ----
function shell(mode){
 root.dataset.mode=mode;lastStep='';
 root.innerHTML=mode==='open'
  ?'<main class="scene"><video class="sceneBg" muted loop playsinline preload="auto" poster="assets/video/zuri-store-poster.webp" aria-hidden="true"><source src="assets/video/zuri-store-loop.mp4" type="video/mp4"></video><header class="sceneTop wrap"><img src="assets/brand/miva-open-university.svg" alt="MIVA Open University" width="116" height="36"><div id="bar"></div></header><div class="wrap grid12"><div class="sceneBody col-1-5" id="sceneBody"></div></div></main>'
  :'<div class="atm"><main class="wrap grid12 room"><aside class="portrait col-half" id="portrait" aria-label="Grace Achieng, owner of Zuri Home Supplies"><video muted loop playsinline preload="auto" poster="assets/video/zuri-store-poster.webp" aria-hidden="true"><source src="assets/video/zuri-store-loop.mp4" type="video/mp4"></video><div class="top"><img src="assets/brand/miva-open-university.svg" alt="MIVA Open University" width="116" height="36"><div id="bar"></div></div><div class="who"><p class="t-title">Grace Achieng</p><p class="t-caption dim">Owner · Zuri Home Supplies, Nairobi</p></div></aside>'
   +'<section class="chat col-7-12" id="chat" aria-label="Conversation with Smart Ledger"><ol class="thread" id="thread"></ol>'
   +'<div class="dock" id="reply"><div class="chips" id="chips"><button class="chip" type="button" data-do="sheet" aria-pressed="false">'+ic('sheet')+'Rule sheet</button></div><div class="composer" id="composer"><div class="pill"><span data-orb id="pillOrb"></span><div class="compose" id="compose"></div><canvas class="wave" data-wave="gradient" id="pillWave"></canvas><button class="send" type="button" id="send" data-do="send" aria-label="Run it"><span>'+ic('arrow','arrow')+'<i class="stop"></i></span></button></div><div id="opts"></div></div><div class="after" id="after"></div></div></section></main></div>';
 byId('bar').innerHTML=iconbar();
 const v=root.querySelector('video');if(!reduced())v.play().catch(()=>{});
 AL.mount(root);
}
function paint(focusSel){
 const st=stage(),mode=st==='open'?'open':'work';
 if(root.dataset.mode!==mode)shell(mode);
 if(mode==='open'){
  const body=byId('sceneBody');body.innerHTML=sceneBody();body.classList.remove('enter');void body.offsetWidth;body.classList.add('enter');AL.mount(body);
  if(focusSel!==false)body.querySelector('[tabindex],#name')?.focus({preventScroll:true});
 }else{
  const step=st+':'+(st==='review'?nextSample():st==='rules'?(ui.saved??count())+':'+(ui.saved!==null):s.compared)+':'+ui.sheet;
  const fresh=step!==lastStep;lastStep=step;
  if(fresh){byId('thread').innerHTML=threadHTML();AL.mount(byId('thread'));const cur=root.querySelector('.msg.cur');if(cur){cur.classList.remove('enter');void cur.offsetWidth;cur.classList.add('enter')}}
  else{const o=byId('obj');if(o)o.innerHTML=currentCard()}
  const done=(st==='approach'&&s.compared)||(st==='rules'&&ui.saved!==null)||st==='end';
  const composer=byId('composer'),send=byId('send'),chips=byId('chips');
  composer.hidden=done;chips.hidden=done||(st==='approach'&&!s.compared);
  chips.querySelector('.chip').setAttribute('aria-pressed',ui.sheet);chips.querySelector('.chip').classList.toggle('on',ui.sheet);
  byId('compose').innerHTML=compose();byId('opts').innerHTML=tileOptions();byId('after').innerHTML=after();
  send.hidden=st!=='rules';send.disabled=ui.busy||ui.pick.includes(null);
  // The glow marks the one thing waiting for the learner: the input box, or the send button once it is ready.
  const ready=st==='rules'&&!ui.pick.includes(null)&&!ui.busy;
  composer.classList.toggle('attn',!done&&!ui.busy&&!ready);send.classList.toggle('attn',ready);
  if(fresh&&focusSel!==false)scrollToCurrent();
  if(focusSel)root.querySelector(focusSel)?.focus({preventScroll:true});
  else if(fresh&&focusSel!==false)byId('ask')?.focus({preventScroll:true});
 }
 if(ui.failedStorage&&!byId('storageAlert'))root.insertAdjacentHTML('beforeend','<p role="alert" id="storageAlert">This browser could not save progress. Keep this tab open.</p>');
}
// Bring the newest exchange into view above the pinned input box: the end of the chat,
// or the top of the current exchange when it is taller than the space available.
function scrollToCurrent(){
 const cur=root.querySelector('.msg.cur');if(!cur)return;
 const avail=innerHeight-byId('reply').getBoundingClientRect().height,end=document.documentElement.scrollHeight-innerHeight;
 const top=cur.getBoundingClientRect().top+scrollY-24,want=cur.offsetHeight+48>avail?top:end;
 scrollTo({top:Math.max(0,Math.min(end,Math.round(want))),behavior:reduced()?'auto':'smooth'});
}
const orbs=()=>[byId('agentOrb')?.orb,byId('pillOrb')?.orb].filter(Boolean);
function working(on,mode='working'){
 ui.busy=on;byId('composer')?.classList.toggle('working',on);byId('send')?.classList.toggle('running',on);
 const w=byId('pillWave')?.wave;if(w){if(on)w.fit();w.set(on)}
 orbs().forEach(o=>o.set(on?mode:'idle'));
}
// Feedback: orb pulse plus the centred pop-up (README: one feedback channel).
function tell(line,tone){
 orbs().forEach(o=>o.set(tone));save();say(line);
 AL.result(line,tone,Math.max(2800,line.split(' ').length*320));
}
// Smart Ledger takes the learner's pick and runs it. Instant with reduced motion.
function run(mode,done){if(reduced()){done();return}working(true,mode);paint(false);runTimer=setTimeout(()=>{working(false);done()},1400)}
function reset(){clearTimeout(runTimer);AL.close(true);stopVoice();stopShopSound();s=fresh();s.agent=newAgent();ui={...ui,pick:[null,null],slot:0,busy:false,saved:null,approach:null,sheet:false,armed:false};save();root.dataset.mode='';scrollTo(0,0);paint()}

function respond(action,n,btn){
 if(ui.busy&&!['recorded','ambience','voice','sheet'].includes(action))return;
 const st=stage();
 switch(action){
 case 'recorded':case 'ambience':case 'voice':setting(action,btn);break;
 case 'restart':
  if(!ui.armed){ui.armed=true;btn.classList.add('armed');AL.flash(btn,'Tap again to start over',3000);clearTimeout(armTimer);armTimer=setTimeout(()=>{ui.armed=false;btn.classList.remove('armed')},3000);break}
  ui.armed=false;reset();break;
 case 'sheet':s.sheet=true;ui.sheet=!ui.sheet;save();paint(false);if(ui.sheet)root.querySelector('.sheetMsg')?.scrollIntoView({block:'nearest',behavior:reduced()?'auto':'smooth'});break;
 case 'begin':if(st!=='open'||s.agent.scene!==0)return;s.agent.scene=1;save();paint();introVoice(0);introSounds(0);break;
 case 'next':if(st!=='open'||s.agent.scene<1||s.agent.scene>2)return;s.agent.scene++;save();paint();introVoice(s.agent.scene-1);introSounds(s.agent.scene-1);break;
 case 'flag':{
  if(st!=='review')return;const i=nextSample(),wrong=n===1;
  s.seen.push(i);s.agent.flags[i]=wrong;record(s,'flag',i,wrong?'Looks wrong':'Looks right',wrong===sampleWrong(i));
  if(nextSample()===-1){s.sheet=true;s.page='action';stopVoice();ui.sheet=false}
  save();paint();break;
 }
 case 'approach':{
  if(st!=='approach'||s.compared)return;
  if(s.firstAudit===null)s.firstAudit=n;record(s,'audit',0,auditOptions[n],n===1);
  if(n!==1){ui.approach=null;paint(false);tell('Changing headings or hiding accounts leaves the original postings unchecked. Try again.','fail');break}
  ui.approach=n;save();
  // The comparison is revealed only once Smart Ledger has finished running it.
  run('working',()=>{s.compared=true;ui.approach=null;paint();tell('Three draft postings differ from the rules.','pass')});break;
 }
 case 'fix':if(st!=='approach'||!s.compared)return;s.agent.fix=true;s.page='mapping';ui.sheet=false;save();paint();break;
 case 'slot':if(st!=='rules'||ui.saved!==null)return;ui.slot=n;paint('[data-do=slot][data-val="'+n+'"]');break;
 case 'acct':{
  if(st!=='rules'||ui.saved!==null)return;
  const other=1-ui.slot;if(ui.pick[other]===n)ui.pick[other]=null;   // one account cannot sit on both sides
  ui.pick[ui.slot]=n;if(ui.slot===0&&ui.pick[1]===null)ui.slot=1;
  paint(ui.pick.includes(null)?'[data-do=acct][data-val="'+n+'"]':'#send');break;
 }
 case 'send':{
  const i=count();if(st!=='rules'||ui.saved!==null||i>=6||ui.pick.includes(null))return;
  const p=ui.pick.slice(),r=rules[i],ok=p[0]===r[1]&&p[1]===r[2];record(s,'map',i,p.map(j=>accounts[j]),ok);
  let feedback='Saved. '+r[3];
  if(!ok){
   const swapped=p[0]===r[2]&&p[1]===r[1];
   feedback=swapped?'Sides swapped. Check which balance increases and which falls.':i===5&&kinds[p[0]]==='expense'?'Owner withdrawals are drawings. A personal withdrawal is separate from a business expense.':'Check the '+(p[0]!==r[1]?'debit account ('+kinds[r[1]]+')':'credit account ('+kinds[r[2]]+')')+'.';
   if(s.log.filter(e=>e.task==='map'&&e.item===i).length>=2){feedback+=' Hint: '+r[3];record(s,'hint',i,'Second rule attempt',true)}
   ui.slot=swapped||p[0]!==r[1]?0:1;
  }
  save();
  // The rule is saved when Smart Ledger finishes its test posting, so the chat never jumps ahead mid-run.
  run('building',()=>{if(ok){s.mappings[i]=p;ui.saved=i;save()}paint(ok?undefined:false);tell(feedback,ok?'pass':'fail');if(ok)byId('after').querySelector('button')?.focus({preventScroll:true})});break;
 }
 case 'nextRule':if(ui.saved===null)return;ui.saved=null;ui.pick=[null,null];ui.slot=0;ui.sheet=false;paint();break;
 case 'handoff':if(st!=='end')return;if(flowPages.includes(s.page))s.page='sort';save();location.href='index.html';break;
 }
}
root.addEventListener('click',e=>{const b=e.target.closest('button[data-do]');if(b&&!b.disabled)respond(b.dataset.do,Number(b.dataset.val),b)});
root.addEventListener('submit',e=>{
 e.preventDefault();if(e.target.id!=='join')return;const n=byId('name').value.trim();
 if(!n){byId('name').setCustomValidity('Enter a name.');byId('name').reportValidity();return}
 s.name=n;s.agent.scene=4;s.started=s.started||new Date().toISOString();s.page='audit';stopShopSound();save();paint();
 playVoice([voiceClips.brief[0][0]],briefings[0][0]);
});
root.addEventListener('input',e=>{if(e.target.id==='name')e.target.setCustomValidity('')});
paint();
