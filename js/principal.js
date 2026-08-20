/* ==========================================================================
   principal.js — Restaurant Pitín, Loncoche
   --------------------------------------------------------------------------
   JavaScript clásico en patrón IIFE. Sin módulos: con type="module" el
   archivo no carga al abrir la página con doble clic (file://).

   Regla de oro de este sitio: el contenido ya está escrito en el HTML. Si
   este archivo no carga, no falta ni una palabra; solo se pierden las
   animaciones, el cartel de abierto/cerrado queda con el horario escrito y
   los enlaces de WhatsApp caen a la sección de contacto.
   ========================================================================== */
(function () {
  'use strict';

  var doc    = document;
  var raiz   = doc.documentElement;
  var DATOS  = window.PITIN_DATOS || {};

  function $ (sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$ (sel, ctx) {
    return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel));
  }


  /* ======================================================================
     1. REVEALS AL SCROLL
     Se observa siempre el CONTENEDOR, nunca un elemento con clip-path o
     máscara cerrada: esos tienen área cero, el observador no dispara nunca
     y el bloque se queda invisible para siempre.
     ====================================================================== */
  function iniciarReveals () {
    var elementos = $$('.reveal');

    // Sin IntersectionObserver (navegador viejo) se muestra todo de una.
    if (!('IntersectionObserver' in window) || !elementos.length) {
      raiz.className = raiz.className.replace(/\bjs\b/, '');
      return;
    }

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) { return; }
        entrada.target.className += ' visible';
        observador.unobserve(entrada.target);
      });
    }, {
      // El margen negativo abajo hace que el bloque aparezca un poco antes de
      // llegar al borde inferior: la animación ya va terminando cuando el ojo
      // alcanza el texto.
      //
      // threshold en 0 a propósito, no en un porcentaje: un bloque más alto
      // que la pantalla nunca llegaría a mostrar ese porcentaje de sí mismo y
      // se quedaría invisible para siempre. Con 0 basta con que asome.
      rootMargin: '0px 0px -12% 0px',
      threshold: 0
    });

    elementos.forEach(function (el) { observador.observe(el); });

    /* Red de seguridad. Si a los tres segundos hay bloques dentro de la
       pantalla que siguen sin marcarse, el observador no está funcionando
       (pestaña que no compone, extensión que interfiere, motor raro). Antes
       que dejar la página en blanco, se apaga la animación entera y se
       muestra todo. */
    setTimeout(function () {
      var falla = false;
      $$('.reveal').forEach(function (el) {
        if (el.className.indexOf('visible') !== -1) { return; }
        var caja = el.getBoundingClientRect();
        if (caja.top < window.innerHeight && caja.bottom > 0) { falla = true; }
      });
      if (falla) {
        raiz.className = raiz.className.replace(/\bjs\b/, '');
      }
    }, 3000);
  }


  /* ======================================================================
     2. CABECERA
     ====================================================================== */
  function iniciarCabecera () {
    var cabecera = $('#cabecera');
    if (!cabecera) { return; }

    function alScroll () {
      if (window.pageYOffset > 40) {
        if (cabecera.className.indexOf('cabecera--fija') === -1) {
          cabecera.className += ' cabecera--fija';
        }
      } else {
        cabecera.className = cabecera.className.replace(/\s*cabecera--fija/, '');
      }
    }

    window.addEventListener('scroll', alScroll, { passive: true });
    alScroll();
  }


  /* ======================================================================
     3. MENÚ EN MÓVIL
     ====================================================================== */
  function iniciarMenu () {
    var boton = $('#hamburguesa');
    var nav   = $('#nav');
    if (!boton || !nav) { return; }

    function cerrar () {
      nav.className = nav.className.replace(/\s*nav--abierto/, '');
      boton.setAttribute('aria-expanded', 'false');
      boton.setAttribute('aria-label', 'Abrir menú');
    }

    boton.addEventListener('click', function () {
      var abierto = boton.getAttribute('aria-expanded') === 'true';
      if (abierto) {
        cerrar();
      } else {
        nav.className += ' nav--abierto';
        boton.setAttribute('aria-expanded', 'true');
        boton.setAttribute('aria-label', 'Cerrar menú');
      }
    });

    // Al tocar un enlace del menú se cierra solo.
    $$('a', nav).forEach(function (a) { a.addEventListener('click', cerrar); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { cerrar(); }
    });
  }


  /* ======================================================================
     4. DATOS DE CONTACTO
     Todo sale de datos.js. Un campo vacío esconde su fila en vez de mostrar
     un dato inventado o un enlace roto.
     ====================================================================== */
  function armarEnlaceWa (texto) {
    if (!DATOS.whatsapp) { return null; }
    var mensaje = texto || DATOS.saludoWhatsapp || '';
    return 'https://wa.me/' + DATOS.whatsapp +
           (mensaje ? '?text=' + encodeURIComponent(mensaje) : '');
  }

  function iniciarDatos () {

    /* --- Botones de WhatsApp -------------------------------------------
       En el HTML todos apuntan a #contacto. Solo si hay número publicado se
       reescriben a wa.me; si no, el clic lleva a la sección de contacto y
       nadie se topa con un enlace muerto. */
    $$('[data-wa]').forEach(function (el) {
      var url = armarEnlaceWa(el.getAttribute('data-wa-texto'));
      if (!url) { return; }
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener';
    });

    /* --- Teléfono ------------------------------------------------------- */
    var enlaceTel = $('#enlace-telefono');
    var filaWa    = $('[data-dato="fila-whatsapp"]');
    if (enlaceTel) {
      if (DATOS.whatsapp) {
        enlaceTel.href = armarEnlaceWa(DATOS.saludoWhatsapp);
        enlaceTel.target = '_blank';
        enlaceTel.rel = 'noopener';
        if (DATOS.telefonoVisible) { enlaceTel.textContent = DATOS.telefonoVisible; }
      } else if (filaWa) {
        filaWa.hidden = true;
      }
    }

    /* --- Correo (hoy no tienen uno publicado) --------------------------- */
    var enlaceMail = $('#enlace-email');
    var filaMail   = $('[data-dato="fila-email"]');
    if (enlaceMail && filaMail) {
      if (DATOS.email) {
        enlaceMail.href = 'mailto:' + DATOS.email;
        enlaceMail.textContent = DATOS.email;
        filaMail.hidden = false;
      } else {
        filaMail.hidden = true;
      }
    }

    /* --- Redes: si una URL queda vacía, se saca el enlace --------------- */
    ['instagram', 'tiktok', 'facebook'].forEach(function (red) {
      var el = $('[data-dato="' + red + '"]');
      if (!el) { return; }
      if (DATOS[red]) { el.href = DATOS[red]; } else { el.hidden = true; }
    });

    /* --- Enlace y mapa según coordenadas ------------------------------- */
    if (DATOS.lat && DATOS.lon) {
      var coords = DATOS.lat + ',' + DATOS.lon;
      var enlaceMapa = $('#enlace-mapa');
      var marco = $('#mapa-marco');
      if (enlaceMapa) {
        enlaceMapa.href = 'https://www.google.com/maps/search/?api=1&query=' + coords;
      }
      if (marco) {
        marco.setAttribute('data-fuente',
          'https://www.google.com/maps?q=' + coords + '&hl=es&z=16&output=embed');
      }
    }

    /* --- Año del pie ---------------------------------------------------- */
    var anio = $('#anio');
    if (anio) { anio.textContent = new Date().getFullYear(); }
  }


  /* ======================================================================
     5. CARTEL ABIERTO / CERRADO
     Calculado contra la hora real de Chile (America/Santiago), nunca contra
     el reloj del visitante: un turista mirando el sitio desde otra zona
     horaria vería cualquier cosa. Si Intl no soporta zonas horarias, el
     cartel se queda con el horario escrito en el HTML y no miente.
     ====================================================================== */
  function ahoraEnChile () {
    // formatToParts entrega el día y la hora ya convertidos a la zona.
    var formato = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Santiago',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    var dias = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
                 Thursday: 4, Friday: 5, Saturday: 6 };
    var partes = formato.formatToParts(new Date());
    var res = { dia: null, minutos: null };
    var hora = null, minuto = null;
    partes.forEach(function (p) {
      if (p.type === 'weekday') { res.dia = dias[p.value]; }
      // "24" aparece en algunos motores para la medianoche.
      if (p.type === 'hour')    { hora = Number(p.value) % 24; }
      if (p.type === 'minute')  { minuto = Number(p.value); }
    });
    if (res.dia === null || isNaN(hora) || isNaN(minuto)) { return null; }
    res.minutos = hora * 60 + minuto;
    return res;
  }

  function aMinutos (hhmm) {
    var p = String(hhmm).split(':');
    return Number(p[0]) * 60 + Number(p[1] || 0);
  }

  function iniciarEstado () {
    var cartel = $('#estado-local');
    var texto  = $('#estado-texto');
    var horarios = DATOS.horarios;
    if (!cartel || !texto || !horarios) { return; }

    var NOMBRES = ['el domingo', 'el lunes', 'el martes', 'el miércoles',
                   'el jueves', 'el viernes', 'el sábado'];

    function pintar (clase, mensaje) {
      cartel.className = cartel.className
        .replace(/\s*estado--(abierto|cerrado)/g, '') + ' ' + clase;
      texto.textContent = mensaje;
    }

    function actualizar () {
      var ahora;
      try { ahora = ahoraEnChile(); } catch (e) { ahora = null; }
      // Sin zona horaria confiable, el cartel se queda como está en el HTML.
      if (!ahora) { return; }

      var hoy = horarios[ahora.dia];
      if (hoy && ahora.minutos >= aMinutos(hoy.abre) && ahora.minutos < aMinutos(hoy.cierra)) {
        pintar('estado--abierto', 'Abierto ahora · hasta las ' + hoy.cierra);
        return;
      }

      // Cerrado: se busca la próxima apertura, hoy incluido si aún no abre.
      for (var salto = 0; salto < 7; salto++) {
        var dia = (ahora.dia + salto) % 7;
        var franja = horarios[dia];
        if (!franja) { continue; }
        if (salto === 0 && ahora.minutos >= aMinutos(franja.abre)) { continue; }
        var cuando = salto === 0 ? 'hoy'
                   : salto === 1 ? 'mañana'
                   : NOMBRES[dia];
        pintar('estado--cerrado', 'Cerrado ahora · abre ' + cuando + ' a las ' + franja.abre);
        return;
      }
      pintar('estado--cerrado', 'Cerrado por ahora');
    }

    actualizar();
    // Se refresca solo: si alguien deja la pestaña abierta hasta las 11:00,
    // el cartel cambia sin recargar.
    setInterval(actualizar, 60000);
  }


  /* ======================================================================
     6. FOTOS QUE TODAVÍA NO ESTÁN
     Mientras un archivo no exista, el navegador dibuja su ícono de imagen
     rota en la esquina y arruina el placeholder. Acá se marca el contenedor
     y se esconde la imagen: queda solo el degradado de la paleta, limpio.
     En cuanto la foto se pega, carga y la marca se quita sola.
     ====================================================================== */
  function iniciarFotos () {
    var fotos = $$('.galeria__foto img, .panel__foto img, .hero__fondo img');

    fotos.forEach(function (img) {
      var caja = img.parentNode;
      if (!caja) { return; }

      var marcar = function () {
        if (caja.className.indexOf('sin-foto') === -1) {
          caja.className += ' sin-foto';
        }
      };
      var limpiar = function () {
        caja.className = caja.className.replace(/\s*sin-foto/, '');
      };

      /* Si ya terminó de intentarlo y no trajo ni un píxel, falló. Las que
         tienen loading="lazy" y aún no arrancan no entran acá: para esas
         alcanzan los escuchadores de abajo. */
      if (img.complete) {
        if (img.naturalWidth === 0) { marcar(); }
        return;
      }

      img.addEventListener('error', marcar);
      img.addEventListener('load', limpiar);
    });
  }


  /* ======================================================================
     7. MAPA BAJO DEMANDA
     El iframe no tiene src hasta que alguien lo pide: así la página no llama
     a Google en cada visita ni carga medio mega que casi nadie mira.
     ====================================================================== */
  function iniciarMapa () {
    var boton = $('#mapa-boton');
    var marco = $('#mapa-marco');
    if (!boton || !marco) { return; }

    boton.addEventListener('click', function () {
      var fuente = marco.getAttribute('data-fuente');
      if (!fuente) { return; }
      marco.src = fuente;
      marco.hidden = false;
      boton.hidden = true;
    });
  }


  /* ======================================================================
     8. RESERVA POR WHATSAPP
     Sin backend: arma el texto del mensaje y abre wa.me. Nada se envía desde
     el sitio ni queda guardado en ninguna parte.
     ====================================================================== */

  /* input[type=date] entrega "2026-08-23". Pasarlo por new Date() lo lee como
     UTC y en Chile puede retroceder un día. Se arma a mano en hora local. */
  function aFecha (valor) {
    if (!valor) { return null; }
    var p = valor.split('-');
    if (p.length !== 3) { return null; }
    var f = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    return isNaN(f.getTime()) ? null : f;
  }

  function formatearFecha (fecha) {
    if (!fecha) { return ''; }
    try {
      return new Intl.DateTimeFormat('es-CL', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      }).format(fecha);
    } catch (e) {
      // Navegador sin Intl: se arma a mano antes que quedar sin fecha.
      return fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear();
    }
  }

  function iniciarReserva () {
    var form = $('#reserva');
    if (!form) { return; }

    var iFecha    = $('#r-fecha');
    var iHora     = $('#r-hora');
    var iPersonas = $('#r-personas');
    var iNombre   = $('#r-nombre');
    var iMensaje  = $('#r-mensaje');
    var resumen   = $('#reserva-resumen');
    var error     = $('#reserva-error');

    // No se puede reservar una mesa para ayer.
    var hoy = new Date();
    var hoyISO = hoy.getFullYear() + '-' +
                 ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' +
                 ('0' + hoy.getDate()).slice(-2);
    iFecha.min = hoyISO;

    function mostrarError (texto) {
      if (!error) { return; }
      if (texto) {
        error.textContent = texto;
        error.hidden = false;
      } else {
        error.textContent = '';
        error.hidden = true;
      }
    }

    /* Devuelve los datos ya validados, o null si falta algo. */
    function leerFormulario (avisar) {
      var fecha = aFecha(iFecha.value);

      if (!fecha) {
        if (avisar) { mostrarError('Elige el día de la reserva.'); }
        return null;
      }

      var manana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      if (fecha < manana) {
        if (avisar) { mostrarError('Esa fecha ya pasó. Elige otro día.'); }
        return null;
      }

      if (!iHora.value) {
        if (avisar) { mostrarError('Elige a qué hora llegan.'); }
        return null;
      }

      var personas = parseInt(iPersonas.value, 10);
      if (!personas || personas < 1) {
        if (avisar) { mostrarError('Indica cuántas personas van.'); }
        return null;
      }

      mostrarError('');
      return { fecha: fecha, hora: iHora.value, personas: personas };
    }

    /* Resumen en vivo bajo el formulario. */
    function actualizarResumen () {
      if (!resumen) { return; }
      var d = leerFormulario(false);

      if (!d) {
        resumen.innerHTML = '<p class="cotizador__lineas">Elige el día y la hora para ver el resumen.</p>';
        return;
      }

      var lineas = '<b>' + formatearFecha(d.fecha) + '</b>' +
                   ' · ' + d.hora + ' h' +
                   ' · ' + d.personas + (d.personas === 1 ? ' persona' : ' personas');

      /* Si el día elegido figura cerrado en el horario cargado, se avisa al
         tiro pero no se bloquea: el horario aún no está confirmado por el
         local y la última palabra la tienen ellos por WhatsApp. */
      var franja = (DATOS.horarios || [])[d.fecha.getDay()];
      if (!franja) {
        lineas += '<br>Ojo: ese día el local figura cerrado (horario por ' +
                  'confirmar). Igual puedes enviar la consulta.';
      }

      resumen.innerHTML = '<p class="cotizador__lineas">' + lineas + '</p>';
    }

    [iFecha, iHora, iPersonas].forEach(function (campo) {
      campo.addEventListener('change', actualizarResumen);
      campo.addEventListener('input', actualizarResumen);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var d = leerFormulario(true);
      if (!d) { return; }

      var lineas = [];
      lineas.push(DATOS.saludoWhatsapp || 'Hola, quiero reservar una mesa:');
      lineas.push('');
      lineas.push('• Día: ' + formatearFecha(d.fecha));
      lineas.push('• Hora: ' + d.hora + ' h');
      lineas.push('• Personas: ' + d.personas);

      if (iNombre && iNombre.value.trim()) {
        lineas.push('• Nombre: ' + iNombre.value.trim());
      }
      if (iMensaje && iMensaje.value.trim()) {
        lineas.push('');
        lineas.push(iMensaje.value.trim());
      }

      var url = armarEnlaceWa(lineas.join('\n'));

      // Sin número publicado el formulario no se pierde: lleva a contacto.
      if (!url) {
        var contacto = $('#contacto');
        if (contacto) { contacto.scrollIntoView({ behavior: 'smooth' }); }
        mostrarError('Todavía no hay un número de WhatsApp cargado. Revisa la sección de contacto.');
        return;
      }

      window.open(url, '_blank', 'noopener');
    });

    actualizarResumen();
  }


  /* ======================================================================
     ARRANQUE
     Si algo de esto revienta, el catch quita .js igual y el contenido queda
     visible: nunca una excepción deja la página en blanco.
     ====================================================================== */
  function arrancar () {
    try {
      iniciarReveals();
      iniciarCabecera();
      iniciarMenu();
      iniciarDatos();
      iniciarEstado();
      iniciarFotos();
      iniciarMapa();
      iniciarReserva();

      // Todo montado: ya no hace falta el temporizador de rescate del <head>.
      if (window.RESCATE_JS) { clearTimeout(window.RESCATE_JS); }

    } catch (e) {
      if (window.RESCATE_JS) { clearTimeout(window.RESCATE_JS); }
      raiz.className = raiz.className.replace(/\bjs\b/, '');
      if (window.console && console.error) { console.error('Pitín:', e); }
    }
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', arrancar);
  } else {
    arrancar();
  }

})();
