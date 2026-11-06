function regression(){
 return '<p class="lead">Run the complete bank against the current posting rules and routines.</p>'+button('runAll',s.report?'Run all ten again':'Run all ten cases')+(s.report?card('Regression report',reportTable())+(s.report.every(a=>a.pass)?button('confirmReport','Confirm report & hand over →'): '<div class="tools">'+s.report.map((a,i)=>a.pass?'':choice('investigate','Investigate T'+(i+1),i)).join('')+'</div>'):'')+choice('backTest','Back to test console');
}
