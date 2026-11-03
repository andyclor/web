'use strict';

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

function suggestedLiquidChlorinePresentation(monthlyLitres) {
  const bidones = Math.max(1, Math.ceil(monthlyLitres / 5));
  const totalLitres = bidones * 5;
  return `${bidones} bidón${bidones === 1 ? '' : 'es'} x 5 L (${totalLitres} L)`;
}

function formatLitres(value) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded)
    ? `${rounded} L`
    : `${rounded.toFixed(1).replace('.', ',')} L`;
}

function calculatePool() {
  const length = Number(document.getElementById('largo')?.value);
  const width = Number(document.getElementById('ancho')?.value);
  const depth = Number(document.getElementById('profundidad')?.value);
  const poolType = document.getElementById('tipoPileta')?.value;
  const recovery = document.getElementById('recuperacion')?.value;
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
    liquido: 'Cloro Líquido 110 g/L',
    ambos: 'Pastillas + Cloro Granulado'
  };
  const maintenanceLabel = maintenanceLabels[maintenance] || maintenance;
  const recoveryLabel = recovery === 'oxypool'
    ? 'Recuperación rápida con Oxypool'
    : 'Solo mantenimiento';
  const seasonLabel = season === 'alta' ? 'Temporada alta' : 'Temporada baja';

  const multiAction = maintenance === 'granulado_multiaccion';
  const addOxypool = recovery === 'oxypool';
  const granulatedName = multiAction
    ? 'Cloro Granulado Rápido Multiacción'
    : (poolType === 'revestida' ? 'Cloro Granulado Lento' : 'Cloro Granulado Rápido');

  const granulatedGrams = Math.ceil((litres / 40000) * 80);
  const granulatedFrequency = season === 'alta' ? 'por día' : 'por semana';
  const granulatedMonthlyKg = season === 'alta'
    ? Math.ceil((granulatedGrams * 30 / 1000) * 10) / 10
    : Math.ceil((granulatedGrams * 4 / 1000) * 10) / 10;

  // Cloro líquido de alta concentración: 110 g/L de cloro activo.
  // La dosis es por aplicación: cada 24 h en temporada alta y cada 7 días en temporada baja.
  const liquidMl = Math.ceil((litres / 40000) * 400);
  const liquidFrequency = season === 'alta' ? 'cada 24 horas' : 'cada 7 días';
  const liquidMonthlyLitres = season === 'alta'
    ? Math.ceil((liquidMl * 30 / 1000) * 10) / 10
    : Math.ceil((liquidMl * 4 / 1000) * 10) / 10;

  const oxypoolBaseGrams = Math.ceil((litres / 10000) * 20);
  const oxypoolReinforcedGrams = Math.ceil((litres / 10000) * 40);
  const oxypoolPresentation = oxypoolReinforcedGrams <= 1000
    ? 'Envase original x 1 kg'
    : 'Lata original x 10 kg';

  const tablets = Math.max(1, Math.ceil(litres / 20000));
  const tabletsFrequency = season === 'alta' ? 'por semana' : 'por mes';
  const tabletsPerMonth = season === 'alta' ? tablets * 4 : tablets;

  const weeklyAlgaecide = Math.ceil((litres / 40000) * 400);
  const strongAlgaeAlgaecide = Math.ceil((litres / 40000) * 800);
  const clarifierDose = Math.ceil((litres / 50000) * 250);

  const resultItems = [];
  const preparedOrder = [];
  const messageOrder = [];

  if (addOxypool) {
    resultItems.push(`
      <div class="treatment-section-title treatment-recovery-title">
        <span>1</span>
        <div><strong>Primero: recupero del agua</strong><small>Tratamiento puntual, no de mantenimiento.</small></div>
      </div>
      <div class="result-item item-oxypool result-item-featured">
        <strong>⚡ Oxypool Nataclor</strong>
        <span><b>Dosis orientativa de recupero:</b> ${oxypoolBaseGrams} g</span>
        <small><b>Aplicación reforzada máxima:</b> ${oxypoolReinforcedGrams} g. No superar el doble de la dosis base.</small>
        <small><b>Presentación original sugerida:</b> ${oxypoolPresentation}.</small>
        <small>Cloro ultrarrápido + oxígeno activo. Ajustar pH, filtrar y volver a medir antes de repetir. El resultado depende del estado inicial, el clima y la carga de suciedad.</small>
      </div>
    `);
    preparedOrder.push(`<li class="prepared-product prepared-oxypool"><strong>Oxypool Nataclor</strong><span>${oxypoolPresentation}</span></li>`);
    messageOrder.push(`Oxypool Nataclor — recupero base: ${oxypoolBaseGrams} g; reforzada máxima: ${oxypoolReinforcedGrams} g; presentación sugerida: ${oxypoolPresentation}`);
  }

  resultItems.push(`
    <div class="treatment-section-title treatment-maintenance-title">
      <span>${addOxypool ? '2' : '1'}</span>
      <div><strong>${addOxypool ? 'Después: mantenimiento sugerido' : 'Mantenimiento sugerido'}</strong><small>Tipo de cloro, dosis y frecuencia orientativa.</small></div>
    </div>
  `);

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

  if (maintenance === 'liquido') {
    const offer = suggestedLiquidChlorinePresentation(liquidMonthlyLitres);
    resultItems.push(`
      <div class="result-item item-liquido">
        <strong>💧 Cloro Líquido de Alta Concentración – 110 g/L</strong>
        <span><b>Dosis de mantenimiento:</b> ${liquidMl} ml ${liquidFrequency}</span>
        <small>La dosis indicada corresponde a <b>una aplicación</b>. En temporada alta representa 24 horas de mantenimiento; en temporada baja, 7 días.</small>
        <small><b>Consumo estimado para aproximadamente un mes:</b> ${formatLitres(liquidMonthlyLitres)}.</small>
        <small><b>Compra sugerida:</b> ${offer}. ANDYCLOR trabaja con 110 g/L de cloro activo, una concentración superior a muchas presentaciones habituales del mercado.</small>
      </div>
    `);
    preparedOrder.push(`<li class="prepared-product prepared-liquido"><strong>Cloro Líquido 110 g/L</strong><span>${offer}</span></li>`);
    messageOrder.push(`Cloro Líquido 110 g/L — dosis: ${liquidMl} ml ${liquidFrequency}; consumo mensual aprox.: ${formatLitres(liquidMonthlyLitres)}; compra sugerida: ${offer}`);
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
    `Recuperación: ${recoveryLabel}`,
    `Mantenimiento: ${maintenanceLabel}`,
    `Temporada: ${seasonLabel}`,
    '',
    'Quisiera cotización para:',
    ...messageOrder.map(item => `• ${item}`),
    '',
    'La página me mostró la dosis estimada y una oferta recomendada. Quisiera consultar disponibilidad y precio.'
  ].join('\n');

  const theme = addOxypool
    ? 'tema-oxypool'
    : (maintenance === 'pastillas'
    ? 'tema-pastillas'
    : (maintenance === 'granulado'
      ? (poolType === 'revestida' ? 'tema-lento' : 'tema-rapido')
      : (maintenance === 'granulado_multiaccion' ? 'tema-pastillas' : (maintenance === 'liquido' ? 'tema-liquido' : 'tema-mixto'))));

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
            <span>${recoveryLabel}</span>
            <span>${maintenanceLabel}</span>
            <span>${seasonLabel}</span>
            <span>${length} m × ${width} m × ${depth} m</span>
          </div>
        </details>
      </section>

      <section class="calc-treatment-column" aria-label="Recupero y mantenimiento recomendado">
        <h3>${addOxypool ? 'Recupero y mantenimiento recomendado' : 'Mantenimiento recomendado'}</h3>
        <div class="result-grid">${resultItems.join('')}</div>

        <div class="recommend">
          <strong>Importante:</strong>
          <p>Las dosis son orientativas. El calor intenso, muchos bañistas, protectores solares y cremas, hojas y pinochas, lluvia, tierra, otros residuos, el filtrado y el estado del agua pueden modificar la necesidad real. Mantener el pH entre 7,2 y 7,6, aplicar cada químico por separado y volver a medir antes de habilitar el baño.</p>
        </div>
      </section>
    </div>
  `;

  const volumeBand = litres <= 20000
    ? 'hasta_20000'
    : (litres <= 40000 ? '20001_a_40000' : (litres <= 70000 ? '40001_a_70000' : 'mas_de_70000'));
  trackSiteEvent('calculator_complete', {
    pool_type: poolType,
    recovery_type: recovery,
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

document.addEventListener('DOMContentLoaded', setupCalculator);
