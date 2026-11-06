function audit(){
 const i=ui.sample,a=samples[i];
 const labels=['Cash sale','Rent paid by bank','Customer payment','Owner withdrawal','Stock bought on credit'];
 const rows=samples.map((v,j)=>'<button class="sampleRow '+(i===j?'selected':'')+'" data-do="sample" data-val="'+j+'" aria-pressed="'+(i===j)+'"><span>'+v[0]+'</span><b>'+labels[j]+'</b><span>'+money(v[2])+'</span><small aria-label="'+(s.seen.includes(j)?'Reviewed':'Unreviewed')+'">'+(s.seen.includes(j)?'✓':'')+'</small></button>').join('');
 const next=samples.findIndex((_,j)=>!s.seen.includes(j));
 const detail=a?'<small>'+a[0]+'</small><h2>'+labels[i]+'</h2><div class="amount">'+cash(a[2])+'</div>'+(i===2?'<p>Payment for an earlier credit sale.</p>':'')+table(['Side','Account'],[['Debit',accounts[a[3]]],['Credit',accounts[a[4]]]]):'<h2>Inspect a posting</h2><p>Select a draft entry to see the accounts Smart Ledger used.</p>';
 return '<div class="split"><section><div class="subhead"><h2>Draft entries</h2><span>'+s.seen.length+' of 5 reviewed</span></div><div class="register">'+rows+'</div></section><section class="summary">'+detail+(next!==-1&&a?choice('sample','Next entry →',next,false,'primary continueSample'):'')+(next===-1&&!s.sheet?'<p>Open the rule sheet to continue.</p>':'')+'</section></div><div class="actions">'+button('auditNext','Choose audit action →',!s.sheet||next!==-1)+'</div>';
}
