// Agent-led flow (prototype): app/agent.html, the opening through the six posting rules.
// Run with the same Playwright setup as browser.cjs. Optional argument: extracted app directory.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path');
const app=path.resolve(process.argv[2]||path.join(__dirname,'../app'));
const url='file://'+app+'/agent.html';
(async()=>{
const b=await chromium.launch({headless:true,...(process.env.LEDGER_BROWSER?{executablePath:process.env.LEDGER_BROWSER}:{})});
const faults=[],unvoiced=[];
const watch=(p,tag)=>{p.on('pageerror',e=>faults.push(tag+': '+e));p.on('console',m=>{if(m.text().startsWith('[unvoiced]'))unvoiced.push(m.text())})};
const st=p=>p.evaluate(()=>({scene:s.agent.scene,page:s.page,seen:s.seen.length,sheet:s.sheet,first:s.firstAudit,compared:s.compared,maps:Object.keys(s.mappings).length,name:s.name}));
const acct=(p,name)=>p.locator('.chip',{hasText:new RegExp('^'+name+'$')}).click();
const setRule=async(p,dr,cr)=>{await p.locator('[data-do=slot][data-val="0"]').click();await acct(p,dr);await p.locator('[data-do=slot][data-val="1"]').click();await acct(p,cr);await p.locator('[data-do=run]').click()};
const opening=async(p,name='Alex')=>{
 await p.goto(url);await p.evaluate(()=>localStorage.clear());await p.reload();
 await p.locator('[data-do=begin]').click();await p.locator('[data-do=next]').click();
 assert.match(await p.locator('.scene .win').textContent(),/Trial balance.*Does not balance/);
 assert.match(await p.locator('.cap').textContent(),/trial balance does not balance/);
 await p.locator('[data-do=next]').click();await p.fill('#name',name);await p.locator('#join button').click();
};

// 1. Full path at laptop width, with one wrong answer at each scored step
let p=await b.newPage({viewport:{width:1280,height:800}});watch(p,'laptop');
await p.goto(url);await p.evaluate(()=>localStorage.clear());await p.reload();
assert.equal(await p.locator('h1').textContent(),'Month-endat Zuri.');
assert.equal(await p.locator('.sceneBg').count(),1);
await p.locator('[data-do=begin]').click();
assert.match(await p.locator('.cap').textContent(),/Welcome to Zuri Home Supplies/);
assert.equal(await p.evaluate(()=>voiceEl.src.split('/').pop()),'intro-0.mp3');
await p.locator('[data-do=next]').click();
assert.equal(await p.evaluate(()=>voiceEl.src.split('/').pop()),'intro-1.mp3');
assert.equal(await p.evaluate(()=>document.querySelector('.sceneBg').isConnected&&!!document.querySelector('.scene .win')),true,'her screen appears over the same scene');
await p.locator('[data-do=next]').click();
await p.locator('#join button').click();assert.equal((await st(p)).scene,3,'a name is required');
await p.fill('#name','Alex');await p.locator('#join button').click();
let x=await st(p);assert.deepEqual([x.scene,x.page,x.name],[4,'audit','Alex']);
assert.equal(await p.evaluate(()=>voiceEl.src.split('/').pop()),'brief-0-grace.mp3');
assert.equal(await p.evaluate(()=>ambienceEl.paused),true,'shop sound stops in the workspace');
// Review: one posting at a time, no expected posting exposed
assert.match(await p.locator('#screen').textContent(),/S-01 · 1 of 5.*Cash sale/);
for(const wrong of [0,1,1,0,0]){
 assert.doesNotMatch(await p.locator('#screen').textContent(),/Trade Receivables|Drawings|Rule sheet/,'expected posting stays hidden during review');
 await p.locator('[data-do=flag][data-val="'+wrong+'"]').click();
}
x=await st(p);assert.deepEqual([x.seen,x.sheet,x.page],[5,true,'action']);
assert.match(await p.locator('#trail').textContent(),/5 reviewed · 2 flagged/);
assert.match(await p.locator('#screen').textContent(),/Account type.*Increases with/);
// Approach: wrong, then right; Smart Ledger runs the comparison and reveals it
await p.locator('[data-do=approach][data-val="0"]').click();
assert.match(await p.locator('#note').textContent(),/leaves the original postings unchecked/);
assert.equal((await st(p)).compared,false);
await p.locator('[data-do=approach][data-val="1"]').click();
assert.equal(await p.locator('.runSteps').count(),1,'the run is visible');
await p.locator('[data-do=fix]').waitFor();
assert.equal(await p.locator('#note').textContent(),'Three draft postings differ from the rules.');
assert.match(await p.locator('#screen').textContent(),/S-03.*Bank \/ Trade Receivables.*Sales counted twice/);
assert.match(await p.locator('#talk').textContent(),/You flagged 2 of the 3/);
assert.equal(await p.locator('.cmp li.bad').count(),3);
x=await st(p);assert.deepEqual([x.first,x.compared],[0,true]);
await p.locator('[data-do=fix]').click();
// Rule 1: swapped, wrong account twice (hint), then right
assert.match(await p.locator('#talk').textContent(),/Rule 1 of 6.*Owner invests cash/);
assert.equal(await p.locator('[data-do=run]').isDisabled(),true);
await acct(p,'Capital');assert.equal(await p.locator('[data-do=run]').isDisabled(),true,'needs both accounts');
await acct(p,'Cash');
assert.match(await p.locator('.rulesT .cur').textContent(),/Owner invests cash.*Capital.*Cash/);
await p.locator('[data-do=run]').click();
await p.locator('#note').waitFor();
assert.match(await p.locator('#note').textContent(),/^Sides swapped/);
assert.equal((await st(p)).maps,0);
await setRule(p,'Bank','Capital');await p.locator('#note.warn').waitFor();
assert.match(await p.locator('#note').textContent(),/Check the debit account \(asset\)\. Hint: Cash comes into the shop/);
await setRule(p,'Cash','Capital');await p.locator('[data-do=nextRule]').waitFor();
assert.match(await p.locator('#note').textContent(),/^Saved\. Cash comes into the shop/);
assert.match(await p.locator('.testPost').textContent(),/Test posting · Owner invests cash · KSh 50,000.*Balanced/);
assert.equal(await p.locator('.chip').count(),0,'picker closes once the rule is saved');
// Reload mid-flow resumes on the next rule
await p.reload();assert.match(await p.locator('#talk').textContent(),/Rule 2 of 6.*Cash sale/);
// Keyboard: pick both accounts and run without the mouse
await p.locator('.chip',{hasText:/^Cash$/}).focus();await p.keyboard.press('Enter');
await p.locator('.chip',{hasText:/^Sales$/}).focus();await p.keyboard.press('Enter');
assert.equal(await p.evaluate(()=>document.activeElement.dataset.do),'run','focus lands on Run it');
await p.keyboard.press('Enter');await p.locator('[data-do=nextRule]').waitFor();await p.locator('[data-do=nextRule]').click();
for(const [dr,cr] of [['Inventory','Trade Payables'],['Rent Expense','Bank'],['Bank','Trade Receivables'],['Drawings','Cash']]){
 await setRule(p,dr,cr);await p.locator('[data-do=nextRule]').waitFor();await p.locator('[data-do=nextRule]').click();
}
x=await st(p);assert.equal(x.maps,6);
assert.match(await p.locator('#talk').textContent(),/All six rules are saved/);
assert.equal(await p.locator('.rulesT tbody tr').count(),6);
// Scoring is the classic engine's: 5 of 6 rules right first time, audit approach wrong first time
const g=await p.evaluate(()=>({pr:grade(s).strands[0],first:s.log.filter(e=>e.task==='map').length,tasks:[...new Set(s.log.map(e=>e.task))]}));
assert.equal(Math.round(g.pr*100)/100,83.33);assert.equal(g.first,8);assert.deepEqual(g.tasks,['flag','audit','map','hint']);
// Hand-off: the same attempt continues in the classic build at the June ledger
await p.locator('[data-do=handoff]').click();await p.waitForURL(/index\.html$/);
assert.equal(await p.locator('h1').textContent(),'Extract the trial balance');
assert.equal(await p.evaluate(()=>Object.keys(s.mappings).length),6);
// Coming back to the agent view after that shows the end, not the opening
await p.goto(url);assert.match(await p.locator('#talk').textContent(),/The prototype ends here/);
await p.locator('[data-do=restart]').first().click();await p.locator('[data-do=reset]').click();
assert.equal(await p.locator('h1').textContent(),'Month-endat Zuri.');assert.equal((await st(p)).maps,0);
await p.close();

// 2. Phone width: single column, no sideways scroll, screen sits between the prompt and the reply
p=await b.newPage({viewport:{width:390,height:844}});watch(p,'phone');await opening(p);
for(let i=0;i<5;i++)await p.locator('[data-do=flag][data-val="1"]').click();
await p.locator('[data-do=approach][data-val="1"]').click();await p.locator('[data-do=fix]').click();
for(const sel of ['#talk','#screen','#reply'])assert((await p.locator(sel).boundingBox()).width<=390);
assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),390);
const order=await p.evaluate(()=>['talk','screen','reply'].map(id=>document.getElementById(id).getBoundingClientRect().top));
assert(order[0]<order[1]&&order[1]<order[2],'prompt, screen, reply in order');
for(const el of await p.locator('#reply button').all())assert((await el.boundingBox()).height>=44,'touch targets');
await p.close();

// 3. Reduced motion: no video autoplay, runs are instant
const ctx=await b.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});p=await ctx.newPage();watch(p,'reduced');await opening(p);
for(let i=0;i<5;i++)await p.locator('[data-do=flag][data-val="0"]').click();
await p.locator('[data-do=approach][data-val="1"]').click();
assert.equal(await p.locator('[data-do=fix]').count(),1,'no wait with reduced motion');assert.equal(await p.locator('.runSteps').count(),0);
assert.equal((await st(p)).first,1);
await ctx.close();

// 4. Media blocked: the flow still works end to end
p=await b.newPage({viewport:{width:1280,height:800}});watch(p,'blocked');await p.route(/assets\/(audio|video)\//,r=>r.abort());await opening(p);
for(let i=0;i<5;i++)await p.locator('[data-do=flag][data-val="0"]').click();
await p.locator('[data-do=approach][data-val="1"]').click();await p.locator('[data-do=fix]').click();
await setRule(p,'Cash','Capital');await p.locator('[data-do=nextRule]').waitFor();assert.equal((await st(p)).maps,1);
await p.close();

assert.deepEqual(faults,[]);assert.deepEqual(unvoiced,[],'every feedback line is in production/voice-lines.json');
console.log('PASS: agent flow opening, her screen in scene, name gate, hidden expected postings, flags, audit retry, visible run, comparison, rule picker, swapped/hint/saved feedback, test posting, reload, keyboard, six rules, classic scoring, hand-off to classic, end state, restart, 390px, reduced motion, blocked media.');
await b.close();})().catch(e=>{console.error(e);process.exit(1)});
