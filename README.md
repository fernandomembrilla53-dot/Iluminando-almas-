# Iluminando Almas — Rediseño celestial v2 (rama de revisión)

Actualización sobre la PWA existente. Se preserva Tarot de Marsella de 78 cartas, selección manual, tiradas de una o tres cartas, interpretaciones simbólicas, voz del dispositivo, historial local y catálogo de comercio en preparación.

## Actualizado
- Portada celeste/violeta y oro con ilustración vectorial original; navegación de cinco accesos.
- Tirada del día con carta determinista por fecha local, además de la selección manual completa del mazo.
- Horóscopo recreativo por signo (sin afirmaciones predictivas).
- Compatibilidad zodiacal lúdica.
- Ritual de luna, ejercicio de calma y afirmación del día con seguimiento local.
- Diario con estado de ánimo, reflexión, guardado y borrado individual en el dispositivo.
- Íconos instalables PNG 192x192 y 512x512, SVG, manifest y caché offline v2.
- Textos de privacidad y términos actualizados para el almacenamiento local del diario.

## Probar en local
Servir el repositorio con `python -m http.server 8080`, abrir `http://localhost:8080` y comprobar inicio, navegación, tarot, lectura en voz, diario, rituales, horóscopo, compatibilidad, manifest y modo offline. El código no necesita API ni backend.

## Aún pendiente antes de publicación comercial / Play Store
- Revisar en dispositivo Android real el diseño, accesibilidad y funcionamiento en modo avión; validar que la PWA sea instalable.
- Crear ilustraciones **individuales del Tarot de Marsella** con licencia adecuada para las 78 cartas; hoy la selección y las caras son representaciones estilizadas, no una baraja ilustrada auténtica.
- Confirmar datos legales y contacto comercial, políticas finales, audiencia, derechos y posible contenido premium.
- Catálogo de productos reales, precios, condiciones y canal de pedidos si se desea habilitar la tienda.
- Generar AAB firmado y realizar las pruebas/revisión requeridas por Google Play; no están hechos.
- Verificar que GitHub Pages esté habilitado y use `main`, revisar despliegue y caché luego de integrar esta rama.

Se trata de un avance funcional de PWA, **no** de una versión aprobada por Google Play ni de un producto con pagos habilitados.
