/* Precios de producto sincronizados con la configuración general. */
(() => {
  'use strict';
  const box = document.querySelector('[data-product-offer]');
  const data = document.getElementById('product-price-data');
  if (!box || !data) return;
  const item = window.ANDYCLOR_CONFIG?.ofertas?.minorista?.find(p => p.id === box.dataset.productOffer);
  const price = Number(item?.precio);
  if (!Number.isFinite(price) || price <= 0) { box.hidden = true; data.remove(); return; }
  const label = box.querySelector('[data-product-price]');
  if (label) label.textContent = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);
  try { const product = JSON.parse(data.textContent); product.offers.price = price; data.textContent = JSON.stringify(product); } catch (_) {}
})();
