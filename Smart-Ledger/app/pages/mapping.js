function mapping(){
 const count=Object.keys(s.mappings).length;
 const configured=rules.flatMap((rule,i)=>s.mappings[i]?[[rule[0],accounts[s.mappings[i][0]],accounts[s.mappings[i][1]]]]:[]);
 const history=configured.length?table(['Transaction','Debit','Credit'],configured):'<p>Your saved postings appear here.</p>';
 const task=count===6?'<h2>Rules complete</h2>'+button('ledger','Open June ledger →'):'<small>Rule '+(count+1)+' of 6</small><h2>'+rules[count][0]+'</h2>'+pair()+button('map','Save rule');
 const last=count?details('Last saved T-account',ta(...s.mappings[count-1],null)+'<p>'+rules[count-1][3]+'</p>'):'';
 return '<p class="lead">Choose the accounts the system should debit and credit.</p><div class="split"><section class="task">'+task+'</section><section class="summary"><h2>Saved rules</h2>'+history+last+'</section></div>';
}
