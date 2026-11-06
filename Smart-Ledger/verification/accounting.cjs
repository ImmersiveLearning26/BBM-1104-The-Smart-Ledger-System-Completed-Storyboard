// From the extracted root: node verification/accounting.cjs
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const context=vm.createContext({assert});
for(const f of ['content.js','engine.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../app/',f),'utf8'),context);
vm.runInContext(`
const s=fresh();
assert.deepEqual(totals(opening),[350000,350000]);
assert.deepEqual(totals(ledger(s)),[465900,480000]);assert.equal(suspense(s),14100);
for(const order of [[0,1],[1,0]]){
 s.posted=[order[0]];assert.equal(suspense(s),order[0]===0?-900:15000);
 s.posted=order;assert.equal(suspense(s),0);assert.deepEqual(totals(ledger(s)),[465000,465000]);
}
rules.forEach((r,i)=>s.mappings[i]=r.slice(1,3));
assert.deepEqual(cases.map((_,i)=>entry(s,i).pass),[true,true,true,true,true,true,true,false,false,false]);
assert.equal(entry(s,9).balanced,true);assert.equal(entry(s,9).d,10);
s.repairs=['F1','F2','F3'];assert(cases.every((_,i)=>entry(s,i).pass));
assert.equal(grade(s).final,0);
for(const [task,n] of [['map',6],['column',11],['difference',1],['type',2],['post',2]])for(let i=0;i<n;i++)record(s,task,i,'correct',true);
s.firstAudit=1;for(let i=0;i<10;i++){s.runs[i]={};record(s,'predict',i,'correct',true)}
for(const f of s.repairs)record(s,'repair',f,'correct',true);
s.marks=[true,true,true];assert.equal(grade(s).final,100);
record(s,'map',0,'repeated attempt',false);assert.equal(grade(s).final,100);
assert.equal([80,90,75,85,80].reduce((n,x,i)=>n+x*[.30,.15,.25,.25,.05][i],0),81.5);
`,context);
console.log('PASS: opening, faulty and corrected monthly totals, either correction order, three seeded faults, scoring endpoints, first-attempt retention and weighted example.');
