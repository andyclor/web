'use strict';

const CONFIG = window.ANDYCLOR_CONFIG || {};

const getWhatsAppNumber = () => String(CONFIG.contacto?.whatsapp || CONFIG.whatsapp || '5491168306266').replace(/\D/g, '');
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
    resultItems.push(`
      <div class="result-item ${multiAction ? 'item-pastillas' : (poolType === 'revestida' ? 'item-lento' : 'item-rapido')}">
        <strong>🧪 ${granulatedName}</strong>
        <span><b>Dosis estimada:</b> ${granulatedGrams} g ${granulatedFrequency}</span>
        <small><b>Consumo estimado para aproximadamente un mes:</b> ${formatKg(granulatedMonthlyKg)}.</small>
        <small><b>Oferta recomendada:</b> ${offer}. Mejor precio por cantidad.</small>
      </div>
    `);
    preparedOrder.push(`<li class="prepared-product"><strong>${granulatedName}</strong><span>${offer}</span></li>`);
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
    preparedOrder.push(`<li class="prepared-product"><strong>Pastillas Multiacción en cápsulas</strong><span>${offer}</span></li>`);
    messageOrder.push(`${offer} — uso estimado: ${tablets} pastilla(s) ${tabletsFrequency}; consumo mensual aprox.: ${estimate.label}`);
  }

  resultItems.push(`
    <div class="result-item item-alguicida">
      <strong>🟦 Alguicida Nataclor</strong>
      <span>${weeklyAlgaecide} cc por semana</span>
      <small>Ante fuerte presencia de algas: ${strongAlgaeAlgaecide} cc. Aplicar sin bañistas y recircular durante 3 horas.</small>
    </div>
  `);
  preparedOrder.push(`<li class="prepared-product"><strong>Alguicida Nataclor</strong><span>x 1 litro</span></li>`);
  messageOrder.push(`Alguicida Nataclor x 1 litro — dosis: ${weeklyAlgaecide} cc semanales`);

  resultItems.push(`
    <div class="result-item item-clarificador">
      <strong>💧 Clarificador Nataclor</strong>
      <span>${clarifierDose} cc por aplicación</span>
      <small>Diluir en 10 litros de agua, aplicar por la noche y pasar el limpiafondo por la mañana.</small>
    </div>
  `);
  preparedOrder.push(`<li class="prepared-product"><strong>Clarificador Nataclor</strong><span>x 1 litro</span></li>`);
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
  applyConfiguration();
  setupNavigation();
  setupMobileSections();
  setupCalculator();
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
  const phone = getWhatsAppNumber();
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
       href="https://wa.me/${phone}?text=${encodeURIComponent(message)}">${buttonLabel}</a>
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
