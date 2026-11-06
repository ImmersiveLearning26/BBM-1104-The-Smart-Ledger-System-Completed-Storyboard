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
