/* Smart & Minimal Studio: basic consent; GTM is never loaded before opt-in. */
(()=>{'use strict';
const source=document.currentScript,container=source?.dataset.container||'',measurement=source?.dataset.measurement||'';
if(!/^GTM-[A-Z0-9]+$/.test(container)||!/^G-[A-Z0-9]+$/.test(measurement))return;
const key='smartminimal-analytics-v1',period=180*86400000,product=!!document.querySelector('#personal-buy')||(/\/products\/detent\/|^\/detent\//.test(location.pathname)&&!/\/(terms|privacy)\.html$/.test(location.pathname));
const denied={analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
window.dataLayer=window.dataLayer||[];function consent(){window.dataLayer.push(arguments)}
consent('consent','default',denied);consent('set','ads_data_redaction',true);
let allowed=false,loaded=false,panel,opener,viewSent=false;
const lang=()=>document.documentElement.lang.startsWith('pt')?'pt':'en';
function read(){try{const v=JSON.parse(localStorage.getItem(key));return v&&['allowed','denied'].includes(v.choice)&&v.expires>Date.now()?v.choice:null}catch{return null}}
function cleanUrl(value){try{const u=new URL(value);const params=new URLSearchParams();for(const name of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']){const v=u.searchParams.get(name);if(v&&v.length<=120&&!v.includes('@'))params.set(name,v)}return u.origin+u.pathname+(params.size?'?'+params:'')}catch{return ''}}
function push(name,details={}){if(!allowed)return;window.dataLayer.push({event:'sms_event',sms_event_name:name,sms_product:product?'detent_d33':'studio',sms_feature:null,sms_palette:null,sms_language:lang(),sms_destination:null,sms_value:null,sms_currency:null,...details})}
function start(){window['ga-disable-'+measurement]=false;consent('set',{linker:{domains:['smartminimalstudio.pages.dev','payhip.com'],accept_incoming:true},allow_google_signals:false,allow_ad_personalization_signals:false,page_location:cleanUrl(location.href),page_referrer:cleanUrl(document.referrer)});consent('consent','update',{...denied,analytics_storage:'granted'});
if(!loaded){loaded=true;window.dataLayer.push({sms_page_location:cleanUrl(location.href),sms_page_referrer:cleanUrl(document.referrer),sms_page_title:document.title});window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});const tag=document.createElement('script');tag.async=true;tag.src='https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(container);tag.id='sms-google-tag-manager';document.head.append(tag)}
if(product&&!viewSent){viewSent=true;push('view_product')}
}
function clearCookies(){for(const c of document.cookie.split(';')){const name=c.split('=')[0].trim();if(!/^(?:sms_ga(?:_|$)|_ga(?:_|$))/.test(name))continue;for(const domain of ['',`; Domain=${location.hostname}`,`; Domain=.${location.hostname}`])document.cookie=`${name}=; Max-Age=0; Path=/; SameSite=Lax${domain}`}}
function choose(choice){allowed=choice==='allowed';try{localStorage.setItem(key,JSON.stringify({choice,expires:Date.now()+period}))}catch{}
panel.hidden=true;if(allowed)start();else{window['ga-disable-'+measurement]=true;if(loaded)consent('consent','update',denied);clearCookies()}opener?.focus({preventScroll:true});}
const words={en:{title:'Your privacy, your choice.',text:'Allow Google Analytics to help us understand visits, product demos and checkout clicks. Optional analytics stays off until you allow it. Advertising stays off.',yes:'Allow analytics',no:'Keep analytics off',details:'Privacy details',settings:'Analytics settings'},pt:{title:'Sua privacidade, sua escolha.',text:'Permita o Google Analytics para entendermos visitas, demonstrações e cliques no checkout. A análise opcional fica desligada até sua autorização. Publicidade permanece desativada.',yes:'Permitir análise',no:'Manter análise desligada',details:'Privacidade',settings:'Preferências de análise'}};
const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('measurement.css',source.src).href;document.head.append(css);
panel=document.createElement('section');panel.id='sms-consent';panel.className='sms-consent';panel.hidden=true;panel.setAttribute('aria-labelledby','sms-consent-title');panel.innerHTML='<h2 id="sms-consent-title"></h2><p></p><div class="sms-consent-actions"><button type="button" data-choice="allowed"></button><button type="button" data-choice="denied"></button></div><a class="sms-privacy-link"></a>';
const privacy=panel.querySelector('a');privacy.href=new URL('../privacy.html',source.src).href;document.body.append(panel);
const footer=document.querySelector('body > footer')||document.body;opener=document.createElement('button');opener.type='button';opener.className='sms-consent-settings';opener.setAttribute('aria-controls','sms-consent');opener.onclick=()=>{panel.hidden=false;panel.querySelector('button').focus()};footer.append(opener);
function translate(){const w=words[lang()];panel.querySelector('h2').textContent=w.title;panel.querySelector('p').textContent=w.text;panel.querySelector('[data-choice="allowed"]').textContent=w.yes;panel.querySelector('[data-choice="denied"]').textContent=w.no;privacy.textContent=w.details;opener.textContent=w.settings}translate();
new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
panel.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>choose(b.dataset.choice));
const saved=read();if(saved==='allowed'){allowed=true;start()}else if(saved==='denied'){window['ga-disable-'+measurement]=true}else panel.hidden=false;
document.addEventListener('click',e=>{const target=e.target instanceof Element?e.target.closest('a,button'):null;if(!target)return;
if(target.matches('[data-play-feature]')&&target.getAttribute('aria-pressed')==='true')push('feature_play',{sms_feature:target.dataset.playFeature});
if(target.id==='hero-play'&&target.getAttribute('aria-pressed')==='true')push('feature_play',{sms_feature:'hero'});
if(target.matches('[data-preset]'))push('finish_change',{sms_palette:target.dataset.preset});
if(target.matches('a[href]')){const url=new URL(target.href,location.href);if(url.hostname==='payhip.com'&&target.id==='personal-buy')push('checkout_click',{sms_destination:'payhip',sms_product:'detent_d33',sms_value:19,sms_currency:'USD'});else if(/(^|\.)(youtube\.com|youtu\.be|instagram\.com)$/.test(url.hostname))push('social_click',{sms_destination:url.hostname.includes('instagram')?'instagram':'youtube'});else if(!product&&url.pathname.includes('/products/detent/'))push('product_explore',{sms_product:'detent_d33'})}
});
document.addEventListener('change',e=>{if(e.target.id==='language')push('language_change',{sms_language:e.target.value==='pt'?'pt':'en'});if(/^color-(gray|black|orange)$/.test(e.target.id))push('finish_change',{sms_palette:'custom'})});
window.SMS_MEASUREMENT={get allowed(){return allowed},get loaded(){return loaded},open(){opener.click()}};
})();
