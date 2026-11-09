// GENERATED reference copy by handoff/build-replication-code.cjs. index.html does not load this file.
// Edit app/shared.js and app/pages/*.js instead, then re-run the script.

// ---- shared.js ----
const escapeHTML=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>Number(n).toLocaleString('en-GB');
const cash=n=>'KSh '+money(n);
const balance=n=>n===0?'Nil':(n>0?'Debit ':'Credit ')+cash(Math.abs(n));
const choice=(id,label,value=null,off=false,style='')=>'<button type="button" class="'+style+'" data-do="'+id+'" '+(value===null?'':'data-val="'+escapeHTML(value)+'" ')+(off?'disabled':'')+'>'+label+'</button>';
const button=(id,label,off=false)=>choice(id,label,null,off,'primary');
const card=(title,body)=>'<section class="card"><h2>'+title+'</h2>'+body+'</section>';
const tag=t=>'<span class="tag">'+t+'</span>';
const table=(heads,rows)=>'<div class="tablewrap"><table><thead><tr>'+heads.map(h=>'<th scope="col">'+h+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map((c,i)=>i?'<td>'+c+'</td>':'<th scope="row">'+c+'</th>').join('')+'</tr>').join('')+'</tbody></table></div>';
const options=(id,items,label,selected='')=>'<label>'+label+'<select id="'+id+'"><option value="">Choose…</option>'+items.map((x,i)=>'<option value="'+i+'" '+(selected===i?'selected':'')+'>'+escapeHTML(x)+'</option>').join('')+'</select></label>';
const pair=()=>'<div class="pair">'+options('dr',accounts,'Debit account')+options('cr',accounts,'Credit account')+'</div>';
const qa=(items,action)=>'<div class="choices">'+items.map((x,i)=>choice(action,escapeHTML(x),i)).join('')+'</div>';
const ruleSheet=()=>table(['Account type','Increases with'],[['Assets · Cash, Bank, Inventory, Equipment, Trade Receivables','Debit'],['Expenses · Rent, Delivery','Debit'],['Drawings · Owner withdrawals','Debit'],['Liabilities · Trade Payables','Credit'],['Capital · Owner investment','Credit'],['Income · Sales','Credit']])+'<p>Each posting has equal debits and credits. An accountant reviews the accounts.</p>';
const ta=(d,c,da,ca=da)=>table(['Debit','Credit'],[[d===null?'Missing':accounts[d]+(da==null?'':' · '+money(da)),c===null?'Missing':accounts[c]+(ca==null?'':' · '+money(ca))]]);
const btnList=(items,action,selected,done)=>'<div class="listing">'+items.map((label,i)=>choice(action,'<span>'+label+'</span><small>'+(done(i)?'Reviewed ✓':'Open →')+'</small>',i,false,selected===i?'current':'')).join('')+'</div>';
const breakdown=['Posting-rule accuracy','Trial balance & ledger skills','Error detection & correction','Testing & debugging','Reasoning'];
const shortEntry=a=>'Debit '+(a.d==null?'missing':accounts[a.d]+' '+money(a.da))+' / Credit '+accounts[a.c]+' '+money(a.ca);
const expected=i=>({d:cases[i][2],c:cases[i][3],da:cases[i][1],ca:cases[i][1]});
const reportTable=()=>table(['Case','Expected entry','Actual entry','Status'],(s.report||[]).map((a,i)=>['T'+(i+1),shortEntry(expected(i)),shortEntry(a),a.pass?'Pass':'Mismatch']));
const stepTitles={audit:'Review draft postings',action:'Choose an audit approach',mapping:'Set the posting rules',sort:'Extract the trial balance',difference:'Read the difference',trace:'Trace the ledger errors',correct:'Clear the suspense account',test:'Test the posting system',regression:'Verify all ten cases',handover:'Hand over to Grace',debrief:'Can you trust the ledger?',finish:'Month-end review complete'};
const sections=[['Posting rules',['audit','action','mapping']],['Trial balance',['sort','difference','trace','correct']],['Test console',['test','regression','handover']],['Debrief',['debrief','finish']]];
const icons = {
 rules: '<path d="M3 6h7m4 0h7M3 17h3m4 0h11"/><circle cx="12" cy="6" r="2"/><circle cx="8" cy="17" r="2"/>',
 balance: '<path d="M12 3v17M6 20h12M3 7l9-3 9 3M5 7l-4 8h8L5 7zm14 0-4 8h8l-4-8z"/>',
 test: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m6 9 3 3-3 3m6 0h5"/>',
 report: '<path d="M5 2h9l5 5v15H5zM14 2v6h5M8 12h8m-8 4h6"/>',
 book: '<path d="M12 6v15M2 4c4-1 7 0 10 2 3-2 6-3 10-2v14c-4-1-7 0-10 2-3-2-6-3-10-2z"/>',
 help: '<circle cx="12" cy="12" r="9"/><path d="M9 9c0-4 7-4 7 0 0 3-4 3-4 6m0 2v.2"/>',
 settings: '<path d="M3 7h8m4 0h6M3 17h3m4 0h11"/><circle cx="13" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
};
const icon = name => '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[name]+'</svg>';
const brand = () => '<span class="brand"><svg viewBox="0 0 25 26" aria-hidden="true"><path fill="#8890ff" d="M1 6 11 1v20L1 26z"/><path fill="#505adc" d="M14 4 24 0v20l-10 5z"/></svg>Smart Ledger</span>';
const utility=(id,name,label)=>'<button type="button" class="utility" data-do="'+id+'" title="'+label+'" aria-label="'+label+'">'+icon(name)+'</button>';
function workspace(){
 const section=activeSection();
 const nav=sections.map(([name],i)=>'<li '+(i===section?'aria-current="step"':'')+'>'+icon(['rules','balance','test','report'][i])+name+'</li>').join('');
 const title=s.page==='test'&&s.runs[s.selected]?'Compare the posting':stepTitles[s.page];
 return '<div class="layout"><aside>'+brand()+'<ol class="nav" aria-label="Simulation stages">'+nav+'</ol></aside><div class="desk"><header class="top"><b>Zuri Home Supplies</b><div class="tools"><span>June ledger · KSh</span>'+utility('brief','help','Briefing')+utility('settings','settings','Audio and captions')+'</div></header><main class="work" data-page="'+s.page+'"><div class="heading"><h1 tabindex="-1">'+title+'</h1>'+(section===1?choice('book',icon('book')+'Ledger book'):s.page==='audit'||s.page==='mapping'?choice('sheet',icon('book')+'Rule sheet'):'')+'</div><div class="status" role="status" tabindex="-1" id="status">'+escapeHTML(ui.message)+'</div>'+view[s.page]()+'</main></div></div>';
}

// ---- pages/cover.js ----
// The MP4 contains only the product demo. Brand, title and primary action are live HTML.
function coverPage(){
 return '<main class="cover"><header>'+brand()+'</header><div class="coverBody"><div class="demo"><video id="coverVideo" muted playsinline loop preload="metadata" poster="assets/product-poster.png" aria-hidden="true"><source src="assets/product-loop.mp4" type="video/mp4"><source src="assets/product-loop.webm" type="video/webm"></video></div><h1>The Smart Ledger System</h1>'+button('enterCover','Start simulation →')+'</div><button class="motionControl" data-do="toggleCover" type="button">Play animation</button></main>';
}
function mountCover(){
 const video=byId('coverVideo'),control=root.querySelector('.motionControl');
 const sync=()=>control.textContent=video.paused?'Play animation':'Pause animation';
 const unavailable=()=>{control.hidden=true;video.removeAttribute('controls')};
 video.addEventListener('play',sync);
 video.addEventListener('pause',sync);
 video.addEventListener('error',unavailable);
 video.querySelector('source:last-child').addEventListener('error',unavailable);
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)video.play().catch(sync);
}
function toggleCover(){
 const video=byId('coverVideo');
 if(video.paused)video.play().catch(()=>{});else video.pause();
}

// ---- pages/opening.js ----
function hero(){
 if(s.page==='splash')return '<div class="splash"><img class="mivaLogo" src="assets/brand/miva-open-university.svg" alt="MIVA Open University" width="200" height="62"><small>presents</small>'+choice('advanceSplash','Continue →',null,false,'textBtn')+'</div>';
 if(s.page==='cover')return coverPage();
 let panel='';
 if(s.page==='identity')return '<main class="identity">'+brand()+'<form id="identity"><p>Zuri Home Supplies · Nairobi</p><h1>Join the ledger team</h1><label>Your name<input required maxlength="60" id="name" autocomplete="given-name" placeholder="Enter your name"></label><button class="primary">Enter the shop →</button></form></main>';
 if(s.page==='intro')panel='<p class="over">Zuri Home Supplies · Nairobi</p><h1>Month-end<br>at Zuri.</h1><div class="caption">'+(s.media.captions||!s.media.voice?'<b>'+intro[ui.cue][0]+'</b><p>'+intro[ui.cue][1]+'</p>':'')+'</div><div class="tools">'+choice('pause',ui.paused?'Resume':'Pause')+choice('skip','Skip introduction →')+'</div>';
 if(s.page==='title')panel='<p class="over">Zuri Home Supplies · Nairobi</p><h1>The Smart<br>Ledger System</h1><p class="heroSub">'+escapeHTML(s.name)+'<br>Junior Accounts Systems Assistant</p>'+button('start','Open the ledger →');
 return '<div class="hero"><div class="heroTop"><span>BBM 1104 &nbsp; / &nbsp; PRINCIPLES OF ACCOUNTING</span>'+choice('settings','Audio & captions')+'</div><div class="heroBody">'+panel+'</div></div>';
}

// ---- pages/audit.js ----
function audit(){
 const i=ui.sample,a=samples[i];
 const labels=['Cash sale','Rent paid by bank','Customer payment','Owner withdrawal','Stock bought on credit'];
 const rows=samples.map((v,j)=>'<button class="sampleRow '+(i===j?'selected':'')+'" data-do="sample" data-val="'+j+'" aria-pressed="'+(i===j)+'"><span>'+v[0]+'</span><b>'+labels[j]+'</b><span>'+money(v[2])+'</span><small aria-label="'+(s.seen.includes(j)?'Reviewed':'Unreviewed')+'">'+(s.seen.includes(j)?'✓':'')+'</small></button>').join('');
 const next=samples.findIndex((_,j)=>!s.seen.includes(j));
 const detail=a?'<small>'+a[0]+'</small><h2>'+labels[i]+'</h2><div class="amount">'+cash(a[2])+'</div>'+(i===2?'<p>Payment for an earlier credit sale.</p>':'')+table(['Side','Account'],[['Debit',accounts[a[3]]],['Credit',accounts[a[4]]]]):'<h2>Inspect a posting</h2><p>Select a draft entry to see the accounts Smart Ledger used.</p>';
 return '<div class="split"><section><div class="subhead"><h2>Draft entries</h2><span>'+s.seen.length+' of 5 reviewed</span></div><div class="register">'+rows+'</div></section><section class="summary">'+detail+(next!==-1&&a?choice('sample','Next entry →',next,false,'primary continueSample'):'')+(next===-1&&!s.sheet?'<p>Open the rule sheet to continue.</p>':'')+'</section></div><div class="actions">'+button('auditNext','Choose audit action →',!s.sheet||next!==-1)+'</div>';
}

// ---- pages/audit-action.js ----
function actionPage(){
 if(!s.compared)return card('How will you check the draft?',qa(auditOptions,'auditChoice'));
 return card('Posting comparison',table(['Sample','Finding','Expected posting'],samples.map(a=>[a[0],({'S-02':'Sides reversed','S-03':'Customer debt remains open. Sales counted twice.','S-04':'Drawings recorded as an expense.'})[a[0]]||'Matches',accounts[rules[a[5]][1]]+' / '+accounts[rules[a[5]][2]]])))+button('configure','Configure rules →');
}

// ---- pages/mapping.js ----
function mapping(){
 const count=Object.keys(s.mappings).length;
 const configured=rules.flatMap((rule,i)=>s.mappings[i]?[[rule[0],accounts[s.mappings[i][0]],accounts[s.mappings[i][1]]]]:[]);
 const history=configured.length?table(['Transaction','Debit','Credit'],configured):'<p>Your saved postings appear here.</p>';
 const task=count===6?'<h2>Rules complete</h2>'+button('ledger','Open June ledger →'):'<small>Rule '+(count+1)+' of 6</small><h2>'+rules[count][0]+'</h2>'+pair()+button('map','Save rule');
 const last=count?details('Last saved T-account',ta(...s.mappings[count-1],null)+'<p>'+rules[count-1][3]+'</p>'):'';
 return '<p class="lead">Choose the accounts the system should debit and credit.</p><div class="split"><section class="task">'+task+'</section><section class="summary"><h2>Saved rules</h2>'+history+last+'</section></div>';
}

// ---- pages/trial-balance.js ----
function sortPage(){
 const v=ledger(s),i=v.findIndex((_,j)=>!s.columns[j]);
 const placed=v.flatMap((n,j)=>s.columns[j]?[[accounts[j],n>0?money(n):'—',n<0?money(-n):'—']]:[]);
 const t=totals(v.map((n,j)=>s.columns[j]?n:0));placed.push(['Total',money(t[0]),money(t[1])]);
 const action=i===-1?'<h2>Extraction complete</h2>'+button('readDifference','Read the difference →'):'<small>Balance '+(i+1)+' of 11</small><h2>'+accounts[i]+'</h2><div class="amount">'+cash(Math.abs(v[i]))+'</div><div class="sides">'+choice('column','Debit',0)+choice('column','Credit',1)+'</div>';
 return '<p class="lead">Place each balance in the debit or credit column.</p><div class="split"><section class="task">'+action+'</section><section class="summary"><h2>Placed balances</h2>'+table(['Account','Debit','Credit'],placed)+'</section></div>';
}

// ---- pages/difference.js ----
function difference(){
 const t=totals(ledger(s));return '<div class="columns">'+card('June trial balance',table(['Column','Total'],[['Debit',cash(t[0])],['Credit',cash(t[1])]]))+card('Which side is short?','<label>Difference in KSh<input id="amount" inputmode="numeric" placeholder="0"></label>'+options('side',['Debit','Credit'],'Short column')+button('difference','Check difference'))+'</div>';
}

// ---- pages/ledger-book.js ----
function ledgerBook(){
 const rows=accounts.map((a,i)=>{
  let items=[];
  if(opening[i])items.push(['1 June · Opening balance',opening[i]>0?money(opening[i]):'—',opening[i]<0?money(-opening[i]):'—']);
  journal.forEach(([label,amount,d,c],j)=>{
   if(d===i&&j!==5)items.push(['J'+(j+1)+' · '+label,money(j===7?5400:amount),'—']);
   if(c===i)items.push(['J'+(j+1)+' · '+label,'—',money(amount)]);
  });
  if(i===5&&s.posted.includes(0))items.push(['E1 · Correction','15,000','—']);
  if(i===10&&s.posted.includes(1))items.push(['E2 · Correction','—','900']);
  return details(a,table(['June posting','Debit','Credit'],items)+'<p>Balance: '+balance(ledger(s)[i])+'</p>');
 });
 return rows.join('')+details('June source transactions',table(['Reference','Transaction','KSh'],journal.map(([label,amount],i)=>['J'+(i+1),label,money(amount)])));
}

// ---- pages/evidence.js ----
const evidence=[['Trade Payables','Supplier payment · June transaction 06','Supplier payment from bank: KSh 15,000.','Bank credit 15,000. No matching debit appears in Trade Payables.'],['Delivery Expense','Delivery voucher · June transaction 08','Cash paid for delivery: KSh 4,500.','Delivery Expense debit 5,400.'],['Cash','Cash record · June transaction 08','Cash paid for delivery: KSh 4,500.','Cash credit 4,500.']];
function tracePage(){
 const i=ui.evidence,a=evidence[i];
 return '<p class="lead">Compare the flagged accounts with the source transactions.</p><div class="columns">'+card('Flagged accounts',btnList(evidence.map(e=>e[0]),'evidence',i,j=>s.inspected.includes(j)))+card(a?a[0]:'Source comparison',a?'<small>'+a[1]+'</small><p>'+a[2]+'</p><hr><small>Ledger entry</small><p>'+a[3]+'</p>':'<p>Open an account to inspect its source and ledger entry.</p>')+'</div>'+ (s.inspected.length===3?card(Object.keys(s.types).length===0?'Classify the supplier payment':Object.keys(s.types).length===1?'Classify the delivery payment':'Both causes identified',Object.keys(s.types).length===2?button('correction','Open correcting journal →'):qa(errors,'type')):'');
}

// ---- pages/corrections.js ----
function correctPage(){
 const i=ui.err;return '<div class="metrics"><div><small>Suspense balance</small><strong>'+balance(suspense(s))+'</strong></div><div><small>Corrections posted</small><strong>'+s.posted.length+' / 2</strong></div></div><div class="columns">'+card('Traced errors',btnList(['E1 · Supplier payment','E2 · Delivery expense'],'pickError',i,j=>s.posted.includes(j)))+card(i===0?'Supplier payment':'Delivery expense',s.posted.includes(i)?'<p>Correcting journal posted.</p>':qa(corrections[i],'post'))+'</div>'+(s.posted.length===2?card('Trial balance agrees',table(['Corrected account','Balance'],[['Trade Payables','Credit 25,000'],['Delivery Expense','Debit 4,500'],['Both column totals',cash(totals(ledger(s))[0])]]))+button('console','Open test console →'):'');
}

// ---- pages/test-console.js ----
function testPage(){
 const i=s.selected,c=cases[i],r=s.runs[i];
 const list=groups.map((g,k)=>'<optgroup label="'+g+'">'+cases.flatMap((v,j)=>v[4]===k?['<option value="'+j+'" '+(i===j?'selected':'')+'>T'+(j+1)+' · '+v[0]+'</option>']:[]).join('')+'</optgroup>').join('');
 const coverage=new Set(Object.keys(s.runs).map(j=>cases[j][4]));
 const bank='<label>Test case<select id="casePick">'+list+'</select></label>';
 const footer='<div class="consoleFoot">'+details('Category coverage · '+coverage.size+' of 4',groups.map((g,k)=>'<p>'+(coverage.has(k)?'Tested':'Pending')+' · '+g+'</p>').join(''))+button('regression','Open regression →',coverage.size<4)+'</div>';
 if(!r)return '<p class="lead">Predict the entry before running the test.</p><div class="split"><section>'+bank+'<div class="amount">'+cash(c[1])+'</div>'+tag(groups[c[4]])+'</section><section class="summary"><h2>Your prediction</h2>'+pair()+button('predict','Run test')+'</section></div>'+footer;
 const a=r.actual;
 const legs=[[c[2],a.d,a.da],[c[3],a.c,a.ca]].map(([exp,actual,amount],j)=>{
  const fault=actual!==exp||amount!==c[1];
  const value=actual===null?'Missing entry':accounts[actual]+' · '+money(amount);
  return [j?'Credit':'Debit',accounts[exp]+' · '+money(c[1]),fault?'<span class="warning">⚠ '+value+'</span>':value];
 });
 const badge=a.balanced?'Amounts balance':'Unequal amounts';
 const match=a.pass?'Entry matches':a.d===null?'Missing posting':a.da!==a.ca?'Amount mismatch':'Account mismatch';
 const fix=a.pass?'':'<div class="repair">'+options('repairPick',[...routines,...rules.map(v=>v[0])],'Which routine or rule needs revision?')+button('repair','Revise and rerun',true)+'</div>';
 return '<div class="caseHead">'+bank+'<b>'+cash(c[1])+'</b></div>'+table(['Account side','Expected','System posted'],legs)+'<div class="pills"><span class="'+(a.balanced?'positive':'warning')+'">'+badge+'</span><span class="'+(a.pass?'positive':'warning')+'">'+match+'</span></div>'+fix+details('Your prediction','<p>Debit '+accounts[r.pred[0]]+' · Credit '+accounts[r.pred[1]]+'</p>')+footer;
}

// ---- pages/regression.js ----
function regression(){
 return '<p class="lead">Run the complete bank against the current posting rules and routines.</p>'+button('runAll',s.report?'Run all ten again':'Run all ten cases')+(s.report?card('Regression report',reportTable())+(s.report.every(a=>a.pass)?button('confirmReport','Confirm report & hand over →'): '<div class="tools">'+s.report.map((a,i)=>a.pass?'':choice('investigate','Investigate T'+(i+1),i)).join('')+'</div>'):'')+choice('backTest','Back to test console');
}

// ---- pages/handover.js ----
const rationalePrompts=['How does account type determine the debit and credit?','How did you trace and clear the trial balance difference?','What can equal totals still conceal?'];
const field=(id,label,value)=>'<label>'+escapeHTML(label)+'<textarea id="'+id+'" data-save="'+id+'" maxlength="2500">'+escapeHTML(value)+'</textarea></label>';
function handover(){
 return '<p class="lead">“If the trial balance balances, can I trust everything in the books?” <span>— Grace Achieng</span></p>'+card('Choose your summary',s.summary===0?'<p>'+handovers[0]+'</p>':qa(handovers,'summary'))+(s.summary===0?card('Explain your reasoning',rationalePrompts.map((p,i)=>field('r'+i,p,s.rationale[i])).join('')+button('submit','Submit handover →')):'');
}

// ---- pages/debrief.js ----
function logTable(tasks){
 const rows=s.log.filter(e=>tasks.includes(e.task));
 return table(['Decision','Your choice','Result'],rows.map(e=>[escapeHTML(e.task+' · '+(typeof e.item==='number'?e.item+1:e.item)),escapeHTML(Array.isArray(e.choice)?e.choice.join(' / '):e.choice),e.correct?'Accepted':'Revisit']));
}
const insight=[
 ['Posting Rules',['audit','map'],'Rent increases with a debit. A customer settling a debt reduces Trade Receivables.'],
 ['Trial Balance and Errors',['column','difference','type','post'],'The missing debit of 15,000 and excess debit of 900 explain the net shortfall of 14,100.'],
 ['Testing',['predict','repair'],'T10 balances even when equipment is charged to Delivery Expense. Check the account and the amount.'],
 ['Explanation',['summary'],'Use account types, trace differences to source transactions and explain the limits of equal totals.']
];
const details=(title,body)=>'<details><summary>'+title+'</summary><div>'+body+'</div></details>';
function debrief(){
 const g=grade(s),qual=s.manual?'Facilitator reviewed':'Indicative reasoning mark';
 return '<div class="metrics"><div><small>Weighted score</small><strong>'+g.final.toFixed(1)+' <em>/ 100</em></strong></div><div><small>'+qual+'</small><strong>'+band(g.final)+'</strong></div></div>'+card('Strand scores',table(['Strand','Score','Feedback'],breakdown.map((b,i)=>[b,g.strands[i].toFixed(1)+' / 100',band(g.strands[i])+' · '+['First choices across six rules','First placement and difference checks','First diagnoses and correcting entries','Audit, coverage, predictions and repairs','Three equally weighted explanation criteria'][i]])))+card('Your decisions',insight.map(([label,tasks,why])=>details(label,logTable(tasks)+'<p><b>Expert reasoning</b> · '+why+'</p>'+(label==='Explanation'?rationalePrompts.map((p,i)=>'<p>'+escapeHTML(s.rationale[i])+' · '+(s.marks[i]?'Criterion met':'Review criterion')+'</p>').join(''):''))).join('')+details('Ten-case report',reportTable()))+card('Reflection · optional',details('Record a lesson','<label>Lesson<select id="lesson"><option value="">Choose a lesson</option>'+lessons.map(l=>'<option '+(s.lesson===l?'selected':'')+'>'+l+'</option>').join('')+'</select></label>'+questions.map((q,i)=>field('q'+i,q,s.reflection[i])).join('')+field('note','Lesson-learned note',s.note)))+button('finish','Finish review →');
}

// ---- pages/debrief-recap.js ----
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

// ---- pages/complete.js ----
function finishPage(){
 return card('Handover saved','<p>“Thank you for staying with the numbers until they made sense.” — Grace</p><p>Smart Ledger supports bookkeeping checks. An accountant reviews the accounts. The figures and business are fictional.</p>')+'<div class="tools">'+button('review','View debrief')+choice('export','Export test log')+choice('facilitator','Facilitator review')+choice('restart','New attempt')+'</div>';
}
