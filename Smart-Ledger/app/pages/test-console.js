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
