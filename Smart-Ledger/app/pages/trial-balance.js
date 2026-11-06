function sortPage(){
 const v=ledger(s),i=v.findIndex((_,j)=>!s.columns[j]);
 const placed=v.flatMap((n,j)=>s.columns[j]?[[accounts[j],n>0?money(n):'—',n<0?money(-n):'—']]:[]);
 const t=totals(v.map((n,j)=>s.columns[j]?n:0));placed.push(['Total',money(t[0]),money(t[1])]);
 const action=i===-1?'<h2>Extraction complete</h2>'+button('readDifference','Read the difference →'):'<small>Balance '+(i+1)+' of 11</small><h2>'+accounts[i]+'</h2><div class="amount">'+cash(Math.abs(v[i]))+'</div><div class="sides">'+choice('column','Debit',0)+choice('column','Credit',1)+'</div>';
 return '<p class="lead">Place each balance in the debit or credit column.</p><div class="split"><section class="task">'+action+'</section><section class="summary"><h2>Placed balances</h2>'+table(['Account','Debit','Credit'],placed)+'</section></div>';
}
