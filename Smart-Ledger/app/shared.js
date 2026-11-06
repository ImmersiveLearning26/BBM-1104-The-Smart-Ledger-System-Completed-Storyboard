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
