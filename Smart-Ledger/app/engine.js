const SAVE='bbm1104-smart-ledger-v1';
const fresh=()=>({v:1,page:'splash',name:'',learner_id:Math.random().toString(36).slice(2,10),simulation_id:'BBM1104-smart-ledger',role:'junior_accounts_systems_assistant',started:null,completed:null,media:{captions:true,voice:false,recorded:true,ambience:true},sheet:false,seen:[],firstAudit:null,compared:false,mappings:{},columns:{},difference:false,inspected:[],types:{},posted:[],selected:0,repairs:[],runs:{},report:null,summary:null,rationale:['','',''],marks:null,manual:false,recapDone:false,lesson:'',note:'',reflection:{},log:[]});
function ledger(s){
 const values=opening.slice();
 journal.forEach(([,amount,dr,cr],i)=>{
   if(i!==5) values[dr]+=i===7?5400:amount;
   values[cr]-=amount;
 });
 if(s.posted.includes(0))values[5]+=15000;
 if(s.posted.includes(1))values[10]-=900;
 return values;
}
const totals=values=>[values.reduce((n,v)=>n+Math.max(v,0),0),values.reduce((n,v)=>n+Math.max(-v,0),0)];
const suspense=s=>14100-(s.posted.includes(0)?15000:0)+(s.posted.includes(1)?900:0);
function entry(s,i){
 const [,amount,dr,cr,,rule,fault]=cases[i];
 let [d,c]=rule===null?[dr,cr]:(s.mappings[rule]||[null,null]);
 let da=amount,ca=amount;
 if(fault&&!s.repairs.includes(fault)){
   if(fault==='F1'){d=null;da=0}
   if(fault==='F2')da=5400;
   if(fault==='F3')d=10;
 }
 return {d,c,da,ca,balanced:da===ca,pass:d===dr&&c===cr&&da===amount&&ca===amount};
}
let onRecord=null; // optional listener (app/audio.js plays answer cues)
function record(s,task,item,choice,correct){s.log.push({time:new Date().toISOString(),task,item,choice,correct});if(onRecord)onRecord(task,correct)}
const first=(s,task,item)=>s.log.find(e=>e.task===task&&e.item===item);
function grade(s){
 const fraction=(task,n)=>Array.from({length:n},(_,i)=>Number(first(s,task,i)?.correct||false)).reduce((a,b)=>a+b,0)/n;
 const tested=Object.keys(s.runs).map(Number);
 const coverage=new Set(tested.map(i=>cases[i][4])).size/4;
 const predicts=tested.filter(i=>first(s,'predict',i)?.correct).length/Math.max(1,tested.length);
 const repairs=['F1','F2','F3'].filter(f=>first(s,'repair',f)?.correct).length/3;
 const raw=[fraction('map',6), (11*fraction('column',11)+fraction('difference',1))/12, (fraction('type',2)+fraction('post',2))/2,
  (s.firstAudit===1?.10:0)+.90*(.4*coverage+.3*predicts+.3*repairs),(s.marks||[]).filter(Boolean).length/3];
 return {strands:raw.map(x=>100*x),final:raw.reduce((v,x,i)=>v+x*[30,15,25,25,5][i],0)};
}
const band=x=>x>=80?'Strong':x>=60?'Developing':'Needs revisit';
// Indicative local assessment; facilitator can review each criterion alongside the original text.
function suggestMarks([r,t,l]){
 const pos=/(asset|expense|drawing).{0,70}debit|debit.{0,70}(asset|expense|drawing)/i;
 const neg=/(liabilit|income|capital|sales).{0,70}credit|credit.{0,70}(liabilit|income|capital|sales)/i;
 return [pos.test(r)&&neg.test(r),/suspense/i.test(t)&&/trac|compar|investigat|reconcil|source/i.test(t)&&/correct|clear|repair|adjust/i.test(t),
 /wrong account|double.count|omission|omitted|revers|misclassif|incorrect entry|cannot prove|does not prove|doesn.t prove|not proof/i.test(l)];
}
