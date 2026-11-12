// Agent-led flow (app/agent.html): the opening through the six posting rules, built on the agent library.
// Checks behaviour, scoring, the library's rules (no progress furniture, one feedback channel, layout never moves
// while the agent works) and the 4 px grid at each step. Run with the same Playwright setup as browser.cjs.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path');
const {audit}=require('./grid-audit.cjs');
const app=path.resolve(process.argv[2]||path.join(__dirname,'../app'));
const url='file://'+app+'/agent.html';
(async()=>{
const b=await chromium.launch({headless:true,...(process.env.LEDGER_BROWSER?{executablePath:process.env.LEDGER_BROWSER}:{})});
const faults=[],unvoiced=[];
const watch=(p,tag)=>{p.on('pageerror',e=>faults.push(tag+': '+e));p.on('console',m=>{if(m.text().startsWith('[unvoiced]'))unvoiced.push(m.text())})};
const st=p=>p.evaluate(()=>({scene:s.agent.scene,page:s.page,seen:s.seen.length,sheet:s.sheet,first:s.firstAudit,compared:s.compared,maps:Object.keys(s.mappings).length,name:s.name}));
// Measure once entrance animations have settled (looping ones, like the glow, are left running).
const settle=p=>p.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));
const onGrid=async(p,where)=>{await settle(p);const r=await p.evaluate(audit);assert.deepEqual(r.bad,[],'off the grid at '+where)};
// The one feedback channel: wait for the pop-up, read it, close it.
const result=async p=>{const el=p.locator('.result');await el.waitFor();const text=await el.textContent();await p.evaluate(()=>AL.close(true));return text};
const askText=p=>p.locator('#ask').textContent().then(t=>t.replace(/^Smart Ledger: /,''));
const tile=(p,name)=>p.locator('#opts .tile',{hasText:new RegExp('^'+name+'$')});
async function setRule(p,dr,cr){
 if(await p.locator('[data-do=slot]').count())await p.locator('[data-do=slot][data-val="0"]').click();
 await tile(p,dr).click();await p.locator('[data-do=slot][data-val="1"]').click();await tile(p,cr).click();
 await p.locator('#send').click();return result(p);
}
async function opening(p,name='Alex'){
 await p.goto(url);await p.evaluate(()=>localStorage.clear());await p.reload();
 await p.locator('[data-do=begin]').click();await p.locator('[data-do=next]').click();await p.locator('[data-do=next]').click();
 await p.fill('#name',name);await p.locator('#join .send').click();
}
const toApproach=async(p,calls=[0,1,1,0,0])=>{for(const v of calls)await p.locator('[data-do=flag][data-val="'+v+'"]').click()};

// 1. Full path at laptop width, with one wrong answer at each scored step
let p=await b.newPage({viewport:{width:1280,height:800}});watch(p,'laptop');
await p.goto(url);await p.evaluate(()=>localStorage.clear());await p.reload();
assert.equal(await p.locator('h1').textContent(),'Month-endat Zuri.');
assert.equal(await p.locator('.sceneBg').count(),1);
await onGrid(p,'opening');
await p.locator('[data-do=begin]').click();
assert.match(await p.locator('.cap').textContent(),/Welcome to Zuri Home Supplies/);
assert.equal(await p.evaluate(()=>voiceEl.src.split('/').pop()),'intro-0.mp3');
await p.locator('[data-do=next]').click();
assert.equal(await p.evaluate(()=>voiceEl.src.split('/').pop()),'intro-1.mp3');
assert.match(await p.locator('.scene .obj').textContent(),/Trial balance\s*Does not balance/);
assert.match(await p.locator('.cap').textContent(),/trial balance does not balance/);
await onGrid(p,'opening: her screen');
await p.locator('[data-do=next]').click();
await p.locator('#join .send').click();assert.equal((await st(p)).scene,3,'a name is required');
await p.fill('#name','Alex');await p.locator('#join .send').click();
let x=await st(p);assert.deepEqual([x.scene,x.page,x.name],[4,'audit','Alex']);
assert.equal(await p.evaluate(()=>voiceEl.src.split('/').pop()),'brief-0-grace.mp3');
assert.equal(await p.evaluate(()=>ambienceEl.paused),true,'shop sound stops in the workspace');
// Library rules: no logo mark, no progress furniture, the orb is the agent
assert.equal(await p.locator('.brand,.prog,#trail,.runSteps,.note,.dots,.hdr,dialog').count(),0,'no logo, header, progress bar, trail, checklist, inline notes or centred dialogs');
assert.equal(await p.locator('#agentOrb canvas').count(),1);
const furniture=/\b\d+ of \d+\b|Rule \d|reviewed|flagged|more to set/i;
// Review: one posting at a time, the expected posting stays hidden
assert.match(await p.locator('#obj').textContent(),/S-01.*Cash sale.*KSh 20,000.*Cash.*Sales/);
assert.equal(await p.locator('.portrait video').count(),1,'Grace fills her side of the screen');
assert.match(await p.locator('.msg.grace').textContent(),/Some of these look wrong to me/);
assert.equal(await p.locator('#composer.attn').count(),1,'the input box glows while it waits');
// Settings are icons that open in place
const ib=p.locator('.ibtn[data-do=recorded]');await ib.hover();await p.waitForTimeout(450);assert((await ib.boundingBox()).width>100,'hover opens the label');
await ib.click();assert.equal(await p.evaluate(()=>s.media.recorded),false);assert.equal(await ib.getAttribute('aria-pressed'),'false');await ib.click();assert.equal(await p.evaluate(()=>s.media.recorded),true);
// The rule sheet arrives as a card in the chat, and leaves when asked
await p.locator('[data-do=sheet]').click();assert.match(await p.locator('.sheetMsg').textContent(),/Rule sheet.*Assets.*Debit/);assert.equal(await p.locator('[data-do=sheet]').getAttribute('aria-pressed'),'true');
await p.locator('[data-do=sheet]').click();assert.equal(await p.locator('.sheetMsg').count(),0);
await onGrid(p,'review');
for(const call of [0,1,1,0,0]){
 assert.doesNotMatch(await p.locator('#obj').textContent(),/Trade Receivables|Rule sheet/,'expected posting stays hidden during review');
 assert.doesNotMatch(await p.locator('body').innerText(),furniture);
 await p.locator('[data-do=flag][data-val="'+call+'"]').click();
}
x=await st(p);assert.deepEqual([x.seen,x.sheet,x.page],[5,true,'action']);
assert.match(await p.locator('#obj').textContent(),/Rule sheet.*Assets.*Debit/);
// Approach: wrong, then right; Smart Ledger runs it before revealing
await p.locator('[data-do=approach][data-val="0"]').click();
assert.match(await result(p),/leaves the original postings unchecked/);
assert.equal((await st(p)).compared,false);
await p.locator('[data-do=approach][data-val="1"]').click();
assert.equal(await p.locator('#composer.working').count(),1,'the agent visibly works');
assert.match(await p.locator('#obj').textContent(),/Rule sheet/,'nothing is revealed before the run ends');
assert.equal(await p.locator('#opts .tile:disabled').count(),3);
assert.equal(await result(p),'Three draft postings differ from the rules.');
assert.equal(await p.locator('#obj .row.open').count(),3);
assert.match(await p.locator('#obj').textContent(),/S-03.*Bank \/ Trade Receivables.*Sales counted twice/);
x=await st(p);assert.deepEqual([x.first,x.compared],[0,true]);
await onGrid(p,'comparison');
await p.locator('[data-do=fix]').click();
// Rule 1: swapped, wrong account twice (hint), then right
assert.match(await askText(p),/^Owner invests cash\. Which account do I debit/);
assert.equal(await p.locator('#send').isDisabled(),true);
await tile(p,'Capital').click();assert.equal(await p.locator('#send').isDisabled(),true,'needs both accounts');
await tile(p,'Cash').click();
assert.equal(await p.evaluate(()=>document.activeElement.id),'send','focus lands on send');
assert.equal(await p.locator('#send.attn').count(),1,'the glow moves to send once it is ready');assert.equal(await p.locator('#composer.attn').count(),0);
assert.match(await p.locator('#obj .row.now').textContent(),/Owner invests cash\s*Capital · Cash/);
await onGrid(p,'rule picker');
const boxes=()=>p.evaluate(()=>['portrait','thread','reply','composer'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(Math.round).join()}));
const before=await boxes();
await p.locator('#send').click();
assert.equal(await p.locator('#send.running').count(),1,'the glow orbits the send button');
assert.equal(await p.evaluate(()=>document.getElementById('agentOrb').dataset.state),'building');
assert.match(await askText(p),/^Owner invests cash/,'the question stays on this rule while the agent works');
assert.equal(await p.evaluate(()=>getComputedStyle(document.getElementById('pillWave')).display),'block');
const pill=await p.locator('.pill').boundingBox(),send=await p.locator('#send').boundingBox();
assert(send.x+send.width<=pill.x+pill.width+.5,'send stays inside the pill while the wave runs');
assert.deepEqual(await boxes(),before,'nothing moves while the agent works');
assert.match(await result(p),/^Sides swapped/);
assert.equal((await st(p)).maps,0);
assert.match(await setRule(p,'Bank','Capital'),/Check the debit account \(asset\)\. Hint: Cash comes into the shop/);
assert.match(await setRule(p,'Cash','Capital'),/^Saved\. Cash comes into the shop/);
assert.match(await p.locator('#obj .t').textContent(),/Debit\s*Cash\s*50,000\s*Credit\s*Capital\s*50,000/);
assert.equal(await p.locator('#composer').isHidden(),true,'the picker closes once the rule is saved');
assert.equal(await p.locator('[data-do=nextRule].attn').count(),1,'the next action glows');
assert.match(await p.locator('.msg.me').last().textContent(),/Debit Cash · Credit Capital/,'the answer joins the chat');
await onGrid(p,'saved rule with T-account');
await p.locator('[data-do=nextRule]').click();
// Reload mid-flow resumes on the next rule
await p.reload();assert.match(await askText(p),/^Cash sale\./);
// Keyboard: pick both accounts and run without the mouse
await tile(p,'Cash').focus();await p.keyboard.press('Enter');
await tile(p,'Sales').focus();await p.keyboard.press('Enter');
assert.equal(await p.evaluate(()=>document.activeElement.id),'send');
await p.keyboard.press('Enter');assert.match(await result(p),/^Saved/);
assert.equal(await p.evaluate(()=>document.activeElement.dataset.do),'nextRule','focus moves to Next rule');
await p.keyboard.press('Enter');
for(const [dr,cr] of [['Inventory','Trade Payables'],['Rent Expense','Bank'],['Bank','Trade Receivables'],['Drawings','Cash']]){
 assert.match(await setRule(p,dr,cr),/^Saved/);await p.locator('[data-do=nextRule]').click();
}
x=await st(p);assert.equal(x.maps,6);
// Scoring is the classic engine's: 5 of 6 rules right first time, audit approach wrong first time
let g=await p.evaluate(()=>({pr:grade(s).strands[0],tries:s.log.filter(e=>e.task==='map').length,tasks:[...new Set(s.log.map(e=>e.task))]}));
assert.equal(Math.round(g.pr*100)/100,83.33);assert.equal(g.tries,8);assert.deepEqual(g.tasks,['flag','audit','map','hint']);
const doo=(a,v)=>p.locator('[data-do='+a+']'+(v===undefined?'':'[data-val="'+v+'"]')).first().click();
// ---- Trial balance: finished chapters collapse to one line each ----
assert.equal((await st(p)).page,'sort');
assert.match(await p.locator('.msg.grace').textContent(),/will not let me close the month/);
assert.deepEqual(await p.locator('.msg.past .obj.mini').allTextContents(),['Draft postingsThree differ from the rules','Posting rulesSix saved']);
assert.match(await askText(p),/^Cash has a balance of KSh 70,500\. Which column/);
assert.equal(await p.locator('[data-do=book]').count(),1,'the ledger book is on hand');
await doo('book');assert.match(await p.locator('.bookMsg').textContent(),/Ledger book.*Trade Payables/);await doo('book');
await onGrid(p,'trial balance');
const sides=await p.evaluate(()=>ledger(s).map(v=>v>0?0:1));
await doo('column',1-sides[0]);assert.match(await result(p),/^Check the normal balance for Cash \(asset\)\./);
for(let i=0;i<11;i++)await doo('column',sides[i]);
assert.match(await askText(p),/Every balance is placed/);assert.equal(await p.locator('[data-do=readDifference].attn').count(),1);
await doo('readDifference');
// ---- Difference: a typed calculation plus the short side ----
await p.fill('#amount','14,100');await doo('side',1);
assert.equal(await p.inputValue('#amount'),'14,100','picking a side keeps the typed amount');
await doo('send');assert.match(await result(p),/^Subtract the smaller total/);
await doo('side',0);await doo('send');
// ---- Trace and classify ----
assert.equal((await st(p)).page,'trace');assert.match(await askText(p),/Open each one/);
for(const i of [0,1,2])await doo('evidence',i);
assert.match(await p.locator('#obj').textContent(),/Supplier payment from bank/);
await doo('type',2);assert.match(await result(p),/^Compare the source amount/);
await doo('type',0);assert.match(await result(p),/Trade Payables is missing its KSh 15,000 debit/);
await doo('type',1);assert.match(await result(p),/divides by nine/);
await onGrid(p,'trace');await doo('correction');
// ---- Corrections: the payoff is the corrected trial balance ----
await doo('post',1);assert.match(await result(p),/^Preview: suspense would be/);
await doo('post',0);assert.match(await result(p),/^Posted\. Suspense balance: Credit KSh 900\./);
await doo('post',1);assert.match(await result(p),/^Posted\. Suspense balance: Nil\./);
assert.match(await askText(p),/Suspense is clear, and both columns agree/);
assert.match(await p.locator('#obj').textContent(),/Corrected June trial balance.*Total\s*465,000\s*465,000/);
await onGrid(p,'corrected trial balance');
await doo('console');
// ---- Tests: pick, predict, run, repair ----
assert.match(await p.locator('.msg.grace').textContent(),/How do I know the system will not make the same mistakes/);
assert.equal(await p.locator('[data-do=regression]').count(),0,'all ten cannot run before every kind is covered');
const predict=async i=>{await doo('case',i);const [d,c]=await p.evaluate(i=>[accounts[cases[i][2]],accounts[cases[i][3]]],i);return setRule(p,d,c)};
assert.match(await predict(0),/The system posted correctly/);assert.match(await predict(3),/The system posted correctly/);
assert.match(await predict(7),/unequal amounts/);assert.match(await p.locator('#obj').textContent(),/Missing entry ⚠/);
await onGrid(p,'failing test');
await doo('repair',3);assert.match(await result(p),/^That change would leave/);
await doo('repair',0);assert.match(await result(p),/^Routine revised/);
await predict(8);await doo('repair',1);await result(p);
assert.match(await predict(9),/The totals agree\. Check which account received the debit\./);await doo('repair',2);await result(p);
assert.equal(await p.locator('[data-do=regression].attn').count(),1,'all ten unlocks once every kind is covered');
await doo('regression');await doo('runAll');assert.equal(await result(p),'All ten cases pass. Confirm the report to unlock handover.');
assert.equal(await p.locator('#obj .row').count(),10);await doo('confirmReport');
// ---- Handover: a summary, then three written answers ----
assert.match(await p.locator('.msg.grace').textContent(),/can I trust everything in the books/);
await doo('summary',1);assert.match(await result(p),/^Recall T10/);await doo('summary',0);assert.equal(await result(p),'Explain the reasoning in your own words.');
assert.equal(await p.locator('#send').isDisabled(),true,'an empty answer cannot be sent');
for(const a of ['Assets, expenses and drawings increase with a debit; liabilities, income and capital increase with a credit.','I compared both ledger legs with source transactions, posted corrections through suspense and cleared the difference.','A wrong account can still leave equal totals, as T10 showed.']){await p.fill('#answer',a);await doo('send')}
// ---- Debrief: score, corrected ledger, report, lesson ----
x=await p.evaluate(()=>({page:s.page,marks:s.marks,recap:s.recapDone}));assert.deepEqual(x,{page:'debrief',marks:[true,true,true],recap:true});
assert.match(await askText(p),/Here is your month-end review/);
assert.match(await p.locator('.thread').textContent(),/Weighted score.*Corrected June ledger.*Regression report/);
await onGrid(p,'debrief');
await doo('lesson',1);assert.equal(await p.evaluate(()=>s.lesson),'Trace a difference before clearing it');
await doo('finish');assert.equal((await st(p)).page,'finish');assert(await p.evaluate(()=>!!s.completed));
assert.match(await p.locator('.msg.grace').textContent(),/Thank you for staying with the numbers/);
g=await p.evaluate(()=>grade(s));assert(g.strands.every(v=>v>=0&&v<=100)&&g.final>0);
const dl=p.waitForEvent('download');await doo('export');assert.match((await dl).suggestedFilename(),/^Smart-Ledger-.+\.json$/);
// The same attempt opens in the detailed review
await doo('classic');await p.waitForURL(/index\.html$/);assert.equal(await p.locator('h1').textContent(),'Month-end review complete');
await p.goto(url);assert.equal((await st(p)).page,'finish');
await p.locator('[data-do=restart]').click();assert.equal((await st(p)).page,'finish','one tap only arms the restart');await p.locator('[data-do=restart]').click();
assert.equal(await p.locator('h1').textContent(),'Month-endat Zuri.');assert.equal((await st(p)).maps,0);
await p.close();

// 2. Phone width: one column (question, Grace's screen, then the reply), no sideways scroll, on the grid
p=await b.newPage({viewport:{width:390,height:844}});watch(p,'phone');await opening(p);
await onGrid(p,'phone review');
await toApproach(p,[1,1,1,1,1]);
await p.locator('[data-do=approach][data-val="1"]').click();await result(p);await p.locator('[data-do=fix]').click();
assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),390);
const order=await p.evaluate(()=>['portrait','thread','reply'].map(id=>document.getElementById(id).getBoundingClientRect().top));
assert(order[0]<order[1]&&order[1]<order[2],'Grace, the chat, then the input box');
for(const el of await p.locator('#reply button:visible').all())assert((await el.boundingBox()).height>=44,'touch targets');
await onGrid(p,'phone rule picker');
// Later stages on the phone, from a saved attempt part-way through
await p.evaluate(()=>{const x=JSON.parse(localStorage.getItem(SAVE));rules.forEach((r,i)=>x.mappings[i]=[r[1],r[2]]);x.page='sort';localStorage.setItem(SAVE,JSON.stringify(x))});
await p.reload();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth),390);await onGrid(p,'phone trial balance');
await p.evaluate(()=>{const x=JSON.parse(localStorage.getItem(SAVE));const v=ledger(x);v.forEach((n,j)=>x.columns[j]=n>0?'Debit':'Credit');Object.assign(x,{difference:true,inspected:[0,1,2],types:{0:0,1:1},posted:[0,1],page:'test',selected:7});x.runs={7:{pred:[5,1],actual:entry(x,7),initial:entry(x,7)}};localStorage.setItem(SAVE,JSON.stringify(x))});
await p.reload();assert.match(await p.locator('#obj').textContent(),/Missing entry/);await onGrid(p,'phone failing test');
await p.close();

// 3. Reduced motion: no video autoplay, runs are instant
const ctx=await b.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});p=await ctx.newPage();watch(p,'reduced');await opening(p);
assert.equal(await p.evaluate(()=>document.querySelector('.sceneBg')?.paused??true),true);
await toApproach(p,[0,0,0,0,0]);
await p.locator('[data-do=approach][data-val="1"]').click();
assert.equal(await p.locator('[data-do=fix]').count(),1,'no wait with reduced motion');
assert.equal((await st(p)).first,1);
await ctx.close();

// 4. Media blocked: the flow still works end to end
p=await b.newPage({viewport:{width:1280,height:800}});watch(p,'blocked');await p.route(/assets\/(audio|video)\//,r=>r.abort());await opening(p);
await toApproach(p,[0,0,0,0,0]);
await p.locator('[data-do=approach][data-val="1"]').click();await result(p);await p.locator('[data-do=fix]').click();
assert.match(await setRule(p,'Cash','Capital'),/^Saved/);assert.equal((await st(p)).maps,1);
await p.close();

assert.deepEqual(faults,[]);assert.deepEqual(unvoiced,[],'every feedback line is in production/voice-lines.json');
console.log('PASS: whole simulation as an agent chat — trial balance, typed difference, trace, corrections to a corrected ledger, tests and repairs, regression, written handover, debrief, finish, export, classic review; portrait, chat history, pinned input, attention glow, icon settings, rule sheet card, opening, her screen in scene, name gate, hidden expected postings, no progress furniture, audit retry, run before reveal, comparison, picker, swapped/hint/saved via the pop-up, glow + building orb + wave with no layout shift, T-account, reload, keyboard, six rules, classic scoring, hand-off, restart, 390px, reduced motion, blocked media, 4 px grid at every step.');
await b.close();})().catch(e=>{console.error(e);process.exit(1)});
