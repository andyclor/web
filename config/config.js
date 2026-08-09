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
        tecnico: "Dicloro",
        detalle: "1 cuñete de 50 kg",
        precio: 0,
        precioKg: 0,
        mensajeWhatsapp: "Hola ANDYCLOR. Quiero consultar la Oferta Minorista de Cloro Granulado Rápido."
      },
      {
        tipo: "lento",
        producto: "Cloro Granulado de Disolución Lenta",
        tecnico: "Tricloro",
        detalle: "1 cuñete de 50 kg",
        precio: 0,
        precioKg: 0,
        mensajeWhatsapp: "Hola ANDYCLOR. Quiero consultar la Oferta Minorista de Cloro Granulado Lento."
      },
      {
        tipo: "pastillas",
        producto: "Pastillas Multiacción 200 g",
        tecnico: "En cápsulas",
        detalle: "1 cuñete de 50 kg",
        precio: 259000,
        precioKg: 5180,
        mensajeWhatsapp: "Hola ANDYCLOR. Quiero consultar la Oferta Minorista de Pastillas Multiacción por 50 kg."
      }
    ],

    mayorista: [
      {
        tipo: "rapido",
        producto: "Cloro Granulado de Disolución Rápida",
        tecnico: "Dicloro",
        detalle: "Referencia para cotización Mayorista",
        precio: 0,
        precioKg: 0,
        mensajeWhatsapp: "Hola ANDYCLOR. Quiero solicitar una cotización Mayorista de Cloro Granulado Rápido. Cantidad estimada: ____ kg. Frecuencia: ____. Zona: ____."
      },
      {
        tipo: "lento",
        producto: "Cloro Granulado de Disolución Lenta",
        tecnico: "Tricloro",
        detalle: "Referencia para cotización Mayorista",
        precio: 0,
        precioKg: 0,
        mensajeWhatsapp: "Hola ANDYCLOR. Quiero solicitar una cotización Mayorista de Cloro Granulado Lento. Cantidad estimada: ____ kg. Frecuencia: ____. Zona: ____."
      },
      {
        tipo: "pastillas",
        producto: "Pastillas Multiacción 200 g",
        tecnico: "En cápsulas",
        detalle: "Referencia publicada: compras desde 500 kg",
        precio: 225000,
        precioKg: 4500,
        ahorro: "Precio de referencia para esta condición",
        mensajeWhatsapp: "Hola ANDYCLOR. Quiero solicitar una cotización Mayorista de Pastillas Multiacción. Cantidad estimada: ____ kg. Frecuencia: ____. Zona: ____."
      }
    ]
  },

  contacto: {
    whatsapp: "5491168306266",
    instagram: "",
    facebook: "",
    mercadolibre: ""
  }
};
