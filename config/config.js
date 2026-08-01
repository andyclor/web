/* PANEL DE CONFIGURACIÓN ANDYCLOR
   Editá solamente los valores entre comillas.
   Dejá un enlace vacío ("") para mostrar "Próximamente".
   Para ocultar un producto, cambiá true por false.
*/
window.ANDYCLOR_CONFIG = {
  whatsapp: "5491168306266",
  mensajeGeneral: "Hola ANDYCLOR. Quiero consultar precios.",
  mensajeCotizacion: "Hola ANDYCLOR. Quisiera solicitar una cotización.",

  oferta: {
    producto: "Pastillas Multiacción x 50 kg",
    precio: "Precio mayorista: Compras superiores a 500 kg, $225.000 cada cuñete",
    texto: "Oferta con stock limitado. Venta mayorista y minorista de Pastillas Multiacción en cápsulas, ideales para mantenimiento mensual y temporada.",
    vigencia: "",
    mensajeWhatsApp: "Hola ANDYCLOR. Quiero consultar la oferta en compra Mayorista de Pastillas Multiacción x 50 kg."
  },

  // Podés agregar más promociones copiando el ejemplo entre llaves.
  // Si la lista queda vacía, la sección no se muestra.
  promociones: [
    // { producto: "Producto", precio: "$0", texto: "Descripción", mensajeWhatsApp: "Hola ANDYCLOR. Quiero consultar esta promoción." }
  ],

  redes: {
    instagram: "@andyclor_distribuidormayorista",
    facebook: "andyclor_distribuidor-mayorist",
    mercadoLibre: ""
  },

  contacto: {
    direccion: "Adrogué, Zona Sur, Buenos Aires",
    horarios: "Consultar horarios por WhatsApp",
    email: ""
  },

  productosVisibles: {
    rapido: true,
    lento: true,
    multiaccion: true,
    alguicida_clarificador: true,
    accesorios: true,
    liquidos: true
  }
};


/* OFERTAS EDITABLES — modificar solo estos valores */
window.ANDYCLOR_OFERTAS = {
  minorista: {
    activo: true,
    producto: "Pastillas Multiacción",
    precio: "$205.000",
    precioKg: "Equivale a $4.100 por kg",
    mensajeWhatsapp: "Hola ANDYCLOR. Quiero consultar la oferta minorista por 1 cuñete de 50 kg."
  },
  mayorista: {
    activo: true,
    volumen: "Desde 300 o 500 kg",
    mensajeWhatsapp: "Hola ANDYCLOR. Quiero solicitar una cotización mayorista por 300 o 500 kg."
  }
};


/* ==========================================================
   ANDYCLOR - CONFIGURACIÓN GENERAL
   MODIFICÁ SOLO LOS VALORES ENTRE COMILLAS
   ========================================================== */
window.ANDYCLOR_CONFIG = {
  oferta: {
    mostrar: true,
    minorista: {
      producto: "Pastillas Multiacción 200 g",
      detalle: "1 cuñete de 50 kg",
      precio: "$259.000",
      precioKg: "$5.180 por kg",
      mensajeWhatsapp: "Hola ANDYCLOR. Quiero consultar la oferta minorista por 1 cuñete de 50 kg."
    },
    distribuidor: {
      volumen: "Compra mínima: 500 kg",
      precio: "$225.000 por cuñete",
      precioKg: "$4.500 por kg",
      ahorro: "Ahorrás $34.000 por cuñete",
      mensajeWhatsapp: "Hola ANDYCLOR. Quiero solicitar una cotización para distribuidores por 500 kg o más."
    }
  },
  contacto: {
    whatsapp: "5491168306266",
    instagram: "",
    facebook: "",
    mercadolibre: ""
  }
};
