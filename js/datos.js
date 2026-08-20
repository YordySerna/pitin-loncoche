/* ==========================================================================
   datos.js — Restaurant Pitín, Loncoche
   --------------------------------------------------------------------------
   TODO dato de contacto vive acá y en ningún otro lado.
   Si un campo queda como cadena vacía "", la página esconde sola el elemento
   que lo muestra en vez de inventarlo, y los botones de WhatsApp caen a
   #contacto. Nunca hay que tocar el HTML para cambiar un teléfono.

   VERIFICADO = publicado por el propio negocio o por una fuente oficial
   (su página de Facebook, su ficha de Google, la municipalidad, Sernatur).
   EJEMPLO = dato de relleno, hay que pedírselo a ellos.
   ========================================================================== */
(function (global) {
  'use strict';

  var DATOS = {

    /* ---- Identidad -------------------------------------------------- */
    // VERIFICADO — así se llaman en su página de Facebook y en Google Maps.
    // "Donde Pitín" es como los nombra la prensa y Sernatur; se usa en la
    // historia, no en la marca.
    nombre: 'Restaurant Pitín',
    nombreLargo: 'Restaurant Pitín — Loncoche',

    /* ---- Contacto ---------------------------------------------------- */
    // VERIFICADO — mismo número en su Facebook y en Google Maps (Google lo
    // confirmó por llamada telefónica en julio de 2026, según la propia
    // ficha). OJO: la página de la municipalidad muestra otro número
    // (+56 9 8611 6716); confirmar con ellos cuál está vigente.
    // Formato internacional sin signos: así lo necesita wa.me
    whatsapp: '56989116716',
    // Cómo se muestra escrito en pantalla.
    telefonoVisible: '+56 9 8911 6716',

    // EJEMPLO — reemplazar. No tienen correo publicado en ninguna parte.
    // Si se deja vacío, la fila de correo desaparece del sitio.
    email: '',

    /* ---- Ubicación --------------------------------------------------- */
    // VERIFICADO — misma dirección en Facebook, Google Maps, TripAdvisor y
    // la página de la municipalidad.
    calle: 'Ignacio Serrano',
    numero: '144',
    comuna: 'Loncoche',
    region: 'Región de La Araucanía, Chile',
    // VERIFICADO — código postal de su ficha de Google Maps.
    codigoPostal: '4970909',
    // VERIFICADO — coordenadas exactas de su ficha de Google Maps.
    lat: -39.3683524,
    lon: -72.6311114,

    /* ---- Redes sociales ---------------------------------------------- */
    // VERIFICADO — página activa con 3,9 mil seguidores.
    facebook: 'https://www.facebook.com/people/Restaurant-Pit%C3%ADn-Loncoche/100063827689309/',
    // No se encontró cuenta de Instagram ni TikTok. Si aparecen, pegarlas
    // acá y las filas se muestran solas.
    instagram: '',
    tiktok: '',

    /* ---- Horarios ---------------------------------------------------- */
    // El rango 11:00–16:30 está publicado en su ficha de TripAdvisor, pero
    // Google decía "abre a las 10:00" un jueves: los DÍAS y la hora exacta
    // hay que confirmarlos con ellos. Por eso el cartel del hero lleva la
    // marca de EJEMPLO mientras horariosConfirmados sea false.
    // Índices: 0 = domingo … 6 = sábado. null = cerrado ese día.
    horarios: [
      null,                            // domingo — EJEMPLO: confirmar si abren
      { abre: '11:00', cierra: '16:30' },  // lunes
      { abre: '11:00', cierra: '16:30' },  // martes
      { abre: '11:00', cierra: '16:30' },  // miércoles
      { abre: '11:00', cierra: '16:30' },  // jueves
      { abre: '11:00', cierra: '16:30' },  // viernes
      { abre: '11:00', cierra: '16:30' }   // sábado
    ],
    horariosConfirmados: false,
    // Cómo se escribe el horario en el cartel cuando el JS no corre.
    horarioTexto: 'Lun a sáb · 11:00 a 16:30',

    /* ---- Sitio ------------------------------------------------------- */
    // Cambiar si el repositorio de GitHub Pages se llama distinto.
    urlCanonica: 'https://yordyserna.github.io/pitin-loncoche/',

    /* ---- Texto base de la reserva ------------------------------------ */
    // Encabezado del mensaje que se arma para WhatsApp.
    saludoWhatsapp: 'Hola Restaurant Pitín 👋 Quiero reservar una mesa:'
  };

  global.PITIN_DATOS = DATOS;

})(window);
