'use strict';

const CONFIG = window.ANDYCLOR_CONFIG || {};

const getWhatsAppNumber = () => String(CONFIG.whatsapp || '5491168306266').replace(/\D/g, '');
const whatsappLink = (message = '') =>
  `https://wa.me/${getWhatsAppNumber()}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

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
  if (monthlyKg <= 1) return 'Cloro granulado x 1 kg';
  if (monthlyKg <= 5) return 'Cloro granulado x 5 kg';
  if (monthlyKg <= 10) return 'Cloro granulado x 10 kg';
  return 'Cloro granulado en cuñete x 50 kg';
}

function suggestedTabletPresentation(tabletsPerMonth) {
  if (tabletsPerMonth <= 5) return 'Pastillas Multiacción x 1 kg';
  if (tabletsPerMonth <= 25) return 'Pastillas Multiacción x 5 kg';
  if (tabletsPerMonth <= 50) return 'Pastillas Multiacción x 10 kg';
  return 'Pastillas Multiacción en cuñete x 50 kg';
}

function calculatePool() {
  const length = Number(document.getElementById('largo')?.value);
  const width = Number(document.getElementById('ancho')?.value);
  const depth = Number(document.getElementById('profundidad')?.value);
  const poolType = document.getElementById('tipoPileta')?.value;
  const maintenance = document.getElementById('mantenimiento')?.value;
  const season = document.getElementById('temporada')?.value;
  const result = document.getElementById('resultadoCalculadora');

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
    const presentation = suggestedGranulatedPresentation(granulatedMonthlyKg);
    resultItems.push(`
      <div class="result-item ${multiAction ? 'item-pastillas' : (poolType === 'revestida' ? 'item-lento' : 'item-rapido')}">
        <strong>🧪 ${granulatedName}</strong>
        <span>${granulatedGrams} g ${granulatedFrequency}</span>
        <small>Presentación sugerida para aproximadamente un mes: ${presentation}.</small>
      </div>
    `);
    preparedOrder.push(`<li><strong>${presentation}</strong><span>${granulatedName}: ${granulatedGrams} g ${granulatedFrequency}</span></li>`);
    messageOrder.push(`${presentation} — dosis: ${granulatedGrams} g ${granulatedFrequency}`);
  }

  if (['pastillas', 'ambos'].includes(maintenance)) {
    const presentation = suggestedTabletPresentation(tabletsPerMonth);
    resultItems.push(`
      <div class="result-item item-pastillas">
        <strong>🟣 Pastillas Multiacción</strong>
        <span>${tablets} pastilla(s) de 200 g ${tabletsFrequency}</span>
        <small>Presentación sugerida para aproximadamente un mes: ${presentation}.</small>
      </div>
    `);
    preparedOrder.push(`<li><strong>${presentation}</strong><span>${tablets} pastilla(s) ${tabletsFrequency}</span></li>`);
    messageOrder.push(`${presentation} — uso: ${tablets} pastilla(s) ${tabletsFrequency}`);
  }

  resultItems.push(`
    <div class="result-item item-alguicida">
      <strong>🟦 Alguicida Nataclor</strong>
      <span>${weeklyAlgaecide} cc por semana</span>
      <small>Ante fuerte presencia de algas: ${strongAlgaeAlgaecide} cc. Aplicar sin bañistas y recircular durante 3 horas.</small>
    </div>
  `);
  preparedOrder.push(`<li><strong>Alguicida Nataclor x 1 litro</strong><span>${weeklyAlgaecide} cc semanales</span></li>`);
  messageOrder.push(`Alguicida Nataclor x 1 litro — dosis: ${weeklyAlgaecide} cc semanales`);

  resultItems.push(`
    <div class="result-item item-clarificador">
      <strong>💧 Clarificador Nataclor</strong>
      <span>${clarifierDose} cc por aplicación</span>
      <small>Diluir en 10 litros de agua, aplicar por la noche y pasar el limpiafondo por la mañana.</small>
    </div>
  `);
  preparedOrder.push(`<li><strong>Clarificador Nataclor x 1 litro</strong><span>${clarifierDose} cc por aplicación</span></li>`);
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
    'La página me sugirió estas cantidades y presentaciones. Quisiera ver los productos disponibles en el catálogo.'
  ].join('\n');

  const theme = maintenance === 'pastillas'
    ? 'tema-pastillas'
    : (maintenance === 'granulado'
      ? (poolType === 'revestida' ? 'tema-lento' : 'tema-rapido')
      : (maintenance === 'granulado_multiaccion' ? 'tema-pastillas' : 'tema-mixto'));

  result.className = `calc-result ${theme}`;
  result.innerHTML = `
    <h3>Tratamiento recomendado</h3>
    <div class="litros-box">
      <strong>${litres.toLocaleString('es-AR')} litros aprox.</strong>
      <span>${poolTypeLabel}</span>
      <span>${maintenanceLabel}</span>
      <span>${seasonLabel}</span>
    </div>

    <div class="result-grid">${resultItems.join('')}</div>

    <section class="prepared-order" aria-label="Pedido preparado">
      <span class="prepared-order-kicker">🛒 Pedido preparado</span>
      <h4>Presentaciones sugeridas para cotizar</h4>
      <ul>${preparedOrder.join('')}</ul>
      <p>WhatsApp recibirá los nombres y las cantidades para asociarlos con los productos de tu catálogo.</p>
    </section>

    <div class="recommend">
      <strong>Importante:</strong>
      <p>Las dosis son orientativas y pueden variar según clima, lluvia, uso, filtrado y estado del agua. Mantener el pH entre 7,2 y 7,6.</p>
    </div>

    <a class="btn primary calculator-whatsapp-cta" target="_blank" rel="noopener noreferrer"
       href="${whatsappLink(message)}">
       💬 Cotizar este tratamiento por WhatsApp
    </a>
    <small class="calculator-whatsapp-help">Se abrirá WhatsApp con el pedido y las cantidades ya preparadas.</small>
  `;

  result.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setupCalculator() {
  const button = document.getElementById('calcularPiletaBtn');
  if (button) button.addEventListener('click', calculatePool);
}

document.addEventListener('DOMContentLoaded', () => {
  applyConfiguration();
  setupNavigation();
  setupMobileSections();
  setupCalculator();
});
