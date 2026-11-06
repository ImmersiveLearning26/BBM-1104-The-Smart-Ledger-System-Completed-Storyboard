function difference(){
 const t=totals(ledger(s));return '<div class="columns">'+card('June trial balance',table(['Column','Total'],[['Debit',cash(t[0])],['Credit',cash(t[1])]]))+card('Which side is short?','<label>Difference in KSh<input id="amount" inputmode="numeric" placeholder="0"></label>'+options('side',['Debit','Credit'],'Short column')+button('difference','Check difference'))+'</div>';
}
