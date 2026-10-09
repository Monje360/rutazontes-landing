# Ruta Zontes · landing del evento

Landing de inscripción para la Ruta Zontes de Duomo Motor Bikes.
Sitio estático, sin dependencias. Se despliega en Vercel.

- **Producción:** https://rutazontes.duomomotor.com
- **Cliente:** Duomo Motor Bikes (Zontes Madrid Sur)

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Todo: estructura, estilos y lógica en un solo archivo |
| `hero.mp4` | Vídeo de fondo del hero (6,1 MB) |
| `hero-poster.jpg` | Imagen que se ve mientras carga el vídeo |
| `card-bunker.jpg` | Foto de la parada en ruta |

## Conectar el formulario

Las inscripciones van a una hoja de cálculo propia del evento. **No se
envía ningún correo**: la hoja se comparte con Zontes para que vean los
registros en vivo.

1. Crea una hoja en Drive: **Inscripciones Ruta Zontes**
2. Extensiones → Apps Script → pega `apps-script-ruta-zontes.gs`
3. Ejecuta `probar` una vez y acepta los permisos
4. Implementar → Nueva implementación → **Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario** ← obligatorio, o fallan todos los envíos
5. Copia la URL (acaba en `/exec`) y pégala en `index.html`, en `FORM_ENDPOINT`

**Mientras `FORM_ENDPOINT` esté vacío, el formulario no envía nada.**
Muestra un aviso de prueba en la pantalla de gracias para que no pase
inadvertido, pero no publiques así: la gente se inscribiría sin quedar
registro.

## Dos cosas que conviene no "arreglar"

**El `fetch` manda `Content-Type: text/plain` a propósito.** Con
`application/json` el navegador envía antes una petición `OPTIONS` que
Apps Script no sabe responder, y el envío falla en producción aunque en
local parezca funcionar. El `.gs` hace `JSON.parse` igual.

**Cada vez que edites el `.gs` hay que volver a implementar**
(Gestionar implementaciones → lápiz → Nueva versión). Guardar no basta:
seguiría corriendo la versión antigua.

## Despliegue

Vercel despliega solo con cada push a `main`.
<!-- despliegue inicial -->
