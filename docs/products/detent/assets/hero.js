/* D33: rendered frames only. No CAD or mesh data is sent to the browser. */
(()=>{'use strict';
const canvas=document.querySelector('#hero-canvas');if(!canvas)return;
const ctx=canvas.getContext('2d'),poster=document.querySelector('#hero-poster'),seek=document.querySelector('#hero-seek'),play=document.querySelector('#hero-play'),playText=document.querySelector('#hero-play-text'),icon=document.querySelector('#hero-play-icon'),state=document.querySelector('#hero-state'),media=document.querySelector('#hero-media');
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),cache=new Map();let files=[],index=0,progress=0,playing=false,raf=0,last=0,visible=true,ready=false,cycle=0,drag=null,loadGeneration=0;
const pt=()=>document.documentElement.lang.startsWith('pt');
function labels(){playText.textContent=playing?(pt()?'Pausar':'Pause'):(pt()?'Reproduzir':'Play');icon.textContent=playing?'Ⅱ':'▶';play.setAttribute('aria-label',playing?(pt()?'Pausar demonstração':'Pause demonstration'):(pt()?'Reproduzir demonstração':'Play demonstration'));play.setAttribute('aria-pressed',String(playing));seek.setAttribute('aria-label',pt()?'Explore a retirada do laptop':'Explore the laptop release');state.textContent=progress<.04?(pt()?'Apoiado':'Docked'):progress<.24?(pt()?'Liberando':'Releasing'):(pt()?'Deslizando':'Sliding out')}
function frame(i){i=Math.max(0,Math.min(files.length-1,i));if(cache.has(i))return cache.get(i);const promise=new Promise((resolve,reject)=>{const img=new Image();img.decoding='async';img.onload=()=>resolve(img);img.onerror=reject;img.src=new URL(files[i],new URL('assets/motion/hero/',location.href)).href});cache.set(i,promise);if(cache.size>16){const keys=[...cache.keys()].sort((a,b)=>Math.abs(b-index)-Math.abs(a-index));cache.delete(keys[0])}return promise}
async function draw(v){progress=Math.max(0,Math.min(1,v));seek.value=String(progress*100);labels();if(!ready)return;index=Math.round(progress*(files.length-1));const generation=++loadGeneration;try{const img=await frame(index);if(generation!==loadGeneration)return;if(canvas.width!==img.naturalWidth||canvas.height!==img.naturalHeight){canvas.width=img.naturalWidth;canvas.height=img.naturalHeight}ctx.drawImage(img,0,0);canvas.hidden=false;poster.hidden=true;for(const d of [-1,1,2])if(files[index+d])frame(index+d).catch(()=>{})}catch{canvas.hidden=true;poster.hidden=false;pause()}}
function pause(){playing=false;cancelAnimationFrame(raf);labels()}
function tick(t){if(!playing||!visible||document.hidden)return;const dt=Math.min(.08,(t-(last||t))/1000);last=t;cycle+=dt;const period=9.4,u=cycle%period;let v;if(u<.8)v=0;else if(u<4.1)v=(u-.8)/3.3;else if(u<5.2)v=1;else if(u<8.5)v=1-(u-5.2)/3.3;else v=0;draw(v);if(cycle>=period){pause();draw(0);return}raf=requestAnimationFrame(tick)}
function start(){if(!ready){load().then(()=>start()).catch(()=>{});return}cancelAnimationFrame(raf);playing=true;cycle=progress*3.3+.8;last=0;labels();raf=requestAnimationFrame(tick)}
let pending;
async function load(){if(pending)return pending;pending=(async()=>{const r=await fetch('assets/motion/hero/frames.json?v=d33');if(!r.ok)throw Error('Hero unavailable');const data=await r.json();files=data.frames;if(!Array.isArray(files)||files.length<2)throw Error('Missing sequence');ready=true;seek.disabled=false;await draw(progress);return true})();return pending}
play.onclick=()=>playing?pause():start();seek.oninput=e=>{pause();if(!ready)load().then(()=>draw(+e.target.value/100)).catch(()=>{});else draw(+e.target.value/100)};
media.addEventListener('pointerdown',e=>{if(e.button!==0)return;pause();drag={x:e.clientX,y:e.clientY,start:progress};media.setPointerCapture(e.pointerId);if(!ready)load().catch(()=>{})});
media.addEventListener('pointermove',e=>{if(!drag||Math.abs(e.clientX-drag.x)<Math.abs(e.clientY-drag.y))return;draw(drag.start+(e.clientX-drag.x)/Math.max(180,media.clientWidth*.6))});
for(const name of ['pointerup','pointercancel'])media.addEventListener(name,()=>drag=null);
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)pause()},{threshold:.12}).observe(document.querySelector('.campaign-hero'));
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});document.addEventListener('detent:featureplay',pause);new MutationObserver(labels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
labels();if(!reduced.matches&&!navigator.connection?.saveData)load().then(start).catch(()=>{labels()});
reduced.addEventListener('change',e=>{if(e.matches)pause()});
window.DETENT_HERO={get progress(){return progress},get playing(){return playing},get ready(){return ready},get frameCount(){return files.length},pause,draw,load};
})();
