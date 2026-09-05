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
        tipo: "rapido",
        producto: "Cloro Granulado de Disolución Rápida",
        tecnico: "Dicloro · A granel",
        detalle: "Cuñete de 50 kg a granel",
        etiquetaPrecio: "Precio minorista por cuñete",
        precio: 249000,
        precioKg: 4980,
        mensajeWhatsapp: "Hola ANDYCLOR. Quiero consultar la Oferta Minorista de Cloro Granulado Rápido a granel: cuñete de 50 kg a $249.000."
      },
      {
        tipo: "lento",
        producto: "Cloro Granulado de Disolución Lenta",
        tecnico: "Tricloro · A granel",
        detalle: "Cuñete de 50 kg a granel",
        etiquetaPrecio: "Precio minorista por cuñete",
        precio: 265000,
        precioKg: 5300,
        mensajeWhatsapp: "Hola ANDYCLOR. Quiero consultar la Oferta Minorista de Cloro Granulado Lento a granel: cuñete de 50 kg a $265.000."
      },
      {
        tipo: "pastillas",
        producto: "Pastillas Multiacción 200 g",
        tecnico: "En cápsulas",
        detalle: "Cuñete de 50 kg",
        etiquetaPrecio: "Precio minorista por cuñete",
        precio: 269000,
        precioKg: 5380,
        mensajeWhatsapp: "Hola ANDYCLOR. Quiero consultar la Oferta Minorista de Pastillas Multiacción: cuñete de 50 kg a $269.000."
      }
    ],

    mayorista: [
      {
        tipo: "rapido",
        producto: "Cloro Granulado de Disolución Rápida",
        tecnico: "Dicloro",
        detalle: "Cuñete de 50 kg · Compra mínima total: 300 kg combinables",
        etiquetaPrecio: "Precio promocional por cuñete de 50 kg",
        precio: 210000,
        precioKg: 4200,
        vigencia: "Pedidos hasta el 12/09/2026",
        condiciones: [
          "Compra mínima total: 300 kg (6 cuñetes combinables)",
          "Entrega propia hasta 100 km, coordinada según zona",
          "Despachos por transporte a todo el país",
          "Cupos de entrega limitados · Consultar stock disponible"
        ],
        mensajeWhatsapp: "Hola ANDYCLOR. Vi la oferta Mayorista de Cloro Granulado Rápido a $210.000 por cuñete de 50 kg. Estoy en ____ y necesito ____ kg."
      },
      {
        tipo: "lento",
        producto: "Cloro Granulado de Disolución Lenta",
        tecnico: "Tricloro",
        detalle: "Cuñete de 50 kg · Compra mínima total: 300 kg combinables",
        etiquetaPrecio: "Precio promocional por cuñete de 50 kg",
        precio: 220000,
        precioKg: 4400,
        vigencia: "Pedidos hasta el 12/09/2026",
        condiciones: [
          "Compra mínima total: 300 kg (6 cuñetes combinables)",
          "Entrega propia hasta 100 km, coordinada según zona",
          "Despachos por transporte a todo el país",
          "Cupos de entrega limitados · Consultar stock disponible"
        ],
        mensajeWhatsapp: "Hola ANDYCLOR. Vi la oferta Mayorista de Cloro Granulado Lento (Tricloro) a $220.000 por cuñete de 50 kg. Estoy en ____ y necesito ____ kg."
      },
      {
        tipo: "pastillas",
        producto: "Pastillas Multiacción 200 g",
        tecnico: "En cápsulas",
        detalle: "Cuñete de 50 kg · Compra mínima total: 300 kg combinables",
        etiquetaPrecio: "Precio promocional por cuñete de 50 kg",
        precio: 235000,
        precioKg: 4700,
        vigencia: "Pedidos hasta el 12/09/2026",
        condiciones: [
          "Compra mínima total: 300 kg (6 cuñetes combinables)",
          "Entrega propia hasta 100 km, coordinada según zona",
          "Despachos por transporte a todo el país",
          "Cupos de entrega limitados · Consultar stock disponible"
        ],
        mensajeWhatsapp: "Hola ANDYCLOR. Vi la oferta Mayorista de Pastillas Multiacción a $235.000 por cuñete de 50 kg. Estoy en ____ y necesito ____ kg."
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
