function actionPage(){
 if(!s.compared)return card('How will you check the draft?',qa(auditOptions,'auditChoice'));
 return card('Posting comparison',table(['Sample','Finding','Expected posting'],samples.map(a=>[a[0],({'S-02':'Sides reversed','S-03':'Customer debt remains open. Sales counted twice.','S-04':'Drawings recorded as an expense.'})[a[0]]||'Matches',accounts[rules[a[5]][1]]+' / '+accounts[rules[a[5]][2]]])))+button('configure','Configure rules →');
}
