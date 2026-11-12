// Agent-led flow (prototype): the opening through the six posting rules.
// Every step has four beats: situation -> evidence on Grace's screen -> the learner's call -> Smart Ledger runs it and reveals.
// State, scoring, log and save key are the same as app.js, so an attempt can continue in index.html.
let s;
try{s=JSON.parse(localStorage.getItem(SAVE));if(!s||s.v!==1)throw Error()}catch{s=fresh()}
const newAgent=()=>({scene:s.started?4:0,flags:{},fix:Object.keys(s.mappings).length>0});
s.agent=s.agent||newAgent();
let ui={msg:'',tone:'',pick:[null,null],slot:0,run:null,saved:null,failedStorage:false};
let runTimer,opener,keys={};
const root=document.querySelector('#app');
const byId=id=>document.getElementById(id);
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportedSpeech=()=>typeof speechSynthesis!=='undefined'&&typeof SpeechSynthesisUtterance!=='undefined';
const details=(title,body)=>'<details><summary>'+title+'</summary><div>'+body+'</div></details>';
const count=()=>Object.keys(s.mappings).length;
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
const flowPages=['splash','cover','identity','intro','title','audit','action','mapping'];
function stage(){
 if(!flowPages.includes(s.page))return 'end';
 if(s.agent.scene<4)return 'open';
 if(nextSample()!==-1)return 'review';
 if(!s.agent.fix)return 'approach';
 if(count()<6||ui.saved!==null)return 'rules';
 return 'end';
}

// ---- Building blocks ----
const mark='<svg viewBox="0 0 25 26" aria-hidden="true"><path fill="#8890ff" d="M1 6 11 1v20L1 26z"/><path fill="#505adc" d="M14 4 24 0v20l-10 5z"/></svg>';
const gear=(cls='')=>'<button type="button" class="utility '+cls+'" data-do="settings" title="Audio" aria-label="Audio settings">'+icon('settings')+'</button>';
const win=(title,body)=>'<section class="win" aria-label="Smart Ledger: '+title+'"><header><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="winBrand">'+mark+'Smart Ledger</span><span class="winTitle">'+title+'</span></header><div class="winBody">'+body+'</div></section>';
const tEntry=(d,c,amount)=>'<div class="tEntry"><div><small>Debit</small><b>'+d+'</b>'+(amount?'<span>'+money(amount)+'</span>':'')+'</div><div><small>Credit</small><b>'+c+'</b>'+(amount?'<span>'+money(amount)+'</span>':'')+'</div></div>';
const speakers={grace:['Grace','<span class="av grace" aria-hidden="true"></span>'],agent:['Smart Ledger','<span class="av" aria-hidden="true">'+mark+'</span>']};
const msgLine=(who,html)=>'<div class="msg">'+speakers[who][1]+'<div><b>'+speakers[who][0]+'</b><p>'+html+'</p></div></div>';
const story=line=>'<figure class="story"><blockquote><cite>Grace Achieng · Owner</cite>'+line+'</blockquote></figure>';
const note=()=>ui.msg?'<p class="note '+ui.tone+'" id="note" role="status" tabindex="-1">'+escapeHTML(ui.msg)+'</p>':'';
const runList=()=>ui.run?'<ol class="runSteps" role="status">'+ui.run.steps.slice(0,ui.run.i+1).map((t,j)=>'<li class="'+(j<ui.run.i?'done':'now')+'">'+escapeHTML(t)+'</li>').join('')+'</ol>':'';
const go=(label,action='next',off=false)=>'<button type="button" class="primary" data-do="'+action+'" '+(off?'disabled':'')+'>'+label+'</button>';

// ---- Opening: who Grace is, what she is facing, the screen she is facing it on ----
function sceneBody(){
 const n=s.agent.scene;
 if(n===0)return '<p class="over">BBM 1104 · Principles of Accounting</p><h1 tabindex="-1">Month-end<br>at Zuri.</h1>'+go('Begin →','begin');
 if(n===1)return '<div class="cap" tabindex="-1"><b>Zuri Home Supplies · Nairobi</b><p>'+intro[0][1]+'</p></div>'+go('Continue →');
 if(n===2)return win('June month-end','<ul class="checks"><li><span>Trial balance</span><b>Does not balance</b></li><li><span>Suspense account</span><b>Open</b></li><li><span>Month-end close</span><b>Blocked</b></li></ul>')+'<div class="cap" tabindex="-1"><b>Grace Achieng · Owner</b><p>“'+intro[1][1]+'”</p></div>'+go('Continue →');
 return '<div class="cap" tabindex="-1"><b>Your role</b><p>'+intro[2][1]+'</p></div><form id="join"><label>Your name<input required maxlength="60" id="name" autocomplete="given-name" placeholder="Enter your name"></label><button class="primary">Join Grace →</button></form><small class="fine">Speed is not scored. All figures are fictional.</small>';
}

// ---- Workspace: the story and the learner's call on the left, Grace's screen on the right ----
function trail(){
 const st=stage(),items=[];
 if(st!=='review'){const f=Object.values(s.agent.flags).filter(Boolean).length;items.push('Draft postings <b>5 reviewed · '+f+' flagged</b>')}
 if(st==='rules'||st==='end')items.push('Checked against the rule sheet <b>3 differ</b>');
 if(st==='end')items.push('Posting rules <b>6 saved</b>');
 return items.length?'<ol>'+items.map(t=>'<li>'+t+'</li>').join('')+'</ol>':'';
}
function talk(){
 const st=stage();
 if(st==='review')return '<h1 class="sr">'+stepTitles.audit+'</h1>'+story('“'+briefings[0][0]+'”')+msgLine('agent','I posted these five. Does each one look right to you?');
 if(st==='approach'){
  if(!s.compared||ui.run)return '<h1 class="sr">'+stepTitles.action+'</h1>'+msgLine('agent','Before I change anything, how should I check them?')+runList()+note();
  const hit=samples.filter((_,i)=>sampleWrong(i)&&s.agent.flags[i]).length;
  return '<h1 class="sr">Posting comparison</h1>'+msgLine('agent','I compared each posting with its rule.')+note()+(Object.keys(s.agent.flags).length===5?'<p class="aside">You flagged '+hit+' of the 3.</p>':'');
 }
 if(st==='rules'){
  const i=ui.saved??count(),r=rules[i];
  return '<h1 class="sr">'+stepTitles.mapping+'</h1>'+msgLine('agent','<small>Rule '+(i+1)+' of 6</small><strong>'+r[0]+'.</strong> Which account do I debit, and which do I credit?')+runList()+note();
 }
 return '<h1 class="sr">Rules complete</h1>'+msgLine('agent','All six rules are saved. New postings will follow them.')+'<div class="endCard"><b>The prototype ends here.</b><p>The June ledger, the tests and the handover continue in the current build, with your progress and score carried over.</p></div>';
}
function rulesTable(){
 const cur=ui.saved===null&&count()<6?count():-1;
 const rows=rules.map((r,i)=>s.mappings[i]&&!(ui.run&&ui.saved===i)?'<tr><th scope="row">'+r[0]+'</th><td>'+accounts[s.mappings[i][0]]+'</td><td>'+accounts[s.mappings[i][1]]+'</td></tr>':i===cur||(ui.run&&ui.saved===i)?'<tr class="cur"><th scope="row">'+r[0]+'</th>'+ui.pick.map(p=>'<td>'+(p===null?'—':accounts[p])+'</td>').join('')+'</tr>':'').join('');
 const left=6-count()-(cur===-1?0:1);
 return '<table class="rulesT"><thead><tr><th scope="col">When this happens</th><th scope="col">Debit</th><th scope="col">Credit</th></tr></thead><tbody>'+rows+'</tbody></table>'+(left>0?'<p class="more">'+left+' more to set</p>':'');
}
function screenView(){
 const st=stage();
 if(st==='review'){
  const i=nextSample(),a=samples[i];
  return win('Draft postings','<ol class="pips" aria-label="Posting '+(i+1)+' of 5">'+samples.map((_,j)=>'<li class="'+(s.seen.includes(j)?'done':j===i?'now':'')+'"></li>').join('')+'</ol><small>'+a[0]+' · '+(i+1)+' of 5</small><h2>'+sampleLabels[i]+'</h2><div class="amount">'+cash(a[2])+'</div>'+(i===2?'<p class="hintLine">Payment for an earlier credit sale.</p>':'')+tEntry(accounts[a[3]],accounts[a[4]]));
 }
 if(st==='approach'){
  if(!s.compared||ui.run)return win('Rule sheet',ruleSheet());
  return win('Posting comparison','<ul class="cmp">'+samples.map((a,i)=>{
   const bad=sampleWrong(i),r=rules[a[5]],flagged=s.agent.flags[i],has=i in s.agent.flags;
   const call=!has?'':bad?(flagged?'<span class="call hit">You flagged it</span>':'<span class="call miss">You passed it</span>'):(flagged?'<span class="call miss">You flagged it</span>':'');
   return '<li class="'+(bad?'bad':'')+'"><small>'+a[0]+'</small><b>'+sampleLabels[i]+'</b>'+(bad?call:'<span class="call fine">Matches</span>'+call)+(bad?'<div class="detail"><span>Posted <s>'+accounts[a[3]]+' / '+accounts[a[4]]+'</s></span><span>Rule sheet <strong>'+accounts[r[1]]+' / '+accounts[r[2]]+'</strong></span><em>'+findings[a[0]]+'</em></div>':'')+'</li>'}).join('')+'</ul>');
 }
 const done=ui.saved!==null&&!ui.run?ui.saved:-1;
 const test=done>-1?'<div class="testPost"><small>Test posting · '+rules[done][0]+' · '+cash(testAmount(done))+'</small>'+tEntry(accounts[s.mappings[done][0]],accounts[s.mappings[done][1]],testAmount(done))+'<span class="positive">Balanced · matches the rule sheet</span></div>':'';
 return win('Posting rules',rulesTable()+test+(st==='rules'?details('Rule sheet',ruleSheet()):''));
}
function reply(){
 const st=stage(),busy=!!ui.run;
 if(st==='review')return '<div class="two">'+choice('flag','Looks right',0)+choice('flag','Looks wrong',1)+'</div>';
 if(st==='approach')return s.compared&&!busy?go('Fix the rules →','fix'):'<div class="opts">'+auditOptions.map((x,i)=>choice('approach',escapeHTML(x),i,busy)).join('')+'</div>';
 if(st==='rules'){
  if(ui.saved!==null&&!busy)return go(count()===6?'Finish the rules →':'Next rule →','nextRule');
  return '<div class="slots">'+[0,1].map(k=>'<button type="button" class="slot'+(ui.slot===k?' on':'')+(ui.pick[k]===null?'':' filled')+'" data-do="slot" data-val="'+k+'" aria-pressed="'+(ui.slot===k)+'" '+(busy?'disabled':'')+'><small>'+['Debit','Credit'][k]+'</small><b>'+(ui.pick[k]===null?'Choose':accounts[ui.pick[k]])+'</b></button>').join('')+'</div><div class="chips" role="group" aria-label="Accounts">'+accounts.map((a,j)=>'<button type="button" class="chip'+(ui.pick.includes(j)?' used':'')+'" data-do="acct" data-val="'+j+'" '+(busy?'disabled':'')+'>'+a+'</button>').join('')+'</div>'+go('Run it →','run',busy||ui.pick.includes(null));
 }
 return go('Continue in the current build →','handoff')+choice('restart','Start again');
}

// ---- Rendering: a fixed shell per mode, so the opening video never restarts ----
function shell(mode){
 root.dataset.mode=mode;keys={};
 root.innerHTML=(mode==='open'
  ?'<main class="scene"><video class="sceneBg" muted loop playsinline preload="auto" poster="assets/video/zuri-store-poster.webp" aria-hidden="true"><source src="assets/video/zuri-store-loop.mp4" type="video/mp4"></video><header class="sceneTop"><img src="assets/brand/miva-open-university.svg" alt="MIVA Open University" width="120" height="37">'+gear('ghost')+'</header><div class="sceneBody" id="sceneBody"></div></main>'
  :'<header class="bar">'+brand()+'<div class="prog" role="img" aria-label="Stage 1 of 4: Posting rules"><b>Posting rules</b><i class="on"></i><i></i><i></i><i></i></div>'+gear()+'</header><main class="flow"><div id="trail"></div><div id="talk"></div><div id="screen"></div><div id="reply"></div></main>')
  +'<dialog id="dialog"></dialog>';
 if(mode==='open'&&!reduced())root.querySelector('.sceneBg').play().catch(()=>{});
}
// Replace a region; animate it only when its content is a new step, not a small update.
function fill(id,html,key){const el=byId(id);if(!el)return;el.classList.toggle('fresh',keys[id]!==key);keys[id]=key;el.innerHTML=html}
function paint(focus){
 const st=stage(),mode=st==='open'?'open':'work';
 if(root.dataset.mode!==mode)shell(mode);
 if(mode==='open'){fill('sceneBody',sceneBody(),s.agent.scene);if(focus!==false)root.querySelector('#sceneBody [tabindex]')?.focus({preventScroll:true})}
 else{
  const step=st+':'+(st==='review'?nextSample():st==='rules'?(ui.saved??count()):s.compared&&!ui.run);
  fill('trail',trail(),st);fill('talk',talk(),step);fill('screen',screenView(),step+(ui.saved!==null&&!ui.run));fill('reply',reply(),step+(ui.saved!==null&&!ui.run));
  if(focus)root.querySelector(focus)?.focus({preventScroll:true});else if(focus!==false){const el=byId('note')||root.querySelector('#talk h1');el?.focus({preventScroll:true});(byId('note')||byId('talk')).scrollIntoView({block:'nearest',behavior:reduced()?'auto':'smooth'})}
 }
 if(ui.failedStorage&&!byId('storageAlert'))root.insertAdjacentHTML('beforeend','<p role="alert" id="storageAlert">This browser could not save progress. Keep this tab open.</p>');
}
// A pick changes only Grace's screen and the reply, so the conversation does not flicker.
function paintPick(focus){fill('screen',screenView(),keys.screen);fill('reply',reply(),keys.reply);root.querySelector(focus)?.focus({preventScroll:true})}
function tell(line,tone){ui.msg=line;ui.tone=tone;save();paint();say(line)}
// "Smart Ledger takes it back and runs it": a short visible run, then the reveal. Instant with reduced motion.
function runAgent(steps,done){
 if(reduced()){done();return}
 ui.run={steps,i:0};ui.msg='';paint(false);
 const tick=()=>{ui.run.i++;if(ui.run.i>=steps.length){ui.run=null;done();return}paint(false);runTimer=setTimeout(tick,380)};
 runTimer=setTimeout(tick,380);
}
function modal(title,body){
 opener=document.activeElement;const d=byId('dialog');
 d.innerHTML='<div class="dialogHead"><h2 id="dialogTitle">'+title+'</h2>'+choice('close','Close')+'</div>'+body;d.setAttribute('aria-labelledby','dialogTitle');d.showModal();
 d.addEventListener('close',()=>opener?.focus(),{once:true});
}
const settingsText=()=>'<label class="toggle"><input type="checkbox" id="recorded" '+(recordedOn()?'checked':'')+'>Play recorded voices for Grace and the narrator</label><label class="toggle"><input type="checkbox" id="ambience" '+(soundsOn()?'checked':'')+'>Play sounds: shop ambience and answer cues</label><label class="toggle"><input type="checkbox" id="voice" '+(s.media.voice?'checked':'')+(supportedSpeech()?'':' disabled')+'>Read feedback and hints aloud</label><hr>'+choice('restart','Start again');

function respond(action,n){
 if(ui.run&&!['settings','close'].includes(action))return;
 const st=stage();
 switch(action){
 case 'settings':modal('Audio',settingsText());break;
 case 'close':byId('dialog').close();break;
 case 'begin':if(st!=='open'||s.agent.scene!==0)return;s.agent.scene=1;save();paint();introVoice(0);introSounds(0);break;
 case 'next':if(st!=='open'||s.agent.scene<1||s.agent.scene>2)return;s.agent.scene++;save();paint();introVoice(s.agent.scene-1);introSounds(s.agent.scene-1);break;
 case 'flag':{
  if(st!=='review')return;const i=nextSample(),wrong=n===1;
  s.seen.push(i);s.agent.flags[i]=wrong;record(s,'flag',i,wrong?'Looks wrong':'Looks right',wrong===sampleWrong(i));
  if(nextSample()===-1){s.sheet=true;s.page='action';stopVoice()}
  save();paint();break;
 }
 case 'approach':{
  if(st!=='approach'||s.compared)return;
  if(s.firstAudit===null)s.firstAudit=n;record(s,'audit',0,auditOptions[n],n===1);
  if(n!==1){tell('Changing headings or hiding accounts leaves the original postings unchecked. Try again.','warn');break}
  s.compared=true;save();
  runAgent(['Reading the rule sheet','Comparing five postings with their rules'],()=>tell('Three draft postings differ from the rules.','ok'));break;
 }
 case 'fix':if(st!=='approach'||!s.compared)return;s.agent.fix=true;s.page='mapping';ui.msg='';save();paint();break;
 case 'slot':if(st!=='rules'||ui.saved!==null)return;ui.slot=n;paintPick('[data-do=slot][data-val="'+n+'"]');break;
 case 'acct':{
  if(st!=='rules'||ui.saved!==null)return;
  ui.pick[ui.slot]=n;const first=ui.slot===0&&ui.pick[1]===null;if(first)ui.slot=1;
  paintPick(ui.pick.includes(null)?'[data-do=acct][data-val="'+n+'"]':'[data-do=run]');break;
 }
 case 'run':{
  const i=count();if(st!=='rules'||ui.saved!==null||i>=6||ui.pick.includes(null))return;
  const p=ui.pick.slice(),r=rules[i],ok=p[0]===r[1]&&p[1]===r[2];record(s,'map',i,p.map(j=>accounts[j]),ok);
  let feedback='Saved. '+r[3];
  if(ok){s.mappings[i]=p;ui.saved=i}
  else{
   const swapped=p[0]===r[2]&&p[1]===r[1];
   feedback=swapped?'Sides swapped. Check which balance increases and which falls.':i===5&&kinds[p[0]]==='expense'?'Owner withdrawals are drawings. A personal withdrawal is separate from a business expense.':'Check the '+(p[0]!==r[1]?'debit account ('+kinds[r[1]]+')':'credit account ('+kinds[r[2]]+')')+'.';
   if(s.log.filter(e=>e.task==='map'&&e.item===i).length>=2){feedback+=' Hint: '+r[3];record(s,'hint',i,'Second rule attempt',true)}
   ui.slot=swapped||p[0]!==r[1]?0:1;
  }
  save();
  runAgent(['Test posting · '+r[0],'Debit '+accounts[p[0]],'Credit '+accounts[p[1]],'Checking the rule sheet'],()=>tell(feedback,ok?'ok':'warn'));break;
 }
 case 'nextRule':if(ui.saved===null)return;ui.saved=null;ui.pick=[null,null];ui.slot=0;ui.msg='';paint();break;
 case 'handoff':if(st!=='end')return;if(flowPages.includes(s.page))s.page='sort';save();location.href='index.html';break;
 case 'restart':modal('Start a new attempt?','<p>This replaces the saved attempt on this device.</p>'+go('Start new attempt','reset'));break;
 case 'reset':clearTimeout(runTimer);stopVoice();stopShopSound();s=fresh();s.agent=newAgent();ui={...ui,msg:'',tone:'',pick:[null,null],slot:0,run:null,saved:null};save();root.dataset.mode='';paint();break;
 }
}
root.addEventListener('click',e=>{const b=e.target.closest('button[data-do]');if(b&&!b.disabled)respond(b.dataset.do,Number(b.dataset.val))});
root.addEventListener('submit',e=>{
 e.preventDefault();if(e.target.id!=='join')return;const n=byId('name').value.trim();
 if(!n){byId('name').setCustomValidity('Enter a name.');byId('name').reportValidity();return}
 s.name=n;s.agent.scene=4;s.started=s.started||new Date().toISOString();s.page='audit';stopShopSound();save();paint();
 playVoice([voiceClips.brief[0][0]],briefings[0][0]);
});
root.addEventListener('input',e=>{if(e.target.id==='name')e.target.setCustomValidity('')});
root.addEventListener('change',e=>{const el=e.target;if(!['voice','recorded','ambience'].includes(el.id))return;s.media[el.id]=el.checked;save();if(el.id==='voice'&&!el.checked&&supportedSpeech())speechSynthesis.cancel();if(el.id==='recorded'&&!el.checked)stopVoice();if(el.id==='ambience'&&!el.checked)stopShopSound()});
paint();
