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
const stepTitles={audit:'Audit the draft postings',action:'Choose your first debugging action',mapping:'Set the posting rules',sort:'Extract the trial balance',difference:'Read the difference',trace:'Trace the ledger errors',correct:'Clear the suspense account',test:'Test the posting system',regression:'Verify all ten cases',handover:'Hand over to Grace',debrief:'Can you trust the ledger?',finish:'Month-end review complete'};
const sections=[['Posting rules',['audit','action','mapping']],['Trial balance',['sort','difference','trace','correct']],['Test & handover',['test','regression','handover']],['Debrief',['debrief','finish']]];
function hero(){
 if(s.page==='splash')return '<div class="splash"><img class="mivaLogo" src="assets/brand/miva-open-university.svg" alt="MIVA Open University" width="200" height="62"><small>presents</small>'+choice('advanceSplash','Continue →',null,false,'textBtn')+'</div>';
 let panel='';
 if(s.page==='identity')panel='<h1>The Smart<br>Ledger System</h1><p class="heroSub">Zuri Home Supplies · Nairobi</p><form id="identity"><label>Your name<input required maxlength="60" id="name" autocomplete="given-name" placeholder="Enter your name"></label><button class="primary">Enter the shop →</button></form>';
 if(s.page==='intro')panel='<p class="over">Zuri Home Supplies · Nairobi</p><h1>Month-end<br>at Zuri.</h1><div class="caption">'+(s.media.captions||!s.media.voice?'<b>'+intro[ui.cue][0]+'</b><p>'+intro[ui.cue][1]+'</p>':'')+'</div><div class="tools">'+choice('pause',ui.paused?'Resume':'Pause')+choice('skip','Skip introduction →')+'</div>';
 if(s.page==='title')panel='<p class="over">Zuri Home Supplies · Nairobi</p><h1>The Smart<br>Ledger System</h1><p class="heroSub">'+escapeHTML(s.name)+'<br>Junior Accounts Systems Assistant</p>'+button('start','Start →');
 return '<div class="hero"><div class="heroTop"><span>BBM 1104 &nbsp; / &nbsp; PRINCIPLES OF ACCOUNTING</span>'+choice('settings','Audio & captions')+'</div><div class="heroBody">'+panel+'</div></div>';
}
function audit(){
 const i=ui.sample,a=samples[i];
 return '<p class="lead">Read the rule sheet and inspect each draft entry.</p><div class="columns">'+card('Draft postings',btnList(samples.map(v=>v[0]+' &nbsp; '+v[1]),'sample',i,j=>s.seen.includes(j)))+card(a?a[0]+' · '+a[1]:'Account-type rules',a?'<div class="amount">'+cash(a[2])+'</div>'+ta(a[3],a[4],a[2]):'<p>What makes an account increase? Open the rule sheet to check.</p>')+'</div><div class="actions">'+choice('sheet','Open rule sheet'+(s.sheet?' ✓':''))+button('auditNext','Choose audit action →',s.seen.length!==5||!s.sheet)+'</div>';
}
function actionPage(){
 if(!s.compared)return card('How will you check the draft?',qa(auditOptions,'auditChoice'));
 return card('Posting comparison',table(['Sample','Finding','Expected posting'],samples.map(a=>[a[0],({'S-02':'Sides reversed','S-03':'Customer debt remains open. Sales counted twice.','S-04':'Drawings recorded as an expense.'})[a[0]]||'Matches',accounts[rules[a[5]][1]]+' / '+accounts[rules[a[5]][2]]])))+button('configure','Configure rules →');
}
function mapping(){
 const i=Object.keys(s.mappings).length;
 return '<p class="lead">Choose which account the system debits and which it credits.</p><div class="columns">'+card('Posting rule table',table(['Transaction','Debit','Credit'],rules.map((r,j)=>[r[0],s.mappings[j]?accounts[s.mappings[j][0]]:'—',s.mappings[j]?accounts[s.mappings[j][1]]:'—'])))+card(i===6?'Rules complete':rules[i][0],(i===6?'<p>All six rules are ready for future postings.</p>'+button('ledger','Open June ledger →'):tag('Rule '+(i+1)+' of 6')+pair()+button('map','Save rule'))+(i?'<hr><b>Last saved rule</b>'+ta(...s.mappings[i-1],null)+'<p>'+rules[i-1][3]+'</p>':''))+'</div>'+choice('sheet','Rule sheet');
}
function sortPage(){
 const v=ledger(s),t=totals(v.map((n,i)=>s.columns[i]?n:0)),i=v.findIndex((n,j)=>!s.columns[j]);
 return '<p class="lead">Place each ledger balance in its normal column.</p><div class="metrics"><div><small>Debit total</small><strong>'+cash(t[0])+'</strong></div><div><small>Credit total</small><strong>'+cash(t[1])+'</strong></div></div><div class="columns">'+card('June balances',table(['Account','Debit','Credit'],accounts.map((a,j)=>[a,s.columns[j]==='Debit'?money(v[j]):'—',s.columns[j]==='Credit'?money(-v[j]):'—'])))+card(i<0?'Extraction complete':accounts[i],i<0?button('readDifference','Read the difference →'):tag('Balance '+(i+1)+' of 11')+'<div class="amount">'+cash(Math.abs(v[i]))+'</div>'+qa(['Debit','Credit'],'column'))+'</div>';
}
function difference(){
 const t=totals(ledger(s));return '<div class="columns">'+card('June trial balance',table(['Column','Total'],[['Debit',cash(t[0])],['Credit',cash(t[1])]]))+card('Which side is short?','<label>Difference in KSh<input id="amount" inputmode="numeric" placeholder="0"></label>'+options('side',['Debit','Credit'],'Short column')+button('difference','Check difference'))+'</div>';
}
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
const evidence=[['Trade Payables','Supplier payment · June transaction 06','Supplier payment from bank: KSh 15,000.','Bank credit 15,000. No matching debit appears in Trade Payables.'],['Delivery Expense','Delivery voucher · June transaction 08','Cash paid for delivery: KSh 4,500.','Delivery Expense debit 5,400.'],['Cash','Cash record · June transaction 08','Cash paid for delivery: KSh 4,500.','Cash credit 4,500.']];
function tracePage(){
 const i=ui.evidence,a=evidence[i];
 return '<p class="lead">Compare the flagged accounts with the source transactions.</p><div class="columns">'+card('Flagged accounts',btnList(evidence.map(e=>e[0]),'evidence',i,j=>s.inspected.includes(j)))+card(a?a[0]:'Source comparison',a?'<small>'+a[1]+'</small><p>'+a[2]+'</p><hr><small>Ledger entry</small><p>'+a[3]+'</p>':'<p>Open an account to inspect its source and ledger entry.</p>')+'</div>'+ (s.inspected.length===3?card(Object.keys(s.types).length===0?'Classify the supplier payment':Object.keys(s.types).length===1?'Classify the delivery payment':'Both causes identified',Object.keys(s.types).length===2?button('correction','Open correcting journal →'):qa(errors,'type')):'');
}
function correctPage(){
 const i=ui.err;return '<div class="metrics"><div><small>Suspense balance</small><strong>'+balance(suspense(s))+'</strong></div><div><small>Corrections posted</small><strong>'+s.posted.length+' / 2</strong></div></div><div class="columns">'+card('Traced errors',btnList(['E1 · Supplier payment','E2 · Delivery expense'],'pickError',i,j=>s.posted.includes(j)))+card(i===0?'Supplier payment':'Delivery expense',s.posted.includes(i)?'<p>Correcting journal posted.</p>':qa(corrections[i],'post'))+'</div>'+(s.posted.length===2?card('Trial balance agrees',table(['Corrected account','Balance'],[['Trade Payables','Credit 25,000'],['Delivery Expense','Debit 4,500'],['Both column totals',cash(totals(ledger(s))[0])]]))+button('console','Open test console →'):'');
}
function testPage(){
 const i=s.selected,c=cases[i],r=s.runs[i],pending=!!(r&&!r.actual.pass);
 const list=groups.map((g,k)=>'<optgroup label="'+g+'">'+cases.map((v,j)=>v[4]===k?'<option value="'+j+'" '+(i===j?'selected':'')+'>T'+(j+1)+' · '+v[0]+'</option>':'').join('')+'</optgroup>').join('');
 const n=new Set(Object.keys(s.runs).map(j=>cases[j][4])).size;
 return '<p class="lead">Predict the entry, then compare it with the system’s posting.</p><div class="columns"><div>'+card('Test bank','<label>Transaction<select id="casePick">'+list+'</select></label><div class="amount">'+cash(c[1])+'</div>'+tag(groups[c[4]])+'<hr><small>Category coverage · '+n+' of 4</small><p>'+groups.map((g,k)=>Object.keys(s.runs).some(j=>cases[j][4]===k)?'✓ '+g:'○ '+g).join('<br>')+'</p>')+button('regression','Open regression →',n<4)+'</div>'+card(!r?'Your prediction':pending?'Investigate mismatch':'Test result',!r?pair()+button('predict','Run prediction'): '<p><b>Your prediction</b><br>Debit '+accounts[r.pred[0]]+' / Credit '+accounts[r.pred[1]]+'</p><small>Expected posting</small>'+ta(c[2],c[3],c[1])+'<small>System posting</small>'+ta(r.actual.d,r.actual.c,r.actual.da,r.actual.ca)+'<p>'+tag(r.actual.balanced?'Balanced':'Unequal totals')+' '+tag(r.actual.pass?'Entry matches':'Entry mismatch')+'</p>'+(pending?options('repairPick',[...routines,...rules.map(r=>r[0])],'Which routine or rule needs revision?')+button('repair','Revise & rerun'):'<p>Choose another case or verify the full bank.</p>'))+'</div>';
}
function regression(){
 return '<p class="lead">Run the complete bank against the current posting rules and routines.</p>'+button('runAll',s.report?'Run all ten again':'Run all ten cases')+(s.report?card('Regression report',reportTable())+(s.report.every(a=>a.pass)?button('confirmReport','Confirm report & hand over →'): '<div class="tools">'+s.report.map((a,i)=>a.pass?'':choice('investigate','Investigate T'+(i+1),i)).join('')+'</div>'):'')+choice('backTest','Back to test console');
}
const rationalePrompts=['How does account type determine the debit and credit?','How did you trace and clear the trial balance difference?','What can equal totals still conceal?'];
const field=(id,label,value)=>'<label>'+escapeHTML(label)+'<textarea id="'+id+'" data-save="'+id+'" maxlength="2500">'+escapeHTML(value)+'</textarea></label>';
function handover(){
 return '<p class="lead">“If the trial balance balances, can I trust everything in the books?” <span>— Grace Achieng</span></p>'+card('Choose your summary',s.summary===0?'<p>'+handovers[0]+'</p>':qa(handovers,'summary'))+(s.summary===0?card('Explain your reasoning',rationalePrompts.map((p,i)=>field('r'+i,p,s.rationale[i])).join('')+button('submit','Submit handover →')):'');
}
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
function finishPage(){
 return card('Handover saved','<p>“Thank you for staying with the numbers until they made sense.” — Grace</p><p>Smart Ledger supports bookkeeping checks. An accountant reviews the accounts. The figures and business are fictional.</p>')+'<div class="tools">'+button('review','View debrief')+choice('export','Export test log')+choice('facilitator','Facilitator review')+choice('restart','New attempt')+'</div>';
}
