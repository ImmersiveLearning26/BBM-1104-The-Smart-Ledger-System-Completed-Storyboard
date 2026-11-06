let s;
try{s=JSON.parse(localStorage.getItem(SAVE));if(!s||s.v!==1)throw Error()}catch{s=fresh()}
let ui={sample:-1,evidence:-1,err:0,cue:0,recap:0,paused:false,message:'',failedStorage:false};
let timer,idle,cueDeadline=0,cueRemaining=null;
const root=document.querySelector('#app');
const view={audit,action:actionPage,mapping,sort:sortPage,difference,trace:tracePage,correct:correctPage,test:testPage,regression,handover,debrief,finish:finishPage};
const introPages=['splash','cover','identity','intro','title'];
const byId=id=>document.getElementById(id);
const activeSection=()=>sections.findIndex(v=>v[1].includes(s.page));
const supportedSpeech=()=>typeof speechSynthesis!=='undefined'&&typeof SpeechSynthesisUtterance!=='undefined';
function say(line){
 if(!s.media.voice||!supportedSpeech())return;
 stopVoice();speechSynthesis.cancel();
 const voice=new SpeechSynthesisUtterance(line);voice.lang='en-KE';
 const match=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase()==='en-ke');
 if(match)voice.voice=match;speechSynthesis.speak(voice);
}
function save(){try{localStorage.setItem(SAVE,JSON.stringify(s))}catch{ui.failedStorage=true}}
function go(page){clearTimeout(timer);clearTimeout(idle);if(supportedSpeech())speechSynthesis.cancel();stopVoice();if(!['intro','title'].includes(page))stopShopSound();s.page=page;ui.message='';save();render();window.scrollTo(0,0);root.querySelector('h1')?.focus()}
function msg(line){ui.message=line;save();render();const box=byId('status');if(box)box.focus({preventScroll:false});say(line)}
function render(){
 const recap=s.page==='debrief'&&!s.recapDone;
 const panel=introPages.includes(s.page)?hero():recap?recapPage():workspace();
 root.innerHTML=panel+'<dialog id="dialog"></dialog>'+(ui.failedStorage?'<p role="alert">This browser could not save progress. Keep this tab open.</p>':'');
 if(s.page==='cover')mountCover();
 if(recap)mountRecap();
 clearTimeout(idle);
 if(['audit','mapping','test'].includes(s.page))idle=setTimeout(()=>{
  if(byId('dialog')?.open||ui.message)return;
  const text=s.page==='audit'?'Open the rule sheet and inspect each of the five draft entries.':s.page==='mapping'?'Hint: consider the account type and whether its balance rises or falls.':'Hint: check both account names and both amounts, even when the totals agree.';
  record(s,'hint',s.page,'Idle prompt',true);save();byId('status').textContent=text;say(text);
 },s.page==='audit'?7000:8000);
}
let opener;
function modal(title,body){
 opener=document.activeElement;const d=byId('dialog');d.innerHTML='<div class="dialogHead"><h2 id="dialogTitle">'+title+'</h2>'+choice('close','Close')+'</div>'+body;d.setAttribute('aria-labelledby','dialogTitle');d.showModal();
 if(s.page==='intro'&&!ui.paused){holdCue();pauseVoice();pauseAmbience();if(supportedSpeech())speechSynthesis.pause()}
 d.addEventListener('close',()=>{opener?.focus();if(ui.briefModal){ui.briefModal=false;stopVoice()}if(s.page==='intro')render();if(s.page==='intro'&&!ui.paused){if(supportedSpeech())speechSynthesis.resume();resumeVoice();resumeAmbience();scheduleCue()}},{once:true});
}
const val=id=>{const el=byId(id);return !el||el.value===''?null:Number(el.value)};
function readPair(){const pair=[val('dr'),val('cr')];return pair.includes(null)?null:pair}
function holdCue(){clearTimeout(timer);cueRemaining=Math.max(0,cueDeadline-Date.now())}
function scheduleCue(){
 clearTimeout(timer);if(s.page!=='intro'||ui.paused)return;
 const delay=cueRemaining??cueHold(ui.cue,[14500,12000,15500,15000,5000][ui.cue]);cueRemaining=null;cueDeadline=Date.now()+delay;
 timer=setTimeout(()=>{if(ui.cue===4){go('title');return}ui.cue++;render();introVoice(ui.cue);introSounds(ui.cue);scheduleCue()},delay);
}
function settingsText(){return '<label class="toggle"><input type="checkbox" id="captions" '+(s.media.captions?'checked':'')+'>Show subtitles</label><label class="toggle"><input type="checkbox" id="recorded" '+(recordedOn()?'checked':'')+'>Play recorded voices for Grace and the narrator</label><label class="toggle"><input type="checkbox" id="ambience" '+(soundsOn()?'checked':'')+'>Play shop sounds in the opening</label><label class="toggle"><input type="checkbox" id="voice" '+(s.media.voice?'checked':'')+(supportedSpeech()?'':' disabled')+'>Read feedback aloud with this device</label><p>Written prompts are available throughout the simulation.</p>'+(s.page==='intro'?details('Read introduction',intro.map(([speaker,line])=>'<p><b>'+speaker+'</b> · '+line+'</p>').join('')):'')}
function startBranch(){s.started=s.started||new Date().toISOString();go('audit')}
function required(message){msg(message)}
function keepFocusMessage(line){const node=byId('status');if(node){node.textContent=line;node.focus()}say(line)}
function exportLog(){
 const data={...s,score:grade(s),reasoning_status:s.manual?'reviewed':'indicative',suspense_balance:suspense(s)};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Smart-Ledger-'+s.learner_id+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
const pageControls={advanceSplash:'splash',skip:'intro',pause:'intro',start:'title',sample:'audit',auditNext:'audit',auditChoice:'action',configure:'action',map:'mapping',ledger:'mapping',column:'sort',readDifference:'sort',difference:'difference',evidence:'trace',type:'trace',correction:'trace',pickError:'correct',post:'correct',console:'correct',predict:'test',repair:'test',regression:'test',runAll:'regression',investigate:'regression',backTest:'regression',confirmReport:'regression',summary:'handover',submit:'handover',recapNext:'debrief',recapBack:'debrief',recapDone:'debrief',toggleRecap:'debrief',finish:'debrief',review:'finish',export:'finish',facilitator:'finish',mark:'finish',restart:'finish',reset:'finish'};
function respond(action,n){
 if(pageControls[action]&&pageControls[action]!==s.page)return;
 switch(action){
 case 'advanceSplash':go('cover');break;
 case 'enterCover':if(s.page==='cover')go('identity');break;
 case 'toggleCover':if(s.page==='cover')toggleCover();break;
 case 'skip':go('title');break;
 case 'pause':if(!ui.paused)holdCue();ui.paused=!ui.paused;if(ui.paused){pauseVoice();pauseAmbience()}else{resumeVoice();resumeAmbience()}if(supportedSpeech()){if(ui.paused)speechSynthesis.pause();else speechSynthesis.resume()}render();scheduleCue();break;
 case 'start':startBranch();briefVoice(0);break;
 case 'brief':{const i=activeSection(),[gr,nar]=briefings[i];modal('Scene briefing','<p><b>Grace Achieng</b></p><p>'+gr+'</p><p><b>Narrator</b></p><p>'+nar+'</p>');ui.briefModal=true;briefVoice(i);break}
 case 'book':if(activeSection()===1)modal('June ledger book',ledgerBook());break;
 case 'settings':modal('Audio & captions',settingsText());break;
 case 'close':byId('dialog').close();if(s.page!=='intro'&&supportedSpeech())speechSynthesis.cancel();break;
 case 'sheet':s.sheet=true;save();if(s.page==='audit'){const next=root.querySelector('[data-do=auditNext]');if(next)next.disabled=s.seen.length!==5}modal('Posting rule sheet',ruleSheet()+details('Opening balances · 1 June',table(['Account','Balance'],opening.flatMap((v,i)=>v?[[accounts[i],balance(v)]]:[]))));break;
 case 'sample':ui.sample=n;if(!s.seen.includes(n))s.seen.push(n);ui.message='';save();render();break;
 case 'auditNext':if(s.sheet&&s.seen.length===5)go('action');break;
 case 'auditChoice':if(s.compared)return;if(s.firstAudit===null)s.firstAudit=n;record(s,'audit',0,auditOptions[n],n===1);s.compared=n===1;msg(n===1?'Three draft postings differ from the rules.':'Changing headings or hiding accounts leaves the original postings unchecked. Try again.');break;
 case 'configure':if(s.compared)go('mapping');break;
 case 'map':{
  const i=Object.keys(s.mappings).length;if(i>=6)return;const p=readPair(),r=rules[i];
  if(!p)return keepFocusMessage('Choose both accounts before saving.');
  const ok=p[0]===r[1]&&p[1]===r[2];record(s,'map',i,p.map(j=>accounts[j]),ok);
  if(ok){s.mappings[i]=p;msg('Saved. '+r[3]);break}
  const swapped=p[0]===r[2]&&p[1]===r[1];let feedback=swapped?'Sides swapped. Check which balance increases and which falls.':i===5&&kinds[p[0]]==='expense'?'Owner withdrawals are drawings. A personal withdrawal is separate from a business expense.':'Check the '+(p[0]!==r[1]?'debit account ('+kinds[r[1]]+')':'credit account ('+kinds[r[2]]+')')+'.';
  if(s.log.filter(e=>e.task==='map'&&e.item===i).length>=2){feedback+=' Hint: '+r[3];record(s,'hint',i,'Second rule attempt',true)}
  msg(feedback);break;
 }
 case 'ledger':if(Object.keys(s.mappings).length===6){go('sort');briefVoice(1)}break;
 case 'column':{
  const v=ledger(s),i=v.findIndex((x,j)=>!s.columns[j]);if(i===-1)return;
  const side=['Debit','Credit'][n],ok=(v[i]>0)===(n===0);record(s,'column',i,side,ok);
  if(ok)s.columns[i]=side;msg(ok?accounts[i]+' placed in '+side+'.':'Check the normal balance for '+accounts[i]+' ('+kinds[i]+').');break;
 }
 case 'readDifference':if(Object.keys(s.columns).length===11)go('difference');break;
 case 'difference':{
  const raw=byId('amount').value.trim(),side=val('side');if(!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(raw)||side===null)return keepFocusMessage('Enter a whole KSh amount and choose a column.');
  const ok=Number(raw.replaceAll(',',''))===14100&&side===0;record(s,'difference',0,raw+' · '+['Debit','Credit'][side],ok);
  if(ok){s.difference=true;go('trace')}else msg('Subtract the smaller total from the larger and identify the smaller column.');break;
 }
 case 'evidence':ui.evidence=n;if(!s.inspected.includes(n))s.inspected.push(n);save();render();break;
 case 'type':{
  const i=Object.keys(s.types).length;if(i>1||s.inspected.length<3)return;
  record(s,'type',i,errors[n],n===i);if(n===i)s.types[i]=n;
  msg(n!==i?'Compare the source amount with both legs of the entry.':i===0?'The bank credit is present. Trade Payables is missing its KSh 15,000 debit.':'The debit was keyed as 5,400 instead of 4,500. The KSh 900 difference divides by nine.');break;
 }
 case 'correction':if(Object.keys(s.types).length===2)go('correct');break;
 case 'pickError':ui.err=n;ui.message='';render();break;
 case 'post':{
  const i=ui.err;if(s.posted.includes(i))return;const ok=n===i;record(s,'post',i,corrections[i][n],ok);
  if(ok){s.posted.push(i);record(s,'suspense',i,balance(suspense(s)),true);msg('Posted. Suspense balance: '+balance(suspense(s))+'.');break}
  const delta=i===0?(n===1?0:-14100):(n===0?0:-900);
  msg('Preview: suspense would be '+balance(suspense(s)+delta)+'. '+(i===0&&n===1?'Bank has already been credited.':'Compare the journal with the specific missing or excess amount.')+' Choose another entry.');break;
 }
 case 'console':if(s.posted.length===2&&suspense(s)===0){go('test');briefVoice(2)}break;
 case 'predict':{
  const i=s.selected;if(s.runs[i])return;const p=readPair();if(!p)return keepFocusMessage('Predict both accounts before running this case.');
  const a=entry(s,i),ok=p[0]===cases[i][2]&&p[1]===cases[i][3];s.runs[i]={pred:p,actual:a,initial:a};record(s,'predict',i,p.map(j=>accounts[j]),ok);
  msg((ok?'Prediction matches the expected entry. ':'Compare your prediction with the expected entry. ')+(a.pass?'The system posted correctly.':a.balanced?'The totals agree. Check which account received the debit.':'The system posted unequal amounts.'));break;
 }
 case 'repair':{
  const i=s.selected,r=s.runs[i],n=val('repairPick');if(!r||r.actual.pass)return;if(n===null)return keepFocusMessage('Choose the rule or routine to revise.');
  const f=cases[i][6],ok=f==='F'+(n+1);record(s,'repair',f,n<3?routines[n]:rules[n-3][0],ok);
  if(!ok)return msg('That change would leave this posting error in place. Compare the expected and actual legs.');
  if(!s.repairs.includes(f))s.repairs.push(f);r.actual=entry(s,i);s.report=null;msg('Routine revised. The rerun matches the expected posting.');break;
 }
 case 'regression':if(new Set(Object.keys(s.runs).map(i=>cases[i][4])).size===4)go('regression');break;
 case 'runAll':s.report=cases.map((_,i)=>entry(s,i));record(s,'regression',0,s.report.filter(a=>a.pass).length+' of 10 passed',s.report.every(a=>a.pass));msg(s.report.every(a=>a.pass)?'All ten cases pass. Confirm the report to unlock handover.':'Investigate each failing case, revise its routine and run all ten again.');break;
 case 'investigate':if(s.report&&!s.report[n].pass){s.selected=n;go('test')}break;
 case 'backTest':go('test');break;
 case 'confirmReport':if(s.report?.length===10&&s.report.every(a=>a.pass))go('handover');break;
 case 'summary':record(s,'summary',0,handovers[n],n===0);s.summary=n;msg(n===0?'Explain the reasoning in your own words.':n===1?'Recall T10. Both sides agreed when the purchase was charged to Delivery Expense.':'Include how you traced the difference and what equal totals can conceal.');break;
 case 'submit':if(s.summary!==0||!s.report?.every(a=>a.pass))return;if(s.rationale.some(x=>!x.trim()))return keepFocusMessage('Complete all three parts of your explanation.');s.marks=suggestMarks(s.rationale);ui.recap=0;go('debrief');break;
 case 'recapNext':if(!s.recapDone)showRecap(1);break;
 case 'recapBack':if(!s.recapDone)showRecap(0);break;
 case 'recapDone':s.recapDone=true;go('debrief');break;
 case 'toggleRecap':toggleRecap();break;
 case 'finish':s.completed=s.completed||new Date().toISOString();go('finish');closingVoice();break;
 case 'review':go('debrief');break;
 case 'export':exportLog();break;
 case 'facilitator':modal('Facilitator review','<p>Review the learner’s own explanation. Award one mark for each demonstrated criterion.</p>'+rationalePrompts.map((p,i)=>'<hr><b>'+p+'</b><p>'+escapeHTML(s.rationale[i])+'</p><label class="toggle"><input id="mark'+i+'" type="checkbox" '+(s.marks[i]?'checked':'')+'>Criterion met</label>').join('')+button('mark','Save reviewed marks'));break;
 case 'mark':s.marks=rationalePrompts.map((p,i)=>byId('mark'+i).checked);s.manual=true;record(s,'review',0,s.marks.map(v=>v?'Met':'Revisit'),true);go('debrief');break;
 case 'restart':modal('Start a new attempt?','<p>This replaces the saved attempt on this device. Export your test log first if you need a copy.</p>'+button('reset','Start new attempt'));break;
 case 'reset':s=fresh();ui={...ui,sample:-1,evidence:-1,err:0,cue:0,recap:0,paused:false};go('cover');break;
 }
}
root.addEventListener('click',e=>{const b=e.target.closest('button[data-do]');if(b&&!b.disabled)respond(b.dataset.do,Number(b.dataset.val))});
root.addEventListener('submit',e=>{e.preventDefault();if(e.target.id!=='identity')return;const n=byId('name').value.trim();if(!n){byId('name').setCustomValidity('Enter a name.');byId('name').reportValidity();return}s.name=n;ui.cue=0;cueRemaining=null;go('intro');introVoice(0);introSounds(0);scheduleCue()});
root.addEventListener('input',e=>{if(e.target.id==='name')e.target.setCustomValidity('');const k=e.target.dataset.save;if(!k)return;if(k==='note')s.note=e.target.value;else if(k[0]==='r')s.rationale[Number(k.slice(1))]=e.target.value;else s.reflection[Number(k.slice(1))]=e.target.value;save()});
root.addEventListener('change',e=>{const el=e.target;if(el.id==='repairPick')root.querySelector('[data-do=repair]').disabled=el.value==='';if(el.id==='casePick'){s.selected=Number(el.value);ui.message='';save();render();byId('casePick')?.focus()}if(el.id==='lesson'){s.lesson=el.value;save()}if(['captions','voice','recorded','ambience'].includes(el.id)){s.media[el.id]=el.checked;save();if(el.id==='voice'&&!el.checked&&supportedSpeech())speechSynthesis.cancel();if(el.id==='recorded'&&!el.checked)stopVoice();if(el.id==='ambience'){if(el.checked)resumeAmbience();else stopShopSound()}}});
render();if(s.page==='splash')timer=setTimeout(()=>go('cover'),1800);if(s.page==='intro')scheduleCue();
