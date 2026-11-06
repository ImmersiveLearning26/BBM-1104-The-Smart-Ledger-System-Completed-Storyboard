function hero(){
 if(s.page==='splash')return '<div class="splash"><img class="mivaLogo" src="assets/brand/miva-open-university.svg" alt="MIVA Open University" width="200" height="62"><small>presents</small>'+choice('advanceSplash','Continue →',null,false,'textBtn')+'</div>';
 if(s.page==='cover')return coverPage();
 let panel='';
 if(s.page==='identity')return '<main class="identity">'+brand()+'<form id="identity"><p>Zuri Home Supplies · Nairobi</p><h1>Join the ledger team</h1><label>Your name<input required maxlength="60" id="name" autocomplete="given-name" placeholder="Enter your name"></label><button class="primary">Enter the shop →</button></form></main>';
 if(s.page==='intro')panel='<p class="over">Zuri Home Supplies · Nairobi</p><h1>Month-end<br>at Zuri.</h1><div class="caption">'+(s.media.captions||!s.media.voice?'<b>'+intro[ui.cue][0]+'</b><p>'+intro[ui.cue][1]+'</p>':'')+'</div><div class="tools">'+choice('pause',ui.paused?'Resume':'Pause')+choice('skip','Skip introduction →')+'</div>';
 if(s.page==='title')panel='<p class="over">Zuri Home Supplies · Nairobi</p><h1>The Smart<br>Ledger System</h1><p class="heroSub">'+escapeHTML(s.name)+'<br>Junior Accounts Systems Assistant</p>'+button('start','Open the ledger →');
 return '<div class="hero"><div class="heroTop"><span>BBM 1104 &nbsp; / &nbsp; PRINCIPLES OF ACCOUNTING</span>'+choice('settings','Audio & captions')+'</div><div class="heroBody">'+panel+'</div></div>';
}
