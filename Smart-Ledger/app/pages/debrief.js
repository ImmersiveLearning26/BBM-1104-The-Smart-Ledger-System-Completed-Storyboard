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
