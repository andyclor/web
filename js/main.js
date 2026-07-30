const CONFIG = window.ANDYCLOR_CONFIG || {};
function aplicarConfiguracion(){
  const wa=(CONFIG.whatsapp||'5491168306266').replace(/\D/g,'');
  const waLink=(mensaje='')=>`https://wa.me/${wa}${mensaje?`?text=${encodeURIComponent(mensaje)}`:''}`;
  const oferta=CONFIG.oferta||{};
  if(oferta.producto) document.getElementById('ofertaProducto').textContent=oferta.producto;
  if(oferta.texto) document.getElementById('ofertaTexto').textContent=oferta.texto;
  if(oferta.precio){
    const precioCompleto=String(oferta.precio);
    const coincidencia=precioCompleto.match(/\$\s?[\d.]+(?:,[\d]{1,2})?/g);
    const numero=coincidencia ? coincidencia[coincidencia.length-1].replace(/\s+/g,'') : precioCompleto;
    const condicion=precioCompleto
      .replace(numero,'')
      .replace(/[,;:\-]\s*$/,'')
      .replace(/\s{2,}/g,' ')
      .trim();
    document.getElementById('ofertaPrecio').textContent=numero;
    const condicionEl=document.getElementById('ofertaCondicion');
    if(condicionEl){
      condicionEl.textContent=condicion || 'Oferta vigente';
      condicionEl.hidden=!condicion;
    }
  }

document.getElementById('ofertaWhatsApp').href=waLink(oferta.mensajeWhatsApp||`Hola ANDYCLOR. Quiero consultar la oferta de ${oferta.producto||'la página'}.`);
  const vigencia=document.getElementById('ofertaVigencia');
  if(oferta.vigencia){vigencia.textContent='Vigencia: '+oferta.vigencia;vigencia.hidden=false;}else vigencia.hidden=true;
  document.getElementById('whatsappFlotante').href=waLink(CONFIG.mensajeGeneral||'Hola ANDYCLOR. Quiero consultar precios.');
  document.getElementById('contactWhatsApp').href=waLink(CONFIG.mensajeGeneral||'Hola ANDYCLOR. Quiero consultar precios.');
  document.getElementById('cotizacionWhatsApp').href=waLink(CONFIG.mensajeCotizacion||'Hola ANDYCLOR. Quisiera solicitar una cotización.');
  const contacto=CONFIG.contacto||{};
  const setInfo=(id,valor,prefijo='')=>{const el=document.getElementById(id);if(!valor){el.style.display='none';return;}el.textContent=prefijo+valor;};
  setInfo('contactDireccion',contacto.direccion,'📍 '); setInfo('contactHorario',contacto.horarios,'🕒 ');
  const email=document.getElementById('contactEmail'); if(contacto.email){email.textContent='✉️ '+contacto.email;email.href='mailto:'+contacto.email}else email.style.display='none';
  const redes=CONFIG.redes||{};
  configurarRed('socialInstagram',redes.instagram,'Próximamente');
  configurarRed('socialFacebook',redes.facebook,'Próximamente');
  configurarRed('socialMercadoLibre',redes.mercadoLibre,'Próximamente');
  // Actualiza todos los botones de WhatsApp conservando el mensaje particular de cada uno.
  document.querySelectorAll('a[href*="wa.me/"]').forEach(el=>{
    try{const url=new URL(el.href);

const mensaje=url.searchParams.get('text')||'';el.href=waLink(mensaje);}catch(e){}
  });
  renderPromociones(CONFIG.promociones||[],waLink);
  const visibles=CONFIG.productosVisibles||{};
  document.querySelectorAll('[data-producto]').forEach(card=>{const key=card.dataset.producto;if(visibles[key]===false)card.style.display='none';});
}

function renderPromociones(promociones,waLink){
  const cont=document.getElementById('promocionesFuturas');
  if(!cont||!Array.isArray(promociones)||promociones.length===0){if(cont)cont.hidden=true;return;}
  cont.innerHTML='<h3>Otras promociones</h3><div class="future-promotions-grid">'+promociones.map(p=>`<article><h4>${p.producto||'Promoción'}</h4><p>${p.texto||''}</p>${p.precio?`<strong>${p.precio}</strong>`:''}<a class="btn primary" target="_blank" rel="noopener" href="${waLink(p.mensajeWhatsApp||`Hola ANDYCLOR. Quiero consultar por ${p.producto||'esta promoción'}.`)}">Consultar</a></article>`).join('')+'</div>';
  cont.hidden=false;
}

function configurarRed(id,enlace,textoPendiente){
  const el=document.getElementById(id); if(!el)return;
  if(enlace){el.href=enlace;el.classList.remove('proximamente');}
  else{el.removeAttribute('target');el.href='#';el.classList.add('proximamente');el.addEventListener('click',e=>e.preventDefault());

const small=el.querySelector('small');small.textContent=textoPendiente;}
}

document.addEventListener('DOMContentLoaded',aplicarConfiguracion);
const nav=document.getElementById('navbar'), menu=document.getElementById('menuToggle'), links=document.getElementById('navLinks');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40));
menu.addEventListener('click',()=>links.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
function sugerirPresentacionKg(kg){
  if(kg<=1) return '1 kg';
  if(kg<=5) return '5 kg';
  if(kg<=10) return '10 kg';
  return '50 kg o consultar cantidad mayorista';
}

function sugerirPresentacionPastillas(pastillasPorMes){
  // Para venta práctica, la calculadora sugiere compra aproximada para un mes.
  // La compra mínima sugerida es 1 kg, equivalente a 5 pastillas de 200 g.
  if(pastillasPorMes<=5) return '1 kg';
  if(pastillasPorMes<=25) return '5 kg';
  if(pastillasPorMes<=50) return '10 kg';
  return 'cuñete de 50 kg o consultar cantidad mayorista';
}

function calcularPileta(){
 const largo=+document.getElementById('largo').value, ancho=+document.getElementById('ancho').value, profundidad=+document.getElementById('profundidad').value;
 const tipo=document.getElementById('tipoPileta').value, mant=document.getElementById('mantenimiento').value, temporada=document.getElementById('temporada').value, res=document.getElementById('resultadoCalculadora');
 if(!largo||!ancho||!profundidad||largo<=0||ancho<=0||profundidad<=0){res.innerHTML='<h3>Resultado</h3><p class="error">Completá largo, ancho y profundidad con valores válidos.</p>';return;}
 const litros=Math.round(largo*ancho*profundidad*1000);
 const tipoTxt=tipo==='revestida'?'Revestida / Venecitas':'Fibra o Pintada';
 const mantTxt={pastillas:'Solo Pastillas Multiacción',granulado:'Solo Cloro Granulado',granulado_multiaccion:'Granulado Rápido Multiacción',ambos:'Pastillas + Cloro Granulado'}[mant];
 const tempTxt=temporada==='alta'?'Temporada alta':'Temporada baja';
 const esMultiaccion=mant==='granulado_multiaccion';
 const cloroNombre=esMultiaccion?'Cloro Granulado Rápido Multiacción':(tipo==='revestida'?'Cloro Granulado Lento':'Cloro Granulado Rápido');
 const cloroGramos=Math.ceil((litros/40000)*80);
 const cloroFrecuencia=temporada==='alta'?'por día':'por semana';
 const cloroCompraKg=temporada==='alta' ? Math.ceil((cloroGramos*30/1000)*10)/10 : Math.ceil((cloroGramos*4/1000)*10)/10;
 const cloroPeriodo=temporada==='alta'?'aprox. un mes de temporada alta':'aprox. un mes de temporada baja';
 const pastillas=Math.max(1,Math.ceil(litros/20000));
 const pastillasFrecuencia=temporada==='alta'?'por semana':'por mes';
 const pastillasPorMes=temporada==='alta'?pastillas*4:pastillas;
 const compraPastillas=sugerirPresentacionPastillas(pastillasPorMes);
 // Dosificaciones Nataclor.
 // Alguicida: 400 cc cada 40.000 L semanal; 800 cc cada 40.000 L ante fuerte presencia de algas.
 // Clarificador: 250 cc cada 50.000 L.
 const algSem=Math.ceil((litros/40000)*400);
 const algChoque=Math.ceil((litros/40000)*800);
 const clarDosis=Math.ceil((litros/50000)*250);
 let items='', compra=[];
 if(mant==='granulado'||mant==='ambos'||mant==='granulado_multiaccion'){
   const clase = esMultiaccion ? 'item-pastillas' : (tipo==='revestida'?'item-lento':'item-rapido');
   items+=`<div class="result-item ${clase}"><strong>🧪 ${cloroNombre}</strong><span>${cloroGramos} g ${cloroFrecuencia}.</span><small>Regla Andyclor: 80 g cada 40.000 litros ${temporada==='alta'?'por día en temporada alta':'por semana en temporada baja'}. Compra sugerida: ${sugerirPresentacionKg(cloroCompraKg)} para ${cloroPeriodo}.</small></div>`;
   compra.push(`${cloroNombre}: ${cloroGramos} g ${cloroFrecuencia}. Presentación sugerida: ${sugerirPresentacionKg(cloroCompraKg)}`);
 }
 if(mant==='pastillas'||mant==='ambos'){
   items+=`<div class="result-item item-pastillas"><strong>🟣 Pastillas Multiacción</strong><span>${pastillas} pastilla(s) de 200 g ${pastillasFrecuencia}.</span><small>Compra sugerida para 1 mes aprox.: ${compraPastillas}.</small><small>Regla Andyclor: 1 pastilla cada 20.000 litros ${temporada==='alta'?'una vez por semana en temporada alta':'por mes en temporada baja'}. 1 kg equivale a 5 pastillas.</small></div>`;
   compra.push(`Pastillas Multiacción: ${pastillas} pastilla(s) ${pastillasFrecuencia}. Compra sugerida para 1 mes aprox.: ${compraPastillas}`);
 }
 if(mant==='pastillas'){
   if(tipo==='fibra_pintada'){
     items+=`<div class="result-item note"><strong>💡 Recuperación</strong><span>Para clientes que mantienen con pastillas, conviene tener Cloro Granulado Rápido solo para shock o recuperación cuando el agua lo requiera.</span></div>`;
     compra.push('Opcional recuperación: Cloro Granulado Rápido');
   } else {
     items+=`<div class="result-item note"><strong>💡 Recuperación</strong><span>Para tratamientos puntuales, consultar dosis según el estado del agua.</span></div>`;
   }
 }
 if(esMultiaccion){
   items+=`<div class="result-item note"><strong>🟣 Multiacción</strong><span>Apto para cualquier tipo de pileta. Ajustá los complementos según el estado real del agua y las indicaciones de la etiqueta.</span></div>`;
 }
 items+=`<div class="result-item item-alguicida"><strong>🟦 Alguicida Nataclor</strong><span>Mantenimiento: ${algSem} cc por semana.</span><small>Ante fuerte presencia de algas: ${algChoque} cc. Aplicar sin bañistas y recircular durante 3 horas.</small></div><div class="result-item item-clarificador"><strong>💧 Clarificador Nataclor</strong><span>${clarDosis} cc por aplicación.</span><small>Diluir en un balde con 10 litros de agua, aplicar por la noche y pasar el limpiafondo por la mañana.</small></div>`;
 compra.push('Alguicida: 1 litro','Clarificador: 1 litro');
 const tema = mant==='pastillas' ? 'tema-pastillas' : (mant==='granulado' ? (tipo==='revestida' ? 'tema-lento' : 'tema-rapido') : (mant==='granulado_multiaccion' ? 'tema-pastillas' : 'tema-mixto'));
 res.className = 'calc-result ' + tema;
 const msg=encodeURIComponent(`Hola Andyclor. Quiero solicitar presupuesto de este tratamiento.\nPileta: ${tipoTxt}\nMedidas: ${largo} m x ${ancho} m x ${profundidad} m\nLitros aprox.: ${litros.toLocaleString('es-AR')}\nMantenimiento: ${mantTxt}\nTemporada: ${tempTxt}\nProductos sugeridos:\n- ${compra.join('\n- ')}\nGracias.`);
 res.innerHTML=`<h3>Resultado para tu pileta</h3><div class="litros-box"><strong>${litros.toLocaleString('es-AR')} litros aprox.</strong><span>${tipoTxt}</span><span>${mantTxt}</span><span>${tempTxt}</span></div><div class="result-grid">${items}</div><div class="recommend"><strong>Recomendaciones:</strong><p>Mantener pH entre 7,2 y 7,6. Filtrar entre 6 y 8 horas diarias en temporada. Las dosis son orientativas y pueden variar por clima, uso, lluvia y estado del agua.</p></div><a class="btn primary" target="_blank" href="https://wa.me/${(CONFIG.whatsapp||'5491168306266').replace(/\D/g,'')}?text=${msg}">Solicitar presupuesto de este tratamiento</a>`;
}
