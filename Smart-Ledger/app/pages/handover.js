const rationalePrompts=['How does account type determine the debit and credit?','How did you trace and clear the trial balance difference?','What can equal totals still conceal?'];
const field=(id,label,value)=>'<label>'+escapeHTML(label)+'<textarea id="'+id+'" data-save="'+id+'" maxlength="2500">'+escapeHTML(value)+'</textarea></label>';
function handover(){
 return '<p class="lead">“If the trial balance balances, can I trust everything in the books?” <span>— Grace Achieng</span></p>'+card('Choose your summary',s.summary===0?'<p>'+handovers[0]+'</p>':qa(handovers,'summary'))+(s.summary===0?card('Explain your reasoning',rationalePrompts.map((p,i)=>field('r'+i,p,s.rationale[i])).join('')+button('submit','Submit handover →')):'');
}
