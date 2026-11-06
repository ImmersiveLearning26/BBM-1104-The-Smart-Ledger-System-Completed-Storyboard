const reports=new Map(),result=document.querySelector('#results');
const strandNames=['Posting rules','Trial balance','Error correction','Testing','Reasoning'];
const pretty={audit:'Audit action',map:'Posting rule',column:'Trial balance column',difference:'Difference',type:'Diagnosis',post:'Correction',predict:'Prediction',repair:'Repair',summary:'Handover'};
function appendTable(title,head,rows){
 const panel=document.createElement('section');panel.className='card';
 const h=document.createElement('h2');h.textContent=title;panel.append(h);
 const wrap=document.createElement('div');wrap.className='tablewrap';panel.append(wrap);
 const t=document.createElement('table');wrap.append(t);
 [head,...rows].forEach((row,i)=>{const tr=t.insertRow();row.forEach(value=>{const cell=document.createElement(i?'td':'th');cell.textContent=value;tr.append(cell)})});result.append(panel);
}
document.querySelector('#logs').onchange=async e=>{
 let rejected=0;for(const file of e.target.files){
  try{const r=JSON.parse(await file.text());if(r.simulation_id!=='BBM1104-smart-ledger'||!r.completed||!r.learner_id||!Array.isArray(r.log)||r.score?.strands?.length!==5||!r.score.strands.every(x=>Number.isFinite(x)&&x>=0&&x<=100))throw Error();
   reports.set(r.learner_id,r);
  }catch{rejected++}
 }
 const list=[...reports.values()];result.replaceChildren();const p=document.createElement('p');p.textContent=list.length+' unique completed attempts. '+list.filter(r=>r.reasoning_status!=='reviewed').length+' indicative reasoning marks. '+rejected+' invalid or incomplete files skipped.';result.append(p);
 if(!list.length)return;
 appendTable('Mean strand scores',['Strand','Mean / 100'],strandNames.map((n,i)=>[n,(list.reduce((v,r)=>v+r.score.strands[i],0)/list.length).toFixed(1)]));
 const counts=new Map();const errors={swapped:0,account:0,suspense:0,overclaim:0};
 const pairs=[['Cash','Capital'],['Cash','Sales'],['Inventory','Trade Payables'],['Rent Expense','Bank'],['Bank','Trade Receivables'],['Drawings','Cash']];
 for(const r of list){const seen=new Set();for(const a of r.log){
  if(!Object.hasOwn(pretty,a.task))continue;
  const k=pretty[a.task]+' '+(typeof a.item==='number'?a.item+1:String(a.item)),v=counts.get(k)||[0,0,0];v[0]++;if(!seen.has(k)){seen.add(k);v[1]++;if(a.correct)v[2]++}counts.set(k,v);
  if(a.correct)continue;
  if(a.task==='map'){const pair=pairs[a.item];if(pair&&Array.isArray(a.choice)&&a.choice[0]===pair[1]&&a.choice[1]===pair[0])errors.swapped++;else errors.account++}
  if(a.task==='post'&&String(a.choice).includes('14,100'))errors.suspense++;
  if(a.task==='summary'&&String(a.choice).startsWith('Equal trial balance'))errors.overclaim++;
 }}
 appendTable('Recorded error patterns',['Pattern','Attempts'],[['Swapped debit and credit',errors.swapped],['Wrong account in a posting rule',errors.account],['Writing off the unexplained difference',errors.suspense],['Assuming equal totals prove accuracy',errors.overclaim]]);
 appendTable('Item-level attempts',['Item','All attempts','First attempts correct'],[...counts].map(([k,[a,b,c]])=>[k,a,c+' / '+b]));
};
