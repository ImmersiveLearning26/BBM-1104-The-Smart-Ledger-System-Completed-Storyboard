// Builds the spoken-line script and the app's audio manifest.
//   node production/build-voice-lines.cjs
// Writes production/voice-lines.json (every line, the text to record, and its file)
// and app/audio-manifest.js (only the files that exist are wired; the rest use the device voice).
// Feedback sentences are built from app/content.js and app/engine.js the same way app/app.js builds them,
// so the script stays in step with the curriculum. Requires ffprobe for clip durations (optional).
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),app=path.join(root,'app');
const ctx=vm.createContext({});
for(const f of ['content.js','engine.js','shared.js'])vm.runInContext(fs.readFileSync(path.join(app,f),'utf8'),ctx);
const {accounts,kinds,rules,briefings,intro,fresh,ledger,balance}=vm.runInContext('({accounts,kinds,rules,briefings,intro,fresh,ledger,balance})',ctx);

const NARRATOR={speaker:'Narrator',voice:'Dr. Omondi (Lecturer)',higgsfield_element:'6d5ab8c1-cae2-4687-b1f1-37824d3f4b23'};
const GRACE={speaker:'Grace',voice:'Joy',higgsfield_element:'9a997ed9-5c54-4963-8dc7-981cfa41e5f1'};
// What the voice actor reads: currency and case codes written out for clean speech.
const article=k=>/^[aeiou]/.test(k)?'an':'a';
const spoken=t=>t
 .replace(/KSh ([\d,]+) (?=[a-z])/g,'$1 shilling ')          // "the KSh 900 difference" -> "the 900 shilling difference"
 .replace(/KSh ([\d,]+)/g,'$1 Kenyan shillings')             // "Debit KSh 15,000." -> "Debit 15,000 Kenyan shillings."
 .replace(/\bKSh\b/g,'shilling')                             // "a whole KSh amount"
 .replace(/\bT10\b/g,'T ten')
 .replace(/ \(([a-z]+)\)\./g,(_,k)=>`, ${article(k)} ${k} account.`);
const slug=t=>t.toLowerCase().replace(/ksh/g,'').replace(/[^a-z0-9]+/g,'-').split('-').filter(Boolean).slice(0,6).join('-');

// Feedback segments. A message is voiced when it splits completely into these (see segmentLine in app/audio.js).
const fb=new Set();
const add=t=>fb.add(t);
add('Three draft postings differ from the rules.');
add('Changing headings or hiding accounts leaves the original postings unchecked. Try again.');
add('Choose both accounts before saving.');add('Saved.');add('Hint:');
rules.forEach(r=>add(r[3]));
add('Sides swapped. Check which balance increases and which falls.');
add('Owner withdrawals are drawings. A personal withdrawal is separate from a business expense.');
for(const k of new Set(rules.map(r=>kinds[r[1]])))add('Check the debit account ('+k+').');
for(const k of new Set(rules.map(r=>kinds[r[2]])))add('Check the credit account ('+k+').');
const v=ledger(fresh());
accounts.forEach((a,i)=>{add(a+' placed in '+(v[i]>0?'Debit':'Credit')+'.');add('Check the normal balance for '+a+' ('+kinds[i]+').')});
add('Enter a whole KSh amount and choose a column.');
add('Subtract the smaller total from the larger and identify the smaller column.');
add('Compare the source amount with both legs of the entry.');
add('The bank credit is present. Trade Payables is missing its KSh 15,000 debit.');
add('The debit was keyed as 5,400 instead of 4,500. The KSh 900 difference divides by nine.');
// Suspense after each accepted journal, and every preview a rejected journal can show.
for(const x of [-900,15000,0])add('Posted. Suspense balance: '+balance(x)+'.');
const previews=new Set();
for(const posted of [[],[0],[1]]){const sus=14100-(posted.includes(0)?15000:0)+(posted.includes(1)?900:0);
 if(!posted.includes(0))[0,-14100].forEach(d=>previews.add(sus+d));
 if(!posted.includes(1))[0,-900].forEach(d=>previews.add(sus+d));}
[...previews].sort((a,b)=>b-a).forEach(x=>add('Preview: suspense would be '+balance(x)+'.'));
add('Bank has already been credited.');add('Compare the journal with the specific missing or excess amount.');add('Choose another entry.');
['Prediction matches the expected entry.','Compare your prediction with the expected entry.','The system posted correctly.','The totals agree. Check which account received the debit.','The system posted unequal amounts.','Predict both accounts before running this case.',
 'Choose the rule or routine to revise.','That change would leave this posting error in place. Compare the expected and actual legs.','Routine revised. The rerun matches the expected posting.',
 'All ten cases pass. Confirm the report to unlock handover.','Investigate each failing case, revise its routine and run all ten again.',
 'Explain the reasoning in your own words.','Recall T10. Both sides agreed when the purchase was charged to Delivery Expense.','Include how you traced the difference and what equal totals can conceal.',
 'Complete all three parts of your explanation.',
 'Open the rule sheet and inspect each of the five draft entries.','Hint: consider the account type and whether its balance rises or falls.','Hint: check both account names and both amounts, even when the totals agree.'].forEach(add);

const recap=[
 'Trace the difference. You compared the ledger with its source records and corrected the errors behind the KSh 14,100 difference.',
 'Test beyond the totals. Equal debit and credit totals can still hide a wrong-account posting. Your tests checked both the amounts and the accounts.'
];

const lines=[];
intro.forEach(([who,t],i)=>lines.push({group:'intro',key:i,...(who==='Grace'?GRACE:NARRATOR),text:t,file:`voice/intro-${i}.mp3`}));
briefings.forEach(([g,n],i)=>{lines.push({group:'brief',key:[i,0],...GRACE,text:g,file:`voice/brief-${i}-grace.mp3`});lines.push({group:'brief',key:[i,1],...NARRATOR,text:n,file:`voice/brief-${i}-narrator.mp3`})});
lines.push({group:'closing',...GRACE,text:'Thank you for staying with the numbers until they made sense.',file:'voice/closing-grace.mp3'});
recap.forEach((t,i)=>lines.push({group:'recap',key:i,...NARRATOR,text:t,file:`voice/recap-${i}.mp3`}));
[...fb].forEach((t,i)=>lines.push({group:'feedback',key:t,...NARRATOR,text:t,file:`feedback/${String(i+1).padStart(3,'0')}-${slug(t)}.mp3`}));
lines.forEach(l=>{l.spoken=spoken(l.text);l.text_hash=l.text.length});

const audio=path.join(app,'assets/audio');
const have=f=>fs.existsSync(path.join(audio,f));
const dur=f=>{try{return Math.round(Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','csv=p=0',path.join(audio,f)]).toString())*100)/100}catch{return null}};
const clip=l=>have(l.file)?{src:'assets/audio/'+l.file,dur:dur(l.file)}:null;
const by=g=>lines.filter(l=>l.group===g);
const J=x=>JSON.stringify(x);
const sound=f=>have(f)?'assets/audio/'+f:null;
const out=`// Generated by production/build-voice-lines.cjs. Do not edit by hand.
// Recorded voices (Eleven v4 via Higgsfield). Grace: custom voice 'Joy'. Narrator: custom voice 'Dr. Omondi (Lecturer)'.
// null = not recorded yet; that line falls back to the device voice (when enabled) or silence.
const voiceClips={
 intro:${J(by('intro').map(clip))},
 brief:${J(briefings.map((_,i)=>by('brief').filter(l=>l.key[0]===i).map(clip)))},
 closing:${J(clip(by('closing')[0]))},
 recap:${J(by('recap').map(clip))}
};
// Feedback and hint segments: text -> clip (null until recorded).
const feedbackClips=${J(Object.fromEntries(by('feedback').map(l=>[l.text,clip(l)])),null,1)};
const soundClips=${J({ambience:sound('sfx/shop-ambience.mp3'),chime:sound('sfx/door-chime.mp3'),till:sound('sfx/till.mp3'),phone:sound('sfx/phone.mp3'),confirm:sound('sfx/confirm.mp3'),correction:sound('sfx/correction.mp3'),music:sound('music/debrief-bed.mp3')})};
`;
fs.writeFileSync(path.join(app,'audio-manifest.js'),out);
fs.writeFileSync(path.join(__dirname,'voice-lines.json'),JSON.stringify(lines.map(({text_hash,...l})=>({...l,recorded:have(l.file)})),null,1)+'\n');
const missing=lines.filter(l=>!have(l.file));
console.log(`${lines.length} lines (${by('feedback').length} feedback segments); recorded ${lines.length-missing.length}, still to record ${missing.length}.`);
