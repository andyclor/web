#!/usr/bin/env node
'use strict';

// Genera el HTML inicial usando la misma configuración y el mismo renderizador
// que usa el navegador. No requiere paquetes ni crea una segunda lista de precios.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const configContext = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(root, 'config/config.js'), 'utf8'), configContext, { timeout: 1000 });
const config = configContext.window.ANDYCLOR_CONFIG;
if (!config || !config.ofertas) throw new Error('Falta ANDYCLOR_CONFIG.ofertas');
const phone = String(config.contacto?.whatsapp || '5491168306266').replace(/\D/g, '');
const main = fs.readFileSync(path.join(root, 'js/main.js'), 'utf8');
const start = main.indexOf('function numericPrice(');
const end = main.indexOf('function renderOfferGroup(', start);
if (start < 0 || end < start) throw new Error('No se encontró el renderizador de ofertas');
const context = vm.createContext({
  whatsappLink: message => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
  document: {
    createElement(tag) {
      if (tag !== 'article') throw new Error('Elemento inesperado: ' + tag);
      return {
        className: '', innerHTML: '',
        get outerHTML() { return `<article class="${this.className}">${this.innerHTML}</article>`; }
      };
    }
  }
});
vm.runInContext(main.slice(start, end), context, { timeout: 1000 });
const offers = (Array.isArray(config.ofertas.mayorista) ? config.ofertas.mayorista : [])
  .filter(offer => offer && context.numericPrice(offer.precio) > 0).slice(0, 3);
const cards = offers.map(offer => context.buildOfferCard(offer, 'wholesale').outerHTML).join('\n');
const countClass = offers.length ? ` count-${offers.length}` : '';
const markup = `<!-- RC38_WHOLESALE_OFFERS_START -->\n<div class="gold-offer-grid${countClass}" id="ofertasMayoristasGrid">\n${cards}\n</div>\n<!-- RC38_WHOLESALE_OFFERS_END -->`;
const pattern = /<!-- RC38_WHOLESALE_OFFERS_START -->[\s\S]*?<!-- RC38_WHOLESALE_OFFERS_END -->/;
for (const name of ['mayoristas.html', 'oferta-cloro-mayorista.html']) {
  const file = path.join(root, name);
  let html = fs.readFileSync(file, 'utf8');
  if (!pattern.test(html)) throw new Error('Faltan marcadores de ofertas: ' + name);
  html = html.replace(pattern, markup);
  html = html.replace(/<(?:div|section)\b[^>]*\bid="(?:accesoOfertaMayorista|oferta-mayorista-master|oferta-mayorista-directa)"[^>]*>/g, tag => {
    tag = tag.replace(/\s+hidden(?:="[^"]*")?/g, '');
    return offers.length ? tag : tag.replace(/>$/, ' hidden>');
  });
  fs.writeFileSync(file, html, 'utf8');
  console.log(`${name}: ${offers.length} ofertas en el HTML inicial`);
}
