ANDYCLOR 1.0 FINAL AJUSTADA

Últimos cambios:
- Pastilla de 50 g: 1 cada 5.000 litros.
- Pastilla de 200 g: 1 cada 20.000 litros.
- Boya ionizadora: para piletas de hasta 70.000 litros.
- Calculadora con un solo título y un subtítulo breve.
- Mayoristas sin títulos repetidos.
- Contacto con tarjetas de color y WhatsApp ubicado en el centro.

PUBLICACIÓN
Descomprimir y subir todo el contenido a la raíz del repositorio GitHub “web”.


HOTFIX:
- Menú móvil cerrado por defecto.
- Se abre únicamente al tocar ☰.
- Se cierra al elegir una opción, tocar fuera o presionar Escape.


CAMBIOS WEB 8 CORREGIDA
- Ribete morado en imágenes de Pastillas y Multiacción.
- Ribetes por color en imágenes sin borde.
- Menor separación entre encabezado y calculadora.
- Opción predeterminada: Solo Cloro Granulado.
- Tratamiento, pedido y botón de WhatsApp aparecen antes que los datos de la pileta.
- Datos de la pileta disponibles en un bloque desplegable.
- Pestañas de Cloro en dos filas en celular.
- Contacto ampliado: Adrogué, Lomas, Banfield, La Plata, Pilar, Canning y otras zonas.


ANDYCLOR 1.0 GOLD
- Al calcular, el formulario se oculta.
- El tratamiento recomendado ocupa su lugar.
- El pedido sugerido y el botón Finalizar pedido por WhatsApp quedan en primer plano.
- Los datos de la pileta permanecen en el bloque desplegable.
- Se agregó el botón Modificar datos para volver al formulario.


AJUSTE FINAL DE CALCULADORA
- El resultado reemplaza visualmente al formulario en la columna izquierda.
- Primero aparecen tratamiento, presentación sugerida y botón Finalizar pedido por WhatsApp.
- Modificar datos permite volver al formulario.


OFERTA Y ACADEMIA
- Inicio muestra la Oferta Minorista sin mezclar precios Mayoristas.
- La página Mayoristas muestra una condición de referencia y deriva la cotización final a contacto directo.
- Los precios editables se modifican en config/config.js, dentro de ANDYCLOR_CONFIG.
- Academia recupera tarjetas/recuadros visuales y preguntas frecuentes.


CORRECCIÓN CALCULADORA Y MAYORISTAS
- Calculadora en dos columnas luego del cálculo.
- Izquierda: pedido, cantidades a comprar y WhatsApp arriba.
- Derecha: tratamiento, dosis y explicación.
- La presentación sugerida no repite la dosis diaria.
- Mayoristas con tarjetas más contrastadas, iconos, colores y relieve.


AJUSTE FINAL DE CALCULADORA
- En Pedido preparado, cada producto aparece en la fila superior.
- La cantidad o presentación sugerida aparece debajo.
- Al calcular, la pantalla se posiciona al inicio de Resultado del cálculo.
- El botón Finalizar pedido por WhatsApp queda visible inmediatamente.


HOTFIX SCROLL
- Espera a que el resultado termine de acomodarse antes de desplazar.
- Lleva la pantalla al comienzo de la columna izquierda.
- Hace un segundo ajuste automático para evitar que termine al final de la calculadora.

CAMBIAR PRECIOS:
Abrir config/config.js y editar:
- minorista.precio
- minorista.precioKg
- distribuidor.precio
- distribuidor.precioKg
- distribuidor.ahorro
Luego subir solo config/config.js a GitHub.


MENÚ MÓVIL FINAL
- Barra inferior con Inicio, Cloro, Calcular y WhatsApp.
- Cada opción tiene efecto redondeado independiente.
- WhatsApp queda destacado en verde.
- Se ocultan los botones flotantes de WhatsApp en celular para evitar duplicados.

ANDYCLOR MASTER 1.0 — M001
- Portada reenfocada en ANDYCLOR como especialista: “Especialistas en el cuidado de piletas”.
- Hero simplificado: “Venta Mayorista y Minorista · Envíos”.
- Se dejaron solo dos acciones principales: Ver productos y Calcular dosis.
- Nataclor deja de ocupar el hero; se mantiene como respaldo comercial en el pie: “Distribuidor Multimarca · Línea principal NATACLOR”.
- Se agregó una línea breve bajo el hero con las categorías principales para reforzar claridad semántica sin recargar la cabecera.
- Título, meta description y Open Graph de la portada alineados con el nuevo posicionamiento.
- Convención editorial: segmentos visibles como Mayorista/Minorista usan mayúscula inicial; en texto corrido se mantiene minúscula.


ANDYCLOR MASTER 1.0 — RC4
- La grilla de ofertas se adapta de forma independiente en Minorista y Mayorista.
- 1 oferta activa: tarjeta centrada.
- 2 ofertas activas: dos tarjetas centradas y repartidas horizontalmente.
- 3 ofertas activas: tres tarjetas repartidas en una misma fila en escritorio.
- En celular, las ofertas se apilan en una sola columna.
- Si no hay ofertas activas, la sección correspondiente se oculta por completo.


ANDYCLOR MASTER 1.0 — RC5
- Se restauró la separación visual entre ANDY y CLOR en el nombre grande de la portada.
- La separación se mantiene en computadora y celular.
- Se conservan sin cambios la configuración de precios y la grilla dinámica de ofertas de RC4.
