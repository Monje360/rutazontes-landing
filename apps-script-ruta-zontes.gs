/**
 * INSCRIPCIONES · Ruta Zontes
 * monje.io · octubre 2026
 *
 * Cada inscripción se guarda en la hoja de cálculo. Nada más.
 *
 * Sin avisos por correo y sin WhatsApp, a propósito: esta hoja se
 * comparte con Zontes para que vean los registros en vivo, y no tiene
 * que mezclarse con los leads comerciales de Duomo ni llenar buzones.
 *
 * ── PUESTA EN MARCHA ────────────────────────────────────────────────
 * 1. Hoja de cálculo nueva en Drive, llamada "Inscripciones Ruta Zontes"
 * 2. Extensiones → Apps Script → pegar esto → Guardar
 * 3. Ejecutar `probar` una vez y aceptar los permisos
 * 4. Implementar → Nueva implementación → Aplicación web
 *       Ejecutar como: Yo
 *       Quién tiene acceso: Cualquier usuario   ← obligatorio
 * 5. Copiar la URL (acaba en /exec) y pegarla en index.html
 *
 * OJO: cada vez que edites este archivo hay que volver a implementar
 * (Gestionar implementaciones → lápiz → Nueva versión). Guardar no basta.
 * ────────────────────────────────────────────────────────────────────
 */

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    guardar(d);
    return responder({ ok: true });
  } catch (err) {
    registrarFallo(err, e && e.postData ? e.postData.contents : '');
    return responder({ ok: false, error: String(err) });
  }
}

function responder(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
                       .setMimeType(ContentService.MimeType.JSON);
}


/* ═══════════════════════════════════════════════════════════
   GUARDAR EN LA HOJA
   ═══════════════════════════════════════════════════════════ */

function guardar(d) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  if (hoja.getLastRow() === 0) {
    hoja.appendRow([
      'Fecha', 'Nombre', 'Apellidos', 'Email', 'Teléfono',
      'Moto', 'Acompañante', 'Se queda a comer', 'Comensales',
      'Comentarios', 'Consentimiento', 'Origen', 'Confirmado'
    ]);
    hoja.getRange(1, 1, 1, 13)
        .setFontWeight('bold')
        .setBackground('#0B0D12')
        .setFontColor('#ffffff');
    hoja.setFrozenRows(1);
    hoja.setColumnWidth(1, 150);   // fecha
    hoja.setColumnWidth(10, 280);  // comentarios
  }

  /* Si eligió "Otro" en el desplegable, la moto real está en modelo_otro. */
  var moto = (d.modelo === 'Otro' && d.modelo_otro) ? d.modelo_otro : (d.modelo || '');

  /* Solo cuenta comensales si se queda a comer. */
  var comensales = (d.comida === 'Sí') ? (d.comensales || '') : '';

  hoja.appendRow([
    new Date(),
    d.nombre || '',
    d.apellidos || '',
    d.email || '',
    "'" + (d.telefono || ''),   // el apóstrofo evita que Sheets se coma el 0 inicial
    moto,
    d.acompanante || '',
    d.comida || '',
    comensales,
    d.comentarios || '',
    d.rgpd ? 'sí' : 'NO',
    d.pagina || '',
    ''                           // columna para que el equipo marque la confirmación
  ]);
}


/* ═══════════════════════════════════════════════════════════
   REGISTRO DE FALLOS
   Si algo peta, la inscripción no se pierde en silencio: queda aquí.
   ═══════════════════════════════════════════════════════════ */

function registrarFallo(err, crudo) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var h = ss.getSheetByName('Fallos') || ss.insertSheet('Fallos');
    if (h.getLastRow() === 0) h.appendRow(['Fecha', 'Error', 'Datos recibidos']);
    h.appendRow([new Date(), String(err), String(crudo).slice(0, 4000)]);
  } catch (e) {}
  console.error(err);
}


/* ═══════════════════════════════════════════════════════════
   PRUEBA · ejecútala desde el editor antes de implementar
   ═══════════════════════════════════════════════════════════ */

function probar() {
  doPost({ postData: { contents: JSON.stringify({
    nombre: 'Prueba',
    apellidos: 'monje.io',
    email: 'prueba@monje.io',
    telefono: '600000000',
    modelo: 'Zontes 703T ETC',
    acompanante: 'Sí',
    comida: 'Sí',
    comensales: '2',
    comentarios: 'Fila de prueba, se puede borrar',
    rgpd: true,
    pagina: 'https://rutazontes.duomomotor.com/'
  })}});
}
