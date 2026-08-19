'use strict';

const CONFIG = window.ANDYCLOR_CONFIG || {};

const getWhatsAppNumber = () => String(CONFIG.contacto?.whatsapp || CONFIG.whatsapp || '5491168306266').replace(/\D/g, '');

function detectTrafficSource() {
  const params = new URLSearchParams(window.location.search);
  const rawUtmSource = (params.get('utm_source') || '').replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ _.-]/g, '').trim().slice(0, 40);
  const referrer = document.referrer.toLowerCase();

  let source = rawUtmSource;
  if (!source && referrer.includes('chatgpt.com')) source = 'ChatGPT';
  else if (!source && referrer.includes('perplexity.ai')) source = 'Perplexity';
  else if (!source && (referrer.includes('copilot.microsoft.com') || referrer.includes('bing.com'))) source = 'Bing/Copilot';
  else if (!source && referrer.includes('claude.ai')) source = 'Claude';
  else if (!source && referrer.includes('gemini.google.com')) source = 'Gemini';
  else if (!source && referrer.includes('meta.ai')) source = 'Meta AI';
  else if (!source && referrer.includes('you.com')) source = 'You.com';
  else if (!source && referrer.includes('search.brave.com')) source = 'Brave Search';
  else if (!source && referrer.includes('google.')) source = 'Google';
  else if (!source && referrer.includes('instagram.com')) source = 'Instagram';
  else if (!source && referrer.includes('facebook.com')) source = 'Facebook';
  else if (!source && referrer && !referrer.includes('andyclor.com.ar')) source = 'Otro sitio';

  try {
    if (source) sessionStorage.setItem('andyclor_visit_source', source);
    return source || sessionStorage.getItem('andyclor_visit_source') || 'Directo';
  } catch (_) {
    return source || 'Directo';
  }
}

function attributedMessage(message = '') {
  const source = detectTrafficSource();
  if (!message || source === 'Directo' || /Origen web:/i.test(message)) return message;
  return `${message}\n\nOrigen web: ${source}.`;
}

function isMobileDevice() {
  const userAgent = navigator.userAgent || '';
  const isIPadDesktopMode = /Macintosh/i.test(userAgent) && Number(navigator.maxTouchPoints || 0) > 1;
  return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i.test(userAgent) || isIPadDesktopMode;
}

function directWhatsAppLink(message = '') {
  const phone = getWhatsAppNumber();
  const text = message ? `&text=${encodeURIComponent(message)}` : '';

  if (isMobileDevice()) {
    return `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
  }

  return `https://web.whatsapp.com/send?phone=${phone}${text}`;
}

const whatsappLink = (message = '') => directWhatsAppLink(attributedMessage(message));

let analyticsInitialized = false;

function trackSiteEvent(eventName, parameters = {}) {
  if (typeof window.gtag !== 'function') setupOptionalAnalytics();
  if (typeof window.gtag !== 'function') return;

  const measurementId = String(CONFIG.analytics?.ga4Id || '').trim();
  window.gtag('event', eventName, {
    page_path: window.location.pathname,
    traffic_source: detectTrafficSource(),
    transport_type: 'beacon',
    ...(/^G-[A-Z0-9]+$/i.test(measurementId) ? { send_to: measurementId } : {}),
    ...parameters
  });
}

function setupOptionalAnalytics() {
  if (analyticsInitialized) return;
  const measurementId = String(CONFIG.analytics?.ga4Id || '').trim();
  if (!/^G-[A-Z0-9]+$/i.test(measurementId)) return;
  analyticsInitialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { anonymize_ip: true });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

function decorateWhatsAppLink(link) {
  if (!link) return;
  const isWhatsApp = /https:\/\/(?:wa\.me\/|web\.whatsapp\.com\/send)/i.test(link.href);
  if (!isWhatsApp && link.dataset.whatsappLink !== 'true') return;

  try {
    const url = new URL(link.href);
    const source = detectTrafficSource();
    const originalMessage = link.dataset.whatsappMessage ||
      url.searchParams.get('text') ||
      (source !== 'Directo'
        ? CONFIG.mensajeGeneral || 'Hola ANDYCLOR. Quiero realizar una consulta.'
        : '');

    link.dataset.whatsappLink = 'true';
    link.dataset.whatsappMessage = originalMessage;
    link.href = directWhatsAppLink(attributedMessage(originalMessage));
  } catch (_) {
    // Conserva el enlace original si el navegador no puede interpretarlo.
  }
}

const WHATSAPP_LINK_SELECTOR = [
  'a[data-whatsapp-link="true"]',
  'a[href*="wa.me/"]',
  'a[href*="web.whatsapp.com/send"]'
].join(', ');

let whatsappTrackingInitialized = false;

function findWhatsAppLink(target) {
  if (!(target instanceof Element)) return null;
  return target.closest(WHATSAPP_LINK_SELECTOR);
}

function handleWhatsAppClick(event) {
  const link = findWhatsAppLink(event.target);
  if (!link) return;

  decorateWhatsAppLink(link);
  trackSiteEvent('whatsapp_click', {
    event_category: 'Contacto',
    contact_method: 'WhatsApp',
    link_label: (link.textContent || 'WhatsApp').trim().slice(0, 80),
    link_url: link.href
  });
}

function activateWhatsappTracking() {
  if (whatsappTrackingInitialized) return;
  whatsappTrackingInitialized = true;
  document.addEventListener('click', handleWhatsAppClick, { capture: true });
}

function setupWhatsappTracking() {
  document.querySelectorAll(WHATSAPP_LINK_SELECTOR).forEach(decorateWhatsAppLink);
  activateWhatsappTracking();
}

// Se activa al evaluar el archivo, sin depender de otras funciones de inicio.
// El modo captura registra el contacto antes de que WhatsApp abra otra pestaña.
setupOptionalAnalytics();
activateWhatsappTracking();

function setupSeoBreadcrumbs() {
  const main = document.querySelector('main');
  const filename = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  if (!main || filename === 'index.html' || main.querySelector('.seo-breadcrumb')) return;

  const pageMap = {
    'cloro-piletas.html': { label: 'Cloro para Piletas' },
    'granulado-rapido.html': { label: 'Granulado Rápido (Dicloro)', parent: ['Cloro para Piletas', 'cloro-piletas.html'] },
    'granulado-lento.html': { label: 'Granulado Lento (Tricloro)', parent: ['Cloro para Piletas', 'cloro-piletas.html'] },
    'granulado-multiaccion.html': { label: 'Granulado Multiacción', parent: ['Cloro para Piletas', 'cloro-piletas.html'] },
    'pastillas-multiaccion.html': { label: 'Pastillas Multiacción', parent: ['Cloro para Piletas', 'cloro-piletas.html'] },
    'alguicida-clarificador.html': { label: 'Alguicida y Clarificador' },
    'accesorios-piletas.html': { label: 'Accesorios para Piletas' },
    'liquidos-papeles.html': { label: 'Líquidos y Papeles' },
    'calculadora.html': { label: 'Calculadora para Piletas' },
    'mayoristas.html': { label: 'Venta Mayorista' },
    'academia.html': { label: 'Academia ANDYCLOR' },
    'como-recuperar-agua-verde-pileta.html': { label: 'Cómo Recuperar el Agua Verde', parent: ['Academia ANDYCLOR', 'academia.html'] },
    'como-mantener-agua-cristalina-pileta.html': { label: 'Cómo Mantener el Agua Cristalina', parent: ['Academia ANDYCLOR', 'academia.html'] },
    'contacto.html': { label: 'Contacto' },
    'cloro-para-piletas-adrogue.html': { label: 'Cloro para Piletas en Adrogué', parent: ['Cloro para Piletas', 'cloro-piletas.html'] }
  };

  const page = pageMap[filename] || {
    label: document.querySelector('h1')?.textContent.trim() || document.title.split('|')[0].trim()
  };
  const items = [{ label: 'Inicio', href: 'index.html', absolute: 'https://andyclor.com.ar/' }];
  if (page.parent) {
    items.push({
      label: page.parent[0],
      href: page.parent[1],
      absolute: `https://andyclor.com.ar/${page.parent[1]}`
    });
  }
  const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href.split('?')[0];
  items.push({ label: page.label, absolute: canonical });

  const nav = document.createElement('nav');
  nav.className = 'seo-breadcrumb';
  nav.setAttribute('aria-label', 'Ruta de navegación');
  items.forEach((item, index) => {
    if (index > 0) {
      const separator = document.createElement('span');
      separator.setAttribute('aria-hidden', 'true');
      separator.textContent = '›';
      nav.appendChild(separator);
    }
    if (item.href) {
      const anchor = document.createElement('a');
      anchor.href = item.href;
      anchor.textContent = item.label;
      nav.appendChild(anchor);
    } else {
      const current = document.createElement('span');
      current.setAttribute('aria-current', 'page');
      current.textContent = item.label;
      nav.appendChild(current);
    }
  });
  main.prepend(nav);

  const structuredData = document.createElement('script');
  structuredData.type = 'application/ld+json';
  structuredData.dataset.generatedBreadcrumb = 'true';
  structuredData.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.absolute
    }))
  });
  document.head.appendChild(structuredData);
}

function setText(id, value, prefix = '') {
  const element = document.getElementById(id);
  if (!element) return;
  if (!value) {
    element.hidden = true;
    return;
  }
  element.textContent = prefix + value;
}

function configureSocial(id, url, pendingLabel = 'Próximamente') {
  const element = document.getElementById(id);
  if (!element) return;

  if (url && /^https?:\/\//i.test(url)) {
    element.href = url;
    element.classList.remove('proximamente');
    return;
  }

  element.href = '#';
  element.removeAttribute('target');
  element.classList.add('proximamente');
  element.addEventListener('click', event => event.preventDefault());
  const label = element.querySelector('small');
  if (label) label.textContent = pendingLabel;
}

function applyConfiguration() {
  const offer = CONFIG.oferta || {};

  if (offer.producto) setText('ofertaProducto', offer.producto);
  if (offer.texto) setText('ofertaTexto', offer.texto);

  if (offer.precio) {
    const fullPrice = String(offer.precio);
    const matches = fullPrice.match(/\$\s?[\d.]+(?:,[\d]{1,2})?/g);
    const number = matches ? matches[matches.length - 1].replace(/\s+/g, '') : fullPrice;
    const condition = fullPrice
      .replace(number, '')
      .replace(/[,;:\-]\s*$/, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    setText('ofertaPrecio', number);
    const conditionElement = document.getElementById('ofertaCondicion');
    if (conditionElement) {
      conditionElement.textContent = condition || 'Oferta vigente';
      conditionElement.hidden = !condition;
    }
  }

  const offerButton = document.getElementById('ofertaWhatsApp');
  if (offerButton) {
    offerButton.href = whatsappLink(
      offer.mensajeWhatsApp ||
      `Hola ANDYCLOR. Quiero consultar la oferta de ${offer.producto || 'la página'}.`
    );
  }

  const validity = document.getElementById('ofertaVigencia');
  if (validity) {
    if (offer.vigencia) {
      validity.textContent = `Vigencia: ${offer.vigencia}`;
      validity.hidden = false;
    } else {
      validity.hidden = true;
    }
  }

  const generalMessage = CONFIG.mensajeGeneral || 'Hola ANDYCLOR. Quiero consultar precios.';
  const quoteMessage = CONFIG.mensajeCotizacion || 'Hola ANDYCLOR. Quisiera solicitar una cotización.';

  ['whatsappFlotante', 'contactWhatsApp', 'quickWhatsApp', 'mobileWhatsApp'].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.href = whatsappLink(generalMessage);
  });

  const quoteButton = document.getElementById('cotizacionWhatsApp');
  if (quoteButton) quoteButton.href = whatsappLink(quoteMessage);

  const contact = CONFIG.contacto || {};
  setText('contactDireccion', contact.direccion, '📍 ');
  setText('contactHorario', contact.horarios, '🕒 ');

  const email = document.getElementById('contactEmail');
  if (email) {
    if (contact.email) {
      email.hidden = false;
      email.textContent = `✉️ ${contact.email}`;
      email.href = `mailto:${contact.email}`;
    } else {
      email.hidden = true;
    }
  }

  const social = CONFIG.redes || {};
  configureSocial('socialInstagram', social.instagram);
  configureSocial('socialFacebook', social.facebook);
  configureSocial('socialMercadoLibre', social.mercadoLibre);

  const visibleProducts = CONFIG.productosVisibles || {};
  document.querySelectorAll('[data-producto]').forEach(card => {
    if (visibleProducts[card.dataset.producto] === false) card.hidden = true;
  });

  renderPromotions(CONFIG.promociones || []);
}

function renderPromotions(promotions) {
  const container = document.getElementById('promocionesFuturas');
  if (!container) return;

  if (!Array.isArray(promotions) || promotions.length === 0) {
    container.hidden = true;
    return;
  }

  container.innerHTML = `
    <h3>Otras promociones</h3>
    <div class="future-promotions-grid">
      ${promotions.map(promotion => `
        <article>
          <h4>${promotion.producto || 'Promoción'}</h4>
          <p>${promotion.texto || ''}</p>
          ${promotion.precio ? `<strong>${promotion.precio}</strong>` : ''}
          <a class="btn primary" target="_blank" rel="noopener noreferrer"
             href="${whatsappLink(promotion.mensajeWhatsApp || `Hola ANDYCLOR. Quiero consultar por ${promotion.producto || 'esta promoción'}.`)}">
             Consultar
          </a>
        </article>
      `).join('')}
    </div>
  `;
  container.hidden = false;
}

function setupNavigation() {
  const navbar = document.getElementById('navbar');
  const menu = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  if (menu && links) {
    menu.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    });

    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

function setupMobileSections() {
  document.querySelectorAll('.mobile-section-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const section = button.closest('section');
      if (!section) return;
      const expanded = section.classList.toggle('mobile-section-expanded');
      button.setAttribute('aria-expanded', String(expanded));
      button.textContent = expanded ? 'Ver menos' : button.dataset.label || button.textContent;
    });
    button.dataset.label = button.textContent;
  });
}

function suggestedGranulatedPresentation(monthlyKg) {
  const requiredKg = Math.max(5, Math.ceil(monthlyKg));

  // Oferta comercial sugerida: Mínimo 5 kg. Hasta 30 kg usamos las escalas
  // 5 / 10 / 20 kg; desde 35 kg conviene el cuñete de 50 kg a granel.
  if (requiredKg <= 5) return 'Oferta x 5 kg';
  if (requiredKg <= 10) return 'Oferta x 10 kg';
  if (requiredKg <= 20) return 'Oferta x 20 kg';
  if (requiredKg <= 25) return 'Oferta x 20 kg + 5 kg';
  if (requiredKg <= 30) return 'Oferta x 20 kg + 10 kg';
  if (requiredKg <= 50) return 'Cuñete x 50 kg a granel — mejor precio';

  const cuñetes = Math.ceil(requiredKg / 50);
  return `${cuñetes} cuñetes x 50 kg a granel`;
}

function formatKg(value) {
  return Number.isInteger(value)
    ? `${value} kg`
    : `${value.toFixed(1).replace('.', ',')} kg`;
}

function tabletMonthlyEstimate(tabletsPerMonth) {
  const capsules = Math.max(1, Math.ceil(tabletsPerMonth));
  const kg = capsules * 0.2;
  return {
    capsules,
    kg,
    label: `${capsules} cápsula(s) de 200 g (${formatKg(kg)})`
  };
}

function suggestedTabletOffer(monthlyKg) {
  const requiredKg = Math.max(5, Math.ceil(monthlyKg));

  // Las pastillas vienen en cápsulas y pueden fraccionarse, pero la calculadora
  // deriva hacia las ofertas comerciales para favorecer una compra conveniente.
  if (requiredKg <= 5) return 'Oferta x 5 kg';
  if (requiredKg <= 10) return 'Oferta x 10 kg';
  if (requiredKg <= 20) return 'Oferta x 20 kg';
  if (requiredKg <= 25) return 'Oferta x 20 kg + 5 kg';
  if (requiredKg <= 30) return 'Oferta x 20 kg + 10 kg';
  if (requiredKg <= 40) return '2 ofertas x 20 kg';
  return 'Cotización por volumen';
}

function calculatePool() {
  const length = Number(document.getElementById('largo')?.value);
  const width = Number(document.getElementById('ancho')?.value);
  const depth = Number(document.getElementById('profundidad')?.value);
  const poolType = document.getElementById('tipoPileta')?.value;
  const maintenance = document.getElementById('mantenimiento')?.value;
  const season = document.getElementById('temporada')?.value;
  const result = document.getElementById('resultadoCalculadora');
  const entryPanel = document.querySelector('.calc-entry-panel');
  const formPanel = document.querySelector('.calc-entry-panel .calc-form');
  const resetButton = document.getElementById('recalcularPiletaBtn');

  if (!result) return;

  if (![length, width, depth].every(value => Number.isFinite(value) && value > 0)) {
    result.innerHTML = '<h3>Resultado</h3><p class="error">Completá largo, ancho y profundidad con valores válidos.</p>';
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const litres = Math.round(length * width * depth * 1000);
  const poolTypeLabel = poolType === 'revestida' ? 'Revestida / Venecitas' : 'Fibra o Pintada';
  const maintenanceLabels = {
    pastillas: 'Solo Pastillas Multiacción',
    granulado: 'Solo Cloro Granulado',
    granulado_multiaccion: 'Granulado Rápido Multiacción',
    ambos: 'Pastillas + Cloro Granulado'
  };
  const maintenanceLabel = maintenanceLabels[maintenance] || maintenance;
  const seasonLabel = season === 'alta' ? 'Temporada alta' : 'Temporada baja';

  const multiAction = maintenance === 'granulado_multiaccion';
  const granulatedName = multiAction
    ? 'Cloro Granulado Rápido Multiacción'
    : (poolType === 'revestida' ? 'Cloro Granulado Lento' : 'Cloro Granulado Rápido');

  const granulatedGrams = Math.ceil((litres / 40000) * 80);
  const granulatedFrequency = season === 'alta' ? 'por día' : 'por semana';
  const granulatedMonthlyKg = season === 'alta'
    ? Math.ceil((granulatedGrams * 30 / 1000) * 10) / 10
    : Math.ceil((granulatedGrams * 4 / 1000) * 10) / 10;

  const tablets = Math.max(1, Math.ceil(litres / 20000));
  const tabletsFrequency = season === 'alta' ? 'por semana' : 'por mes';
  const tabletsPerMonth = season === 'alta' ? tablets * 4 : tablets;

  const weeklyAlgaecide = Math.ceil((litres / 40000) * 400);
  const strongAlgaeAlgaecide = Math.ceil((litres / 40000) * 800);
  const clarifierDose = Math.ceil((litres / 50000) * 250);

  const resultItems = [];
  const preparedOrder = [];
  const messageOrder = [];

  if (['granulado', 'ambos', 'granulado_multiaccion'].includes(maintenance)) {
    const offer = suggestedGranulatedPresentation(granulatedMonthlyKg);
    const preparedGranulatedClass = multiAction
      ? 'prepared-multiaccion'
      : (poolType === 'revestida' ? 'prepared-lento' : 'prepared-rapido');
    resultItems.push(`
      <div class="result-item ${multiAction ? 'item-pastillas' : (poolType === 'revestida' ? 'item-lento' : 'item-rapido')}">
        <strong>🧪 ${granulatedName}</strong>
        <span><b>Dosis estimada:</b> ${granulatedGrams} g ${granulatedFrequency}</span>
        <small><b>Consumo estimado para aproximadamente un mes:</b> ${formatKg(granulatedMonthlyKg)}.</small>
        <small><b>Oferta recomendada:</b> ${offer}. Mejor precio por cantidad.</small>
      </div>
    `);
    preparedOrder.push(`<li class="prepared-product ${preparedGranulatedClass}"><strong>${granulatedName}</strong><span>${offer}</span></li>`);
    messageOrder.push(`${offer} — dosis estimada: ${granulatedGrams} g ${granulatedFrequency}; consumo mensual aprox.: ${formatKg(granulatedMonthlyKg)}`);
  }

  if (['pastillas', 'ambos'].includes(maintenance)) {
    const estimate = tabletMonthlyEstimate(tabletsPerMonth);
    const offer = suggestedTabletOffer(estimate.kg);
    resultItems.push(`
      <div class="result-item item-pastillas">
        <strong>🟣 Pastillas Multiacción en cápsulas</strong>
        <span><b>Dosis estimada:</b> ${tablets} pastilla(s) de 200 g ${tabletsFrequency}</span>
        <small><b>Consumo estimado para aproximadamente un mes:</b> ${estimate.label}.</small>
        <small><b>Oferta recomendada:</b> ${offer}. Mejor precio por cantidad.</small>
      </div>
    `);
    preparedOrder.push(`<li class="prepared-product prepared-pastillas"><strong>Pastillas Multiacción en cápsulas</strong><span>${offer}</span></li>`);
    messageOrder.push(`${offer} — uso estimado: ${tablets} pastilla(s) ${tabletsFrequency}; consumo mensual aprox.: ${estimate.label}`);
  }

  resultItems.push(`
    <div class="result-item item-alguicida">
      <strong>🟦 Alguicida Nataclor</strong>
      <span>${weeklyAlgaecide} cc por semana</span>
      <small>Ante fuerte presencia de algas: ${strongAlgaeAlgaecide} cc. Aplicar sin bañistas y recircular durante 3 horas.</small>
    </div>
  `);
  preparedOrder.push(`<li class="prepared-product prepared-alguicida"><strong>Alguicida Nataclor</strong><span>x 1 litro</span></li>`);
  messageOrder.push(`Alguicida Nataclor x 1 litro — dosis: ${weeklyAlgaecide} cc semanales`);

  resultItems.push(`
    <div class="result-item item-clarificador">
      <strong>💧 Clarificador Nataclor</strong>
      <span>${clarifierDose} cc por aplicación</span>
      <small>Diluir en 10 litros de agua, aplicar por la noche y pasar el limpiafondo por la mañana.</small>
    </div>
  `);
  preparedOrder.push(`<li class="prepared-product prepared-clarificador"><strong>Clarificador Nataclor</strong><span>x 1 litro</span></li>`);
  messageOrder.push(`Clarificador Nataclor x 1 litro — dosis: ${clarifierDose} cc por aplicación`);

  const message = [
    'Hola ANDYCLOR. Utilicé la calculadora de la página.',
    '',
    `Pileta: ${poolTypeLabel}`,
    `Medidas: ${length} m x ${width} m x ${depth} m`,
    `Capacidad aproximada: ${litres.toLocaleString('es-AR')} litros`,
    `Mantenimiento: ${maintenanceLabel}`,
    `Temporada: ${seasonLabel}`,
    '',
    'Quisiera cotización para:',
    ...messageOrder.map(item => `• ${item}`),
    '',
    'La página me mostró la dosis estimada y una oferta recomendada. Quisiera consultar disponibilidad y precio.'
  ].join('\n');

  const theme = maintenance === 'pastillas'
    ? 'tema-pastillas'
    : (maintenance === 'granulado'
      ? (poolType === 'revestida' ? 'tema-lento' : 'tema-rapido')
      : (maintenance === 'granulado_multiaccion' ? 'tema-pastillas' : 'tema-mixto'));

  result.className = `calc-result ${theme}`;
  result.innerHTML = `
    <div class="calc-final-layout">
      <section class="calc-order-column" aria-label="Resultado y oferta recomendada">
        <span class="calc-result-kicker">✓ Resultado del cálculo</span>
        <h3>Oferta recomendada para tu pileta</h3>

        <a class="btn primary calculator-whatsapp-cta calculator-whatsapp-top" target="_blank" rel="noopener noreferrer"
           href="${whatsappLink(message)}">
           🟢 Finalizar pedido por WhatsApp
        </a>
        <small class="calculator-whatsapp-help">WhatsApp recibirá los productos, la dosis estimada y la oferta recomendada.</small>

        <section class="prepared-order prepared-order-compact" aria-label="Pedido preparado">
          <span class="prepared-order-kicker">🛒 Compra recomendada</span>
          <ul>${preparedOrder.join('')}</ul>
        </section>

        <details class="pool-summary">
          <summary>Ver datos utilizados para el cálculo</summary>
          <div class="litros-box">
            <strong>${litres.toLocaleString('es-AR')} litros aprox.</strong>
            <span>${poolTypeLabel}</span>
            <span>${maintenanceLabel}</span>
            <span>${seasonLabel}</span>
            <span>${length} m × ${width} m × ${depth} m</span>
          </div>
        </details>
      </section>

      <section class="calc-treatment-column" aria-label="Tratamiento recomendado">
        <h3>Tratamiento recomendado</h3>
        <div class="result-grid">${resultItems.join('')}</div>

        <div class="recommend">
          <strong>Importante:</strong>
          <p>Las dosis son orientativas y pueden variar según clima, lluvia, uso, filtrado y estado del agua. Mantener el pH entre 7,2 y 7,6.</p>
        </div>
      </section>
    </div>
  `;

  const volumeBand = litres <= 20000
    ? 'hasta_20000'
    : (litres <= 40000 ? '20001_a_40000' : (litres <= 70000 ? '40001_a_70000' : 'mas_de_70000'));
  trackSiteEvent('calculator_complete', {
    pool_type: poolType,
    maintenance_type: maintenance,
    season,
    volume_band: volumeBand
  });

  if (formPanel) {
    formPanel.classList.add('is-hidden-after-calc');
    formPanel.setAttribute('aria-hidden', 'true');
  }
  if (entryPanel) {
    entryPanel.classList.add('showing-result');
  }
  if (resetButton) {
    resetButton.hidden = false;
  }
  result.classList.add('is-visible-after-calc');

  setTimeout(() => {
    const target = result.querySelector('.calc-order-column') || result;
    const headerOffset = 86;
    const rect = target.getBoundingClientRect();
    const targetTop = window.scrollY + rect.top - headerOffset;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth'
    });

    // Segundo ajuste breve por si el navegador todavía estaba reacomodando
    setTimeout(() => {
      const updatedRect = target.getBoundingClientRect();
      const correctedTop = window.scrollY + updatedRect.top - headerOffset;
      window.scrollTo({
        top: Math.max(0, correctedTop),
        behavior: 'auto'
      });
    }, 280);
  }, 180);
}

function resetPoolCalculator() {
  const entryPanel = document.querySelector('.calc-entry-panel');
  const formPanel = document.querySelector('.calc-entry-panel .calc-form');
  const result = document.getElementById('resultadoCalculadora');
  const resetButton = document.getElementById('recalcularPiletaBtn');

  if (formPanel) {
    formPanel.classList.remove('is-hidden-after-calc');
    formPanel.removeAttribute('aria-hidden');
  }
  if (entryPanel) {
    entryPanel.classList.remove('showing-result');
    entryPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (result) {
    result.className = 'calc-result';
    result.innerHTML = '<h3>Resultado</h3><p>Completá los datos para ver el tratamiento recomendado.</p>';
  }

  if (resetButton) {
    resetButton.hidden = true;
  }
}

function setupCalculator() {
  const button = document.getElementById('calcularPiletaBtn');
  const resetButton = document.getElementById('recalcularPiletaBtn');

  if (button) button.addEventListener('click', calculatePool);
  if (resetButton) resetButton.addEventListener('click', resetPoolCalculator);
}

document.addEventListener('DOMContentLoaded', () => {
  setupOptionalAnalytics();
  setupSeoBreadcrumbs();
  applyConfiguration();
  setupNavigation();
  setupMobileSections();
  setupCalculator();
  setupWhatsappTracking();
});


// HOTFIX MENÚ MÓVIL
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const menu = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');

  if (!menu || !links) return;

  const closeMenu = () => {
    links.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  };

  document.addEventListener('click', (event) => {
    if (!links.classList.contains('open')) return;
    if (navbar && !navbar.contains(event.target)) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  }, { passive: true });
});


// ==========================================================
// OFERTAS DINÁMICAS MASTER
// Precio > 0 = visible. Precio 0 = oculto.
// 1 oferta: Centrada | 2: Lado a lado | 3: Misma fila en desktop.
// ==========================================================
function numericPrice(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string') return 0;
  const cleaned = value.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatARS(value) {
  const amount = numericPrice(value);
  if (amount <= 0) return '';
  return `$${Math.round(amount).toLocaleString('es-AR')}`;
}

function offerTypeClass(type) {
  const allowed = ['rapido', 'lento', 'pastillas', 'multiaccion'];
  return allowed.includes(type) ? `offer-product-${type}` : 'offer-product-default';
}

function buildOfferCard(offer, segment) {
  const card = document.createElement('article');
  card.className = `gold-offer-card ${segment} ${offerTypeClass(offer.tipo)}`;

  const badge = segment === 'retail' ? 'Oferta Minorista' : 'Oferta Mayorista';
  const buttonLabel = segment === 'retail' ? 'Consultar oferta' : 'Solicitar cotización';
  const priceKg = numericPrice(offer.precioKg);
  const message = offer.mensajeWhatsapp ||
    (segment === 'retail'
      ? `Hola ANDYCLOR. Quiero consultar la oferta de ${offer.producto || 'este producto'}.`
      : `Hola ANDYCLOR. Quiero solicitar una cotización Mayorista de ${offer.producto || 'este producto'}. Cantidad estimada: ____ kg. Frecuencia: ____. Zona: ____.`);

  card.innerHTML = `
    <div class="gold-offer-badge">${badge}</div>
    <h3>${offer.producto || 'Oferta ANDYCLOR'}</h3>
    ${offer.tecnico ? `<p class="gold-offer-technical">${offer.tecnico}</p>` : ''}
    ${offer.detalle ? `<p class="gold-offer-volume">${offer.detalle}</p>` : ''}
    <div class="gold-offer-price-wrap">
      <small>Precio publicado</small>
      <strong>${formatARS(offer.precio)}</strong>
      ${priceKg > 0 ? `<span>${formatARS(priceKg)} por kg</span>` : ''}
      ${offer.ahorro ? `<span class="gold-saving-badge">${offer.ahorro}</span>` : ''}
    </div>
    <ul>
      ${segment === 'retail' ? `
        <li>Precio especial por cantidad</li>
        <li>Entrega coordinada según zona</li>
        <li>Pago por efectivo o transferencia</li>
      ` : `
        <li>Referencia sujeta a volumen, frecuencia, distancia y producto</li>
        <li>Otros volúmenes y compras recurrentes se evalúan caso por caso</li>
        <li>Entrega propia, retiro coordinado o despacho por transporte</li>
      `}
    </ul>
    <a class="btn primary gold-offer-action" target="_blank" rel="noopener noreferrer"
       data-whatsapp-link="true" href="${whatsappLink(message)}">${buttonLabel}</a>
  `;
  return card;
}

function renderOfferGroup(containerId, offers, segment) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const active = (Array.isArray(offers) ? offers : [])
    .filter(offer => offer && numericPrice(offer.precio) > 0)
    .slice(0, 3);

  const section = container.closest('.gold-offer-section');
  if (active.length === 0) {
    if (section) section.hidden = true;
    container.innerHTML = '';
    return;
  }

  if (section) section.hidden = false;
  container.classList.remove('count-1', 'count-2', 'count-3');
  container.classList.add(`count-${active.length}`);
  container.innerHTML = '';
  active.forEach(offer => container.appendChild(buildOfferCard(offer, segment)));
}

function renderMasterOffers() {
  const offers = CONFIG.ofertas || {};
  renderOfferGroup('ofertasMinoristasGrid', offers.minorista, 'retail');
  renderOfferGroup('ofertasMayoristasGrid', offers.mayorista, 'wholesale');
}

document.addEventListener('DOMContentLoaded', renderMasterOffers);
// ==========================================================
// OFERTAS POR PÁGINA + PRODUCT/OFFER PARA BUSCADORES
// Solo se publica una oferta cuando el mismo precio también
// queda visible para la persona que visita la página.
// ==========================================================
const PRODUCT_OFFER_PAGES = {
  'granulado-rapido.html': {
    tipo: 'rapido',
    nombre: 'Cloro Instantáneo o Granulado Rápido (Dicloro)',
    descripcion: 'Cloro granulado de disolución rápida para mantenimiento, recuperación y tratamiento de choque en piletas de fibra o pintadas.',
    imagen: 'Imagenes/cloro-rapido.webp'
  },
  'granulado-lento.html': {
    tipo: 'lento',
    nombre: 'Cloro Técnico o Granulado Lento (Tricloro)',
    descripcion: 'Cloro granulado de disolución lenta para el mantenimiento de piletas revestidas o con venecitas.',
    imagen: 'Imagenes/cloro-lento.webp'
  },
  'granulado-multiaccion.html': {
    tipo: 'multiaccion',
    nombre: 'Cloro Granulado Multiacción',
    descripcion: 'Cloro granulado multiacción para desinfectar, ayudar a prevenir algas y mantener el agua cristalina en todo tipo de piletas.',
    imagen: 'Imagenes/cloro-multiaccion.webp'
  },
  'pastillas-multiaccion.html': {
    tipo: 'pastillas',
    nombre: 'Pastillas Multiacción para Piletas de 50 g y 200 g',
    descripcion: 'Pastillas Multiacción en cápsulas para mantenimiento continuo, aptas para todo tipo de piletas mediante boya dosificadora.',
    imagen: 'Imagenes/pastillas.webp'
  }
};

function productOfferPageData() {
  const fileName = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  return PRODUCT_OFFER_PAGES[fileName] || null;
}

function productTypeMatches(configType, pageType) {
  const normalized = String(configType || '').toLowerCase().trim();
  if (pageType === 'multiaccion') return normalized === 'multiaccion' || normalized === 'multi';
  return normalized === pageType;
}

function activeOffersForProduct(pageData) {
  const groups = [
    { offers: CONFIG.ofertas?.minorista, segment: 'retail', label: 'Minorista' },
    { offers: CONFIG.ofertas?.mayorista, segment: 'wholesale', label: 'Mayorista' }
  ];

  return groups.flatMap(group => (Array.isArray(group.offers) ? group.offers : [])
    .filter(offer => offer && productTypeMatches(offer.tipo, pageData.tipo) && numericPrice(offer.precio) > 0)
    .slice(0, 1)
    .map(offer => ({ ...group, offer })));
}

function offerEligibleQuantity(offer) {
  const detail = String(offer.detalle || '');
  const match = detail.match(/(\d[\d.]*)\s*kg/i);
  if (!match) return null;
  const value = Number(match[1].replace(/\./g, ''));
  return Number.isFinite(value) && value > 0
    ? { '@type': 'QuantitativeValue', minValue: value, unitCode: 'KGM' }
    : null;
}

function appendProductOfferSchema(pageData, activeOffers) {
  const canonicalUrl = new URL(window.location.pathname, 'https://andyclor.com.ar').href;
  const offers = activeOffers.map(({ offer, label }) => {
    const schemaOffer = {
      '@type': 'Offer',
      name: `Oferta ${label}: ${offer.producto || pageData.nombre}`,
      description: offer.detalle || `Precio publicado para compra ${label}`,
      price: String(Math.round(numericPrice(offer.precio))),
      priceCurrency: 'ARS',
      url: canonicalUrl,
      seller: {
        '@type': 'Organization',
        '@id': 'https://andyclor.com.ar/#organization',
        name: 'ANDYCLOR',
        url: 'https://andyclor.com.ar/'
      }
    };
    const eligibleQuantity = offerEligibleQuantity(offer);
    if (eligibleQuantity) schemaOffer.eligibleQuantity = eligibleQuantity;
    return schemaOffer;
  });

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${canonicalUrl}#product`,
    name: pageData.nombre,
    description: pageData.descripcion,
    image: new URL(pageData.imagen, 'https://andyclor.com.ar/').href,
    category: 'Productos para piletas',
    url: canonicalUrl,
    offers: offers.length === 1 ? offers[0] : offers
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'product-offer-structured-data';
  script.textContent = JSON.stringify(productSchema);
  document.head.appendChild(script);
}

function renderCurrentProductOffers() {
  const pageData = productOfferPageData();
  if (!pageData || document.getElementById('ofertas-producto-actual')) return;

  const activeOffers = activeOffersForProduct(pageData);
  if (activeOffers.length === 0) return;

  const section = document.createElement('section');
  section.className = 'section gold-offer-section rc-product-live-offers';
  section.id = 'ofertas-producto-actual';
  section.innerHTML = `
    <div class="gold-offer-heading">
      <span class="rc-eyebrow blue">Precios activos</span>
      <h2>Ofertas vigentes de ${pageData.nombre}</h2>
      <p>Valores publicados según presentación y condición de compra. Confirmamos disponibilidad antes de cerrar la operación.</p>
    </div>
    <div class="gold-offer-grid count-${activeOffers.length}"></div>
    <p class="gold-offer-note">La condición Mayorista depende de cantidad, frecuencia, distancia y modalidad de entrega.</p>
  `;

  const grid = section.querySelector('.gold-offer-grid');
  activeOffers.forEach(({ offer, segment }) => grid.appendChild(buildOfferCard(offer, segment)));

  const preferredAnchor = document.querySelector('.rc-tablet-commerce');
  const main = document.querySelector('main');
  if (preferredAnchor) preferredAnchor.insertAdjacentElement('afterend', section);
  else if (main) main.appendChild(section);
  else return;

  appendProductOfferSchema(pageData, activeOffers);
}

document.addEventListener('DOMContentLoaded', renderCurrentProductOffers);
