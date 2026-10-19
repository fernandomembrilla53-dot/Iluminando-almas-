# Iluminando Almas — demo funcional 1.0

App web progresiva (PWA) para presentar a un cliente. Diseño negro, rojo y dorado. Camila es un personaje ilustrado basado en una fotografía de referencia.

## Incluye
- Pantalla de inicio con Camila; menú y navegación inferior.
- Baraja de 78 cartas, selección aleatoria y tiradas de 1 o 3 cartas, amor, trabajo y general.
- Interpretaciones simbólicas escritas y lectura por voz del dispositivo (Web Speech API, si disponible).
- Historial de tiradas local, eliminación individual o total.
- Catálogo con categorías, buscador y carrito preparado; sin productos ni precios ficticios.
- Consejos, contacto pendiente, privacidad, términos, iconos, manifest y caché offline.

## Probar
1. Extraer el ZIP.
2. Abrir una terminal en la carpeta `iluminando-almas`.
3. Ejecutar `python -m http.server 8080`.
4. Abrir `http://localhost:8080` en un navegador. Desde otro dispositivo en la misma red, abrir la IP local de la computadora con puerto 8080.

No se necesita API ni cuenta para probar el tarot. El sintetizador de voz depende del navegador/dispositivo y no se garantiza un timbre argentino ni funcionamiento sin conexión en todos los equipos.

## Personalización
- `app.js`: objeto `CONFIG` al inicio (contactos). `PRODUCTS` es un array vacío. Ejemplo de un artículo real cuando el cliente lo autorice:
  `{id:'sku-001', name:'Nombre aprobado', category:'Sahumerios', description:'Descripción aprobada', price:1200, icon:'🕯'}`
- Los precios son ARS, se muestran solamente cuando estén definidos en el catálogo real.
- `assets/camila.png` es una ilustración preliminar extraída de la propuesta gráfica, no una animación 3D ni un modelo animable. El movimiento de labios no está implementado.
- La versión premium y pagos no están implementados. No se almacenan claves privadas en el cliente.

## Publicar PWA
Subir todo el contenido a una ruta HTTPS estable, por ejemplo GitHub Pages, manteniendo rutas relativas. Actualizar la versión del caché en `sw.js` después de cada publicación. Verificar que `privacy.html` y `terms.html` tengan URL públicas. Reemplazar los documentos de demostración por versiones con datos del titular.

## Preparar APK / AAB para Google Play (TWA)
Esta entrega **no contiene APK ni AAB compilados**. Para crear los binarios se necesita una computadora con Android SDK, JDK y Bubblewrap o Android Studio, más una URL HTTPS pública y una clave de firma segura.

Ejemplo de flujo orientativo con Bubblewrap (verificar versiones y documentación vigente):
1. Publicar y probar la PWA en HTTPS.
2. Instalar Android SDK, JDK y `@bubblewrap/cli` en la PC.
3. `bubblewrap init --manifest https://DOMINIO/iluminando-almas/manifest.webmanifest`
4. Elegir un identificador de paquete único (ej. `com.bmapps.iluminandoalmas`, **solo si está disponible**) y generar una clave de firma bajo control del propietario.
5. `bubblewrap build` para generar binarios, según versión y configuración.
6. Publicar `/.well-known/assetlinks.json` en el origen HTTPS con huella SHA-256 del certificado correcto (la firma de Play App Signing puede diferir de la local); verificar pantalla completa sin barra de navegador.
7. Probar APK en varios Android, incluyendo instalación, navegación, voz, modo offline y enlaces externos. Para Play subir AAB firmado y completar ficha, clasificación, audiencia, Data Safety, política de privacidad, declaración de contenido, accesos de revisión, países y pruebas requeridas para esa cuenta.

Una alternativa es crear una aplicación Android nativa con WebView, pero la TWA permite reutilizar la PWA y exige un dominio verificado.

## Pendiente antes de producción
- Identidad legal, dirección de contacto y correo del responsable.
- Autorización de uso comercial de imagen/semejanza de Camila; derechos de imágenes, música y demás recursos.
- Productos reales, fotografías, precios, stock, condiciones de compra, envíos y devoluciones; WhatsApp comercial.
- Elegir si habrá IA remota, voz profesional, anuncios, suscripciones o compras digitales. En caso de vender funcionalidades digitales dentro de la app, revisar las reglas de Google Play Billing. Productos físicos tienen tratamiento diferente.
- Revisar afirmaciones sobre santería y evitar promesas de curación o efectos garantizados.
- Configurar HTTPS, dominio y política de privacidad definitiva, accesibilidad, pruebas con lectores de pantalla, contraste, rendimiento, fallos, actualización offline y seguridad.
- Verificar edad objetivo, contenido sensible, consentimiento y políticas de Play actuales antes de presentar a revisión.
- Si se agrega una API de IA, implementar un backend con control de costos, límites, protección de claves y manejo de datos.

**Estado:** prototipo navegable para aprobación del cliente, no versión de producción ni APK lista para Play.
