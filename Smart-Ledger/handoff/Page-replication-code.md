# Page replication code
These are the executable renderers and handlers from this build. The source paths are relative to **app/**. For an existing Claude project, use the index below to find the affected page and its companion shared files. For a fresh project, copy the complete app folder and use index.html as its entry point. Do not concatenate the snippets in document order; index.html defines the script load order.
## Source index
| Page or state | Source | Reference images |
|---|---|---|
| Opening, identity, briefing and role confirmation | [pages/opening.js](../app/pages/opening.js) | [P00-opening](../design/screens/P00-opening.png) · [P01-identity](../design/screens/P01-identity.png) · [P02-introduction](../design/screens/P02-introduction.png) · [P03-title](../design/screens/P03-title.png) |
| Animated product cover | [pages/cover.js](../app/pages/cover.js) | [P00b-motion-cover](../design/screens/P00b-motion-cover.png) |
| Draft posting review | [pages/audit.js](../app/pages/audit.js) | [P04-audit](../design/screens/P04-audit.png) |
| Shared design components, rule sheet and shell | [shared.js](../app/shared.js) | [D01-rule-sheet](../design/screens/D01-rule-sheet.png) |
| Audit decision and comparison | [pages/audit-action.js](../app/pages/audit-action.js) | [P05-audit-action](../design/screens/P05-audit-action.png) · [P06-comparison](../design/screens/P06-comparison.png) |
| Posting rule configuration | [pages/mapping.js](../app/pages/mapping.js) | [P07-rules](../design/screens/P07-rules.png) |
| Trial balance extraction | [pages/trial-balance.js](../app/pages/trial-balance.js) | [P08-trial-balance](../design/screens/P08-trial-balance.png) |
| Ledger evidence dialog | [pages/ledger-book.js](../app/pages/ledger-book.js) | [D02-ledger-book](../design/screens/D02-ledger-book.png) |
| Identify the difference | [pages/difference.js](../app/pages/difference.js) | [P09-difference](../design/screens/P09-difference.png) |
| Trace and classify the errors | [pages/evidence.js](../app/pages/evidence.js) | [P10-evidence](../design/screens/P10-evidence.png) |
| Correct and clear suspense | [pages/corrections.js](../app/pages/corrections.js) | [P11-corrections](../design/screens/P11-corrections.png) · [P11b-ledger-cleared](../design/screens/P11b-ledger-cleared.png) |
| Predictions, results and routine revisions | [pages/test-console.js](../app/pages/test-console.js) | [P12-test-bank](../design/screens/P12-test-bank.png) · [P13-balanced-mismatch](../design/screens/P13-balanced-mismatch.png) |
| Full-bank regression | [pages/regression.js](../app/pages/regression.js) | [P14a-regression-ready](../design/screens/P14a-regression-ready.png) · [P14-regression-fail](../design/screens/P14-regression-fail.png) · [P15-regression-pass](../design/screens/P15-regression-pass.png) |
| Handover to Grace | [pages/handover.js](../app/pages/handover.js) | [P16a-handover-choice](../design/screens/P16a-handover-choice.png) · [P16-handover](../design/screens/P16-handover.png) |
| Debrief and reflection | [pages/debrief.js](../app/pages/debrief.js) | [P17-debrief](../design/screens/P17-debrief.png) |
| Completion, export and review | [pages/complete.js](../app/pages/complete.js) | [P18-completion](../design/screens/P18-completion.png) |
| Routing, actions, persistence and review modal | [app.js](../app/app.js) | [D03-rubric-review](../design/screens/D03-rubric-review.png) |
| Facilitator import entry point | [facilitator.html](../app/facilitator.html) | [F01-cohort](../design/screens/F01-cohort.png) |
| Facilitator report calculation | [cohort.js](../app/cohort.js) | [F01-cohort](../design/screens/F01-cohort.png) |

## Common dependencies
app/content.js supplies immutable curriculum data. app/engine.js calculates ledger values, test outcomes and weighted scores. app/shared.js builds common controls; app/style.css owns the responsive layout and motion tokens. All local scripts are loaded with defer. There is no runtime package install.

## Opening, identity, briefing and role confirmation
**Source**: `app/pages/opening.js`  
**Actions**: advanceSplash, submit identity, pause, skip, start
Emit the shell, collect a name, play the five caption cues and enter audit. Cue and pause timing are in app.js.

```javascript
function hero(){
 if(s.page==='splash')return '<div class="splash"><img class="mivaLogo" src="assets/brand/miva-open-university.svg" alt="MIVA Open University" width="200" height="62"><small>presents</small>'+choice('advanceSplash','Continue →',null,false,'textBtn')+'</div>';
 if(s.page==='cover')return coverPage();
 let panel='';
 if(s.page==='identity')return '<main class="identity">'+brand()+'<form id="identity"><p>Zuri Home Supplies · Nairobi</p><h1>Join the ledger team</h1><label>Your name<input required maxlength="60" id="name" autocomplete="given-name" placeholder="Enter your name"></label><button class="primary">Enter the shop →</button></form></main>';
 if(s.page==='intro')panel='<p class="over">Zuri Home Supplies · Nairobi</p><h1>Month-end<br>at Zuri.</h1><div class="caption">'+(s.media.captions||!s.media.voice?'<b>'+intro[ui.cue][0]+'</b><p>'+intro[ui.cue][1]+'</p>':'')+'</div><div class="tools">'+choice('pause',ui.paused?'Resume':'Pause')+choice('skip','Skip introduction →')+'</div>';
 if(s.page==='title')panel='<p class="over">Zuri Home Supplies · Nairobi</p><h1>The Smart<br>Ledger System</h1><p class="heroSub">'+escapeHTML(s.name)+'<br>Junior Accounts Systems Assistant</p>'+button('start','Open the ledger →');
 return '<div class="hero"><div class="heroTop"><span>BBM 1104 &nbsp; / &nbsp; PRINCIPLES OF ACCOUNTING</span>'+choice('settings','Audio & captions')+'</div><div class="heroBody">'+panel+'</div></div>';
}
```

## Animated product cover
**Source**: `app/pages/cover.js`  
**Actions**: enterCover, toggleCover
A silent native looping video is decorative. The live button navigates immediately and the poster covers deferred playback or reduced motion.

```javascript
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
```

## Draft posting review
**Source**: `app/pages/audit.js`  
**Actions**: sample, sheet, auditNext
Keep visited sample IDs unique. Selecting Next entry opens the first unread record. Both the rules and all five records are required.

```javascript
function audit(){
 const i=ui.sample,a=samples[i];
 const labels=['Cash sale','Rent paid by bank','Customer payment','Owner withdrawal','Stock bought on credit'];
 const rows=samples.map((v,j)=>'<button class="sampleRow '+(i===j?'selected':'')+'" data-do="sample" data-val="'+j+'" aria-pressed="'+(i===j)+'"><span>'+v[0]+'</span><b>'+labels[j]+'</b><span>'+money(v[2])+'</span><small aria-label="'+(s.seen.includes(j)?'Reviewed':'Unreviewed')+'">'+(s.seen.includes(j)?'✓':'')+'</small></button>').join('');
 const next=samples.findIndex((_,j)=>!s.seen.includes(j));
 const detail=a?'<small>'+a[0]+'</small><h2>'+labels[i]+'</h2><div class="amount">'+cash(a[2])+'</div>'+(i===2?'<p>Payment for an earlier credit sale.</p>':'')+table(['Side','Account'],[['Debit',accounts[a[3]]],['Credit',accounts[a[4]]]]):'<h2>Inspect a posting</h2><p>Select a draft entry to see the accounts Smart Ledger used.</p>';
 return '<div class="split"><section><div class="subhead"><h2>Draft entries</h2><span>'+s.seen.length+' of 5 reviewed</span></div><div class="register">'+rows+'</div></section><section class="summary">'+detail+(next!==-1&&a?choice('sample','Next entry →',next,false,'primary continueSample'):'')+(next===-1&&!s.sheet?'<p>Open the rule sheet to continue.</p>':'')+'</section></div><div class="actions">'+button('auditNext','Choose audit action →',!s.sheet||next!==-1)+'</div>';
}
```

## Shared design components, rule sheet and shell
**Source**: `app/shared.js`  
**Actions**: sheet, close, settings, brief
Construct one consistent icon set, navigation rail, heading, grid, tables and reusable controls. Width, hierarchy and motion come from style.css.

```javascript
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
```

## Audit decision and comparison
**Source**: `app/pages/audit-action.js`  
**Actions**: auditChoice, configure
Preserve the original audit decision. A rule-by-rule comparison unlocks a detailed comparison; either distractor can be retried.

```javascript
function actionPage(){
 if(!s.compared)return card('How will you check the draft?',qa(auditOptions,'auditChoice'));
 return card('Posting comparison',table(['Sample','Finding','Expected posting'],samples.map(a=>[a[0],({'S-02':'Sides reversed','S-03':'Customer debt remains open. Sales counted twice.','S-04':'Drawings recorded as an expense.'})[a[0]]||'Matches',accounts[rules[a[5]][1]]+' / '+accounts[rules[a[5]][2]]])))+button('configure','Configure rules →');
}
```

## Posting rule configuration
**Source**: `app/pages/mapping.js`  
**Actions**: map, sheet, ledger
Show the next of six transaction types. Validate the account pair atomically; commit the accepted pair and allow review of the last T-account.

```javascript
function mapping(){
 const count=Object.keys(s.mappings).length;
 const configured=rules.flatMap((rule,i)=>s.mappings[i]?[[rule[0],accounts[s.mappings[i][0]],accounts[s.mappings[i][1]]]]:[]);
 const history=configured.length?table(['Transaction','Debit','Credit'],configured):'<p>Your saved postings appear here.</p>';
 const task=count===6?'<h2>Rules complete</h2>'+button('ledger','Open June ledger →'):'<small>Rule '+(count+1)+' of 6</small><h2>'+rules[count][0]+'</h2>'+pair()+button('map','Save rule');
 const last=count?details('Last saved T-account',ta(...s.mappings[count-1],null)+'<p>'+rules[count-1][3]+'</p>'):'';
 return '<p class="lead">Choose the accounts the system should debit and credit.</p><div class="split"><section class="task">'+task+'</section><section class="summary"><h2>Saved rules</h2>'+history+last+'</section></div>';
}
```

## Trial balance extraction
**Source**: `app/pages/trial-balance.js`  
**Actions**: column, readDifference
Display one unresolved account. Add committed balances to the register and recalculate both column totals.

```javascript
function sortPage(){
 const v=ledger(s),i=v.findIndex((_,j)=>!s.columns[j]);
 const placed=v.flatMap((n,j)=>s.columns[j]?[[accounts[j],n>0?money(n):'—',n<0?money(-n):'—']]:[]);
 const t=totals(v.map((n,j)=>s.columns[j]?n:0));placed.push(['Total',money(t[0]),money(t[1])]);
 const action=i===-1?'<h2>Extraction complete</h2>'+button('readDifference','Read the difference →'):'<small>Balance '+(i+1)+' of 11</small><h2>'+accounts[i]+'</h2><div class="amount">'+cash(Math.abs(v[i]))+'</div><div class="sides">'+choice('column','Debit',0)+choice('column','Credit',1)+'</div>';
 return '<p class="lead">Place each balance in the debit or credit column.</p><div class="split"><section class="task">'+action+'</section><section class="summary"><h2>Placed balances</h2>'+table(['Account','Debit','Credit'],placed)+'</section></div>';
}
```

## Ledger evidence dialog
**Source**: `app/pages/ledger-book.js`  
**Actions**: book, close
Show source lines, opening balances and posted corrections; closing returns to the same task.

```javascript
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
```

## Identify the difference
**Source**: `app/pages/difference.js`  
**Actions**: difference
Accept a whole amount and the short side. For June, debits are short by 14,100.

```javascript
function difference(){
 const t=totals(ledger(s));return '<div class="columns">'+card('June trial balance',table(['Column','Total'],[['Debit',cash(t[0])],['Credit',cash(t[1])]]))+card('Which side is short?','<label>Difference in KSh<input id="amount" inputmode="numeric" placeholder="0"></label>'+options('side',['Debit','Credit'],'Short column')+button('difference','Check difference'))+'</div>';
}
```

## Trace and classify the errors
**Source**: `app/pages/evidence.js`  
**Actions**: evidence, type, correction
Inspect all three flagged accounts; classify the missing supplier debit and transposed delivery amount before correcting.

```javascript
const evidence=[['Trade Payables','Supplier payment · June transaction 06','Supplier payment from bank: KSh 15,000.','Bank credit 15,000. No matching debit appears in Trade Payables.'],['Delivery Expense','Delivery voucher · June transaction 08','Cash paid for delivery: KSh 4,500.','Delivery Expense debit 5,400.'],['Cash','Cash record · June transaction 08','Cash paid for delivery: KSh 4,500.','Cash credit 4,500.']];
function tracePage(){
 const i=ui.evidence,a=evidence[i];
 return '<p class="lead">Compare the flagged accounts with the source transactions.</p><div class="columns">'+card('Flagged accounts',btnList(evidence.map(e=>e[0]),'evidence',i,j=>s.inspected.includes(j)))+card(a?a[0]:'Source comparison',a?'<small>'+a[1]+'</small><p>'+a[2]+'</p><hr><small>Ledger entry</small><p>'+a[3]+'</p>':'<p>Open an account to inspect its source and ledger entry.</p>')+'</div>'+ (s.inspected.length===3?card(Object.keys(s.types).length===0?'Classify the supplier payment':Object.keys(s.types).length===1?'Classify the delivery payment':'Both causes identified',Object.keys(s.types).length===2?button('correction','Open correcting journal →'):qa(errors,'type')):'');
}
```

## Correct and clear suspense
**Source**: `app/pages/corrections.js`  
**Actions**: pickError, post, console
Support either posting order. An incorrect choice previews the effect. An accepted correction posts once and changes the trail and balance.

```javascript
function correctPage(){
 const i=ui.err;return '<div class="metrics"><div><small>Suspense balance</small><strong>'+balance(suspense(s))+'</strong></div><div><small>Corrections posted</small><strong>'+s.posted.length+' / 2</strong></div></div><div class="columns">'+card('Traced errors',btnList(['E1 · Supplier payment','E2 · Delivery expense'],'pickError',i,j=>s.posted.includes(j)))+card(i===0?'Supplier payment':'Delivery expense',s.posted.includes(i)?'<p>Correcting journal posted.</p>':qa(corrections[i],'post'))+'</div>'+(s.posted.length===2?card('Trial balance agrees',table(['Corrected account','Balance'],[['Trade Payables','Credit 25,000'],['Delivery Expense','Debit 4,500'],['Both column totals',cash(totals(ledger(s))[0])]]))+button('console','Open test console →'):'');
}
```

## Predictions, results and routine revisions
**Source**: `app/pages/test-console.js`  
**Actions**: casePick, predict, repair, regression
Store the initial prediction and actual posting. The comparison tags independently assess equality of amounts and correctness of the entry.

```javascript
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
```

## Full-bank regression
**Source**: `app/pages/regression.js`  
**Actions**: runAll, investigate, backTest, confirmReport
Compute ten real outcomes. Route failed rows to their editable case. A new accepted repair invalidates the old report.

```javascript
function regression(){
 return '<p class="lead">Run the complete bank against the current posting rules and routines.</p>'+button('runAll',s.report?'Run all ten again':'Run all ten cases')+(s.report?card('Regression report',reportTable())+(s.report.every(a=>a.pass)?button('confirmReport','Confirm report & hand over →'): '<div class="tools">'+s.report.map((a,i)=>a.pass?'':choice('investigate','Investigate T'+(i+1),i)).join('')+'</div>'):'')+choice('backTest','Back to test console');
}
```

## Handover to Grace
**Source**: `app/pages/handover.js`  
**Actions**: summary, input r0–r2, submit
Accept the supported summary and save three parts of a free-text explanation. Submit after an explicitly confirmed passing report.

```javascript
const rationalePrompts=['How does account type determine the debit and credit?','How did you trace and clear the trial balance difference?','What can equal totals still conceal?'];
const field=(id,label,value)=>'<label>'+escapeHTML(label)+'<textarea id="'+id+'" data-save="'+id+'" maxlength="2500">'+escapeHTML(value)+'</textarea></label>';
function handover(){
 return '<p class="lead">“If the trial balance balances, can I trust everything in the books?” <span>— Grace Achieng</span></p>'+card('Choose your summary',s.summary===0?'<p>'+handovers[0]+'</p>':qa(handovers,'summary'))+(s.summary===0?card('Explain your reasoning',rationalePrompts.map((p,i)=>field('r'+i,p,s.rationale[i])).join('')+button('submit','Submit handover →')):'');
}
```

## Debrief and reflection
**Source**: `app/pages/debrief.js`  
**Actions**: open details, edit lesson/note, finish
Calculate the weighted score from committed evidence. Expand personal feedback and reflect; reflection has zero score weight.

```javascript
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
```

## Completion, export and review
**Source**: `app/pages/complete.js`  
**Actions**: review, export, facilitator, restart
Keep the completed attempt available. Export a JSON snapshot, moderate the rubric or explicitly confirm replacement of this run.

```javascript
function finishPage(){
 return card('Handover saved','<p>“Thank you for staying with the numbers until they made sense.” — Grace</p><p>Smart Ledger supports bookkeeping checks. An accountant reviews the accounts. The figures and business are fictional.</p>')+'<div class="tools">'+button('review','View debrief')+choice('export','Export test log')+choice('facilitator','Facilitator review')+choice('restart','New attempt')+'</div>';
}
```

## Routing, actions, persistence and review modal
**Source**: `app/app.js`  
**Actions**: mark, reset, close; all guards and events above
This controller owns the active page, grading events, idempotent corrections and repairs, transient inspector selections, dialogue timers and local saving.

```javascript
let s;
try{s=JSON.parse(localStorage.getItem(SAVE));if(!s||s.v!==1)throw Error()}catch{s=fresh()}
let ui={sample:-1,evidence:-1,err:0,cue:0,paused:false,message:'',failedStorage:false};
let timer,idle,cueDeadline=0,cueRemaining=null;
const root=document.querySelector('#app');
const view={audit,action:actionPage,mapping,sort:sortPage,difference,trace:tracePage,correct:correctPage,test:testPage,regression,handover,debrief,finish:finishPage};
const introPages=['splash','cover','identity','intro','title'];
const byId=id=>document.getElementById(id);
const activeSection=()=>sections.findIndex(v=>v[1].includes(s.page));
const supportedSpeech=()=>typeof speechSynthesis!=='undefined'&&typeof SpeechSynthesisUtterance!=='undefined';
function say(line){
 if(!s.media.voice||!supportedSpeech())return;
 speechSynthesis.cancel();
 const voice=new SpeechSynthesisUtterance(line);voice.lang='en-KE';
 const match=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase()==='en-ke');
 if(match)voice.voice=match;speechSynthesis.speak(voice);
}
function save(){try{localStorage.setItem(SAVE,JSON.stringify(s))}catch{ui.failedStorage=true}}
function go(page){clearTimeout(timer);clearTimeout(idle);if(supportedSpeech())speechSynthesis.cancel();s.page=page;ui.message='';save();render();window.scrollTo(0,0);root.querySelector('h1')?.focus()}
function msg(line){ui.message=line;save();render();const box=byId('status');if(box)box.focus({preventScroll:false});say(line)}
function render(){
 const panel=introPages.includes(s.page)?hero():workspace();
 root.innerHTML=panel+'<dialog id="dialog"></dialog>'+(ui.failedStorage?'<p role="alert">This browser could not save progress. Keep this tab open.</p>':'');
 if(s.page==='cover')mountCover();
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
 if(s.page==='intro'&&!ui.paused){holdCue();if(supportedSpeech())speechSynthesis.pause()}
 d.addEventListener('close',()=>{opener?.focus();if(s.page==='intro')render();if(s.page==='intro'&&!ui.paused){if(supportedSpeech())speechSynthesis.resume();scheduleCue()}},{once:true});
}
const val=id=>{const el=byId(id);return !el||el.value===''?null:Number(el.value)};
function readPair(){const pair=[val('dr'),val('cr')];return pair.includes(null)?null:pair}
function holdCue(){clearTimeout(timer);cueRemaining=Math.max(0,cueDeadline-Date.now())}
function scheduleCue(){
 clearTimeout(timer);if(s.page!=='intro'||ui.paused)return;
 const delay=cueRemaining??[14500,12000,15500,15000,5000][ui.cue];cueRemaining=null;cueDeadline=Date.now()+delay;
 timer=setTimeout(()=>{if(ui.cue===4){go('title');return}ui.cue++;render();say(intro[ui.cue][1]);scheduleCue()},delay);
}
function settingsText(){return '<label class="toggle"><input type="checkbox" id="captions" '+(s.media.captions?'checked':'')+'>Show subtitles</label><label class="toggle"><input type="checkbox" id="voice" '+(s.media.voice?'checked':'')+(supportedSpeech()?'':' disabled')+'>Read prompts aloud with this device</label><p>Written prompts are available throughout the simulation.</p>'+(s.page==='intro'?details('Read introduction',intro.map(([speaker,line])=>'<p><b>'+speaker+'</b> · '+line+'</p>').join('')):'')}
function startBranch(){s.started=s.started||new Date().toISOString();go('audit')}
function required(message){msg(message)}
function keepFocusMessage(line){const node=byId('status');if(node){node.textContent=line;node.focus()}say(line)}
function exportLog(){
 const data={...s,score:grade(s),reasoning_status:s.manual?'reviewed':'indicative',suspense_balance:suspense(s)};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Smart-Ledger-'+s.learner_id+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
const pageControls={advanceSplash:'splash',skip:'intro',pause:'intro',start:'title',sample:'audit',auditNext:'audit',auditChoice:'action',configure:'action',map:'mapping',ledger:'mapping',column:'sort',readDifference:'sort',difference:'difference',evidence:'trace',type:'trace',correction:'trace',pickError:'correct',post:'correct',console:'correct',predict:'test',repair:'test',regression:'test',runAll:'regression',investigate:'regression',backTest:'regression',confirmReport:'regression',summary:'handover',submit:'handover',finish:'debrief',review:'finish',export:'finish',facilitator:'finish',mark:'finish',restart:'finish',reset:'finish'};
function respond(action,n){
 if(pageControls[action]&&pageControls[action]!==s.page)return;
 switch(action){
 case 'advanceSplash':go('cover');break;
 case 'enterCover':if(s.page==='cover')go('identity');break;
 case 'toggleCover':if(s.page==='cover')toggleCover();break;
 case 'skip':go('title');break;
 case 'pause':if(!ui.paused)holdCue();ui.paused=!ui.paused;if(supportedSpeech()){if(ui.paused)speechSynthesis.pause();else speechSynthesis.resume()}render();scheduleCue();break;
 case 'start':startBranch();say(briefings[0].join(' '));break;
 case 'brief':{const [gr,nar]=briefings[activeSection()];modal('Scene briefing','<p><b>Grace Achieng</b></p><p>'+gr+'</p><p><b>Narrator</b></p><p>'+nar+'</p>');say(gr+' '+nar);break}
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
 case 'ledger':if(Object.keys(s.mappings).length===6){go('sort');say(briefings[1].join(' '))}break;
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
 case 'console':if(s.posted.length===2&&suspense(s)===0){go('test');say(briefings[2].join(' '))}break;
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
 case 'submit':if(s.summary!==0||!s.report?.every(a=>a.pass))return;if(s.rationale.some(x=>!x.trim()))return keepFocusMessage('Complete all three parts of your explanation.');s.marks=suggestMarks(s.rationale);go('debrief');break;
 case 'finish':s.completed=s.completed||new Date().toISOString();go('finish');break;
 case 'review':go('debrief');break;
 case 'export':exportLog();break;
 case 'facilitator':modal('Facilitator review','<p>Review the learner’s own explanation. Award one mark for each demonstrated criterion.</p>'+rationalePrompts.map((p,i)=>'<hr><b>'+p+'</b><p>'+escapeHTML(s.rationale[i])+'</p><label class="toggle"><input id="mark'+i+'" type="checkbox" '+(s.marks[i]?'checked':'')+'>Criterion met</label>').join('')+button('mark','Save reviewed marks'));break;
 case 'mark':s.marks=rationalePrompts.map((p,i)=>byId('mark'+i).checked);s.manual=true;record(s,'review',0,s.marks.map(v=>v?'Met':'Revisit'),true);go('debrief');break;
 case 'restart':modal('Start a new attempt?','<p>This replaces the saved attempt on this device. Export your test log first if you need a copy.</p>'+button('reset','Start new attempt'));break;
 case 'reset':s=fresh();ui={...ui,sample:-1,evidence:-1,err:0,cue:0,paused:false};go('cover');break;
 }
}
root.addEventListener('click',e=>{const b=e.target.closest('button[data-do]');if(b&&!b.disabled)respond(b.dataset.do,Number(b.dataset.val))});
root.addEventListener('submit',e=>{e.preventDefault();if(e.target.id!=='identity')return;const n=byId('name').value.trim();if(!n){byId('name').setCustomValidity('Enter a name.');byId('name').reportValidity();return}s.name=n;ui.cue=0;cueRemaining=null;go('intro');say(intro[0][1]);scheduleCue()});
root.addEventListener('input',e=>{if(e.target.id==='name')e.target.setCustomValidity('');const k=e.target.dataset.save;if(!k)return;if(k==='note')s.note=e.target.value;else if(k[0]==='r')s.rationale[Number(k.slice(1))]=e.target.value;else s.reflection[Number(k.slice(1))]=e.target.value;save()});
root.addEventListener('change',e=>{const el=e.target;if(el.id==='repairPick')root.querySelector('[data-do=repair]').disabled=el.value==='';if(el.id==='casePick'){s.selected=Number(el.value);ui.message='';save();render();byId('casePick')?.focus()}if(el.id==='lesson'){s.lesson=el.value;save()}if(el.id==='captions'||el.id==='voice'){s.media[el.id]=el.checked;save();if(el.id==='voice'&&!el.checked&&supportedSpeech())speechSynthesis.cancel()}});
render();if(s.page==='splash')timer=setTimeout(()=>go('cover'),1800);if(s.page==='intro')scheduleCue();
```

## Facilitator import entry point
**Source**: `app/facilitator.html`  
**Actions**: select completed JSON files
Open this separate local report reader to combine completed exports.

```html
<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Smart Ledger · Facilitator</title><link rel="stylesheet" href="style.css"><main class="work"><div class="crumb">Smart Ledger / Facilitator</div><h1>Cohort review</h1><p class="lead">Open completed test logs to compare strand scores and first-attempt patterns. The reports stay on this device.</p><label>Completed JSON test logs<input type="file" id="logs" accept="application/json,.json" multiple></label><div id="results" aria-live="polite"></div></main><script src="cohort.js"></script></html>
```

## Facilitator report calculation
**Source**: `app/cohort.js`  
**Actions**: logs change
Validate completed exports, deduplicate by attempt ID, aggregate five strands and show error and first-attempt patterns.

```javascript
const reports=new Map(),result=document.querySelector('#results');
const strandNames=['Posting rules','Trial balance','Error correction','Testing','Reasoning'];
const pretty={audit:'Audit action',map:'Posting rule',column:'Trial balance column',difference:'Difference',type:'Diagnosis',post:'Correction',predict:'Prediction',repair:'Repair',summary:'Handover'};
function appendTable(title,head,rows){
 const panel=document.createElement('section');panel.className='card';
 const h=document.createElement('h2');h.textContent=title;panel.append(h);
 const wrap=document.createElement('div');wrap.className='tablewrap';panel.append(wrap);
 const t=document.createElement('table');wrap.append(t);
 [head,...rows].forEach((row,i)=>{const tr=t.insertRow();row.forEach(value=>{const cell=document.createElement(i?'td':'th');cell.textContent=value;tr.append(cell)})});result.append(panel);
}
document.querySelector('#logs').onchange=async e=>{
 let rejected=0;for(const file of e.target.files){
  try{const r=JSON.parse(await file.text());if(r.simulation_id!=='BBM1104-smart-ledger'||!r.completed||!r.learner_id||!Array.isArray(r.log)||r.score?.strands?.length!==5||!r.score.strands.every(x=>Number.isFinite(x)&&x>=0&&x<=100))throw Error();
   reports.set(r.learner_id,r);
  }catch{rejected++}
 }
 const list=[...reports.values()];result.replaceChildren();const p=document.createElement('p');p.textContent=list.length+' unique completed attempts. '+list.filter(r=>r.reasoning_status!=='reviewed').length+' indicative reasoning marks. '+rejected+' invalid or incomplete files skipped.';result.append(p);
 if(!list.length)return;
 appendTable('Mean strand scores',['Strand','Mean / 100'],strandNames.map((n,i)=>[n,(list.reduce((v,r)=>v+r.score.strands[i],0)/list.length).toFixed(1)]));
 const counts=new Map();const errors={swapped:0,account:0,suspense:0,overclaim:0};
 const pairs=[['Cash','Capital'],['Cash','Sales'],['Inventory','Trade Payables'],['Rent Expense','Bank'],['Bank','Trade Receivables'],['Drawings','Cash']];
 for(const r of list){const seen=new Set();for(const a of r.log){
  if(!Object.hasOwn(pretty,a.task))continue;
  const k=pretty[a.task]+' '+(typeof a.item==='number'?a.item+1:String(a.item)),v=counts.get(k)||[0,0,0];v[0]++;if(!seen.has(k)){seen.add(k);v[1]++;if(a.correct)v[2]++}counts.set(k,v);
  if(a.correct)continue;
  if(a.task==='map'){const pair=pairs[a.item];if(pair&&Array.isArray(a.choice)&&a.choice[0]===pair[1]&&a.choice[1]===pair[0])errors.swapped++;else errors.account++}
  if(a.task==='post'&&String(a.choice).includes('14,100'))errors.suspense++;
  if(a.task==='summary'&&String(a.choice).startsWith('Equal trial balance'))errors.overclaim++;
 }}
 appendTable('Recorded error patterns',['Pattern','Attempts'],[['Swapped debit and credit',errors.swapped],['Wrong account in a posting rule',errors.account],['Writing off the unexplained difference',errors.suspense],['Assuming equal totals prove accuracy',errors.overclaim]]);
 appendTable('Item-level attempts',['Item','All attempts','First attempts correct'],[...counts].map(([k,[a,b,c]])=>[k,a,c+' / '+b]));
};
```
