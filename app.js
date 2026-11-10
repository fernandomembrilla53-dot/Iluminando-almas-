'use strict';
// Demo configuration: replace these only with approved client information.
const CONFIG={businessName:'Iluminando Almas',whatsapp:'',email:'',site:'',premiumEnabled:false};
const MAJORS=['El Loco','El Mago','La Papisa','La Emperatriz','El Emperador','El Papa','Los Enamorados','El Carro','La Justicia','El Ermitaño','La Rueda de la Fortuna','La Fuerza','El Colgado','Arcano XIII','La Templanza','El Diablo','La Torre','La Estrella','La Luna','El Sol','El Juicio','El Mundo'];
const MMEAN=['Nuevos comienzos, libertad y confianza en el camino.','Iniciativa, habilidades y capacidad de actuar.','Intuición, silencio y conocimiento interior.','Creatividad, cuidado y abundancia.','Estructura, responsabilidad y límites claros.','Aprendizaje, valores y orientación.','Elecciones afectivas y coherencia con tus valores.','Avance, determinación y dirección.','Equilibrio, honestidad y consecuencias.','Introspección, prudencia y búsqueda personal.','Cambios, ciclos y oportunidades inesperadas.','Coraje, paciencia y dominio de los impulsos.','Pausa, entrega y otra perspectiva.','Transformación, cierre y renovación.','Moderación, armonía y recuperación del equilibrio.','Apegos, tentaciones y patrones limitantes.','Rupturas, revelaciones y reconstrucción.','Esperanza, inspiración y serenidad.','Incertidumbre, sueños y emociones profundas.','Claridad, alegría y vitalidad.','Despertar, evaluación y nuevas decisiones.','Realización, integración y fin de una etapa.'];
const SYMBOLS=['✧','✦','☾','❀','♜','✝','♡','♞','♌','☼','☸','⚖','⌛','✿','☯','♠','⚡','★','☽','☀','♬','◎'];
const RANKS=['As','Dos','Tres','Cuatro','Cinco','Seis','Siete','Ocho','Nueve','Diez','Sota','Caballo','Reina','Rey'];
const SUITS=[['Bastos','energía, iniciativa y proyectos','♣'],['Copas','afectos, intuición y vínculos','♥'],['Espadas','ideas, conflictos y decisiones','⚔'],['Oros','recursos, trabajo y estabilidad','◆']];
const RMEAN=['un comienzo o una posibilidad','la búsqueda de equilibrio','la expansión y colaboración','la construcción de bases','un desafío que pide atención','el intercambio y los acuerdos','la reflexión antes de avanzar','el movimiento y la adaptación','la madurez de una situación','la culminación de un proceso','un mensaje o aprendizaje','una acción decidida','la comprensión y el cuidado','la responsabilidad y el liderazgo'];
const DECK=[...MAJORS.map((name,i)=>({name,meaning:MMEAN[i],symbol:SYMBOLS[i]})),...SUITS.flatMap(([suit,theme,symbol])=>RANKS.map((rank,i)=>({name:`${rank} de ${suit}`,meaning:`Esta carta relaciona ${theme} con ${RMEAN[i]}.`,symbol})))];
const CATEGORIES=['Todos','Sahumerios','Esencias','Velas','Amuletos','Hierbas','Imágenes','Otros'];
// Illustrative categories only. No products/prices until client provides the real catalog.
const PRODUCTS=[];
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{toast('No se pudo guardar en este dispositivo')}};
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state={page:'home',mode:'3',chosen:[],cards:[],deck:[],category:'Todos',search:'',cart:read('ia_cart',[]),history:read('ia_history',[]),voice:null};
const $=id=>document.getElementById(id);
function toast(s){$('toast').textContent=s;$('toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').style.display='none',2600)}
function stopVoice(){if('speechSynthesis' in window)window.speechSynthesis.cancel()}
function speak(s){if(!('speechSynthesis' in window)){toast('La voz no está disponible en este dispositivo');return}stopVoice();const u=new SpeechSynthesisUtterance(s);u.lang='es-AR';u.rate=.92;u.pitch=1.08;const voices=window.speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang.toLowerCase()==='es-ar')||voices.find(v=>v.lang.toLowerCase().startsWith('es'))||null;window.speechSynthesis.speak(u)}
function go(page){stopVoice();state.page=page;render();window.scrollTo(0,0)}
function header(title,sub=''){return `<h2>${escapeHTML(title)}</h2>${sub?`<p class="subtitle">${escapeHTML(sub)}</p>`:''}`}
function home(){return `<section class="hero"><div class="hero-content"><h1>Iluminando Almas</h1><p class="subtitle">☾ Tarot · Guía espiritual · Santería ☽</p><p>Hola, soy <em class="glow">Camila</em>. Estoy acá para acompañarte en un momento de reflexión.</p><button class="btn wide" data-page="tarot">✦ Comenzar una tirada</button></div></section><div class="actions"><button class="tile" data-page="tarot"><b>🃏</b>Tarot</button><button class="tile" data-page="shop"><b>✧</b>Santería</button><button class="tile" data-page="rituals"><b>🕯</b>Consejos</button><button class="tile" data-page="history"><b>♡</b>Mis tiradas</button><button class="tile" data-page="about"><b>☾</b>Acerca de</button><button class="tile" data-page="contact"><b>✉</b>Contacto</button></div>`}
const MODES=[['1','Una carta','Un mensaje para reflexionar'],['3','Tres cartas','Pasado · Presente · Futuro'],['love','Amor','Vínculos y emociones'],['work','Trabajo','Proyectos y decisiones'],['general','General','Panorama de tu momento']];
function tarot(){return header('Tu tirada','Elegí la lectura que más resuene con vos')+MODES.map(([id,n,d])=>`<button class="listbtn" data-mode="${id}"><span>✧ <strong>${n}</strong><small>${d}</small></span><span>❯</span></button>`).join('')}
function newReading(mode){state.mode=mode;state.chosen=[];const copy=[...DECK];for(let i=copy.length-1;i>0;i--){const bytes=new Uint32Array(1);if(crypto?.getRandomValues)crypto.getRandomValues(bytes);else bytes[0]=Math.floor(Math.random()*4294967295);const j=bytes[0]%(i+1);[copy[i],copy[j]]=[copy[j],copy[i]]}state.deck=copy;state.cards=[];go('pick')}
function pick(){
 const count=state.mode==='1'?1:3;
 return `<section class="camila-table"><div class="camila-table-caption"><strong>Camila te acompaña</strong><span>Respirá, pensá en tu pregunta y elegí ${count===1?'una carta':'tres cartas'} del mazo.</span></div></section>`+
 header('Elegí tus cartas',`Tarot de Marsella · ${state.chosen.length} de ${count} seleccionadas`)+
 `<p class="center muted">Deslizá el mazo hacia los costados para recorrer las 78 cartas.</p><div class="deck-scroll" role="group" aria-label="Mazo completo de 78 cartas"><div class="deck-fan">${state.deck.map((c,i)=>`<button class="fan-card ${state.chosen.includes(i)?'selected':''}" data-pick="${i}" aria-label="Elegir carta ${i+1}" aria-pressed="${state.chosen.includes(i)}" ${state.chosen.length===count&&!state.chosen.includes(i)?'disabled':''}><span class="fan-art">☼<small>✦</small></span></button>`).join('')}</div></div>`+
 `<p class="center muted">${state.chosen.length} de ${count} elegidas</p><div class="chosen-slots">${Array.from({length:count},(_,i)=>`<div class="chosen-slot">${state.chosen[i]===undefined?'☾':'✦'}<small>${['Primera','Segunda','Tercera'][i]}</small></div>`).join('')}</div>`+
 `<button class="btn wide" data-page="result" ${state.chosen.length!==count?'disabled':''}>Revelar ${count===1?'la carta':'las cartas'} ✦</button><button class="btn secondary wide" style="margin-top:10px" id="resetPick">Volver a mezclar</button>`;
}
function positions(){return state.cards.length===1?['Mensaje']:state.mode==='3'?['Pasado','Presente','Futuro']:state.mode==='love'?['Tu energía','El vínculo','Consejo']:state.mode==='work'?['Situación','Desafío','Oportunidad']:['Situación','Lo que influye','Consejo']}
function interpretation(){const pos=positions();return `Camila te acompaña en esta lectura simbólica. ${state.cards.map((c,i)=>`${pos[i]}: ${c.name}. ${c.meaning}`).join(' ')} Tomá aquello que te resulte útil para reflexionar; tus decisiones siempre te pertenecen.`}
function result(){if(!state.cards.length)return tarot();const pos=positions(),message=interpretation();return header('Tu tirada','Interpretación de Camila')+`<div class="cardrow">${state.cards.map((c,i)=>`<div class="tarotcard revealed marseille-face"><span class="marseille-label">TAROT DE MARSEILLE</span><span class="symbol">${c.symbol}</span><span class="name">${escapeHTML(c.name)}</span><span class="pos">${pos[i]}</span></div>`).join('')}</div><section class="panel"><h3>☾ Mensaje de Camila</h3><p>${escapeHTML(message)}</p><div class="speak"><button class="btn" id="speak">▶ Escuchar</button><button class="btn secondary" id="stopSpeak">■ Detener</button></div></section><button class="btn wide" id="saveReading">♡ Guardar tirada</button><button class="btn secondary wide" style="margin-top:10px" data-page="tarot">Hacer otra tirada</button>`}
function shop(){const filtered=PRODUCTS.filter(p=>(state.category==='Todos'||p.category===state.category)&&p.name.toLowerCase().includes(state.search.toLowerCase()));return header('Tienda de Santería','Productos y precios disponibles próximamente')+`<input id="search" class="field" type="search" placeholder="Buscar productos..." value="${escapeHTML(state.search)}" aria-label="Buscar productos"><div class="chips">${CATEGORIES.map(c=>`<button class="chip ${c===state.category?'active':''}" data-category="${c}">${c}</button>`).join('')}</div>${filtered.length?filtered.map(p=>productHTML(p)).join(''):`<section class="panel empty"><div style="font-size:45px">🕯</div><h3>Catálogo en preparación</h3><p>Acá aparecerán las fotos, descripciones y precios reales que proporcione el comercio.</p></section>`}<p class="notice">No se procesan pagos en esta demostración. La disponibilidad y los precios serán confirmados por el comercio.</p>`}
function productHTML(p){return `<article class="panel product"><div class="product-art">${escapeHTML(p.icon||'✧')}</div><div class="product-body"><h3>${escapeHTML(p.name)}</h3><p class="muted">${escapeHTML(p.description||'')}</p><p class="price">${typeof p.price==='number'?p.price.toLocaleString('es-AR',{style:'currency',currency:'ARS'}):'Consultar precio'}</p><button class="smallbtn" data-add="${escapeHTML(p.id)}">Agregar al carrito</button></div></article>`}
function cart(){const lines=state.cart.map(i=>{const p=PRODUCTS.find(p=>p.id===i.id);return p?`<div class="panel row"><div>${escapeHTML(p.name)} × ${i.qty}</div><button class="smallbtn" data-remove="${escapeHTML(i.id)}">Quitar</button></div>`:''}).join('');return header('Mi carrito')+(lines||'<p class="empty">Todavía no agregaste productos.</p>')+`<button class="btn wide" id="order" ${!state.cart.length||!CONFIG.whatsapp?'disabled':''}>Consultar pedido por WhatsApp</button><p class="notice">La opción de pedidos se habilitará cuando el cliente proporcione su WhatsApp comercial y catálogo real. La compra se confirma fuera de la app.</p>`}
function history(){return header('Mis tiradas','Guardadas solamente en este dispositivo')+(state.history.length?state.history.map((h,i)=>`<article class="panel"><p class="muted">${escapeHTML(h.date)}</p><strong>${escapeHTML(h.names.join(' · '))}</strong><p>${escapeHTML(h.message)}</p><button class="smallbtn" data-delete="${i}">Eliminar</button></article>`).join(''):'<p class="empty">Todavía no guardaste ninguna tirada.</p>')+`<button class="btn secondary wide" id="clearHistory" ${!state.history.length?'disabled':''}>Borrar todo el historial</button>`}
function rituals(){return header('Consejos y bienestar','Ideas sencillas para acompañar tus momentos')+[['🕯','Un momento de calma','Elegí un lugar tranquilo, respirá lentamente y dedicá unos minutos a ordenar tus pensamientos.'],['✍','Escritura reflexiva','Anotá una pregunta que quieras explorar y tres posibles maneras de avanzar.'],['☾','Intención del día','Elegí una intención realista y una acción pequeña para ponerla en práctica.']].map(([ico,t,d])=>`<article class="panel"><h3>${ico} ${t}</h3><p>${d}</p></article>`).join('')+'<p class="notice">Los rituales se presentan como prácticas culturales o simbólicas, sin promesas de curación ni resultados garantizados.</p>'}
function about(){return header('Acerca de','Iluminando Almas')+`<section class="panel"><h3>Conocé a Camila</h3><p>Camila te acompaña en las lecturas del Tarot de Marsella, con interpretaciones basadas en sus símbolos tradicionales.</p><p>Versión demostrativa 1.0 · BM-Apps</p></section><div class="actions"><button class="tile" data-page="privacy">Privacidad</button><button class="tile" data-page="terms">Términos</button></div>`}
function contact(){return header('Contacto')+`<section class="panel"><p>Los datos de contacto comercial se incorporarán cuando el cliente los confirme.</p><p>WhatsApp: pendiente</p><p>Correo electrónico: pendiente</p></section>`}
function legal(type){return header(type==='privacy'?'Política de privacidad':'Términos de uso')+`<div class="panel"><p>Consultá el documento completo:</p><a class="btn wide" href="${type==='privacy'?'privacy.html':'terms.html'}" target="_blank" rel="noopener">Abrir documento</a></div>`}
function render(){const pages={home,tarot,pick,result,shop,cart,history,rituals,horoscope,journal,compatibility,profile,about,contact,privacy:()=>legal('privacy'),terms:()=>legal('terms')};document.body?.classList?.toggle('official-home-active',state.page==='home');$('app').innerHTML=(pages[state.page]||home)();$('cartCount').textContent=state.cart.reduce((n,i)=>n+i.qty,0)||'';$('back').textContent=state.page==='home'?'☰':'‹';document.querySelectorAll('.bottom button').forEach(b=>b.style.opacity=b.dataset.page===state.page?'1':'.65');}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.page){if(b.dataset.page==='result'&&state.chosen.length!==state.cards.length)return;go(b.dataset.page)}else if(b.dataset.mode)newReading(b.dataset.mode);else if(b.dataset.pick!==undefined){const n=Number(b.dataset.pick);if(!state.chosen.includes(n)&&state.chosen.length<(state.mode==='1'?1:3)){state.chosen.push(n);state.cards=state.chosen.map(i=>state.deck[i]);render()}}else if(b.dataset.category){state.category=b.dataset.category;render()}else if(b.dataset.add){const p=PRODUCTS.find(p=>p.id===b.dataset.add);if(!p)return;const entry=state.cart.find(i=>i.id===p.id);entry?entry.qty++:state.cart.push({id:p.id,qty:1});save('ia_cart',state.cart);render();toast('Producto agregado')}else if(b.dataset.remove){state.cart=state.cart.filter(i=>i.id!==b.dataset.remove);save('ia_cart',state.cart);render()}else if(b.dataset.delete!==undefined){state.history.splice(Number(b.dataset.delete),1);save('ia_history',state.history);render()}else if(b.id==='resetPick')newReading(state.mode);else if(b.id==='speak')speak(interpretation());else if(b.id==='stopSpeak')stopVoice();else if(b.id==='saveReading'){state.history.unshift({date:new Date().toLocaleString('es-AR'),names:state.cards.map(c=>c.name),message:interpretation()});state.history=state.history.slice(0,50);save('ia_history',state.history);toast('Tirada guardada')}else if(b.id==='clearHistory'){if(confirm('¿Borrar todas las tiradas guardadas?')){state.history=[];save('ia_history',[]);render()}}else if(b.id==='order'){if(!CONFIG.whatsapp)return;const msg='Hola, quisiera consultar estos productos: '+state.cart.map(i=>{const p=PRODUCTS.find(p=>p.id===i.id);return p?`${p.name} x${i.qty}`:''}).join(', ');window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`,'_blank','noopener')}});
document.addEventListener('input',e=>{if(e.target.id==='search'){const start=e.target.selectionStart;state.search=e.target.value;render();const f=$('search');f.focus();f.setSelectionRange(start,start)}});
$('back').addEventListener('click',()=>go(state.page==='home'?'about':'home'));$('cartBtn').addEventListener('click',()=>go('cart'));
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});

/* Iluminando Almas v2 — visual celestial y experiencias locales. */
const SIGNS=['Aries','Tauro','Géminis','Cáncer','Leo','Virgo','Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis'];
const DAILY_THEMES=[
 ['Renovación y claridad','Una oportunidad para observar qué querés comenzar. Elegí hoy un paso pequeño y posible.'],
 ['Calma y equilibrio','Permitite avanzar a tu ritmo. Darte un momento para pensar también es una decisión.'],
 ['Creatividad y confianza','Hacé lugar a una idea que te entusiasme; anotala y buscá una manera sencilla de probarla.'],
 ['Conexión y gratitud','Una conversación o gesto amable puede ayudarte a mirar el día con otros ojos.'],
 ['Intuición y perspectiva','Escuchá tus emociones, sin dejar de considerar los hechos antes de decidir.']
];
const RITUALS=[
 {id:'luna',icon:'☾',title:'Ritual de luna',desc:'Una pausa para definir una intención.',steps:['Buscá un momento tranquilo.','Escribí una intención concreta para esta semana.','Elegí una acción pequeña que dependa de vos.']},
 {id:'calma',icon:'✧',title:'Limpieza energética',desc:'Un ejercicio simbólico de renovación.',steps:['Ordená un rincón de tu espacio.','Respirá con tranquilidad un minuto.','Anotá algo que quieras dejar atrás.']},
 {id:'afirmacion',icon:'✿',title:'Afirmación del día',desc:'Palabras amables para acompañarte.',steps:['Elegí una palabra que necesites hoy.','Decí en voz alta: «Puedo avanzar a mi ritmo».','Escribí algo que hayas logrado.']}
];
const todayId=()=>new Date().toLocaleDateString('en-CA');
function dailyIndex(salt=0){const s=todayId();let n=2166136261;for(const ch of s){n=Math.imul(n^ch.charCodeAt(0),16777619)}return Math.abs((n>>>0)+salt)}
function dailyReading(){state.mode='1';state.cards=[DECK[dailyIndex()%DECK.length]];state.chosen=[0];go('result')}
function home(){
 return `<section class="official-home" aria-label="Iluminando Almas. Inicio">
 <h1 class="sr-only">Iluminando Almas</h1>
 <img src="assets/home-official.webp" width="710" height="1218" alt="Bienvenida a Iluminando Almas. Mujer mística con cartas de tarot, cielo estrellado violeta, energía de hoy, tirada del día y accesos a lecturas, horóscopo, rituales, diario y compatibilidad." fetchpriority="high" decoding="async">
 <button class="official-hit" style="left:3%;top:1%;width:12%;height:7%" data-page="profile" aria-label="Abrir menú y mi espacio"></button>
 <button class="official-hit" style="left:88%;top:1%;width:10%;height:8%" data-page="history" aria-label="Ver mis tiradas guardadas"></button>
 <button class="official-hit" style="left:3%;top:35%;width:94%;height:14.5%" data-energy="1" aria-label="Leer la energía de hoy"></button>
 <button class="official-hit" style="left:6%;top:63%;width:42%;height:7%" data-daily="1" aria-label="Hacer mi tirada del día"></button>
 <button class="official-hit" style="left:2%;top:72.5%;width:32%;height:14.6%" data-page="tarot" aria-label="Lectura interactiva de tarot"></button>
 <button class="official-hit" style="left:35%;top:72.5%;width:31%;height:14.6%" data-page="horoscope" aria-label="Horóscopo"></button>
 <button class="official-hit" style="left:67%;top:72.5%;width:31%;height:14.6%" data-page="rituals" aria-label="Rituales"></button>
 <button class="official-hit" style="left:2%;top:87.4%;width:47%;height:12.6%" data-page="journal" aria-label="Diario espiritual"></button>
 <button class="official-hit" style="left:50%;top:87.4%;width:48%;height:12.6%" data-page="compatibility" aria-label="Compatibilidad"></button>
 </section>`;
}
function profile(){
 return header('Mi espacio','Tus opciones de Iluminando Almas')+
 `<section class="panel"><h3>Bienvenida a tu rincón</h3><p>Las lecturas y reflexiones que decidas guardar permanecen en este dispositivo.</p></section>
 <div class="actions"><button class="tile" data-page="history">Mis tiradas</button><button class="tile" data-page="journal">Diario espiritual</button><button class="tile" data-page="shop">Tienda</button><button class="tile" data-page="about">Acerca de</button><button class="tile" data-page="privacy">Privacidad</button><button class="tile" data-page="terms">Términos</button></div>`;
}
function horoscope(){
 const sign=state.sign||read('ia_sign','Aries');const d=DAILY_THEMES[dailyIndex(SIGNS.indexOf(sign)*29)%DAILY_THEMES.length];
 return header('Horóscopo de hoy','Una invitación simbólica a mirar tu día')+`<section class="panel horoscope-panel"><div class="zodiac-wheel" aria-hidden="true">✦<span>☾</span></div><label for="sign">Elegí tu signo</label><select id="sign" class="field">${SIGNS.map(s=>`<option ${s===sign?'selected':''}>${s}</option>`).join('')}</select><p class="eyebrow">${escapeHTML(todayId())} · ${escapeHTML(sign)}</p><h3>${escapeHTML(d[0])}</h3><p>${escapeHTML(d[1])}</p><p class="muted">Contenido recreativo, no predice acontecimientos.</p></section><button class="btn secondary wide" data-page="compatibility">Explorar compatibilidad</button>`;
}
function compatibility(){
 const a=state.signA||'Aries',b=state.signB||'Libra';
 const idx=(SIGNS.indexOf(a)*5+SIGNS.indexOf(b)*7)%DAILY_THEMES.length;
 const words=['Comunicación','Respeto','Espacios personales','Proyectos compartidos','Escucha y empatía'];
 return header('Compatibilidad zodiacal','Una mirada lúdica a dos signos')+`<section class="panel"><div class="zodiac-pair"><div><label for="signA">Primer signo</label><select id="signA" class="field">${SIGNS.map(s=>`<option ${s===a?'selected':''}>${s}</option>`).join('')}</select></div><strong>♡</strong><div><label for="signB">Segundo signo</label><select id="signB" class="field">${SIGNS.map(s=>`<option ${s===b?'selected':''}>${s}</option>`).join('')}</select></div></div><h3>${escapeHTML(a)} + ${escapeHTML(b)}</h3><p>Para reflexionar sobre este vínculo, probá poner en primer plano: <strong>${words[idx]}</strong>.</p><p class="muted">Los signos no determinan la compatibilidad real ni el destino de una relación.</p></section>`;
}
function rituals(){
 const selected=RITUALS.find(r=>r.id===state.selectedRitual)||RITUALS[0];
 const done=read('ia_ritual_done',{});
 return header('Tu espacio sagrado','Prácticas simbólicas para conectar con tu día')+`<section class="ritual-tiles">${RITUALS.map(r=>`<button class="ritual-tile ${r.id===selected.id?'active':''}" data-ritual="${r.id}"><b>${r.icon}</b><strong>${r.title}</strong><small>${r.desc}</small></button>`).join('')}</section>
 <section class="panel"><span class="eyebrow">☾ MOMENTO PARA VOS</span><h3>${selected.icon} ${selected.title}</h3><p>${selected.desc}</p><ol class="ritual-steps">${selected.steps.map(t=>`<li>${t}</li>`).join('')}</ol><button class="btn wide" data-complete-ritual="${selected.id}">${done[todayId()+':'+selected.id]?'✓ Práctica completada':'Marcar como realizada'}</button></section>
 <p class="notice">Estas actividades son recreativas y de introspección. No garantizan resultados espirituales ni sustituyen atención profesional.</p>`;
}
function journal(){
 const entries=read('ia_journal',[]), mood=state.journalMood||'Tranquilidad',draft=state.journalDraft||'';
 const moods=['Alegría','Tranquilidad','Energía','Sensibilidad','Preocupación','Tristeza'];
 return header('Diario espiritual','Un lugar privado para registrar cómo te sentís')+`<section class="panel diary-panel"><span class="eyebrow">✿ TU MOMENTO DE HOY</span><h3>¿Cómo te sentís?</h3><div class="mood-choices" role="group" aria-label="Elegir emoción">${moods.map(m=>`<button class="chip ${m===mood?'active':''}" data-mood="${m}" aria-pressed="${m===mood}">${m}</button>`).join('')}</div><label for="entry">Tu reflexión</label><textarea id="entry" class="field" rows="5" maxlength="800" placeholder="Escribí algo que agradezcas, una intención o un pensamiento...">${escapeHTML(draft)}</textarea><button class="btn wide" id="saveJournal">Guardar en mi diario</button><p class="muted">Se guarda únicamente en este dispositivo.</p></section>
 <h2 class="section-title">Mis reflexiones</h2>${entries.length?entries.map((entry,i)=>`<article class="panel diary-entry"><div class="row"><small class="muted">${escapeHTML(entry.date)}</small><button class="smallbtn" data-remove-entry="${i}" aria-label="Eliminar entrada">Eliminar</button></div><strong>${escapeHTML(entry.mood)}</strong><p>${escapeHTML(entry.note)}</p></article>`).join(''):'<p class="empty">Todavía no escribiste en tu diario.</p>'}`;
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.daily!==undefined)dailyReading();
 else if(b.dataset.energy!==undefined){const d=DAILY_THEMES[dailyIndex()%DAILY_THEMES.length];toast(d[0]+': '+d[1])}
 else if(b.dataset.ritual){state.selectedRitual=b.dataset.ritual;render()}
 else if(b.dataset.completeRitual){const done=read('ia_ritual_done',{});done[todayId()+':'+b.dataset.completeRitual]=true;save('ia_ritual_done',done);render();toast('Tu práctica quedó registrada')}
 else if(b.dataset.mood){state.journalMood=b.dataset.mood;state.journalDraft=$('entry')?.value||'';render()}
 else if(b.id==='saveJournal'){const note=$('entry')?.value.trim();if(!note){toast('Escribí tu reflexión primero');return}const arr=read('ia_journal',[]);arr.unshift({date:new Date().toLocaleString('es-AR'),mood:state.journalMood||'Tranquilidad',note});save('ia_journal',arr.slice(0,100));state.journalDraft='';render();toast('Reflexión guardada')}
 else if(b.dataset.removeEntry!==undefined){if(!confirm('¿Eliminar esta reflexión?'))return;const arr=read('ia_journal',[]);arr.splice(Number(b.dataset.removeEntry),1);save('ia_journal',arr);render()}
});
document.addEventListener('input',e=>{if(e.target.id==='entry')state.journalDraft=e.target.value});
document.addEventListener('change',e=>{
 if(e.target.id==='sign'){state.sign=e.target.value;save('ia_sign',state.sign);render()}
 if(e.target.id==='signA'){state.signA=e.target.value;render()}
 if(e.target.id==='signB'){state.signB=e.target.value;render()}
});

render();
