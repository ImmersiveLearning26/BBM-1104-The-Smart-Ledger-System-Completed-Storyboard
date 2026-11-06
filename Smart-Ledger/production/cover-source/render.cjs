const sharp=require('sharp');
const {spawn}=require('child_process');
const fs=require('fs');
const {once}=require('events');
const C={ink:'#171922',muted:'#596171',line:'#E2E5EB',violet:'#565FCF',tint:'#EEF0FE',mint:'#DDF5EB',green:'#22694F',white:'#FFFFFF',fog:'#F5F6F9'};
const rect=(x,y,w,h,fill,r=0,stroke='none')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="'+fill+'" stroke="'+stroke+'"/>';
const line=(x,y,a,b,col=C.line)=>'<path d="M'+x+' '+y+' L'+a+' '+b+'" stroke="'+col+'" stroke-width="1"/>';
const tx=(x,y,t,size=16,weight=400,fill=C.ink,anchor='start')=>'<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'" font-family="Nimbus Sans,DejaVu Sans,sans-serif" font-size="'+size+'" font-weight="'+weight+'" fill="'+fill+'">'+t+'</text>';
const group=(a,o=1,x=0,y=0)=>'<g opacity="'+o+'" transform="translate('+x+','+y+')">'+a+'</g>';
const clamp=t=>Math.max(0,Math.min(1,t)), ease=t=>(t=clamp(t))*t*(3-2*t), mix=(a,b,k)=>a+(b-a)*k;
const fade=(t,a,b)=>ease((t-a)/(b-a));
const money=n=>Math.round(n).toLocaleString('en-GB');
function icon(x,y,d,color=C.muted,scale=1){return '<g transform="translate('+x+' '+y+') scale('+scale+')" fill="none" stroke="'+color+'" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+d+'</g>'}
const glyphs=[
 '<path d="M2 5h7m4 0h5M2 13h2m4 0h10"/><circle cx="11" cy="5" r="2"/><circle cx="6" cy="13" r="2"/>',
 '<path d="M10 2v15m-6 0h12M2 5l8-2 8 2M4 5l-3 7h6L4 5zm12 0l-3 7h6l-3-7z"/>',
 '<rect x="1" y="2" width="18" height="14" rx="3"/><path d="m5 6 3 3-3 3m6 0h4"/>',
 '<path d="M4 2h8l4 4v12H4z M12 2v5h4 M7 11h6m-6 3h4"/>'
];
const logo=(x,y,scale=1)=>'<g transform="translate('+x+','+y+') scale('+scale+')"><path d="M0 5L10 0v21L0 26z" fill="#7E86F7"/><path d="M13 3l10-5v21l-10 5z" fill="#4B55D8"/></g>';
function shell(t,idx,local){
 const a=['Posting rules','Trial balance','Test console','Debrief'];
 let z=rect(186,89,988,380,'#E4E6F0',17)+rect(184,84,992,380,C.white,17,'#D6DAE4')+line(360,84,360,464)+line(360,132,1176,132);
 z+=logo(204,104,.69)+tx(228,117,'Smart Ledger',16,700)+tx(384,115,'Zuri Home Supplies',15,700)+tx(1150,115,'June ledger · KSh',13,400,C.muted,'end');
 const last=(idx+2)%3,navT=fade(local,0,.45),ny=mix(151+47*last,151+47*idx,navT);
 z+=rect(196,ny,152,36,C.tint,8);
 a.forEach((v,j)=>{let c=j===idx?C.violet:C.muted;z+=icon(210,160+47*j,glyphs[j],c,.9)+tx(236,175+j*47,v,14,j===idx?700:400,c)});
 return z;
}
function pointer(x,y,k=1,r=0){return group((r>0?'<circle cx="0" cy="0" r="'+(7+16*r)+'" fill="none" stroke="'+C.violet+'" stroke-width="1.3" opacity="'+(1-r)+'"/>':'')+'<path d="M0 0l3 20 5-6 7 7 4-4-7-7 8-2z" fill="#262936" stroke="white" stroke-width="1.7" stroke-linejoin="round"/>',k,x,y)}
function audit(t){
 let h=tx(394,187,'Review draft postings',32,700),a=fade(t,1.6,2.2),rowY=mix(244,302,a);
 h+=tx(395,221,'Draft entries',15,700)+tx(763,221,'KSh',13,400,C.muted,'end')+line(395,233,762,233)+rect(389,rowY-3,383,46,C.tint,8);
 [['S-01','Cash sale','20,000'],['S-02','Rent paid by bank','25,000'],['S-03','Customer payment','18,000']].forEach((v,i)=>{let y=270+i*58;h+=tx(404,y,v[0],13,400,C.muted)+tx(453,y,v[1],15,500)+tx(751,y,v[2],15,500,C.ink,'end')+line(395,y+21,762,y+21)});
 h+=rect(804,206,337,222,C.fog,13);
 const detail=(k,title,amt,dr,cr)=>group(tx(824,239,title,17,700)+tx(824,281,amt,32,700)+line(824,304,1121,304)+tx(824,340,'Debit',15,400,C.muted)+tx(1119,340,dr,16,500,C.ink,'end')+line(824,357,1121,357)+tx(824,389,'Credit',15,400,C.muted)+tx(1119,389,cr,16,500,C.ink,'end'),k);
 h+=detail(1-a,'Cash sale','KSh 20,000','Cash','Sales')+detail(a,'Rent paid by bank','KSh 25,000','Bank','Rent Expense');
 const mv=fade(t,.65,1.7);h+=pointer(mix(779,710,mv),mix(395,328,mv),fade(t,.3,.8)*(1-fade(t,2.5,3.1)),t>1.7&&t<2.2?(t-1.7)/.5:0);return h;
}
function trial(t){
 let a=fade(t,1.9,2.65),h=tx(394,187,'Extract the trial balance',32,700)+tx(395,232,'Account balance',15,400,C.muted)+tx(395,278,'Cash',26,700)+tx(395,318,'KSh 70,500',32,700);
 h+=rect(395,353,125,42,'#FFFFFF',8,'#C8CDD8')+rect(532,353,125,42,'#FFFFFF',8,'#C8CDD8')+group(rect(395,353,125,42,C.tint,8,C.violet),a)+tx(457,380,'Debit',16,600,C.ink,'middle')+tx(594,380,'Credit',16,600,C.ink,'middle');
 h+=rect(721,211,420,217,C.fog,13)+tx(744,249,'Placed balances',19,700)+tx(745,288,'Account',14,400,C.muted)+tx(1099,288,'Debit · KSh',14,400,C.muted,'end')+line(745,301,1115,301);
 h+=group(tx(745,338,'Cash',17,500)+tx(1099,338,'70,500',17,500,C.ink,'end'),a,0,9*(1-a))+line(745,358,1115,358)+tx(745,393,'Total',16,700)+tx(1099,393,money(70500*a),20,700,C.ink,'end');
 let mv=fade(t,.65,1.75);h+=pointer(mix(677,476,mv),mix(395,377,mv),fade(t,.4,.85)*(1-fade(t,2.75,3.2)),t>1.85&&t<2.35?(t-1.85)/.5:0);return h;
}
function test(t){
 const a=fade(t,1.75,2.45);
 let h=tx(394,187,'Test a posting',32,700)+tx(395,222,'T1 · Cash sale · KSh 12,000',16,400,C.muted);
 h+=tx(395,263,'Account side',14,400,C.muted)+tx(625,263,'Expected',14,400,C.muted)+tx(870,263,'System posted',14,400,C.muted)+line(395,276,1141,276);
 [['Debit','Cash'],['Credit','Sales']].forEach(([l,v],i)=>{let y=311+47*i;h+=tx(395,y,l,16)+tx(625,y,v,17,500)+group(tx(870,y,'—',16,500,C.muted),1-a)+group(tx(870,y,v,17,500),a,0,(1-a)*6)+line(395,y+16,1141,y+16)});
 h+=group(rect(395,392,109,37,C.ink,7)+tx(449,417,'Run test',14,700,C.white,'middle'),1-a)+group(rect(395,392,126,36,C.mint,8)+icon(407,403,'<path d="m1 6 4 4 9-9"/>',C.green,.8)+tx(430,416,'Entry matches',13,700,C.green),a);
 let mv=fade(t,.6,1.6);h+=pointer(mix(618,473,mv),mix(392,412,mv),fade(t,.3,.8)*(1-fade(t,2,2.5)),t>1.65&&t<2.15?(t-1.65)/.5:0);return h;
}
const draw=[audit,trial,test];
function frame(t){
 let idx=Math.floor(t/5)%3,local=t%5,prev=(idx+2)%3,x=fade(local,0,.5);
 let bg='<defs><radialGradient id="wash"><stop offset="0" stop-color="#E5E7FA"/><stop offset=".65" stop-color="#F1F2FA"/><stop offset="1" stop-color="#FBFBFD"/></radialGradient></defs>'+rect(0,0,1360,765,'url(#wash)');
 let top=logo(50,28,.88)+tx(82,47,'Smart Ledger',22,700);
 let app=shell(t,idx,local)+(x<1?group(draw[prev](4.99),1-x,-10*x,0):'')+group(draw[idx](local),x,10*(1-x),0);
 let cover=tx(680,562,'The Smart Ledger System',49,700,C.ink,'middle')+rect(581,604,198,49,C.ink,10)+tx(668,636,'Start simulation',17,600,C.white,'middle')+icon(741,620,'<path d="M1 8h14m-6-6 6 6-6 6"/>',C.white,.9);
 return '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1360 765">'+bg+top+app+cover+'</svg>';
}
async function main(){
 const path=process.argv[2];const fps=24;const w=1920,h=1080;
 // Start in the audit hold. The loop boundary lies in a static pose so both frame and velocity match.
 const encoder=spawn('ffmpeg',['-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',w+'x'+h,'-r',String(fps),'-i','-','-an','-c:v','libx264','-preset','veryfast','-crf','17','-pix_fmt','yuv420p','-threads','3','-movflags','+faststart',path],{stdio:['pipe','inherit','inherit']});
 const done=once(encoder,'close');let last='',buffer;sharp.concurrency(2);
 for(let i=0;i<fps*15;i++){const t=(i/fps+3.8)%15,svg=frame(t);if(svg!==last){buffer=await sharp(Buffer.from(svg)).removeAlpha().raw().toBuffer();last=svg}if(!encoder.stdin.write(buffer))await once(encoder.stdin,'drain')}
 encoder.stdin.end();const [status]=await done;if(status!==0)throw Error('Encoding failed');
}
main().catch(e=>{console.error(e);process.exitCode=1});
