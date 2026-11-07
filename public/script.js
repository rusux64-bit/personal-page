(function(){
var root=document.documentElement,rm=matchMedia('(prefers-reduced-motion:reduce)').matches,$=function(i){return document.getElementById(i)};

/* translations */
var D={
en:{home:'Home',about:'About',into:'Into',work:'Work',contact:'Contact',
 h1a:'Hi, I’m <span class="nm">Rusu.</span>',h1b:'High school student from Republic of Moldova.',aria:'Hi, I’m Rusu. High school student from Republic of Moldova.',
 intro:'I run a few servers at home, spend a little too much time on DNS, and I’m slowly teaching myself C++. This is my little corner of the internet.',
 gh:'My GitHub',see:'See what I’m making',aboutH:'About me',
 aboutP:'I’m the kind of person who isn’t happy when something just works. I want to know <i>why</i> it works. That’s how I ended up self-hosting things and chasing down DNS problems at odd hours. Linux is my main environment, with macOS next to it when the task fits better.',
 intoH:'What I’m into',mapAria:'Interactive map of my interests',workH:'Projects',say:'Say hi',
 sayP:'Want to talk about self-hosting, networking or C++? Open an issue or send a message on GitHub. I’m always happy to learn from people who know more than I do.',
 mail:'Email',foot:'Made with ❤️ in Moldova.',theme:'Toggle light or dark theme'},
ro:{home:'Acasă',about:'Despre',into:'Pasiuni',work:'Proiecte',contact:'Contact',
 h1a:'Salut, sunt <span class="nm">Rusu.</span>',h1b:'Liceean din Republica Moldova',aria:'Salut, sunt Rusu. Liceean din Republica Moldova.',
 intro:'Țin câteva servere acasă, petrec puțin cam mult timp cu DNS-ul și învăț încet C++. Acesta este micul meu colț de internet.',
 gh:'GitHub-ul meu',see:'Vezi ce construiesc',aboutH:'Despre mine',
 aboutP:'Sunt genul de om care nu se mulțumește când ceva doar funcționează. Vreau să știu <i>de ce</i> funcționează. Așa am ajuns să-mi găzduiesc singur serviciile și să caut probleme de DNS la ore târzii. Linux este mediul meu principal, iar macOS stă alături când sarcina se potrivește mai bine.',
 intoH:'Ce mă pasionează',mapAria:'Hartă interactivă a pasiunilor mele',workH:'Proiecte',say:'Scrie-mi',
 sayP:'Vrei să vorbim despre self-hosting, rețele sau C++? Deschide un issue sau trimite-mi un mesaj pe GitHub. Învăț mereu cu plăcere de la oameni care știu mai mult decât mine.',
 mail:'E-mail',foot:'Făcut cu ❤️ în Moldova.',theme:'Comută tema deschisă sau închisă'}};
var T={
en:[{label:'Self-hosting',t:'Self-hosting',b:'Running services at home and finding out what it really takes to keep them up.'},
 {label:'Networking',t:'Networking',b:'Routing, DNS, and the classic “why can’t I reach this?” mystery.'},
 {label:'Linux + macOS',t:'Linux + macOS',b:'Both, every day. Whichever one makes the job easier.'},
 {label:'C++',t:'Currently learning: C++',b:'Still early days. Mostly practice projects and small experiments.',
  ul:'<li>Writing small programs to see how things behave</li><li>Breaking things <span class="mono">→</span> reading the error <span class="mono">→</span> fixing them</li><li><s>Understanding everything on the first try</s></li>'}],
ro:[{label:'Self-hosting',t:'Self-hosting',b:'Rulez servicii acasă și descopăr ce înseamnă, de fapt, să le menții pornite.'},
 {label:'Rețele',t:'Rețele',b:'Rutare, DNS și clasicul mister „de ce nu pot ajunge aici?”.'},
 {label:'Linux + macOS',t:'Linux + macOS',b:'Pe amândouă, zilnic. Oricare face treaba mai ușoară.'},
 {label:'C++',t:'Acum învăț: C++',b:'Sunt abia la început. În mare parte proiecte de exercițiu și experimente mici.',
  ul:'<li>Scriu programe mici ca să văd cum se comportă lucrurile</li><li>Stric ceva <span class="mono">→</span> citesc eroarea <span class="mono">→</span> repar</li><li><s>Să înțeleg totul din prima</s></li>'}]};

/* theme: circular reveal */
var tb=$('theme');
tb.addEventListener('click',function(){
  var r=tb.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
  function flip(){var d=root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;root.dataset.theme=d?'light':'dark'}
  if(!document.startViewTransition||rm){flip();return}
  document.startViewTransition(flip).ready.then(function(){
    var rad=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
    root.animate({clipPath:['circle(0px at '+x+'px '+y+'px)','circle('+rad+'px at '+x+'px '+y+'px)']},{duration:800,easing:'cubic-bezier(.2,0,0,1)',pseudoElement:'::view-transition-new(root)'});
  }).catch(function(){});
});

/* letters that react to the pointer (variable font width + weight) */
function fish(el,wd0,wg0,wd1,wg1){
  var chars=[];
  function build(){chars=[];(function split(n){[].slice.call(n.childNodes).forEach(function(c){
    if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split('').forEach(function(t){
      if(t===' '){f.appendChild(document.createTextNode(' '));return}
      var s=document.createElement('span');s.className='ch';s.textContent=t;s.style.setProperty('--i',chars.length);chars.push(s);f.appendChild(s)});c.replaceWith(f)}
    else split(c)})})(el)}
  if(!rm){
    el.addEventListener('pointermove',function(e){chars.forEach(function(s){var r=s.getBoundingClientRect(),t=Math.max(0,1-Math.abs(e.clientX-(r.left+r.width/2))/Math.max(140,r.height*1.6));
      s.style.fontVariationSettings='"wght" '+Math.round(wg0+(wg1-wg0)*t)+',"wdth" '+Math.round(wd0+(wd1-wd0)*t)+',"opsz" 144'})});
    el.addEventListener('pointerleave',function(){chars.forEach(function(s){s.style.fontVariationSettings=''})});
  }
  return function(html){el.innerHTML=html;build()};
}
var setL1=fish(document.querySelector('.l1'),90,800,140,1000),setSay=fish($('say'),90,900,145,1000);
function words(h){return h.split(' ').map(function(w,i){return '<span class="w2" style="--i:'+i+'">'+w+'</span>'}).join(' ')}

/* interest map with morphing shapes */
var C={x:320,y:200,R:56,l:12,cls:'core',label:'rusu',base:.08};
var N=[{x:120,y:90,R:46,l:8,cls:'n0'},{x:520,y:90,R:46,l:6,cls:'n1'},{x:120,y:290,R:46,l:7,cls:'n2'},{x:520,y:290,R:46,l:5,cls:'n3'}];
var NS='http://www.w3.org/2000/svg',gl=$('lines'),gn=$('nodes'),sel=0,panel=$('panel'),lang='en';
function mk(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e}
function sh(n){n.amp=.05;n.v=0;n.rot=Math.random()*6;n.T=n.base||.05;
  var g=mk('g',{class:'nd '+n.cls,tabindex:n===C?-1:0,role:n===C?'presentation':'button'},gn);
  n.p=mk('path',{},g);n.tx=mk('text',{x:n.x,y:n===C?n.y+8:n.y+n.R+34},g);n.tx.textContent=n.label||'';n.g=g}
function pd(n){var s='',M=72,i,a,r;for(i=0;i<M;i++){a=i/M*6.2832;r=n.R*(1+n.amp*Math.cos(n.l*a+n.rot));s+=(i?'L':'M')+(n.x+r*Math.cos(a)).toFixed(1)+' '+(n.y+r*Math.sin(a)).toFixed(1)}return s+'Z'}
N.forEach(function(n){n.ln=mk('line',{class:'ln',x1:C.x,y1:C.y,x2:n.x,y2:n.y},gl)});
N.forEach(sh);sh(C);
function pick(i,first){
  sel=i;N.forEach(function(n,k){n.ln.classList.toggle('on',k===i);n.g.setAttribute('aria-pressed',k===i);n.T=k===i?.2:.05});
  var n=T[lang][i];panel.className='panel sw p'+i;
  panel.innerHTML='<h3 style="--k:0">'+n.t+'</h3><p style="--k:1">'+n.b+'</p>'+(n.ul?'<ul style="--k:2">'+n.ul+'</ul>':'');
  if(!first){panel.classList.remove('sw');void panel.offsetWidth;panel.classList.add('sw')}
}
N.forEach(function(n,i){
  n.g.addEventListener('click',function(){pick(i)});
  n.g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(i)}});
  n.g.addEventListener('pointerenter',function(){if(i!==sel)n.T=.12});
  n.g.addEventListener('pointerleave',function(){if(i!==sel)n.T=.05});
});
var vis=false,all=N.concat([C]);
new IntersectionObserver(function(e){vis=e[0].isIntersecting;if(vis)loop()}).observe($('svg'));
function loop(){
  all.forEach(function(n){var T0=n===C?.08:n.T;n.v+=(T0-n.amp)*.16;n.v*=.74;n.amp+=n.v;n.rot+=(n===C?-.004:(N[sel]===n?.015:.003));n.p.setAttribute('d',pd(n))});
  if(vis&&!rm)requestAnimationFrame(loop)}
if(rm){all.forEach(function(n){n.amp=n===C?.08:n.T;n.p.setAttribute('d',pd(n))})}else{loop()}

/* nav indicator */
var links=[].slice.call(document.querySelectorAll('nav a')),ind=$('ind'),cur=links[0];
function act(a){cur=a;links.forEach(function(l){l.classList.toggle('on',l===a)});ind.style.left=a.offsetLeft+'px';ind.style.width=a.offsetWidth+'px'}
var secs=links.map(function(l){return document.querySelector(l.getAttribute('href'))});
var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)act(links[secs.indexOf(e.target)])})},{rootMargin:'-45% 0px -50% 0px'});
secs.forEach(function(s){so.observe(s)});
addEventListener('resize',function(){act(cur)});

/* language */
var LB=[].slice.call(document.querySelectorAll('#lang button'));
function mark(l){$('lang').dataset.l=l;LB.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.l===l)})}
function apply(l){
  lang=l;var d=D[l];root.lang=l;
  document.querySelectorAll('[data-t]').forEach(function(e){e.innerHTML=d[e.getAttribute('data-t')]});
  setL1(d.h1a);setSay(d.say);$('l2').innerHTML=words(d.h1b);
  $('hh1').setAttribute('aria-label',d.aria);$('svg').setAttribute('aria-label',d.mapAria);tb.setAttribute('aria-label',d.theme);
  N.forEach(function(n,i){n.tx.textContent=T[l][i].label;n.g.setAttribute('aria-label',T[l][i].label)});
  pick(sel,true);mark(l);
  requestAnimationFrame(function(){act(cur)});
  try{localStorage.setItem('lang',l)}catch(e){}
}
function switchTo(l){
  if(l===lang)return;mark(l);
  if(rm){apply(l);return}
  root.classList.add('fading');
  setTimeout(function(){apply(l);requestAnimationFrame(function(){root.classList.remove('fading')})},230);
}
LB.forEach(function(b){b.addEventListener('click',function(){switchTo(b.dataset.l)})});
var saved='en';try{saved=localStorage.getItem('lang')==='ro'?'ro':'en'}catch(e){}
apply(saved);

/* reveal */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
(document.fonts&&document.fonts.ready||Promise.resolve()).then(function(){act(cur)});
})();
