ANDYCLOR 1.0 FINAL AJUSTADA

Últimos cambios:
- Pastilla de 50 g: 1 cada 5.000 litros.
- Pastilla de 200 g: 1 cada 20.000 litros.
- Boya ionizadora: Para piletas de hasta 70.000 litros.
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
- Izquierda: Pedido, cantidades a comprar y WhatsApp arriba.
- Derecha: Tratamiento, dosis y explicación.
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
- Convención editorial: Los segmentos visibles como Mayorista/Minorista usan mayúscula inicial. Cada oración y la primera palabra posterior a dos puntos comienzan con mayúscula.


ANDYCLOR MASTER 1.0 — RC4
- La grilla de ofertas se adapta de forma independiente en Minorista y Mayorista.
- 1 oferta activa: Tarjeta centrada.
- 2 ofertas activas: Dos tarjetas centradas y repartidas horizontalmente.
- 3 ofertas activas: Tres tarjetas repartidas en una misma fila en escritorio.
- En celular, las ofertas se apilan en una sola columna.
- Si no hay ofertas activas, la sección correspondiente se oculta por completo.


ANDYCLOR MASTER 1.0 — RC5
- Se restauró la separación visual entre ANDY y CLOR en el nombre grande de la portada.
- La separación se mantiene en computadora y celular.
- Se conservan sin cambios la configuración de precios y la grilla dinámica de ofertas de RC4.


ANDYCLOR MASTER 1.0 — RC6
- La venta Mayorista se comunica desde 100 kg.
- Las listas de 300, 500 y 1.000 kg se presentan como escalas de referencia.
- La condición final se acuerda con cada cliente según cantidad, distancia, frecuencia y modalidad de entrega.
- Se eliminaron de la página Mayoristas las referencias a ofertas de 5, 10 y 20 kg.
- La oferta publicada de 500 kg se mantiene como referencia, no como tarifa general.
- Se informan tres modalidades: Entrega con transporte propio, retiro coordinado y despacho por transporte de confianza.


ANDYCLOR MASTER 1.0 — RC7
- Se normalizó el uso de mayúsculas al comienzo de cada oración.
- La primera palabra posterior a dos puntos comienza con mayúscula en todos los textos visibles.
- Se unificó la escritura de Mayorista y Minorista en los pies de página.


ANDYCLOR MASTER 1.0 — RC8
- La sección de presentaciones de granulados quedó reducida a tres tarjetas centradas.
- Las cantidades de 5, 10 y 20 kg se agruparon como descuentos por cantidad.
- Los 50 kg se identifican expresamente como granulados a granel en cuñete completo.
- Los 45 kg fraccionados se muestran como alternativa dentro de la presentación de cuñete.
- La misma clasificación se aplicó a las fichas de Granulado Rápido, Lento y Multiacción.


ANDYCLOR MASTER 1.0 — RC11
- Se incorporó la guía “Cómo recuperar el agua verde de una pileta” con pasos, seguridad, pH, cloro, alguicida, filtrado, clarificador y limpiafondo.
- Los textos combinan expresiones habituales de los clientes con términos técnicos: Cloro en polvo/granulado, dicloro, tricloro, pastillas multifunción/triple acción/Multiacción, verdín/algas y decantar/clarificar.
- La calculadora suma una tabla visible de cantidades para 10.000, 20.000, 40.000 y 50.000 litros y nuevas respuestas frecuentes.
- Se recuperaron los datos estructurados Organization y WebSite en la portada.
- Todas las páginas internas generan navegación visible y BreadcrumbList.
- Academia enlaza directamente a la nueva guía.
- El sitemap incluye la nueva URL y fechas de actualización.
- Los mensajes enviados por WhatsApp identifican el origen cuando la visita llega desde ChatGPT, Perplexity, Bing/Copilot, Google, Instagram o Facebook.
- Quedó preparado Google Analytics 4: Para activarlo, editar config/config.js y completar analytics.ga4Id. Si permanece vacío, no se carga Analytics.


ANDYCLOR MASTER 1.0 — RC12
- En computadora, los botones de WhatsApp abren directamente la conversación en WhatsApp Web y evitan la página institucional intermedia.
- En celulares y tabletas, los enlaces conservan la apertura mediante WhatsApp para derivar a la aplicación instalada.
- Se mantienen el mensaje precargado, la identificación del origen de la visita y la medición de clics.


ANDYCLOR MASTER 1.0 — RC13
- Se incorporó la guía “Cómo mantener el agua cristalina de una pileta” con una rutina preventiva, señales frecuentes y respuestas concretas.
- La portada incluye accesos visibles a elección de cloro, recuperación de agua verde, mantenimiento del agua cristalina y calculadora.
- Academia enlaza la nueva guía y suma una respuesta preventiva para agua verde o turbia.
- El sitemap incluye 16 páginas indexables.
- Academia incorpora datos estructurados CollectionPage con enlaces a sus contenidos principales.
- La identificación del origen de consultas suma Claude, Gemini, Meta AI, You.com y Brave Search.
- Se mantienen sin cambios los precios, condiciones comerciales, ofertas, calculadora, diseño general y apertura directa de WhatsApp.

Después de publicar RC13:
- Solicitar indexación de la portada, Academia y la nueva guía en Google Search Console.
- Enviar https://andyclor.com.ar/sitemap.xml en Bing Webmaster Tools.
- Activar Google Analytics 4 sólo cuando se disponga del ID G-XXXXXXXXXX en config/config.js.


ANDYCLOR MASTER 1.0 — RC14
- Se activó Google Analytics 4 con el ID de medición G-H3QG2BNK9Y.
- La medición se carga automáticamente en todas las páginas públicas del sitio.
- Se conserva el evento whatsapp_click para medir los accesos a WhatsApp, con la página, el texto del enlace y el origen de la visita.
- Se mantiene la identificación de visitas desde buscadores, redes sociales y asistentes de IA.
- No se modificaron precios, ofertas, diseño, SEO, calculadora ni el funcionamiento de WhatsApp.

Después de publicar RC14:
- Abrir andyclor.com.ar en una pestaña nueva.
- Volver a Google Analytics y usar “Probar instalación”.
- Verificar la primera visita en Informes > En tiempo real; la recepción inicial puede tardar unos minutos.


ANDYCLOR MASTER 1.0 — RC15
- Se reforzó el evento whatsapp_click después de comprobar que Analytics recibía las visitas pero no los contactos.
- El detector de clics se activa de forma independiente al resto de las funciones de la página.
- El evento se captura antes de abrir WhatsApp y se envía mediante beacon al flujo G-H3QG2BNK9Y.
- La medición funciona con wa.me en celulares y web.whatsapp.com en computadoras.
- Se mantiene la apertura directa de WhatsApp Web, sin volver a la pantalla institucional intermedia.
- No se modificaron diseño, precios, ofertas, SEO, calculadora ni mensajes comerciales.

Después de publicar RC15:
- Abrir andyclor.com.ar con Ctrl + F5.
- Hacer clic una sola vez en un botón de WhatsApp.
- Esperar entre 1 y 3 minutos y revisar “Número de eventos por Nombre del evento” en el informe En tiempo real.


ANDYCLOR MASTER 1.0 — RC16
- Se incorporó en la raíz el archivo de verificación de IndexNow que antes se había subido individualmente: 9e25630c36644c258549d8f7415001ab.txt.
- Se agregó una automatización de GitHub que se ejecuta al publicar cambios en la rama principal.
- La automatización toma directamente de sitemap.xml las 16 páginas públicas y las envía juntas al servicio oficial de IndexNow.
- También puede ejecutarse manualmente desde la sección Actions de GitHub si alguna vez fuera necesario.
- La validación comprueba que la clave, el dominio y todas las URL pertenezcan a andyclor.com.ar antes de hacer el envío.
- No requiere contraseñas, secretos ni configuraciones adicionales.
- No se modificaron diseño, textos comerciales, precios, ofertas, SEO visible, calculadora, Analytics ni WhatsApp.

PUBLICACIÓN DE RC16
- Descomprimir y subir todo el contenido a la raíz del repositorio GitHub “web”, reemplazando los archivos anteriores.
- Incluir especialmente la carpeta .github, la carpeta scripts y el archivo 9e25630c36644c258549d8f7415001ab.txt.
- No generar otra clave en Bing ni borrar el archivo de verificación.
- Después de confirmar los cambios, GitHub ejecutará “Avisar cambios a IndexNow” automáticamente.


ANDYCLOR MASTER 1.0 — RC17
- Se incorporó una página regional útil: “Distribuidor de Cloro para Piletas en Zona Sur”.
- La portada y Mayoristas refuerzan Distribuidor, Zona Sur, Buenos Aires e Interior del País sin repetir palabras de forma artificial.
- La ficha de Granulado Rápido incorpora la equivalencia comercial: Cloro Instantáneo = Dicloro de disolución rápida.
- La ficha de Granulado Lento incorpora la equivalencia comercial: Cloro Técnico = Tricloro de disolución lenta.
- La ficha de Pastillas incorpora las búsquedas Multiacción, Multifunción y Triple Acción, manteniendo Multiacción como nombre principal.
- Se agregaron enlaces internos entre portada, productos, Mayoristas, contacto, Adrogué y la nueva página regional.
- El sitemap pasa de 16 a 17 páginas y conserva la automatización de IndexNow.
- No se modificaron precios, ofertas, calculadora, Analytics, WhatsApp, configuración ni diseño general.

DESPUÉS DE PUBLICAR RC17
- Solicitar indexación en Google Search Console de la portada, Mayoristas y distribuidor-cloro-piletas-zona-sur.html.
- No es necesario volver a cargar el sitemap en Bing: IndexNow enviará automáticamente las 17 páginas.


ANDYCLOR — OPTIMIZACIÓN FINAL PC Y CELULAR — 2026-08-18
- Se eliminaron 10 imágenes antiguas que no eran utilizadas por ninguna página.
- La carpeta Imagenes pasó de aproximadamente 9,1 MB a aproximadamente 1,1 MB.
- Se mantiene fondo.webp para computadoras y se agregó fondo-mobile.webp para celulares.
- Cada página precarga solamente el fondo correspondiente al ancho de pantalla.
- Se optimizaron el logo superior, el logo del pie, Granulado Multiacción y Test Kit sin cambiar su función ni su aspecto general.
- Todas las imágenes visibles tienen dimensiones declaradas para evitar movimientos durante la carga.
- Las imágenes fuera de la primera pantalla usan carga diferida y decodificación asíncrona.
- Se conserva fondo.jpg porque es la imagen social utilizada por Open Graph.
- Se mantienen las 17 páginas, sitemap, robots, IndexNow, Analytics, WhatsApp, Data Fiscal, ofertas y calculadora.

PUBLICACIÓN
- Descomprimir este ZIP y subir todo su contenido directamente a la raíz del repositorio GitHub “web”, reemplazando los archivos anteriores.
- No subir una carpeta contenedora adicional.


ANDYCLOR MASTER 1.0 — RC18 SEO SELECTIVO — 2026-08-23
- Se auditó el sitio con la hoja de ruta SEO de Webstrategy y la documentación oficial de Google Search Central.
- Se conservaron títulos, contenidos, páginas, enlaces internos, Analytics y eventos de WhatsApp porque ya están correctamente implementados.
- La identidad Organization ahora utiliza el logo cuadrado de 512 px y vincula el perfil oficial de Instagram mediante sameAs.
- Se acortó la descripción de la página local de Adrogué para evitar una presentación innecesariamente larga en resultados.
- El sitemap informa fechas reales de cambios significativos y elimina priority/changefreq, valores que Google declara ignorar.
- No se agregaron páginas repetidas, palabras clave forzadas, precios estructurados ni una dirección comercial inexistente.

DESPUÉS DE PUBLICAR RC18
- En Google Search Console, inspeccionar la portada, Mayoristas y Cloro para Piletas en Adrogué; solicitar indexación una sola vez.
- No volver a enviar cada URL repetidamente: el sitemap y la automatización de IndexNow ya anuncian los cambios.


ANDYCLOR MASTER 1.0 — RC19 GUÍAS SEO — 2026-08-23
- Se revisaron los 45 puntos de la hoja de ruta SEO y se contrastaron con la documentación vigente de Google Search Central.
- Se agregaron índices internos visibles a las dos guías extensas para facilitar la navegación y el acceso directo a sus secciones.
- Se corrigió la página huérfana de Adrogué con un enlace contextual desde la cobertura de Zona Sur.
- Se incorporó autoría organizacional y fecha visible de actualización en ambas guías.
- Se actualizaron dateModified y lastmod de forma coherente con los cambios reales.
- Los datos Article ahora usan el logotipo cuadrado del sitio de 512 x 512 px.
- Se agregaron descripciones og:image:alt y se incrementó la versión de CSS solamente en las páginas modificadas.
- No se añadieron GTM, plugins, texto de relleno, backlinks pagos ni esquemas de producto sin precio y stock verificables.

DESPUÉS DE PUBLICAR RC19
- Inspeccionar en Google Search Console las dos guías actualizadas y solicitar indexación una sola vez.
- Mantener el seguimiento de consultas, páginas y enlaces en Search Console; no crear contenido sólo para alcanzar una cantidad de palabras.


ANDYCLOR MASTER 1.0 — RC20 OXYPOOL — 2026-08-24
- Se incorporó Oxypool Nataclor como alternativa de recuperación rápida dentro de la página principal de cloro, sin crear una página repetida.
- Se publican únicamente las presentaciones originales trabajadas por ANDYCLOR: envase de 1 kg y lata de 10 kg.
- La guía de agua verde incluye la referencia base de 20 g cada 10.000 litros y una aplicación reforzada máxima de 40 g cada 10.000 litros.
- Se aclara que el tiempo de recuperación depende del pH, el filtrado, el estado inicial y la carga orgánica; no se promete un plazo fijo.
- Se detallan los factores que aumentan la demanda: calor intenso, muchos bañistas, protectores solares y cremas, hojas y pinochas, lluvia, tierra y otros residuos.
- La calculadora suma la opción “Recuperación rápida con Oxypool”, muestra dosis base y reforzada máxima y prepara la consulta por WhatsApp.
- Se actualizaron metadatos, datos estructurados, enlaces internos, versiones de CSS/JavaScript y fechas reales del sitemap.
- Se conservan Analytics, WhatsApp, IndexNow, Data Fiscal, ofertas, diseño general y las 17 URLs existentes.

DESPUÉS DE PUBLICAR RC20
- Probar la calculadora seleccionando “Recuperación rápida con Oxypool” en computadora y celular.
- Inspeccionar en Google Search Console cloro-piletas.html, calculadora.html y como-recuperar-agua-verde-pileta.html; solicitar indexación una sola vez.
- Subir todo el contenido del ZIP directamente a la raíz del repositorio GitHub “web”, sin agregar una carpeta contenedora.


ANDYCLOR MASTER 1.0 — RC21 RECUPERO + MANTENIMIENTO — 2026-08-24
- La calculadora separa el tratamiento puntual de recuperación del mantenimiento habitual.
- Cuando el agua necesita recupero, muestra primero Oxypool Nataclor con la dosis base de 20 g cada 10.000 litros y el máximo reforzado de 40 g cada 10.000 litros.
- Debajo muestra el tipo de cloro, la dosis y la frecuencia orientativa para continuar el mantenimiento según la pileta, la temporada y la opción elegida.
- Oxypool ya no reemplaza al cloro de mantenimiento dentro del selector: se calcula como tratamiento adicional.
- La consulta preparada por WhatsApp incluye primero el recupero y luego todos los productos sugeridos para mantenimiento.
- Se reforzó en las páginas de cloro y agua verde que Oxypool no reemplaza el mantenimiento posterior.

DESPUÉS DE PUBLICAR RC21
- Probar la calculadora una vez con “Necesita recuperación rápida” y otra con “Está bien: calcular solo mantenimiento”.
- Verificar en celular que el bloque “Primero: recupero del agua” aparezca antes de “Después: mantenimiento sugerido”.
- Subir todo el contenido del ZIP directamente a la raíz del repositorio GitHub “web”, sin agregar una carpeta contenedora.
