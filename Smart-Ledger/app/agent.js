// Agent-led build: the whole simulation as a chat with Smart Ledger, built only from the agent library
// (design/agent-library/README.md, app/agent-library.css and .js).
// Layout: Grace on one side; the chat on the other, with the input box pinned at the bottom.
// Each step: the agent asks -> Grace's screen arrives as a card -> the learner picks -> the agent runs it and reveals.
// State, scoring, log, feedback wording and save key are the same as app.js (index.html), so attempts are interchangeable.
let s;
try{s=JSON.parse(localStorage.getItem(SAVE));if(!s||s.v!==1)throw Error()}catch{s=fresh()}
const newAgent=()=>({scene:s.started?4:0,flags:{},fix:Object.keys(s.mappings).length>0});
s.agent=s.agent||newAgent();
const freshUi=()=>({pick:[null,null],slot:0,busy:false,saved:null,approach:null,sheet:false,book:false,armed:false,evidence:-1,err:null,side:null,predicting:false});
let ui={...freshUi(),failedStorage:false};
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

// ---- Curriculum helpers (all values come from content.js and engine.js) ----
const sampleLabels=['Cash sale','Rent paid by bank','Customer payment','Owner withdrawal','Stock bought on credit'];
const findings={'S-02':'Sides reversed','S-03':'Customer debt remains open. Sales counted twice.','S-04':'Drawings recorded as an expense.'};
const sampleWrong=i=>{const a=samples[i],r=rules[a[5]];return a[3]!==r[1]||a[4]!==r[2]};
const nextSample=()=>samples.findIndex((_,j)=>!s.seen.includes(j));
const testAmount=i=>(samples.find(a=>a[5]===i)||[])[2]??cases.find(c=>c[5]===i)[1];
const sheetRows=[['Assets','Cash, Bank, Inventory, Equipment, Trade Receivables','Debit'],['Expenses','Rent, Delivery','Debit'],['Drawings','Owner withdrawals','Debit'],['Liabilities','Trade Payables','Credit'],['Capital','Owner investment','Credit'],['Income','Sales','Credit']];
const traceSources=[['Trade Payables','Supplier payment · June transaction 06','Supplier payment from bank: KSh 15,000.','Bank credit 15,000. No matching debit appears in Trade Payables.'],['Delivery Expense','Delivery voucher · June transaction 08','Cash paid for delivery: KSh 4,500.','Delivery Expense debit 5,400.'],['Cash','Cash record · June transaction 08','Cash paid for delivery: KSh 4,500.','Cash credit 4,500.']];
const errorNames=['Supplier payment','Delivery expense'];
const rPrompts=['How does account type determine the debit and credit?','How did you trace and clear the trial balance difference?','What can equal totals still conceal?'];
const approachIcons=['heading','compare','hide'],errorIcons=['payable','delivery','cash','globe'];
const openPages=['splash','cover','identity','intro','title','audit','action','mapping'];
const pairText=p=>'Debit '+accounts[p[0]]+' · Credit '+accounts[p[1]];
const coverage=()=>new Set(Object.keys(s.runs).map(i=>cases[i][4]));
const firstOpenCol=()=>ledger(s).findIndex((_,j)=>!s.columns[j]);
function stage(){
 if(s.agent.scene<4&&openPages.includes(s.page))return 'open';
 if(openPages.includes(s.page)){
  if(nextSample()!==-1)return 'review';
  if(!s.agent.fix)return 'approach';
  if(count()<6||ui.saved!==null)return 'rules';
  return 'sort';
 }
 return s.page;
}
// Chapters: finished ones collapse to one summary line, the current one shows its full conversation.
const chapters=[
 {stages:['review','approach'],sum:['Draft postings','Three differ from the rules']},
 {stages:['rules'],sum:['Posting rules','Six saved']},
 {stages:['sort','difference'],sum:['June trial balance','Debit short '+cash(14100)]},
 {stages:['trace','correct'],sum:['Suspense account','Cleared · both columns '+cash(465000)]},
 {stages:['test','regression'],sum:['Ten-case report','All ten pass']},
 {stages:['handover'],sum:['Handover to Grace','Submitted']},
 {stages:['debrief','finish'],sum:['Month-end review','Complete']}
];
const chapterOf=st=>chapters.findIndex(c=>c.stages.includes(st));

// ---- Cards: Grace's Smart Ledger screen, posted into the chat ----
const objBar=(title,sub='June ledger')=>'<div class="objBar"><span class="appTile">'+ic('ledger')+'</span><div><b>'+title+'</b><small>'+sub+'</small></div>'+ic('globe','end')+'</div>';
const ledgerCard=(title,body,sub)=>objBar(title,sub)+'<div class="objBody">'+body+'</div>';
const tAccount=(d,c,amount)=>'<div class="t"><div><small>Debit</small><b>'+d+'</b>'+(amount?'<span>'+money(amount)+'</span>':'')+'</div><div><small>Credit</small><b>'+c+'</b>'+(amount?'<span>'+money(amount)+'</span>':'')+'</div></div>';
const row=(label,right,cls='')=>'<li class="row '+cls+'"><span>'+label+'</span><small>'+right+'</small></li>';
const tbRow=(label,dr,cr,cls='')=>'<li class="row tb '+cls+'"><span>'+label+'</span><span class="num">'+dr+'</span><span class="num">'+cr+'</span></li>';
const tbHead='<li class="tbHead"><span>Account</span><span>Debit</span><span>Credit</span></li>';
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
// The trial balance as placed so far; with all=true, the whole ledger as it stands.
function trialCard(title,all=false){
 const v=ledger(s),cur=all?-1:firstOpenCol();
 const rows=v.map((n,j)=>{
  if(all||s.columns[j])return tbRow(accounts[j],n>0?money(n):'—',n<0?money(-n):'—');
  if(j===cur)return tbRow(accounts[j],'?','?','now');
  return '';
 }).join('');
 const t=all?totals(v):totals(v.map((n,j)=>s.columns[j]?n:0));
 const sus=all&&suspense(s)!==0?tbRow('Suspense',suspense(s)>0?money(suspense(s)):'—',suspense(s)<0?money(-suspense(s)):'—'):'';
 return ledgerCard(title,'<ul class="rows">'+tbHead+rows+sus+tbRow('<b>Total</b>','<b>'+money(t[0]+(all&&suspense(s)>0?suspense(s):0))+'</b>','<b>'+money(t[1]+(all&&suspense(s)<0?-suspense(s):0))+'</b>','total')+'</ul>'+(cur>-1?'<p class="objLabel sheetNote">Next balance · '+accounts[cur]+' · '+cash(Math.abs(v[cur]))+'</p>':''));
}
function differenceCard(){const t=totals(ledger(s));return ledgerCard('June trial balance','<ul class="rows">'+row('Debit column','<b>'+cash(t[0])+'</b>')+row('Credit column','<b>'+cash(t[1])+'</b>')+'</ul>')}
function bookCard(){
 const v=ledger(s);
 return ledgerCard('Ledger book','<ul class="rows">'+accounts.map((a,i)=>{
  const refs=[];if(opening[i])refs.push('Opening '+money(Math.abs(opening[i])));
  journal.forEach(([,amount,d,c],j)=>{if(d===i&&j!==5)refs.push('J'+(j+1)+' Dr '+money(j===7?5400:amount));if(c===i)refs.push('J'+(j+1)+' Cr '+money(amount))});
  if(i===5&&s.posted.includes(0))refs.push('E1 Dr 15,000');if(i===10&&s.posted.includes(1))refs.push('E2 Cr 900');
  return '<li class="row"><span><b>'+a+'</b><small class="eg">'+refs.join(' · ')+'</small></span><small>'+balance(v[i])+'</small></li>'}).join('')+'</ul><p class="objLabel sheetNote">June sources: '+journal.map(([l,amt],i)=>'J'+(i+1)+' '+l+' '+money(amt)).join(' · ')+'</p>');
}
function traceCard(){
 const k=Object.keys(s.types).length,picked=s.inspected.length===3&&k<2?(k===0?[0]:[1,2]):ui.evidence>-1?[ui.evidence]:[];
 if(!picked.length)return ledgerCard('Flagged accounts','<ul class="rows">'+traceSources.map(e=>row(e[0],'Not opened')).join('')+'</ul>');
 return ledgerCard('Source comparison',picked.map(i=>{const e=traceSources[i];return '<p class="objLabel">'+e[1]+'</p><ul class="rows">'+row('Source',e[2])+row('Ledger',e[3])+'</ul>'}).join('<div class="gap"></div>'));
}
function suspenseCard(){
 return ledgerCard('Suspense account','<p class="objLabel">Balance</p><p class="objAmount">'+balance(suspense(s))+'</p><ul class="rows">'+errorNames.map((n,i)=>row((i?'E2 · ':'E1 · ')+n,s.posted.includes(i)?'Correcting journal posted':'Waiting',!s.posted.includes(i)&&ui.err===i?'now':'')).join('')+'</ul>');
}
function caseCard(){
 const i=s.selected,c=cases[i],r=s.runs[i];
 const head='<p class="objLabel">T'+(i+1)+' · '+groups[c[4]]+'</p><p class="objTitle">'+c[0]+'</p><p class="objAmount">'+cash(c[1])+'</p>';
 if(!r)return ledgerCard('Test console',head+'<ul class="rows">'+row('Your prediction',(ui.pick[0]===null?'Debit ?':'Debit '+accounts[ui.pick[0]])+' · '+(ui.pick[1]===null?'Credit ?':'Credit '+accounts[ui.pick[1]]),'now')+'</ul>');
 const a=r.actual,bad=(exp,act,amt)=>act!==exp||amt!==c[1],leg=(exp,act,amt)=>(act===null?'Missing entry':accounts[act]+' · '+money(amt))+(bad(exp,act,amt)?' ⚠':'');
 const compact='<p class="objLabel">T'+(i+1)+' · '+groups[c[4]]+' · '+cash(c[1])+'</p><p class="objTitle">'+c[0]+'</p>';
 const match=a.pass?'Entry matches':a.d===null?'Missing posting':a.da!==a.ca?'Amount mismatch':'Account mismatch';
 const legRow=(side,exp,act,amt)=>'<li class="row tb3"'+(bad(exp,act,amt)?' data-focus':'')+'><span>'+side+'</span><span>'+accounts[exp]+' · '+money(c[1])+'</span><span>'+leg(exp,act,amt)+'</span></li>';
 return ledgerCard('Test console',compact+'<ul class="rows">'+tbHead.replace('Account','Side').replace('Debit','Expected').replace('Credit','System posted')+legRow('Debit',c[2],a.d,a.da)+legRow('Credit',c[3],a.c,a.ca)+row(a.balanced?'Amounts balance':'Unequal amounts',match,'verdict')+'</ul>');
}
function reportCard(){return ledgerCard('Regression report','<ul class="rows">'+(s.report||[]).map((a,i)=>row('T'+(i+1)+' · '+cases[i][0],a.pass?'Pass':'Mismatch',a.pass?'':'now')).join('')+'</ul>')}
function scoreCard(){
 const g=grade(s),names=['Posting rules','Trial balance and ledger','Errors and corrections','Testing and debugging','Reasoning'];
 return ledgerCard('Weighted score','<p class="objLabel">'+(s.manual?'Facilitator reviewed':'Indicative reasoning mark')+'</p><p class="objAmount">'+g.final.toFixed(1)+' / 100 · '+band(g.final)+'</p><ul class="rows">'+names.map((n,i)=>row(n,g.strands[i].toFixed(1)+' · '+band(g.strands[i]))).join('')+'</ul>','Month-end review');
}
function currentCard(){
 const st=stage();
 if(st==='review')return postingCard(nextSample());
 if(st==='approach')return s.compared?comparisonCard():sheetCard();
 if(st==='rules')return rulesCard();
 if(st==='sort')return trialCard(firstOpenCol()===-1?'June trial balance':'Trial balance extraction');
 if(st==='difference')return differenceCard();
 if(st==='trace')return traceCard();
 if(st==='correct')return s.posted.length===2&&suspense(s)===0?trialCard('Corrected June trial balance',true):suspenseCard();
 if(st==='test')return caseCard();
 if(st==='regression')return s.report?reportCard():ledgerCard('Regression','<ul class="rows">'+cases.map((c,i)=>row('T'+(i+1)+' · '+c[0],groups[c[4]])).join('')+'</ul>');
 if(st==='handover')return ledgerCard('Handover','<ul class="rows">'+row('Summary',s.summary===0?'Chosen':'Waiting')+rPrompts.map((p,i)=>row(p,s.rationale[i].trim()?'Answered':'Waiting',!s.rationale[i].trim()&&s.summary===0&&i===s.rationale.findIndex(x=>!x.trim())?'now':'')).join('')+'</ul>','Your explanation');
 if(st==='debrief')return scoreCard();
 return trialCard('Corrected June ledger',true);
}

// ---- The chat: rebuilt from saved state, so a reload restores the whole conversation ----
function thread(){
 const st=stage(),ch=chapterOf(st),items=[],A=(html,o={})=>items.push({who:'agent',html,...o}),L=html=>items.push({who:'me',html}),G=html=>items.push({who:'grace',html});
 chapters.slice(0,Math.max(0,ch)).forEach(c=>A(c.sum[0]+'.',{card:mini(c.sum[0],c.sum[1])}));
 if(ch===0){
  G('“'+briefings[0][0]+'”');
  for(const i of s.seen){A('Does this posting look right to you?',{card:mini(samples[i][0]+' '+sampleLabels[i],accounts[samples[i][3]]+' / '+accounts[samples[i][4]])});L(s.agent.flags[i]?'Looks wrong':'Looks right')}
  if(st==='review')return A('Does this posting look right to you?',{cur:true}),items;
  if(!s.compared)return A('Before I change anything, how should I check them?',{cur:true}),items;
  A('Before I change anything, how should I check them?');L(auditOptions[1]);
  return A('I compared each posting with its rule.',{cur:true}),items;
 }
 if(ch===1){
  for(let j=0;j<count();j++){if(j===ui.saved)continue;A(rules[j][0]+'.');L(pairText(s.mappings[j]))}
  A('<b>'+rules[ui.saved??count()][0]+'.</b> Which account do I debit, and which do I credit?',{cur:true});if(ui.saved!==null)L(pairText(s.mappings[ui.saved]));
  return items;
 }
 if(ch===2){
  G('“'+briefings[1][0]+'”');
  const v=ledger(s),open=firstOpenCol();
  Object.keys(s.columns).map(Number).sort((a,b)=>a-b).forEach(j=>{A(accounts[j]+' · '+cash(Math.abs(v[j]))+'.');L(s.columns[j])});
  if(st==='sort')return A(open===-1?'Every balance is placed. The columns do not agree.':'<b>'+accounts[open]+'</b> has a balance of '+cash(Math.abs(v[open]))+'. Which column does it go in?',{cur:true}),items;
  return A('The two columns disagree. How large is the difference, and which column is short?',{cur:true}),items;
 }
 if(ch===3){
  const k=Object.keys(s.types).length;
  if(st==='trace'){
   if(s.inspected.length<3)return A('Three accounts do not match their sources. Open each one.',{cur:true}),items;
   A('Three accounts do not match their sources. Open each one.');
   if(k>0){A('What kind of error is the supplier payment?');L(errors[0])}
   if(k===2){A('And the delivery payment?');L(errors[1]);return A('Both causes are identified.',{cur:true}),items}
   return A(k===0?'What kind of error is the supplier payment?':'And the delivery payment?',{cur:true}),items;
  }
  A('Both causes are identified.');
  s.posted.forEach(i=>{A('Which journal corrects the '+errorNames[i].toLowerCase()+'?');L(corrections[i][i])});
  if(s.posted.length===2)return A('Suspense is clear, and both columns agree.',{cur:true}),items;
  const e=ui.err??[0,1].find(i=>!s.posted.includes(i));
  return A('Which journal corrects the '+errorNames[e].toLowerCase()+'?',{cur:true}),items;
 }
 if(ch===4){
  G('“'+briefings[2][0]+'”');
  Object.keys(s.runs).map(Number).filter(i=>!(st==='test'&&i===s.selected)).forEach(i=>{A('T'+(i+1)+' · '+cases[i][0]+'.');L(pairText(s.runs[i].pred))});
  if(st==='regression')return A(s.report?(s.report.every(a=>a.pass)?'All ten cases pass.':'Some cases still fail. Investigate them.'):'I will run all ten cases against your rules and routines.',{cur:true}),items;
  const r=s.runs[s.selected];
  if(r){A('T'+(s.selected+1)+' · '+cases[s.selected][0]+'.');L(pairText(r.pred));return A(r.actual.pass?(coverage().size===4?'Pick another case, or run all ten.':'Pick another case.'):'This case fails. Which routine or rule needs revision?',{cur:true}),items}
  return A(ui.predicting?'Predict the entry for T'+(s.selected+1)+' · '+cases[s.selected][0]+'.':'Pick a test case. Cover each kind: normal, rule check, routine fault, and balanced but wrong.',{cur:true}),items;
 }
 if(ch===5){
  G('“If the trial balance balances, can I trust everything in the books?”');
  if(s.summary!==0)return A('Which summary do you give Grace?',{cur:true}),items;
  A('Which summary do you give Grace?');L(handovers[0]);
  const k=s.rationale.findIndex(x=>!x.trim());
  rPrompts.forEach((p,i)=>{if(i<k||k===-1){A(p);L(escapeHTML(s.rationale[i]))}});
  return A(k===-1?'Your explanation is ready.':rPrompts[k]+' Answer in your own words.',{cur:true}),items;
 }
 G('“'+(st==='finish'?'Thank you for staying with the numbers until they made sense.':briefings[3][0])+'”');
 if(st==='finish')return A('Your handover is saved. An accountant reviews the accounts; the figures and business are fictional.',{cur:true}),items;
 A('Here is your month-end review.',{cur:true});
 items.push({who:'agent',html:'Trace the difference. You compared the ledger with its source records and corrected the errors behind the '+cash(14100)+' difference.',card:'<div class="obj">'+trialCard('Corrected June ledger',true)+'</div>',extra:true});
 items.push({who:'agent',html:'Test beyond the totals. Equal debit and credit totals can still hide a wrong-account posting. Your tests checked both the amounts and the accounts.',card:'<div class="obj">'+reportCard()+'</div>',extra:true});
 items.push({who:'agent',html:'Which lesson will you keep? This is optional.',extra:true});
 return items;
}
function threadHTML(){
 const me=(s.name||'?').trim()[0]?.toUpperCase()||'?',out=[],st=stage();
 for(const m of thread()){
  const av=m.who==='grace'?'<span class="av grace" aria-hidden="true"></span>':m.who==='me'?'<span class="av me" aria-hidden="true">'+escapeHTML(me)+'</span>':m.cur?'<span class="av" data-orb id="agentOrb"></span>':'<span class="av dot" aria-hidden="true"></span>';
  const who=m.who==='grace'?'Grace':m.who==='me'?'You':'Smart Ledger',live=m.cur||m.extra;
  const body='<p class="t-message"'+(m.cur?' id="ask" tabindex="-1"':'')+'><span class="sr">'+who+': </span>'+m.html+'</p>'+(m.cur?'<div class="obj" id="obj">'+currentCard()+'</div>':m.card||'');
  out.push('<li class="msg '+m.who+(live?' cur':' past')+'">'+av+'<div class="body">'+body+'</div></li>');
  // Reference cards, when asked for, arrive under the current question.
  if(m.cur){
   if(ui.sheet&&!(st==='approach'&&!s.compared))out.push('<li class="msg agent cur sheetMsg"><span class="av dot" aria-hidden="true"></span><div class="body"><p class="t-message">Here is the rule sheet.</p><div class="obj">'+sheetCard()+'</div></div></li>');
   if(ui.book)out.push('<li class="msg agent cur bookMsg"><span class="av dot" aria-hidden="true"></span><div class="body"><p class="t-message">Here is the June ledger book.</p><div class="obj">'+bookCard()+'</div></div></li>');
  }
 }
 return out.join('');
}

// ---- The input box, pinned at the bottom ----
const tile=(label,icon,val,on=false,act='pick',sub='')=>'<button type="button" class="tile'+(on?' on':'')+'" data-do="'+act+'" data-val="'+val+'" '+(ui.busy?'disabled':'')+'>'+ic(icon)+'<span>'+label+(sub?'<small>'+sub+'</small>':'')+'</span>'+(on?'<i class="dot" aria-hidden="true"></i>':'')+'</button>';
const tokens=(names=['Debit','Credit'])=>names.map((x,k)=>'<button type="button" class="token'+(ui.slot===k?' on':'')+(ui.pick[k]===null?' empty':'')+'" data-do="slot" data-val="'+k+'" aria-pressed="'+(ui.slot===k)+'" '+(ui.busy?'disabled':'')+'><small>'+x+'</small><b>'+(ui.pick[k]===null?'—':accounts[ui.pick[k]])+'</b></button>').join('');
const accountTiles=()=>'<div class="tiles" role="group" aria-label="Accounts">'+accounts.map((a,j)=>tile(a,AL.accountIcons[j],j,ui.pick.includes(j),'acct')).join('')+'</div>';
// What the input box asks for at each step: placeholder or tokens, the options, and whether send is used.
function dock(){
 const st=stage(),place=t=>'<span class="placeholder">'+t+'</span>';
 if(st==='review')return {compose:place('Looks right or looks wrong?'),opts:'<div class="tiles two" role="group" aria-label="Your call">'+tile('Looks right','check',0,false,'flag')+tile('Looks wrong','cross',1,false,'flag')+'</div>'};
 if(st==='approach'&&!s.compared)return {compose:ui.approach===null?place('Choose how I should check'):'<span class="token on"><b>'+auditOptions[ui.approach]+'</b></span>',opts:'<div class="tiles list" role="group" aria-label="How to check">'+auditOptions.map((x,i)=>tile(escapeHTML(x),approachIcons[i],i,ui.approach===i,'approach')).join('')+'</div>'};
 if(st==='rules'&&ui.saved===null)return {compose:ui.pick.every(v=>v===null)&&ui.slot===0?place('Pick the debit account'):tokens(),opts:accountTiles(),send:true};
 if(st==='sort'&&firstOpenCol()>-1)return {compose:place('Debit or credit?'),opts:'<div class="tiles two" role="group" aria-label="Column">'+tile('Debit','receivable',0,false,'column')+tile('Credit','payable',1,false,'column')+'</div>'};
 if(st==='difference')return {compose:'<label class="sr" for="amount">Difference in KSh</label><input id="amount" class="amountIn" inputmode="numeric" autocomplete="off" placeholder="Difference in KSh">',opts:'<div class="tiles two" role="group" aria-label="Short column">'+tile('Debit is short','receivable',0,ui.side===0,'side')+tile('Credit is short','payable',1,ui.side===1,'side')+'</div>',send:true};
 if(st==='trace'&&s.inspected.length<3)return {compose:place('Open each flagged account'),opts:'<div class="tiles list" role="group" aria-label="Flagged accounts">'+traceSources.map((e,i)=>tile(e[0],errorIcons[i],i,ui.evidence===i,'evidence',s.inspected.includes(i)?'Opened':'')).join('')+'</div>'};
 if(st==='trace'&&Object.keys(s.types).length<2)return {compose:place('Choose the kind of error'),opts:'<div class="tiles cases" role="group" aria-label="Error types">'+errors.map((e,i)=>tile(e,['payable','compare','cross','hide'][i],i,false,'type')).join('')+'</div>'};
 if(st==='correct'&&s.posted.length<2){const e=ui.err??[0,1].find(i=>!s.posted.includes(i));return {compose:place('Choose the correcting journal'),opts:'<div class="tiles list" role="group" aria-label="Journals">'+corrections[e].map((j,i)=>tile(j,'ledger',i,false,'post')).join('')+'</div>',chips:s.posted.length===0?errorNames.map((n,i)=>'<button class="chip'+(e===i?' on':'')+'" type="button" data-do="pickError" data-val="'+i+'" aria-pressed="'+(e===i)+'">'+(i?'E2 · ':'E1 · ')+n+'</button>').join(''):''}}
 if(st==='test'){
  const r=s.runs[s.selected];
  if(r&&!r.actual.pass)return {compose:place('Choose what to revise'),opts:'<div class="tiles cases" role="group" aria-label="Routines and rules">'+[...routines,...rules.map(v=>v[0])].map((x,i)=>tile(x,i<3?'restart':'sheet',i,false,'repair')).join('')+'</div>'};
  if(ui.predicting)return {compose:ui.pick.every(v=>v===null)&&ui.slot===0?place('Predict the debit account'):tokens(),opts:accountTiles(),send:true};
  return {compose:place('Pick a test case'),opts:'<div class="tiles cases" role="group" aria-label="Test cases">'+cases.map((c,i)=>tile('T'+(i+1)+' · '+c[0],s.runs[i]?'check':'compare',i,false,'case',groups[c[4]])).join('')+'</div>'};
 }
 if(st==='regression'&&s.report&&!s.report.every(a=>a.pass))return {compose:place('Investigate a failing case'),opts:'<div class="tiles list" role="group" aria-label="Failing cases">'+s.report.flatMap((a,i)=>a.pass?[]:[tile('Investigate T'+(i+1)+' · '+cases[i][0],'compare',i,false,'investigate')]).join('')+'</div>'};
 if(st==='handover'&&s.summary!==0)return {compose:place('Choose your summary'),opts:'<div class="tiles list" role="group" aria-label="Summaries">'+handovers.map((x,i)=>tile(x,'note',i,false,'summary')).join('')+'</div>'};
 if(st==='handover'&&s.rationale.some(x=>!x.trim()))return {compose:'<label class="sr" for="answer">Your answer</label><textarea id="answer" class="answerIn" maxlength="2500" rows="3" placeholder="Answer in your own words"></textarea>',send:true,long:true};
 if(st==='debrief')return {compose:place('Optional: the lesson you will keep'),opts:'<div class="tiles list" role="group" aria-label="Lessons">'+lessons.map((l,i)=>tile(l,'note',i,s.lesson===l,'lesson')).join('')+'</div>'};
 return null;
}
function after(){
 const st=stage(),b=(act,label,cls='btn-ink attn')=>'<button type="button" class="'+cls+'" data-do="'+act+'">'+label+'</button>';
 if(st==='approach'&&s.compared)return b('fix','Fix the rules');
 if(st==='rules'&&ui.saved!==null)return b('nextRule',count()===6?'Open the June ledger':'Next rule');
 if(st==='sort'&&firstOpenCol()===-1)return b('readDifference','Read the difference');
 if(st==='trace'&&Object.keys(s.types).length===2)return b('correction','Open the correcting journal');
 if(st==='correct'&&s.posted.length===2)return b('console','Test the system');
 if(st==='test'&&!ui.predicting&&coverage().size===4&&!(s.runs[s.selected]&&!s.runs[s.selected].actual.pass))return b('regression','Run all ten cases');
 if(st==='regression'&&!s.report)return b('runAll','Run all ten cases');
 if(st==='regression'&&s.report?.every(a=>a.pass))return b('confirmReport','Confirm the report');
 if(st==='regression')return b('backTest','Back to the tests','btn-glass');
 if(st==='debrief')return b('finish','Finish');
 if(st==='finish')return b('export','Export test log','btn-raised')+b('classic','Open the detailed review','btn-glass');
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
   +'<div class="dock" id="reply"><div class="chips" id="chips"></div><div class="composer" id="composer"><div class="pill" id="pill"><span data-orb id="pillOrb"></span><div class="compose" id="compose"></div><canvas class="wave" data-wave="gradient" id="pillWave"></canvas><button class="send" type="button" id="send" data-do="send" aria-label="Send"><span>'+ic('arrow','arrow')+'<i class="stop"></i></span></button></div><div id="opts"></div></div><div class="after" id="after"></div></div></section></main></div>';
 byId('bar').innerHTML=iconbar();
 const v=root.querySelector('video');if(!reduced())v.play().catch(()=>{});
 AL.mount(root);
}
function stepKey(){
 const st=stage();
 return [st,nextSample(),s.compared,ui.saved??count(),ui.saved!==null,firstOpenCol(),s.inspected.length,ui.evidence,Object.keys(s.types).length,s.posted.length,ui.err,s.selected,!!s.runs[s.selected],s.runs[s.selected]?.actual.pass,ui.predicting,s.report?.filter(a=>a.pass).length,s.summary,s.rationale.findIndex(x=>!x.trim()),ui.sheet,ui.book].join(':');
}
function paint(focusSel){
 const st=stage(),mode=st==='open'?'open':'work';
 if(root.dataset.mode!==mode)shell(mode);
 if(mode==='open'){
  const body=byId('sceneBody');body.innerHTML=sceneBody();body.classList.remove('enter');void body.offsetWidth;body.classList.add('enter');AL.mount(body);
  if(focusSel!==false)body.querySelector('[tabindex],#name')?.focus({preventScroll:true});
  requestAnimationFrame(()=>AL.attend(root));
  return;
 }
 const step=stepKey(),fresh=step!==lastStep;lastStep=step;
 if(fresh){byId('thread').innerHTML=threadHTML();AL.mount(byId('thread'));const cur=root.querySelector('.msg.cur');if(cur){cur.classList.remove('enter');void cur.offsetWidth;cur.classList.add('enter')}}
 else{const o=byId('obj');if(o)o.innerHTML=currentCard()}
 const d=dock(),composer=byId('composer'),send=byId('send'),chips=byId('chips'),pill=byId('pill');
 composer.hidden=!d;
 // Typed answers (the difference, the written handover) keep what the learner typed until the step changes.
 const typed=st==='difference'||!!d?.long;
 if(d&&(fresh||!typed||!byId('compose').querySelector('input,textarea')))byId('compose').innerHTML=d.compose;
 if(d)byId('opts').innerHTML=d.opts||'';
 pill.classList.toggle('long',!!d?.long);
 // Reference chips: the rule sheet throughout (except while it is the card itself), the ledger book through the trial balance stages.
 const showSheet=d&&!(st==='approach'&&!s.compared),showBook=d&&['sort','difference','trace','correct'].includes(st);
 chips.innerHTML=(d?.chips||'')+(showSheet?'<button class="chip'+(ui.sheet?' on':'')+'" type="button" data-do="sheet" aria-pressed="'+ui.sheet+'">'+ic('sheet')+'Rule sheet</button>':'')+(showBook?'<button class="chip'+(ui.book?' on':'')+'" type="button" data-do="book" aria-pressed="'+ui.book+'">'+ic('ledger')+'Ledger book</button>':'');
 chips.hidden=!chips.innerHTML;
 byId('after').innerHTML=after();
 send.hidden=!d?.send;send.disabled=ui.busy||!ready();
 // The glow marks the one thing waiting for the learner: a next-step button, the send button once ready, or the input box.
 const hasNext=!!byId('after').querySelector('.attn'),isReady=!!d?.send&&ready()&&!ui.busy;
 composer.classList.toggle('attn',!!d&&!ui.busy&&!isReady&&!hasNext);send.classList.toggle('attn',isReady&&!hasNext);
 if(fresh&&focusSel!==false)scrollToCurrent();
 if(focusSel)root.querySelector(focusSel)?.focus({preventScroll:true});
 else if(fresh&&focusSel!==false)byId('ask')?.focus({preventScroll:true});
 if(ui.failedStorage&&!byId('storageAlert'))root.insertAdjacentHTML('beforeend','<p role="alert" id="storageAlert">This browser could not save progress. Keep this tab open.</p>');
 requestAnimationFrame(()=>AL.attend(root));
}
function ready(){
 const st=stage();
 if(st==='difference')return (byId('amount')?.value.trim()||'')!==''&&ui.side!==null;
 if(st==='handover')return (byId('answer')?.value.trim()||'')!=='';
 return !ui.pick.includes(null);
}
// Bring the newest exchange into view above the pinned input box.
function scrollToCurrent(){
 const cur=root.querySelector('.msg.cur');if(!cur)return;
 const avail=innerHeight-byId('reply').getBoundingClientRect().height,end=document.documentElement.scrollHeight-innerHeight;
 const top=cur.getBoundingClientRect().top+scrollY-24,last=[...root.querySelectorAll('.msg.cur')].pop(),span=last.getBoundingClientRect().bottom-cur.getBoundingClientRect().top;
 let want=span+48>avail?top:end;
 // A row being worked on (e.g. the next trial balance line) must sit just above the pinned input box.
 const now=cur.querySelector('[data-focus],.row.now');if(now){const need=now.getBoundingClientRect().bottom+scrollY+16-avail;want=Math.max(want,need)}
 scrollTo({top:Math.max(0,Math.min(end,Math.round(want))),behavior:reduced()?'auto':'smooth'});
}
const orbs=()=>[byId('agentOrb')?.orb,byId('pillOrb')?.orb].filter(Boolean);
function working(on,mode='working'){
 ui.busy=on;byId('composer')?.classList.toggle('working',on);byId('send')?.classList.toggle('running',on);
 const w=byId('pillWave')?.wave;if(w){if(on)w.fit();w.set(on)}
 orbs().forEach(o=>o.set(on?mode:'idle'));
}
// Feedback: orb pulse plus the centred pop-up (README: one feedback channel). Quick correct answers pulse only.
function tell(line,tone){orbs().forEach(o=>o.set(tone));save();say(line);AL.result(line,tone,Math.max(2800,line.split(' ').length*320))}
function pulse(tone,line){orbs().forEach(o=>o.set(tone));save();if(line)say(line)}
// Smart Ledger takes the learner's pick and runs it. Instant with reduced motion.
function run(mode,done){if(reduced()){done();return}working(true,mode);paint(false);runTimer=setTimeout(()=>{working(false);done()},1400)}
function go(page,voice){s.page=page;Object.assign(ui,{pick:[null,null],slot:0,sheet:false,book:false,evidence:-1,err:null,side:null,predicting:false});save();paint();if(voice!==undefined)briefVoice(voice)}
function reset(){clearTimeout(runTimer);AL.close(true);stopVoice();stopShopSound();s=fresh();s.agent=newAgent();ui={...freshUi(),failedStorage:ui.failedStorage};save();root.dataset.mode='';scrollTo(0,0);paint()}
function exportAttempt(){
 const data={...s,score:grade(s),reasoning_status:s.manual?'reviewed':'indicative',suspense_balance:suspense(s)};
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');
 a.href=url;a.download='Smart-Ledger-'+s.learner_id+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
// Two-pick answers (rules and predictions) share the account picker.
function pickAccount(n){
 const other=1-ui.slot;if(ui.pick[other]===n)ui.pick[other]=null;   // one account cannot sit on both sides
 ui.pick[ui.slot]=n;if(ui.slot===0&&ui.pick[1]===null)ui.slot=1;
 paint(ui.pick.includes(null)?'[data-do=acct][data-val="'+n+'"]':'#send');
}

function respond(action,n,btn){
 if(ui.busy&&!['recorded','ambience','voice','sheet','book'].includes(action))return;
 const st=stage();
 switch(action){
 case 'recorded':case 'ambience':case 'voice':setting(action,btn);break;
 case 'restart':
  if(!ui.armed){ui.armed=true;btn.classList.add('armed');AL.flash(btn,'Tap again to start over',3000);clearTimeout(armTimer);armTimer=setTimeout(()=>{ui.armed=false;btn.classList.remove('armed')},3000);break}
  ui.armed=false;reset();break;
 case 'sheet':s.sheet=true;ui.sheet=!ui.sheet;save();paint(false);if(ui.sheet)root.querySelector('.sheetMsg')?.scrollIntoView({block:'nearest',behavior:reduced()?'auto':'smooth'});break;
 case 'book':ui.book=!ui.book;paint(false);if(ui.book)root.querySelector('.bookMsg')?.scrollIntoView({block:'nearest',behavior:reduced()?'auto':'smooth'});break;
 case 'begin':if(st!=='open'||s.agent.scene!==0)return;s.agent.scene=1;save();paint();introVoice(0);introSounds(0);break;
 case 'next':if(st!=='open'||s.agent.scene<1||s.agent.scene>2)return;s.agent.scene++;save();paint();introVoice(s.agent.scene-1);introSounds(s.agent.scene-1);break;
 // ---- Posting rules ----
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
  run('working',()=>{s.compared=true;ui.approach=null;paint();tell('Three draft postings differ from the rules.','pass')});break;
 }
 case 'fix':if(st!=='approach'||!s.compared)return;s.agent.fix=true;s.page='mapping';ui.sheet=false;save();paint();break;
 case 'slot':if(!['rules','test'].includes(st))return;ui.slot=n;paint('[data-do=slot][data-val="'+n+'"]');break;
 case 'acct':if((st==='rules'&&ui.saved===null)||(st==='test'&&ui.predicting))pickAccount(n);break;
 case 'send':
  if(st==='rules')return sendRule();
  if(st==='test')return sendPrediction();
  if(st==='difference')return sendDifference();
  if(st==='handover')return sendAnswer();
  break;
 case 'nextRule':if(ui.saved===null)return;ui.saved=null;Object.assign(ui,{pick:[null,null],slot:0,sheet:false});if(count()===6)go('sort',1);else paint();break;
 // ---- Trial balance ----
 case 'column':{
  if(st!=='sort')return;const v=ledger(s),i=firstOpenCol();if(i===-1)return;
  const side=['Debit','Credit'][n],ok=(v[i]>0)===(n===0);record(s,'column',i,side,ok);
  if(ok){s.columns[i]=side;paint();pulse('pass',accounts[i]+' placed in '+side+'.')}
  else{paint(false);tell('Check the normal balance for '+accounts[i]+' ('+kinds[i]+').','fail')}
  break;
 }
 case 'readDifference':if(Object.keys(s.columns).length===11)go('difference');break;
 case 'side':if(st!=='difference')return;ui.side=n;paint('#amount');break;
 // ---- Errors and corrections ----
 case 'evidence':if(st!=='trace')return;ui.evidence=n;if(!s.inspected.includes(n))s.inspected.push(n);save();paint();break;
 case 'type':{
  const i=Object.keys(s.types).length;if(st!=='trace'||i>1||s.inspected.length<3)return;
  record(s,'type',i,errors[n],n===i);if(n===i)s.types[i]=n;
  if(n!==i){paint(false);tell('Compare the source amount with both legs of the entry.','fail');break}
  paint();tell(i===0?'The bank credit is present. Trade Payables is missing its KSh 15,000 debit.':'The debit was keyed as 5,400 instead of 4,500. The KSh 900 difference divides by nine.','pass');break;
 }
 case 'correction':if(Object.keys(s.types).length===2)go('correct');break;
 case 'pickError':if(st!=='correct')return;ui.err=n;paint();break;
 case 'post':{
  if(st!=='correct')return;const i=ui.err??[0,1].find(k=>!s.posted.includes(k));if(s.posted.includes(i))return;
  const ok=n===i;record(s,'post',i,corrections[i][n],ok);
  if(!ok){const delta=i===0?(n===1?0:-14100):(n===0?0:-900);paint(false);tell('Preview: suspense would be '+balance(suspense(s)+delta)+'. '+(i===0&&n===1?'Bank has already been credited.':'Compare the journal with the specific missing or excess amount.')+' Choose another entry.','fail');break}
  save();run('building',()=>{s.posted.push(i);record(s,'suspense',i,balance(suspense(s)),true);ui.err=null;paint();tell('Posted. Suspense balance: '+balance(suspense(s))+'.','pass')});break;
 }
 case 'console':if(s.posted.length===2&&suspense(s)===0)go('test',2);break;
 // ---- Testing ----
 case 'case':if(st!=='test')return;s.selected=n;save();ui.predicting=!s.runs[n];Object.assign(ui,{pick:[null,null],slot:0});paint();break;
 case 'repair':{
  const i=s.selected,r=s.runs[i];if(st!=='test'||!r||r.actual.pass)return;
  const f=cases[i][6],ok=f==='F'+(n+1);record(s,'repair',f,n<3?routines[n]:rules[n-3][0],ok);
  if(!ok){paint(false);tell('That change would leave this posting error in place. Compare the expected and actual legs.','fail');break}
  save();run('building',()=>{if(!s.repairs.includes(f))s.repairs.push(f);r.actual=entry(s,i);s.report=null;paint();tell('Routine revised. The rerun matches the expected posting.','pass')});break;
 }
 case 'regression':if(coverage().size===4)go('regression');break;
 case 'runAll':if(st!=='regression')return;run('working',()=>{s.report=cases.map((_,i)=>entry(s,i));const all=s.report.every(a=>a.pass);record(s,'regression',0,s.report.filter(a=>a.pass).length+' of 10 passed',all);paint();tell(all?'All ten cases pass. Confirm the report to unlock handover.':'Investigate each failing case, revise its routine and run all ten again.',all?'pass':'fail')});break;
 case 'investigate':if(s.report&&!s.report[n].pass){s.selected=n;go('test')}break;
 case 'backTest':go('test');break;
 case 'confirmReport':if(s.report?.length===10&&s.report.every(a=>a.pass))go('handover');break;
 // ---- Handover ----
 case 'summary':if(st!=='handover'||s.summary===0)return;record(s,'summary',0,handovers[n],n===0);if(n===0)s.summary=0;paint(n===0?undefined:false);tell(n===0?'Explain the reasoning in your own words.':n===1?'Recall T10. Both sides agreed when the purchase was charged to Delivery Expense.':'Include how you traced the difference and what equal totals can conceal.',n===0?'pass':'fail');break;
 // ---- Debrief ----
 case 'lesson':if(st!=='debrief')return;s.lesson=lessons[n];save();paint();break;
 case 'finish':if(st!=='debrief')return;s.completed=s.completed||new Date().toISOString();go('finish');closingVoice();break;
 case 'export':exportAttempt();break;
 case 'classic':s.page='finish';s.recapDone=true;save();location.href='index.html';break;
 }
}
function sendRule(){
 const i=count();if(ui.saved!==null||i>=6||ui.pick.includes(null))return;
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
 run('building',()=>{if(ok){s.mappings[i]=p;ui.saved=i;save()}paint(ok?undefined:false);tell(feedback,ok?'pass':'fail');if(ok)byId('after').querySelector('button')?.focus({preventScroll:true})});
}
function sendPrediction(){
 const i=s.selected;if(s.runs[i]||ui.pick.includes(null))return;
 const p=ui.pick.slice();save();
 run('working',()=>{
  const a=entry(s,i),ok=p[0]===cases[i][2]&&p[1]===cases[i][3];s.runs[i]={pred:p,actual:a,initial:a};record(s,'predict',i,p.map(j=>accounts[j]),ok);
  ui.predicting=false;Object.assign(ui,{pick:[null,null],slot:0});paint();
  tell((ok?'Prediction matches the expected entry. ':'Compare your prediction with the expected entry. ')+(a.pass?'The system posted correctly.':a.balanced?'The totals agree. Check which account received the debit.':'The system posted unequal amounts.'),ok&&a.pass?'pass':'fail');
 });
}
function sendDifference(){
 const raw=(byId('amount')?.value||'').trim(),side=ui.side;
 if(!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(raw)||side===null){tell('Enter a whole KSh amount and choose a column.','fail');return}
 const ok=Number(raw.replaceAll(',',''))===14100&&side===0;record(s,'difference',0,raw+' · '+['Debit','Credit'][side],ok);
 if(ok){s.difference=true;pulse('pass');go('trace')}else{save();tell('Subtract the smaller total from the larger and identify the smaller column.','fail')}
}
function sendAnswer(){
 const k=s.rationale.findIndex(x=>!x.trim()),text=(byId('answer')?.value||'').trim();if(k===-1||!text)return;
 s.rationale[k]=text;save();
 if(s.rationale.some(x=>!x.trim())){paint();return}
 if(s.summary!==0||!s.report?.every(a=>a.pass))return;
 s.marks=suggestMarks(s.rationale);s.recapDone=true;go('debrief',3);
}
root.addEventListener('click',e=>{const b=e.target.closest('button[data-do]');if(b&&!b.disabled)respond(b.dataset.do,Number(b.dataset.val),b)});
root.addEventListener('submit',e=>{
 e.preventDefault();if(e.target.id!=='join')return;const n=byId('name').value.trim();
 if(!n){byId('name').setCustomValidity('Enter a name.');byId('name').reportValidity();return}
 s.name=n;s.agent.scene=4;s.started=s.started||new Date().toISOString();s.page='audit';stopShopSound();save();paint();
 playVoice([voiceClips.brief[0][0]],briefings[0][0]);
});
root.addEventListener('input',e=>{
 if(e.target.id==='name')e.target.setCustomValidity('');
 if(e.target.id==='amount'||e.target.id==='answer'){const isReady=ready()&&!ui.busy;byId('send').disabled=!isReady;byId('send').classList.toggle('attn',isReady);byId('composer').classList.toggle('attn',!isReady);AL.attend(root)}
});
root.addEventListener('keydown',e=>{
 if(e.key==='Enter'&&e.target.id==='amount'){e.preventDefault();if(ready())respond('send')}
 if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)&&e.target.id==='answer'){e.preventDefault();if(ready())respond('send')}
});
if(stage()==='sort'&&openPages.includes(s.page))s.page='sort';
paint();
