/* ==========================================================
   ANDYCLOR - CONFIGURACIÓN GENERAL

   OFERTAS:
   - Para MOSTRAR una oferta, cargá un precio mayor a 0.
   - Para OCULTARLA, dejá precio: 0.
   - Escribí los precios SIN $ y SIN puntos. Ejemplo: 259000
   - La grilla se acomoda sola: 1 centrada / 2 lado a lado / 3 en fila.
   ========================================================== */
window.ANDYCLOR_CONFIG = {
  ofertas: {
    minorista: [
      {
        tipo: "pastillas",
        producto: "Pastillas Multiacción 200 g",
        tecnico: "En cápsulas",
        detalle: "Cuñete de 50 kg",
        etiquetaPrecio: "Precio minorista por cuñete",
        precio: 295000,
        precioKg: 5900,
        superOferta: true,
        mensajeWhatsapp: "Hola ANDYCLOR. Quiero consultar la SUPER OFERTA Minorista de Pastillas Multiacción 200 g: cuñete de 50 kg a $295.000."
      },
      {
        tipo: "rapido",
        producto: "Cloro Granulado de Disolución Rápida",
        tecnico: "Dicloro · A granel",
        detalle: "Cuñete de 50 kg a granel",
        etiquetaPrecio: "Precio minorista por cuñete",
        precio: 255000,
        precioKg: 5100,
        mensajeWhatsapp: "Hola ANDYCLOR. Quiero consultar la Oferta Minorista de Cloro Granulado Rápido a granel: cuñete de 50 kg a $255.000."
      },
      {
        tipo: "lento",
        producto: "Cloro Granulado de Disolución Lenta",
        tecnico: "Tricloro · A granel",
        detalle: "Cuñete de 50 kg a granel",
        etiquetaPrecio: "Precio minorista por cuñete",
        precio: 279000,
        precioKg: 5580,
        mensajeWhatsapp: "Hola ANDYCLOR. Quiero consultar la Oferta Minorista de Cloro Granulado Lento a granel: cuñete de 50 kg a $279.000."
      },
      {
        tipo: "multiaccion",
        producto: "Cloro Granulado Multiacción",
        tecnico: "Granulado Multiacción · A granel",
        detalle: "Cuñete de 50 kg a granel",
        etiquetaPrecio: "Precio minorista por cuñete",
        precio: 299000,
        precioKg: 5980,
        mensajeWhatsapp: "Hola ANDYCLOR. Quiero consultar la Oferta Minorista de Cloro Granulado Multiacción a granel: cuñete de 50 kg a $299.000."
      }
    ],

    mayorista: [
      {
        tipo: "pastillas",
        producto: "Pastillas Multiacción 200 g",
        tecnico: "En cápsulas",
        detalle: "Cuñete de 50 kg · Compra mínima total: 300 kg combinables",
        etiquetaPrecio: "Precio promo por cuñete de 50 kg",
        precio: 279000,
        precioNormal: 289000,
        precioKg: 5580,
        ahorro: "Descuento adicional: $10.000 por cuñete",
        superOferta: true,
        vigencia: "",
        condiciones: [
          "Mínimo total: 300 kg · 6 cuñetes combinables",
          "Entrega coordinada según zona",
          "Consultar stock y entrega"
        ],
        mensajeWhatsapp: "Hola ANDYCLOR. Vi la SUPER OFERTA Mayorista de Pastillas Multiacción 200 g: $279.000 por cuñete de 50 kg (precio habitual $289.000), dentro de una compra mínima de 300 kg. Estoy en ____ y necesito ____ kg."
      },
      {
        tipo: "rapido",
        producto: "Cloro Granulado de Disolución Rápida",
        tecnico: "Dicloro",
        detalle: "Cuñete de 50 kg · Compra mínima total: 300 kg combinables",
        etiquetaPrecio: "Precio por cuñete de 50 kg",
        precio: 235000,
        precioKg: 4700,
        vigencia: "",
        condiciones: [
          "Mínimo total: 300 kg · 6 cuñetes combinables",
          "Entrega coordinada según zona",
          "Despachos por transporte a todo el país"
        ],
        mensajeWhatsapp: "Hola ANDYCLOR. Vi la oferta Mayorista de Cloro Granulado Rápido a $235.000 por cuñete de 50 kg dentro de una compra mínima de 300 kg. Estoy en ____ y necesito ____ kg."
      },
      {
        tipo: "lento",
        producto: "Cloro Granulado de Disolución Lenta",
        tecnico: "Tricloro",
        detalle: "Cuñete de 50 kg · Compra mínima total: 300 kg combinables",
        etiquetaPrecio: "Precio por cuñete de 50 kg",
        precio: 259000,
        precioKg: 5180,
        vigencia: "",
        condiciones: [
          "Mínimo total: 300 kg · 6 cuñetes combinables",
          "Entrega coordinada según zona",
          "Despachos por transporte a todo el país"
        ],
        mensajeWhatsapp: "Hola ANDYCLOR. Vi la oferta Mayorista de Cloro Granulado Lento a $259.000 por cuñete de 50 kg dentro de una compra mínima de 300 kg. Estoy en ____ y necesito ____ kg."
      },
      {
        tipo: "multiaccion",
        producto: "Cloro Granulado Multiacción",
        tecnico: "Granulado Multiacción · A granel",
        detalle: "Cuñete de 50 kg · Compra mínima total: 300 kg combinables",
        etiquetaPrecio: "Precio por cuñete de 50 kg",
        precio: 289000,
        precioKg: 5780,
        vigencia: "",
        condiciones: [
          "Mínimo total: 300 kg · 6 cuñetes combinables",
          "Entrega coordinada según zona",
          "Despachos por transporte a todo el país"
        ],
        mensajeWhatsapp: "Hola ANDYCLOR. Vi la oferta Mayorista de Cloro Granulado Multiacción a $289.000 por cuñete de 50 kg dentro de una compra mínima de 300 kg. Estoy en ____ y necesito ____ kg."
      }
    ]

  },

  contacto: {
    whatsapp: "5491168306266",
    instagram: "",
    facebook: "",
    mercadolibre: ""
  },

  /* Google Analytics 4 activo para andyclor.com.ar. */
  analytics: {
    ga4Id: "G-H3QG2BNK9Y"
  }
};
