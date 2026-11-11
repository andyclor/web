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
    if (url.hostname === 'wa.me' && /^\/c\//i.test(url.pathname)) {
      link.dataset.whatsappCatalog = 'true';
      return;
    }
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
  trackSiteEvent(link.dataset.whatsappCatalog === 'true' ? 'whatsapp_catalog_click' : 'whatsapp_click', {
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

function syncProductPrices() {
  document.querySelectorAll('[data-product-offer]').forEach(block => {
    const segment = block.dataset.priceSegment === 'mayorista' ? 'mayorista' : 'minorista';
    const offer = (CONFIG.ofertas?.[segment] || []).find(item => item.id === block.dataset.productOffer);
    if (!offer) return;
    block.hidden = numericPrice(offer.precio) <= 0;
    block.querySelectorAll('[data-product-price]').forEach(price => {
      price.textContent = formatARS(offer.precio);
    });
  });
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
  syncProductPrices();
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

document.addEventListener('DOMContentLoaded', () => {
  setupOptionalAnalytics();
  setupSeoBreadcrumbs();
  applyConfiguration();
  setupNavigation();
  setupMobileSections();
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

function formatARS(value, fractionDigits = 0) {
  const amount = numericPrice(value);
  if (amount <= 0) return '';
  return `$${amount.toLocaleString('es-AR', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })}`;
}

function offerTypeClass(type) {
  const allowed = ['rapido', 'lento', 'pastillas', 'multiaccion'];
  return allowed.includes(type) ? `offer-product-${type}` : 'offer-product-default';
}

function buildOfferCard(offer, segment) {
  const card = document.createElement('article');
  card.className = `gold-offer-card ${segment} ${offerTypeClass(offer.tipo)}${offer.superOferta ? ' is-super-offer' : ''}`;

  const badge = segment === 'retail' ? 'Oferta Minorista' : 'Oferta Mayorista';
  const buttonLabel = segment === 'retail' ? 'Consultar oferta' : 'Solicitar cotización';
  const weightKg = numericPrice(offer.pesoKg);
  const priceKg = weightKg > 0 ? numericPrice(offer.precio) / weightKg : numericPrice(offer.precioKg);
  const fractionatedKg = numericPrice(offer.pesoFraccionadoKg);
  const fractionatedPriceKg = fractionatedKg > 0 ? numericPrice(offer.precio) / fractionatedKg : 0;
  const normalPrice = numericPrice(offer.precioNormal);
  const priceLabel = offer.etiquetaPrecio || 'Precio publicado';
  const conditions = Array.isArray(offer.condiciones) && offer.condiciones.length
    ? offer.condiciones
    : (segment === 'retail'
      ? [
          'Precio especial por cantidad',
          'Entrega coordinada según zona',
          'Pago por efectivo o transferencia'
        ]
      : [
          'Referencia sujeta a volumen, frecuencia, distancia y producto',
          'Otros volúmenes y compras recurrentes se evalúan caso por caso',
          'Entrega propia, retiro coordinado o despacho por transporte'
        ]);
  const message = offer.mensajeWhatsapp ||
    (segment === 'retail'
      ? `Hola ANDYCLOR. Quiero consultar la oferta de ${offer.producto || 'este producto'}.`
      : `Hola ANDYCLOR. Quiero solicitar una cotización Mayorista de ${offer.producto || 'este producto'}. Cantidad estimada: ____ kg. Frecuencia: ____. Zona: ____.`);

  card.innerHTML = `
    ${offer.superOferta ? '<div class="gold-super-offer">SUPER OFERTA</div>' : ''}
    <div class="gold-offer-badge">${badge}</div>
    <h3>${offer.producto || 'Oferta ANDYCLOR'}</h3>
    ${offer.tecnico ? `<p class="gold-offer-technical">${offer.tecnico}</p>` : ''}
    ${offer.detalle ? `<p class="gold-offer-volume">${offer.detalle}</p>` : ''}
    <div class="gold-offer-price-wrap">
      <small>${priceLabel}</small>
      ${normalPrice > numericPrice(offer.precio) ? `<span class="gold-normal-price">Precio habitual: <del>${formatARS(normalPrice)}</del></span>` : ''}
      <strong>${formatARS(offer.precio)}</strong>
      ${priceKg > 0 ? `<span>${formatARS(priceKg, Number.isInteger(priceKg) ? 0 : 2)} por kg${fractionatedKg > 0 ? ' a granel' : ''}</span>` : ''}
      ${fractionatedPriceKg > 0 ? `<span>${formatARS(fractionatedPriceKg, 2)} por kg fraccionado aprox.</span>` : ''}
      ${offer.vigencia ? `<span class="gold-saving-badge">${offer.vigencia}</span>` : ''}
      ${offer.ahorro ? `<span class="gold-saving-badge">${offer.ahorro}</span>` : ''}
    </div>
    <ul>
      ${conditions.map(condition => `<li>${condition}</li>`).join('')}
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
    .slice(0, 4);

  const section = container.closest('.gold-offer-section');
  if (active.length === 0) {
    if (section) section.hidden = true;
    container.innerHTML = '';
    return;
  }

  if (section) section.hidden = false;
  container.classList.remove('count-1', 'count-2', 'count-3', 'count-4');
  container.classList.add(`count-${active.length}`);
  container.innerHTML = '';
  active.forEach(offer => container.appendChild(buildOfferCard(offer, segment)));
}

function renderMasterOffers() {
  const offers = CONFIG.ofertas || {};
  renderOfferGroup('ofertasMinoristasGrid', offers.minorista, 'retail');
  renderOfferGroup('ofertasMayoristasGrid', offers.mayorista, 'wholesale');

  const hasActiveOffer = list => (Array.isArray(list) ? list : []).some(offer => offer && numericPrice(offer.precio) > 0);
  const retailAccess = document.getElementById('accesoOfertaMinorista');
  const wholesaleAccess = document.getElementById('accesoOfertaMayorista');
  if (retailAccess) retailAccess.hidden = !hasActiveOffer(offers.minorista);
  if (wholesaleAccess) wholesaleAccess.hidden = !hasActiveOffer(offers.mayorista);
}

document.addEventListener('DOMContentLoaded', renderMasterOffers);
