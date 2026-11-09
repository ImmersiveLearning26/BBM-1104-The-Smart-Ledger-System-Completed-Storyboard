const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
(async()=>{
const dir=path.resolve(__dirname,'..'),b=await chromium.launch({headless:true, ...(process.env.LEDGER_BROWSER ? {executablePath:process.env.LEDGER_BROWSER,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--no-zygote']} : {})});
try{
const output=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'ledger-qa-'));
const p=await b.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});const faults=[],unvoiced=[];p.on('pageerror',e=>faults.push(String(e)));p.on('console',m=>{if(m.text().startsWith('[unvoiced]'))unvoiced.push(m.text())});
const click=async(id,v)=>p.locator('[data-do="'+id+'"]'+(v===undefined?'':'[data-val="'+v+'"]')).click();
const shot=async(id)=>{await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(process.env.LEDGER_SCREEN_DIR||output,id+'.png')})};
const set=async(id,v)=>p.selectOption('#'+id,String(v));
const get=async(k)=>p.evaluate(k=>JSON.parse(localStorage.getItem('bbm1104-smart-ledger-v1'))?.[k],k);
const pair=async(d,c)=>{await set('dr',d);await set('cr',c)};
await p.goto('file://'+dir+'/app/index.html');await shot('P00-opening');await p.locator('[data-do=enterCover]').waitFor();await shot('P00b-motion-cover');assert(await p.locator('video').evaluate(v=>v.paused));await click('enterCover');await p.locator('#identity').waitFor();await shot('P01-identity');await p.fill('#name','Alex');await p.locator('form button').click();await shot('P02-introduction');await click('skip');await shot('P03-title');await click('start');
assert(await p.locator('[data-do="auditNext"]').isDisabled());await click('sheet');await shot('D01-rule-sheet');await click('close');
for(let i=0;i<5;i++){await p.locator('.sampleRow[data-val="'+i+'"]').click();if(i===2)await shot('P04-audit');}await click('auditNext');await shot('P05-audit-action');await click('auditChoice',0);await click('auditChoice',1);await shot('P06-comparison');await click('configure');
await click('map');assert.equal(Object.keys(await get('mappings')).length,0);await pair(6,0);await click('map');
const rules=[[0,6],[0,8],[2,5],[9,1],[1,4],[7,0]];
for(let i=0;i<rules.length;i++){if(i===2)await shot('P07-rules');await pair(...rules[i]);await click('map')}
await click('ledger');await click('column',1);await click('column',0);await p.reload();assert.equal(Object.keys(await get('columns')).length,1);
await click('book');await shot('D02-ledger-book');await click('close');
for(let i=1;i<11;i++){if(i===4)await shot('P08-trial-balance');await click('column',[5,6,8].includes(i)?1:0)}
await click('readDifference');await shot('P09-difference');await p.fill('#amount','14,100');await set('side',0);await click('difference');
for(let i=0;i<3;i++)await click('evidence',i);await shot('P10-evidence');await click('type',3);await click('type',0);await click('type',1);await click('correction');
const before=await p.evaluate(()=>JSON.stringify(s));await click('post',0);assert.match(await p.locator('.metrics').textContent(),/Credit KSh 900/);await click('pickError',1);await click('post',1);assert.match(await p.locator('.metrics').textContent(),/Nil/);
await p.evaluate(v=>localStorage.setItem('bbm1104-smart-ledger-v1',v),before);await p.reload();await click('pickError',1);await click('post',0);assert.equal((await get('posted')).length,0);await click('post',1);assert.match(await p.locator('.metrics').textContent(),/Debit KSh 15,000/);await shot('P11-corrections');await click('pickError',0);await click('post',0);await shot('P11b-ledger-cleared');await click('console');
assert(await p.locator('[data-do="regression"]').isDisabled());await shot('P12-test-bank');await click('predict');assert.equal(Object.keys(await get('runs')).length,0);
for(const [i,d,c] of [[0,0,8],[3,1,9],[7,5,1],[9,3,0]]){
 await set('casePick',i);await pair(d,c);await click('predict');
 if(i===7||i===9){if(i===9)await shot('P13-balanced-mismatch');await set('repairPick',i===7?2:0);await click('repair');await set('repairPick',i===7?0:2);await click('repair')}
}
await click('regression');await shot('P14a-regression-ready');await click('runAll');assert.equal((await get('report')).filter(v=>v.pass).length,9);await shot('P14-regression-fail');await click('investigate',8);await pair(10,0);await click('predict');await set('repairPick',1);await click('repair');await click('regression');await click('runAll');assert((await get('report')).every(v=>v.pass));await shot('P15-regression-pass');await click('confirmReport');
await shot('P16a-handover-choice');await click('summary',1);await click('summary',0);await click('submit');assert.equal(await get('page'),'handover');
await p.fill('#r0','Assets and expenses rise with a debit; income, capital and liabilities increase with a credit.');
await p.fill('#r1','I compared both ledger legs with source transactions, posted corrections through suspense and cleared the difference.');
await p.fill('#r2','A wrong account can still leave equal totals, as T10 showed.');await shot('P16-handover');await click('submit');assert.deepEqual(await get('marks'),[true,true,true]);await p.locator('#recapTitle0').waitFor();assert.equal(await p.locator('.recapSlide.on h1').textContent(),'Trace the difference');await shot('P16b-recap-trace');await click('recapNext');await p.waitForTimeout(400);assert.equal(await p.locator('.recapSlide.on h1').textContent(),'Test beyond the totals');await shot('P16c-recap-test');await click('recapDone');assert.equal(await get('recapDone'),true);await shot('P17-debrief');
await p.getByText('Record a lesson',{exact:true}).click();await set('lesson','Trace a difference before clearing it');await p.fill('#note','Check both legs before clearing suspense.');await click('finish');await shot('P18-completion');await click('facilitator');await shot('D03-rubric-review');await p.uncheck('#mark0');await click('mark');assert.equal(await get('manual'),true);await click('finish');
const dl=p.waitForEvent('download');await click('export');const download=await dl;await download.saveAs(path.join(output,'example-log.json'));await click('restart');await click('close');assert.equal(await get('page'),'finish');await p.reload();assert.equal(await get('page'),'finish');
await p.goto('file://'+dir+'/app/facilitator.html');await p.setInputFiles('#logs',path.join(output,'example-log.json'));await p.getByText('Mean strand scores').waitFor();await shot('F01-cohort');await p.setInputFiles('#logs',path.join(output,'example-log.json'));assert.match(await p.locator('#results').textContent(),/1 unique/);
await p.goto('file://'+dir+'/app/index.html');await click('restart');await click('reset');assert.equal(await get('page'),'cover');await click('enterCover');assert.equal(await get('page'),'identity');await p.setViewportSize({width:390,height:844});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.fill('#name','Alex');await p.locator('form button').click();await click('skip');await click('start');assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
assert.deepEqual(faults,[]);assert.deepEqual(unvoiced,[],'every feedback line is in production/voice-lines.json');console.log('PASS: end-to-end, both correction orders, negative inputs, retries, regression failure and repair, manual marking, cohort import, resume, reset, mobile width, page error and voice-script coverage checks.');
}finally{await b.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
