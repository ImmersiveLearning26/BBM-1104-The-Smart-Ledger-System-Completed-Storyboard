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
| Debrief recap | [pages/debrief-recap.js](../app/pages/debrief-recap.js) | [P16b-recap-trace](../design/screens/P16b-recap-trace.png) · [P16c-recap-test](../design/screens/P16c-recap-test.png) |
| Voices, feedback audio and sound | [audio.js](../app/audio.js) | — |
| Audio manifest | [audio-manifest.js](../app/audio-manifest.js) | — |
| Agent-led flow (prototype) | [agent.js](../app/agent.js) | — |
| Routing, actions, persistence and review modal | [app.js](../app/app.js) | [D03-rubric-review](../design/screens/D03-rubric-review.png) |
| Facilitator import entry point | [facilitator.html](../app/facilitator.html) | [F01-cohort](../design/screens/F01-cohort.png) |
| Facilitator report calculation | [cohort.js](../app/cohort.js) | [F01-cohort](../design/screens/F01-cohort.png) |

## Common dependencies
app/content.js supplies immutable curriculum data. app/engine.js calculates ledger values, test outcomes and weighted scores. app/shared.js builds common controls; app/style.css owns the responsive layout and motion tokens. All local scripts are loaded with defer. There is no runtime package install.

## Opening, identity, briefing and role confirmation
**Source**: `app/pages/opening.js`  
**Actions**: advanceSplash, submit identity, pause, skip, start
Emit the shell with the MIVA Open University logo, collect a name, play the five caption cues with their recorded lines and shop sound, and enter audit. Cue, pause and audio timing are in app.js and audio.js.

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
Calculate the weighted score from committed evidence. Opens after the two-slide recap (pages/debrief-recap.js). Expand personal feedback and reflect; reflection has zero score weight.

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

## Debrief recap
**Source**: `app/pages/debrief-recap.js`  
**Actions**: recapNext, recapBack, recapDone, toggleRecap
Two full-screen slides over the store loop before the detailed debrief. Headings, explanations and figures are live HTML; each slide is narrated when recorded. Media never gates the flow. See production/Debrief-media.md.

```javascript
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
```

## Voices, feedback audio and sound
**Source**: `app/audio.js`  
**Actions**: introVoice, briefVoice, recapVoice, closingVoice, say (feedback), answer cues
Plays recorded lines with caption and device-voice fallback, splits feedback into recorded segments, and adds shop ambience, opening effects, answer cues and the recap music bed. See production/Audio.md.

```javascript
// Recorded voices and shop sound. Nothing in the simulation waits on audio:
// captions and timed cues run on their own, and a clip that cannot load or play
// falls back to the device voice (when that setting is on) or to silence.
const voiceEl=new Audio(),ambienceEl=new Audio(),musicEl=new Audio();
voiceEl.preload='auto';ambienceEl.loop=true;ambienceEl.preload='none';musicEl.loop=true;musicEl.preload='none';
let voiceToken=0,voiceFallback='',sfxTimers=[],fadeTimer;
const recordedOn=()=>s.media.recorded!==false;
const soundsOn=()=>s.media.ambience!==false;

function stopVoice(){voiceToken++;voiceEl.onended=voiceEl.onerror=null;voiceEl.pause()}
// Play clips in order. fallback is the same words for the device voice.
function playVoice(clips,fallback){
 stopVoice();if(supportedSpeech())speechSynthesis.cancel();
 clips=(clips||[]).filter(Boolean);voiceFallback=fallback||'';
 if(!recordedOn()||!clips.length){deviceSay(fallback);return}
 const token=voiceToken;let i=0;
 const fail=()=>{if(token!==voiceToken)return;voiceToken++;deviceSay(voiceFallback)};
 const next=()=>{if(token!==voiceToken||i>=clips.length)return;voiceEl.src=clips[i++].src;voiceEl.play().catch(fail)};
 voiceEl.onended=next;voiceEl.onerror=fail;next();
}
function pauseVoice(){voiceEl.pause()}
function resumeVoice(){if(recordedOn()&&voiceEl.onended&&voiceEl.src&&!voiceEl.ended&&voiceEl.currentTime>0)voiceEl.play().catch(()=>{})}
const introVoice=i=>playVoice([voiceClips.intro[i]],intro[i][1]);
const briefVoice=i=>playVoice(voiceClips.brief[i],briefings[i].join(' '));
const closingVoice=()=>playVoice([voiceClips.closing],'Thank you for staying with the numbers until they made sense.');
// Recorded intro lines may set a longer hold than the default cue timing.
const cueHold=(i,base)=>Math.max(base,recordedOn()&&voiceClips.intro[i]?.dur?voiceClips.intro[i].dur*1000+900:0);
const recapVoice=i=>{const r=recapSlides[i];if(recordedOn())playVoice([voiceClips.recap[i]],r.title+'. '+r.text().replace(/<[^>]+>/g,''))};
// Split a feedback message into recorded segments, longest match first. null = some part has no script line.
const feedbackKeys=Object.keys(feedbackClips).sort((a,b)=>b.length-a.length);
function segmentLine(line){const keys=[];let rest=String(line||'').trim();while(rest){const k=feedbackKeys.find(k=>rest.startsWith(k));if(!k)return null;keys.push(k);rest=rest.slice(k.length).trim()}return keys}

function sfx(name,delay=0,volume=.6){
 if(!soundsOn()||!soundClips[name])return;
 if(!delay){const a=new Audio(soundClips[name]);a.volume=volume;a.play().catch(()=>{});return}
 sfxTimers.push(setTimeout(()=>{const a=new Audio(soundClips[name]);a.volume=volume;a.play().catch(()=>{})},delay));
}
function startAmbience(){
 if(!soundsOn()||!soundClips.ambience)return;
 if(!ambienceEl.src)ambienceEl.src=soundClips.ambience;
 clearInterval(fadeTimer);ambienceEl.volume=0;ambienceEl.play().then(()=>{
  fadeTimer=setInterval(()=>{ambienceEl.volume=Math.min(.35,ambienceEl.volume+.035);if(ambienceEl.volume>=.35)clearInterval(fadeTimer)},120);
 }).catch(()=>{});
}
function pauseAmbience(){clearInterval(fadeTimer);ambienceEl.pause()}
function resumeAmbience(){if(!soundsOn()||!['intro','title'].includes(s.page))return;if(!ambienceEl.src)startAmbience();else ambienceEl.play().catch(()=>{})}
function stopShopSound(){sfxTimers.forEach(clearTimeout);sfxTimers=[];pauseAmbience();musicEl.pause()}
// Music bed under the debrief recap (slot: assets/audio/music/debrief-bed.mp3).
function startMusic(){if(!soundsOn()||!soundClips.music)return;if(!musicEl.src)musicEl.src=soundClips.music;musicEl.volume=.18;musicEl.play().catch(()=>{})}
// Soft confirm/correction cue on every graded answer.
const gradedTasks=['audit','map','column','difference','type','post','predict','repair','regression','summary'];
onRecord=(task,ok)=>{if(gradedTasks.includes(task))sfx(ok?'confirm':'correction',0,.35)};
// Opening beats from production/Media.md: door chime, till, phone.
function introSounds(i){if(i===0){startAmbience();sfx('chime',250)}if(i===1)sfx('till',200,.5);if(i===2)sfx('phone',600,.55)}
```

## Audio manifest
**Source**: `app/audio-manifest.js`  
**Actions**: none (data)
Generated by production/build-voice-lines.cjs from production/voice-lines.json. A null entry means that line is not recorded yet.

```javascript
// Generated by production/build-voice-lines.cjs. Do not edit by hand.
// Recorded voices (Eleven v4 via Higgsfield). Grace: custom voice 'Joy'. Narrator: custom voice 'Dr. Omondi (Lecturer)'.
// null = not recorded yet; that line falls back to the device voice (when enabled) or silence.
const voiceClips={
 intro:[{"src":"assets/audio/voice/intro-0.mp3","dur":11.57},{"src":"assets/audio/voice/intro-1.mp3","dur":8.23},{"src":"assets/audio/voice/intro-2.mp3","dur":11.49},{"src":"assets/audio/voice/intro-3.mp3","dur":12.38},{"src":"assets/audio/voice/intro-4.mp3","dur":2.22}],
 brief:[[{"src":"assets/audio/voice/brief-0-grace.mp3","dur":6.06},{"src":"assets/audio/voice/brief-0-narrator.mp3","dur":8.39}],[{"src":"assets/audio/voice/brief-1-grace.mp3","dur":7.5},{"src":"assets/audio/voice/brief-1-narrator.mp3","dur":10.71}],[{"src":"assets/audio/voice/brief-2-grace.mp3","dur":5.75},{"src":"assets/audio/voice/brief-2-narrator.mp3","dur":16.07}],[{"src":"assets/audio/voice/brief-3-grace.mp3","dur":5.36},{"src":"assets/audio/voice/brief-3-narrator.mp3","dur":6.14}]],
 closing:{"src":"assets/audio/voice/closing-grace.mp3","dur":3.27},
 recap:[null,null]
};
// Feedback and hint segments: text -> clip (null until recorded).
const feedbackClips={"Three draft postings differ from the rules.":null,"Changing headings or hiding accounts leaves the original postings unchecked. Try again.":null,"Choose both accounts before saving.":null,"Saved.":null,"Hint:":null,"Cash comes into the shop. The owner’s capital increases.":null,"Cash and sales income both increase.":null,"Inventory rises and the shop owes its supplier.":null,"Rent expense increases. The bank balance falls.":null,"Bank increases. The amount owed by the customer falls.":null,"Drawings increase. The shop has less cash.":null,"Sides swapped. Check which balance increases and which falls.":null,"Owner withdrawals are drawings. A personal withdrawal is separate from a business expense.":null,"Check the debit account (asset).":null,"Check the debit account (expense).":null,"Check the debit account (drawings).":null,"Check the credit account (capital).":null,"Check the credit account (income).":null,"Check the credit account (liability).":null,"Check the credit account (asset).":null,"Cash placed in Debit.":null,"Check the normal balance for Cash (asset).":null,"Bank placed in Debit.":null,"Check the normal balance for Bank (asset).":null,"Inventory placed in Debit.":null,"Check the normal balance for Inventory (asset).":null,"Equipment placed in Debit.":null,"Check the normal balance for Equipment (asset).":null,"Trade Receivables placed in Debit.":null,"Check the normal balance for Trade Receivables (asset).":null,"Trade Payables placed in Credit.":null,"Check the normal balance for Trade Payables (liability).":null,"Capital placed in Credit.":null,"Check the normal balance for Capital (capital).":null,"Drawings placed in Debit.":null,"Check the normal balance for Drawings (drawings).":null,"Sales placed in Credit.":null,"Check the normal balance for Sales (income).":null,"Rent Expense placed in Debit.":null,"Check the normal balance for Rent Expense (expense).":null,"Delivery Expense placed in Debit.":null,"Check the normal balance for Delivery Expense (expense).":null,"Enter a whole KSh amount and choose a column.":null,"Subtract the smaller total from the larger and identify the smaller column.":null,"Compare the source amount with both legs of the entry.":null,"The bank credit is present. Trade Payables is missing its KSh 15,000 debit.":null,"The debit was keyed as 5,400 instead of 4,500. The KSh 900 difference divides by nine.":null,"Posted. Suspense balance: Credit KSh 900.":null,"Posted. Suspense balance: Debit KSh 15,000.":null,"Posted. Suspense balance: Nil.":null,"Preview: suspense would be Debit KSh 15,000.":null,"Preview: suspense would be Debit KSh 14,100.":null,"Preview: suspense would be Debit KSh 13,200.":null,"Preview: suspense would be Debit KSh 900.":null,"Preview: suspense would be Nil.":null,"Preview: suspense would be Credit KSh 900.":null,"Preview: suspense would be Credit KSh 1,800.":null,"Bank has already been credited.":null,"Compare the journal with the specific missing or excess amount.":null,"Choose another entry.":null,"Prediction matches the expected entry.":null,"Compare your prediction with the expected entry.":null,"The system posted correctly.":null,"The totals agree. Check which account received the debit.":null,"The system posted unequal amounts.":null,"Predict both accounts before running this case.":null,"Choose the rule or routine to revise.":null,"That change would leave this posting error in place. Compare the expected and actual legs.":null,"Routine revised. The rerun matches the expected posting.":null,"All ten cases pass. Confirm the report to unlock handover.":null,"Investigate each failing case, revise its routine and run all ten again.":null,"Explain the reasoning in your own words.":null,"Recall T10. Both sides agreed when the purchase was charged to Delivery Expense.":null,"Include how you traced the difference and what equal totals can conceal.":null,"Complete all three parts of your explanation.":null,"Open the rule sheet and inspect each of the five draft entries.":null,"Hint: consider the account type and whether its balance rises or falls.":null,"Hint: check both account names and both amounts, even when the totals agree.":null};
const soundClips={"ambience":"assets/audio/sfx/shop-ambience.mp3","chime":"assets/audio/sfx/door-chime.mp3","till":"assets/audio/sfx/till.mp3","phone":"assets/audio/sfx/phone.mp3","confirm":"assets/audio/sfx/confirm.mp3","correction":"assets/audio/sfx/correction.mp3","music":null};
```

## Agent-led flow (prototype)
**Source**: `app/agent.js`  
**Actions**: begin, next, join, flag, approach, fix, slot, acct, run, nextRule, handoff, restart
Alternative presentation opened from app/agent.html: the opening through the six posting rules as a guided, one-step-at-a-time flow. Same content, engine, scoring, log and save key as app.js. See handoff/CLAUDE.md.

```javascript
// Agent-led flow: the opening through the six posting rules, built only from the agent library
// (design/agent-library/README.md, app/agent-library.css and .js).
// Each step: situation -> evidence on Grace's screen -> the learner's pick -> Smart Ledger runs it and reveals.
// State, scoring, log and save key are the same as app.js, so an attempt can continue in index.html.
let s;
try{s=JSON.parse(localStorage.getItem(SAVE));if(!s||s.v!==1)throw Error()}catch{s=fresh()}
const newAgent=()=>({scene:s.started?4:0,flags:{},fix:Object.keys(s.mappings).length>0});
s.agent=s.agent||newAgent();
let ui={pick:[null,null],slot:0,busy:false,saved:null,approach:null,failedStorage:false};
let runTimer,opener,lastStep='';
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
function stage(){
 if(!flowPages.includes(s.page))return 'end';
 if(s.agent.scene<4)return 'open';
 if(nextSample()!==-1)return 'review';
 if(!s.agent.fix)return 'approach';
 if(count()<6||ui.saved!==null)return 'rules';
 return 'end';
}

// ---- Library pieces ----
const objBar=(title,sub='June ledger')=>'<div class="objBar"><span class="appTile">'+ic('ledger')+'</span><div><b>'+title+'</b><small>'+sub+'</small></div>'+ic('globe','end')+'</div>';
const obj=(title,body,sub)=>objBar(title,sub)+'<div class="objBody">'+body+'</div>';
const tAccount=(d,c,amount)=>'<div class="t"><div><small>Debit</small><b>'+d+'</b>'+(amount?'<span>'+money(amount)+'</span>':'')+'</div><div><small>Credit</small><b>'+c+'</b>'+(amount?'<span>'+money(amount)+'</span>':'')+'</div></div>';
const row=(label,right,cls='')=>'<li class="row '+cls+'"><span>'+label+'</span><small>'+right+'</small></li>';
const sheet=()=>'<ul class="rows">'+sheetRows.map(([k,eg,side])=>'<li class="row"><span><b>'+k+'</b><small class="eg">'+eg+'</small></span><small>'+side+'</small></li>').join('')+'</ul><p class="objLabel sheetNote">Each posting has equal debits and credits.</p>';
const tile=(label,icon,val,on=false,act='pick')=>'<button type="button" class="tile'+(on?' on':'')+'" data-do="'+act+'" data-val="'+val+'" '+(ui.busy?'disabled':'')+'>'+ic(icon)+'<span>'+label+'</span>'+(on?'<i class="dot" aria-hidden="true"></i>':'')+'</button>';

// ---- Opening: Grace, then her problem on her own screen, then the learner's role ----
function sceneBody(){
 const n=s.agent.scene,next=(label,act='next')=>'<button type="button" class="btn-raised" data-do="'+act+'">'+label+'</button>';
 if(n===0)return '<p class="t-caption over">BBM 1104 · Principles of Accounting</p><h1 class="t-display" tabindex="-1">Month-end<br>at Zuri.</h1>'+next('Begin','begin');
 if(n===1)return '<div class="cap" tabindex="-1"><p class="t-caption">Zuri Home Supplies · Nairobi</p><p class="t-message">'+intro[0][1]+'</p></div>'+next('Continue');
 if(n===2)return '<div class="obj win">'+obj('June month-end','<ul class="rows">'+row('Trial balance','Does not balance')+row('Suspense account','Open')+row('Month-end close','Blocked')+'</ul>','Smart Ledger')+'</div><div class="cap" tabindex="-1"><p class="t-caption">Grace Achieng · Owner</p><p class="t-message">“'+intro[1][1]+'”</p></div>'+next('Continue');
 return '<div class="cap" tabindex="-1"><p class="t-caption">Your role</p><p class="t-message">'+intro[2][1]+'</p></div><form id="join" class="pill"><span data-orb></span><label class="sr" for="name">Your name</label><input id="name" required maxlength="60" autocomplete="given-name" placeholder="Your name"><button class="send" type="submit" aria-label="Join Grace"><span>'+ic('arrow','arrow')+'</span></button></form><p class="t-caption fine">Speed is not scored. All figures are fictional.</p>';
}

// ---- Workspace: talk (left), Grace's screen (right), the composer (left, below) ----
function ask(){
 const st=stage();
 if(st==='review')return 'Does this posting look right to you?';
 if(st==='approach')return s.compared?'I compared each posting with its rule.':'Before I change anything, how should I check them?';
 if(st==='rules'){const r=rules[ui.saved??count()];return '<b>'+r[0]+'.</b> Which account do I debit, and which do I credit?'}
 return 'All six rules are saved. The June ledger is next.';
}
function screenView(){
 const st=stage();
 if(st==='review'){
  const i=nextSample(),a=samples[i];
  return obj('Draft postings','<p class="objLabel">'+a[0]+(i===2?' · Payment for an earlier credit sale':'')+'</p><p class="objTitle">'+sampleLabels[i]+'</p><p class="objAmount">'+cash(a[2])+'</p>'+tAccount(accounts[a[3]],accounts[a[4]]));
 }
 if(st==='approach'){
  if(!s.compared)return obj('Rule sheet',sheet());
  return obj('Posting comparison','<ul class="rows">'+samples.map((a,i)=>{
   const call=i in s.agent.flags?'You said '+(s.agent.flags[i]?'wrong':'right'):'';
   if(!sampleWrong(i))return row('<b>'+a[0]+'</b> '+sampleLabels[i],'Matches'+(call?' · '+call:''));
   const r=rules[a[5]];
   return '<li class="row open"><span><b>'+a[0]+'</b> '+sampleLabels[i]+'</span><small>'+call+'</small><p class="was">Posted <s>'+accounts[a[3]]+' / '+accounts[a[4]]+'</s></p><p class="is">Rule sheet <b>'+accounts[r[1]]+' / '+accounts[r[2]]+'</b></p><p class="why">'+findings[a[0]]+'</p></li>'}).join('')+'</ul>');
 }
 const cur=st==='rules'&&ui.saved===null?count():-1;
 const rows=rules.map((r,i)=>s.mappings[i]&&ui.saved!==i?row(r[0],accounts[s.mappings[i][0]]+' · '+accounts[s.mappings[i][1]]):i===cur||ui.saved===i?row(r[0],ui.saved===i?accounts[s.mappings[i][0]]+' · '+accounts[s.mappings[i][1]]:(ui.pick[0]===null?'Debit ?':accounts[ui.pick[0]])+' · '+(ui.pick[1]===null?'Credit ?':accounts[ui.pick[1]]),'now'):'').join('');
 const test=ui.saved!==null?'<div class="objOk enter"><p class="objLabel">Test posting · '+cash(testAmount(ui.saved))+'</p>'+tAccount(accounts[s.mappings[ui.saved][0]],accounts[s.mappings[ui.saved][1]],testAmount(ui.saved))+'</div>':'';
 return obj('Posting rules','<ul class="rows">'+rows+'</ul>'+test);
}
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
 if(st==='approach'&&s.compared)return '<button type="button" class="btn-ink" data-do="fix">Fix the rules</button>';
 if(st==='rules'&&ui.saved!==null)return '<button type="button" class="btn-ink" data-do="nextRule">'+(count()===6?'Finish the rules':'Next rule')+'</button>';
 if(st==='end')return '<button type="button" class="btn-ink" data-do="handoff">Open the June ledger</button><button type="button" class="btn-glass" data-do="restart">Start again</button>';
 return '';
}

// ---- Shells: fixed skeletons, so the orb and waveform keep running between steps ----
function shell(mode){
 root.dataset.mode=mode;lastStep='';
 root.innerHTML=(mode==='open'
  ?'<main class="scene"><video class="sceneBg" muted loop playsinline preload="auto" poster="assets/video/zuri-store-poster.webp" aria-hidden="true"><source src="assets/video/zuri-store-loop.mp4" type="video/mp4"></video><header class="sceneTop wrap"><img src="assets/brand/miva-open-university.svg" alt="MIVA Open University" width="116" height="36"><button class="icon-glass" type="button" data-do="settings" aria-label="Audio settings">'+ic('settings')+'</button></header><div class="wrap grid12"><div class="sceneBody col-1-5" id="sceneBody"></div></div></main>'
  :'<div class="atm"><header class="hdr"><p class="t-title">Zuri Home Supplies</p><p class="t-caption dim">June month-end</p><button class="icon-glass" type="button" data-do="settings" aria-label="Audio settings">'+ic('settings')+'</button></header>'
   +'<main class="wrap grid12 flow"><section class="col-1-5 flowA" id="talk"><div id="story"></div><div class="line"><span class="av" data-orb id="agentOrb"></span><p class="t-message" id="ask" tabindex="-1"></p></div></section>'
   +'<section class="col-7-12 flowObj" id="screen" aria-label="Grace\'s Smart Ledger screen"><div class="obj" id="obj"></div></section>'
   +'<section class="col-1-5 flowC" id="reply"><div class="chips"><button class="chip" type="button" data-do="sheet">'+ic('sheet')+'Rule sheet</button></div><div class="composer" id="composer"><div class="pill"><span data-orb id="pillOrb"></span><div class="compose" id="compose"></div><canvas class="wave" data-wave="gradient" id="pillWave"></canvas><button class="send" type="button" id="send" data-do="send" aria-label="Run it"><span>'+ic('arrow','arrow')+'<i class="stop"></i></span></button></div><div id="opts"></div></div><div class="after" id="after"></div></section></main></div>')
  +'<dialog id="dialog" class="sheetDialog"></dialog>';
 if(mode==='open'&&!reduced())root.querySelector('.sceneBg').play().catch(()=>{});
 AL.mount(root);
}
function paint(focusSel){
 const st=stage(),mode=st==='open'?'open':'work';
 if(root.dataset.mode!==mode)shell(mode);
 if(mode==='open'){
  const body=byId('sceneBody');body.innerHTML=sceneBody();body.classList.remove('enter');void body.offsetWidth;body.classList.add('enter');AL.mount(body);
  if(focusSel!==false)body.querySelector('[tabindex],#name')?.focus({preventScroll:true});
 }else{
  const step=st+':'+(st==='review'?nextSample():st==='rules'?(ui.saved??count())+':'+(ui.saved!==null):s.compared);
  const fresh=step!==lastStep;lastStep=step;
  byId('story').innerHTML=st==='review'?'<div class="story"><p>“'+briefings[0][0]+'”</p><button class="icon-glass" type="button" data-do="replay" aria-label="Play Grace\'s line">'+ic('play')+'</button></div>':'';
  byId('ask').innerHTML=ask();
  byId('obj').innerHTML=screenView();
  const done=(st==='approach'&&s.compared)||(st==='rules'&&ui.saved!==null)||st==='end';
  byId('composer').hidden=done;root.querySelector('#reply .chips').hidden=done;
  byId('compose').innerHTML=compose();byId('opts').innerHTML=tileOptions();byId('after').innerHTML=after();
  const send=byId('send');send.hidden=st!=='rules';send.disabled=ui.busy||ui.pick.includes(null);
  if(fresh)for(const id of ['talk','obj','reply']){const el=byId(id);el.classList.remove('enter');void el.offsetWidth;el.classList.add('enter')}
  if(focusSel)root.querySelector(focusSel)?.focus({preventScroll:true});
  else if(fresh&&focusSel!==false)byId('ask').focus({preventScroll:true});
 }
 if(ui.failedStorage&&!byId('storageAlert'))root.insertAdjacentHTML('beforeend','<p role="alert" id="storageAlert">This browser could not save progress. Keep this tab open.</p>');
}
// The agent's two orbs share its state.
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
function modal(title,body){
 opener=document.activeElement;const d=byId('dialog');
 d.innerHTML='<div class="sheetHead"><h2 class="t-title" id="dialogTitle">'+title+'</h2><button type="button" class="icon-glass" data-do="close" aria-label="Close">'+ic('cross')+'</button></div>'+body;d.setAttribute('aria-labelledby','dialogTitle');d.showModal();
 d.addEventListener('close',()=>opener?.focus(),{once:true});
}
const toggle=(id,on,label,off=false)=>'<label class="toggle"><input type="checkbox" id="'+id+'" '+(on?'checked':'')+(off?' disabled':'')+'><span>'+label+'</span></label>';
const settingsText=()=>toggle('recorded',recordedOn(),'Play recorded voices for Grace and the narrator')+toggle('ambience',soundsOn(),'Play sounds: shop ambience and answer cues')+toggle('voice',s.media.voice,'Read feedback and hints aloud',!supportedSpeech())+'<button type="button" class="btn-glass" data-do="restart">Start again</button>';

function respond(action,n){
 if(ui.busy&&!['settings','close','sheet'].includes(action))return;
 const st=stage();
 switch(action){
 case 'settings':modal('Audio',settingsText());break;
 case 'sheet':s.sheet=true;save();modal('Rule sheet','<div class="obj">'+obj('Rule sheet',sheet(),'Account types')+'</div>');break;
 case 'close':byId('dialog').close();break;
 case 'replay':playVoice([voiceClips.brief[0][0]],briefings[0][0]);break;
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
  if(n!==1){ui.approach=null;paint(false);tell('Changing headings or hiding accounts leaves the original postings unchecked. Try again.','fail');break}
  ui.approach=n;save();
  // The comparison is revealed only once Smart Ledger has finished running it.
  run('working',()=>{s.compared=true;ui.approach=null;paint();tell('Three draft postings differ from the rules.','pass')});break;
 }
 case 'fix':if(st!=='approach'||!s.compared)return;s.agent.fix=true;s.page='mapping';save();paint();break;
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
  // The rule is saved when Smart Ledger finishes its test posting, so the question never jumps ahead mid-run.
  run('building',()=>{if(ok){s.mappings[i]=p;ui.saved=i;save()}paint(false);tell(feedback,ok?'pass':'fail');if(ok)byId('after').querySelector('button')?.focus({preventScroll:true})});break;
 }
 case 'nextRule':if(ui.saved===null)return;ui.saved=null;ui.pick=[null,null];ui.slot=0;paint();break;
 case 'handoff':if(st!=='end')return;if(flowPages.includes(s.page))s.page='sort';save();location.href='index.html';break;
 case 'restart':modal('Start a new attempt?','<p class="t-body">This replaces the saved attempt on this device.</p><button type="button" class="btn-ink" data-do="reset">Start new attempt</button>');break;
 case 'reset':clearTimeout(runTimer);AL.close(true);stopVoice();stopShopSound();s=fresh();s.agent=newAgent();ui={...ui,pick:[null,null],slot:0,busy:false,saved:null,approach:null};save();root.dataset.mode='';paint();break;
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
```

## Routing, actions, persistence and review modal
**Source**: `app/app.js`  
**Actions**: mark, reset, close; all guards and events above
This controller owns the active page, grading events, idempotent corrections and repairs, transient inspector selections, dialogue timers, audio hand-offs (audio.js) and local saving.

```javascript
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
// Feedback and hints: recorded segments when every part of the line is recorded, otherwise the device voice.
function say(line){
 const keys=segmentLine(line);if(!keys)console.debug('[unvoiced]',line);
 if(!s.media.voice)return;
 const clips=recordedOn()&&keys&&keys.map(k=>feedbackClips[k]);
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
function settingsText(){return '<label class="toggle"><input type="checkbox" id="captions" '+(s.media.captions?'checked':'')+'>Show subtitles</label><label class="toggle"><input type="checkbox" id="recorded" '+(recordedOn()?'checked':'')+'>Play recorded voices for Grace and the narrator</label><label class="toggle"><input type="checkbox" id="ambience" '+(soundsOn()?'checked':'')+'>Play sounds: shop ambience, answer cues and music</label><label class="toggle"><input type="checkbox" id="voice" '+(s.media.voice?'checked':'')+(supportedSpeech()?'':' disabled')+'>Read feedback and hints aloud</label><p>Written prompts are available throughout the simulation.</p>'+(s.page==='intro'?details('Read introduction',intro.map(([speaker,line])=>'<p><b>'+speaker+'</b> · '+line+'</p>').join('')):'')}
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
