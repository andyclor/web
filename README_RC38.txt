ANDYCLOR RC38 — SEO para cloro por mayor y precios por cantidad
Fecha de la mejora SEO: 30/09/2026
Actualización de ofertas: 04/10/2026
Base: RC37_CLORO_LIQUIDO_110_CALCULADORA.zip

OBJETIVO
Reforzar las páginas actuales para búsquedas como "cloro por mayor",
"mayorista de cloro" y búsquedas de precio de cloro por cantidad.
Los cambios preparan el sitio para competir por esas consultas; no garantizan
una posición ni un plazo determinado en Google.

CAMBIOS
- mayoristas.html: título, descripción y encabezado enfocados en cloro por mayor.
- Precios promocionales más cerca del inicio de la página mayorista.
- Oferta por cuñete de 50 kg y precio por kilo incluidos en el HTML inicial.
- Condiciones claras: venta general desde 100 kg; promoción desde 300 kg.
- Sección para comparar precio por kilo, presentación, cantidad y costo de entrega.
- Preguntas frecuentes sobre precios y compras mayoristas.
- oferta-cloro-mayorista.html: precios por cantidad, enlace a condiciones mayoristas
  y ruta de navegación hacia la página principal de mayoristas.
- Inicio y fichas de granulados/pastillas: enlaces descriptivos hacia mayoristas.
- Encabezado del inicio con la actividad principal de ANDYCLOR.
- Fechas del sitemap actualizadas únicamente para las páginas modificadas.
- Se mantienen las URLs actuales.

PRECIOS ACTUALIZADOS AL 04/10/2026
Oferta minorista por cuñete de 50 kg:
- Granulado rápido: $259.000 por 50 kg / $5.180 por kg.
- Granulado lento: $275.000 por 50 kg / $5.500 por kg.
- Pastillas Multiacción 200 g: $295.000 por 50 kg / $5.900 por kg.

Oferta para un mínimo total de 300 kg, con cuñetes combinables según stock:
- Granulado rápido: $239.000 por 50 kg / $4.780 por kg.
- Granulado lento: $255.000 por 50 kg / $5.100 por kg.
- Pastillas Multiacción 200 g: $275.000 por 50 kg / $5.500 por kg.
Stock, precio final y entrega sujetos a confirmación.
Los mensajes de WhatsApp y el HTML inicial mayorista reflejan estos importes.
Todas las páginas cargan una nueva versión de config/config.js para evitar
que el navegador reutilice los precios anteriores.

CONTENIDO CONSERVADO
La lógica de la calculadora, incluido cloro líquido 110 g/L, su JavaScript
y el CSS conservan el contenido de la RC37. La configuración cambia únicamente
en los seis precios de oferta, sus importes por kilo y los mensajes de WhatsApp.
Se conserva la mejora SEO de la RC38, sus URLs y sus condiciones comerciales.
No se agregan imágenes, librerías ni recursos externos a la carga de las páginas.

VERIFICACIÓN
- Todos los enlaces locales y sus anclas resuelven.
- Un título y un H1 por página, sin IDs duplicados.
- JSON de datos estructurados y XML del sitemap válidos.
- Tres ofertas correctas en el HTML inicial de ambas páginas mayoristas.
- Regeneración verificada para tres, dos y cero ofertas activas.
- Calculadora y lógica existente comparadas con la RC37.
La prueba visual de escritorio/celular quedó pendiente porque el navegador
de prueba no estuvo disponible. Abrí las páginas para revisar su presentación
antes de subir el contenido del ZIP.

PUBLICACIÓN
1. Descomprimí el ZIP. El index.html y el CNAME están en la raíz del paquete.
2. Revisá mayoristas.html, oferta-cloro-mayorista.html, oferta-cloro-50kg.html
   e index.html para confirmar los seis precios de oferta.
3. Subí los archivos del paquete al mismo repositorio de GitHub Pages que usás.
4. Esperá a que GitHub Pages termine la publicación y verificá las dos URLs.
5. En Search Console, solicitá indexación de:
   https://andyclor.com.ar/mayoristas.html
   https://andyclor.com.ar/oferta-cloro-mayorista.html

SEGUIMIENTO
Compará períodos equivalentes en Search Console y filtrá las consultas que
contengan "cloro por mayor", "mayorista de cloro" y búsquedas de precios.
Revisá impresiones, clics, CTR, posición y las páginas mostradas para cada consulta.
Las consultas de marca deben analizarse por separado de las búsquedas genéricas.

FUTURAS ACTUALIZACIONES DE PRECIOS
config/config.js sigue siendo el origen de los precios. Al modificar esa
configuración, regenerá también el HTML inicial antes de subir los cambios:

  node scripts/render_wholesale_offers.cjs

Actualizá también la versión de config/config.js en los HTML y subí el paquete
completo, para que las páginas soliciten la configuración nueva.

El generador usa el mismo renderizador de ofertas que el navegador y no requiere
paquetes adicionales. También oculta las ofertas cuyo precio sea cero.

REFERENCIAS
https://developers.google.com/search/docs/essentials?hl=es
https://developers.google.com/search/docs/appearance/title-link?hl=es
