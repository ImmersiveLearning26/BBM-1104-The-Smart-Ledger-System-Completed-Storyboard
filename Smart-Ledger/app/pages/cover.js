// The MP4 contains only the product demo. Brand, title and primary action are live HTML.
function coverPage(){
 return '<main class="cover"><header>'+brand()+'</header><div class="coverBody"><div class="demo"><video id="coverVideo" muted playsinline loop preload="metadata" poster="assets/product-poster.png" aria-hidden="true"><source src="assets/product-loop.mp4" type="video/mp4"><source src="assets/product-loop.webm" type="video/webm"></video></div><h1>The Smart Ledger System</h1>'+button('enterCover','Start simulation →')+'</div><button class="motionControl" data-do="toggleCover" type="button">Play animation</button></main>';
}
function mountCover(){
 const video=byId('coverVideo'),control=root.querySelector('.motionControl');
 const sync=()=>control.textContent=video.paused?'Play animation':'Pause animation';
 const unavailable=()=>{control.hidden=true;video.removeAttribute('controls')};
 video.addEventListener('play',sync);
 video.addEventListener('pause',sync);
 video.addEventListener('error',unavailable);
 video.querySelector('source:last-child').addEventListener('error',unavailable);
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)video.play().catch(sync);
}
function toggleCover(){
 const video=byId('coverVideo');
 if(video.paused)video.play().catch(()=>{});else video.pause();
}
