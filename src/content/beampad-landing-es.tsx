// Lo que dice /beampad/es, en español de Latinoamérica ("celular", "control
// remoto"), con el mismo diseño que /beampad (src/components/beampad/Landing.tsx).
//
// Escrito para "usar celular como control remoto para tv sin wifi", la primera
// sugerencia de Google en México para "usar celular como control" (nov. 2026),
// donde los resultados solo ofrecen apps que necesitan wifi o infrarrojo. Cada
// afirmación es la misma que en la página en inglés y en la ficha de Google
// Play. Los menús de Google TV son los de la ayuda de Google en español
// (es-419); el de Fire TV aparece con dos nombres según el equipo, y se dan los dos.
import { AppLink } from '@/components/beampad/BeamPad'
import { PairingPaths, type LandingCopy } from '@/components/beampad/Landing'
import { BEAMPAD, type Compat } from '@/content/beampad'

const LINK = 'font-semibold text-white underline decoration-[var(--bp-mint)] underline-offset-4'
const PAGE = 'beampad_es'
const ANDROID = 'Android 9'

const COMPAT_ES: { works: Compat[]; limited: Compat[]; no: Compat[] } = {
  works: [
    { name: 'Google TV y Android TV', note: 'Chromecast con Google TV, NVIDIA Shield, TV boxes y televisores Sony, TCL, Hisense y Philips.' },
    { name: 'Amazon Fire TV', note: 'Dispositivos Fire TV, incluido el Fire TV Stick.' },
    { name: 'Computadoras', note: 'Cualquier computadora que acepte teclado y mouse Bluetooth. El teclado de PC completo y el gamepad son Pro.' },
    { name: 'Proyectores y TV boxes', note: 'Cualquier modelo que acepte un teclado Bluetooth.' },
  ],
  limited: [
    { name: 'Televisores Samsung y LG', note: 'Algunos modelos aceptan un teclado Bluetooth. Algunos LG solo aceptan teclado por USB.' },
    { name: 'Apple TV', note: 'Funcionan la escritura y la navegación con flechas. El gamepad no.' },
  ],
  no: [
    { name: 'Roku', note: 'Los dispositivos Roku no aceptan teclados Bluetooth.' },
    { name: 'iPhone', note: `BeamPad es para celulares Android, con ${ANDROID} o posterior.` },
  ],
}

export const FAQ_ES: [question: string, answer: string][] = [
  [
    '¿BeamPad necesita wifi?',
    'No. BeamPad conecta tu celular con la TV directamente por Bluetooth, como un teclado inalámbrico. El celular y la TV no tienen que estar en la misma red, y la TV ni siquiera necesita internet. La versión gratis usa tu conexión solo para mostrar anuncios.',
  ],
  [
    '¿Tengo que instalar algo en la TV?',
    'No. La TV ve tu celular como un teclado y un mouse Bluetooth comunes, así que no hay que instalar ninguna app en la TV ni crear una cuenta.',
  ],
  [
    '¿Funciona con mi TV?',
    'Si tu TV o tu dispositivo de streaming acepta un teclado Bluetooth, acepta BeamPad. Google TV, Android TV y Fire TV lo aceptan. En Samsung y LG depende del modelo, Apple TV acepta escritura y flechas, y Roku no acepta teclados Bluetooth.',
  ],
  [
    '¿Puedo usar BeamPad si perdí el control remoto?',
    'La vinculación se hace una sola vez, en los ajustes Bluetooth de la TV, así que para ese paso necesitas moverte por la TV. Muchas veces sirve el control de la propia TV por HDMI-CEC, o un mouse USB. Después, BeamPad es tu control remoto, con o sin wifi.',
  ],
  [
    '¿Es seguro escribir contraseñas con BeamPad?',
    'Lo que escribes va directo del celular a la TV por la conexión Bluetooth vinculada. Según su ficha de seguridad de datos en Google Play, BeamPad no recopila ni comparte datos. Los fragmentos guardados se cifran con una clave que queda en el hardware seguro de tu celular y no se incluyen en las copias de seguridad en la nube.',
  ],
  ['¿La app está en español?', 'Sí. BeamPad está disponible en español, inglés, francés y portugués.'],
  ['¿Hay versión para iPhone?', `No. BeamPad es para celulares Android con ${ANDROID} o posterior.`],
  [
    '¿Por qué mi celular no se conecta?',
    'Algunos fabricantes de celulares desactivan la función Bluetooth que permite que el celular funcione como teclado. En esos celulares BeamPad no puede vincularse con nada. La versión gratis es la forma más rápida de comprobar el tuyo.',
  ],
]

export const LANDING_ES: LandingCopy = {
  lang: 'es',
  page: PAGE,
  skip: 'Ir al contenido',
  ids: { features: 'funciones', how: 'como-funciona', compat: 'compatibilidad', guides: 'guias', faq: 'preguntas' },
  hero: {
    chip: 'Control remoto, teclado y mouse por Bluetooth para Android',
    title: 'Usa tu celular como control remoto para la TV.',
    accent: 'Sin wifi.',
    lead: 'BeamPad conecta tu celular Android con la TV por Bluetooth: control remoto, teclado y mouse en una sola app. No hay que instalar nada en la TV, no hace falta una red compartida y no necesitas cuenta.',
    check: 'Revisa si funciona con tu TV',
    footnote: `Gratis con anuncios · ${ANDROID} o posterior · Google TV, Android TV y Fire TV · App en español`,
    searches: ['recetas fáciles', 'fútbol en vivo', 'música relajante', 'documentales'],
    tvChip: 'Escrito desde tu celular',
    phoneAlt: 'Celular usado como teclado para la TV: pantalla de teclado de BeamPad, con un cuadro de texto que escribe en la TV',
  },
  proof: {
    label: 'Por qué BeamPad',
    items: [
      ['Sin wifi', 'Se conecta por Bluetooth, como un teclado inalámbrico'],
      ['Nada en la TV', 'Sin app que instalar en la TV y sin crear cuenta'],
      ['No recopila datos', 'Según su ficha de seguridad de datos en Google Play'],
      ['Tu propio teclado', 'Autocorrector, escritura deslizada y voz, como en tu celular'],
    ],
  },
  why: {
    eyebrow: 'Por qué Bluetooth',
    title: 'Casi todas las apps de control remoto necesitan tu wifi. BeamPad no.',
    lead: 'Las apps de Google TV, de Fire TV y de los fabricantes de televisores buscan la TV en la red de tu casa. Si la TV no está en esa red, no la encuentran.',
    wifiTitle: 'Apps de control remoto por wifi',
    wifi: [
      'El celular y la TV deben estar en la misma red wifi',
      'Dejan de funcionar si la TV no tiene internet o cambiaste de router',
      'Suelen fallar en redes de hotel o de invitados, que separan los dispositivos',
      'Cada marca de TV tiene su propia app',
    ],
    beampad: [
      'Se vincula directamente con la TV, como un teclado Bluetooth',
      'Sigue funcionando con el wifi apagado',
      'No importa en qué red esté cada cosa',
      'Una sola app para Google TV, Android TV, Fire TV y computadoras',
    ],
  },
  features: {
    eyebrow: 'Lo que hace',
    title: 'Control remoto, teclado y mouse en una sola app',
    lead: 'Cambia entre ellos con un toque en la parte de arriba de la pantalla. La TV ve un solo dispositivo Bluetooth común.',
    items: [
      {
        screen: 'remote',
        eyebrow: 'Control remoto',
        title: 'Todo el control remoto en tu celular',
        text: 'Un pad direccional con OK, Atrás e Inicio, además de volumen, silencio y canales cuando tu TV los admite.',
        points: [
          'Reproducir, pausar, adelantar, buscar y teclado numérico',
          'Controles multimedia en la notificación, en Configuración rápida y en un widget',
          'Útil cuando el control de verdad se perdió entre los cojines',
        ],
        alt: 'Celular usado como control remoto de la TV sin wifi: pantalla de control remoto de BeamPad con pad direccional, OK, volumen, canales, Atrás, Inicio y Menú',
      },
      {
        screen: 'keyboard',
        eyebrow: 'Teclado',
        title: 'Deja de buscar letras con las flechas',
        text: 'Escribe búsquedas, contraseñas y direcciones web con el teclado que ya tienes en el celular. Lo que escribas, la TV lo recibe.',
        points: [
          'Autocorrector, escritura deslizada y voz, según tu teclado',
          'Enter, Tab, Esc, flechas y Borrar a la mano',
          'Sirve en buscadores, inicios de sesión y direcciones web',
        ],
        alt: 'Celular usado como teclado para la TV: pantalla de teclado de BeamPad, con un cuadro de texto que escribe en la TV y teclas Ctrl, Alt, Esc, Tab, flechas y Enter',
      },
      {
        screen: 'trackpad',
        eyebrow: 'Mouse',
        title: 'Un puntero para las apps que lo necesitan',
        text: 'Los navegadores y las apps que no se hicieron para control remoto se usan fácil con un puntero. Muévelo con el pulgar y toca para hacer clic.',
        points: ['Toca para hacer clic y desliza con dos dedos donde se admita', 'Clic izquierdo y derecho', 'Funciona en navegadores, ajustes y apps compatibles'],
        alt: 'Celular usado como mouse para la TV: pantalla de panel táctil de BeamPad con botones de clic izquierdo y derecho',
      },
      {
        screen: 'snippets',
        eyebrow: 'Fragmentos',
        title: 'Inicia sesión en la TV con un toque',
        text: 'Guarda la contraseña del wifi, tus cuentas de streaming y lo que escribes seguido, y envíalo a la TV con un toque.',
        points: [
          'Cifrado con una clave guardada en el hardware seguro del celular',
          'Fuera de las copias de seguridad en la nube',
          'Los fragmentos protegidos piden tu huella o tu PIN',
        ],
        alt: 'Enviar la contraseña del wifi del celular a la TV: pantalla de fragmentos guardados de BeamPad, con contraseñas de wifi, cuentas y direcciones',
      },
    ],
  },
  pro: {
    eyebrow: 'BeamPad Pro',
    title: 'Para jugar, trabajar y presentar',
    lead: 'Mensual, anual o de por vida. O mira un anuncio y usa todas las funciones Pro durante 24 horas.',
    gamepad: [
      'Un control de juegos para Android TV y PC',
      'Dos joysticks analógicos, pad direccional, botones A, B, X e Y, gatillos y botones superiores, con dirección por inclinación y etiquetas de Xbox, PlayStation o Nintendo. Para juegos y emuladores compatibles.',
    ],
    pc: [
      'Un teclado de PC completo',
      'F1 a F12, atajos con Ctrl, Alt y Windows, macros y un lanzador de apps, para la computadora del otro lado del cuarto.',
      'Celular usado como teclado de PC completo: teclado de BeamPad Pro con F1 a F12, números y teclas Ctrl, Win y Alt',
    ],
    presenter: [
      'Un control para presentaciones',
      'Diapositiva siguiente y anterior, puntero láser, pantalla negra y temporizador, desde tu bolsillo.',
      'Celular usado como control para presentaciones: botones de diapositiva siguiente y anterior, puntero láser y temporizador de BeamPad Pro',
    ],
    allTitle: 'Todo lo que incluye Pro',
    all: [
      'Control de juegos Bluetooth: dos joysticks, pad direccional, A, B, X e Y, botones superiores, gatillos analógicos y dirección por inclinación',
      'Teclado de PC completo: F1 a F12 y atajos con Ctrl, Alt y Windows',
      'Control para presentaciones: siguiente, anterior, puntero láser, pantalla negra y temporizador',
      'Escritura en vivo y por voz, pegar, air mouse y panel táctil de precisión',
      'Paneles personalizados, macros, lanzador de apps, perfiles de dispositivo y paleta de comandos',
      'Fragmentos ilimitados y sin anuncios',
    ],
  },
  how: {
    eyebrow: 'Cómo funciona',
    title: 'Se vincula una vez, en los ajustes de la TV',
    lead: 'Tu celular se conecta con la TV igual que un teclado inalámbrico. Toma alrededor de un minuto.',
    steps: [
      {
        title: 'Instala BeamPad',
        body: (
          <>
            Descárgala gratis desde{' '}
            <AppLink placement="how_install" page={PAGE}>
              Google Play
            </AppLink>{' '}
            en tu celular Android ({ANDROID} o posterior) y activa el Bluetooth.
          </>
        ),
      },
      {
        title: 'Abre la vinculación en la TV',
        body: (
          <PairingPaths
            intro="Entra a la pantalla de vinculación Bluetooth de la TV:"
            paths={[
              ['Google TV y Android TV', ['Configuración', 'Control remoto y accesorios', 'Vincular control remoto o accesorio']],
              [
                'Fire TV y Fire TV Stick',
                ['Configuración', 'Controles y dispositivos Bluetooth', 'Otros dispositivos Bluetooth', 'Agregar dispositivos Bluetooth'],
                'En algunos equipos el menú se llama «Controladores y dispositivos Bluetooth».',
              ],
            ]}
          />
        ),
      },
      {
        title: 'Conecta y listo',
        body: 'Sigue los pasos de BeamPad para conectarte y confirma la vinculación en la TV (en Google TV, elige «Vincular»). Después, BeamPad recuerda la TV.',
      },
    ],
    note: (
      <>
        Para ese único paso de vinculación necesitas moverte por la TV: con su control remoto o con el control de la propia TV por HDMI-CEC. ¿Ya
        perdiste el control? Tenemos guías, en inglés, para{' '}
        <a href="/beampad/lost-firestick-remote-no-wifi" hrefLang="en" className={LINK}>
          Fire TV
        </a>{' '}
        y{' '}
        <a href="/beampad/lost-google-tv-remote-no-wifi" hrefLang="en" className={LINK}>
          Google TV
        </a>
        .
      </>
    ),
  },
  compat: {
    eyebrow: 'Compatibilidad',
    title: '¿Funciona con tu TV?',
    lead: 'Si tu TV acepta un teclado Bluetooth, acepta BeamPad. Aquí te decimos dónde es así y dónde no.',
    works: ['Funciona', COMPAT_ES.works],
    limited: ['Depende del modelo', COMPAT_ES.limited],
    no: ['No es compatible', COMPAT_ES.no],
    footnote: 'Algunos fabricantes de celulares desactivan la función Bluetooth que permite que el celular funcione como teclado. La versión gratis es la forma más rápida de comprobar el tuyo.',
  },
  privacy: {
    eyebrow: 'Privacidad',
    title: 'Hecha para que le confíes tus contraseñas',
    lead: (
      <>
        Un teclado ve todo lo que escribes, así que BeamPad está hecha para guardárselo. Lee la{' '}
        <a href={BEAMPAD.privacyUrl} target="_blank" rel="noopener" className={LINK}>
          política de privacidad
        </a>{' '}
        (en inglés).
      </>
    ),
    points: [
      ['No recopila ni comparte datos', 'Es lo que BeamPad declara en su ficha de seguridad de datos de Google Play.'],
      ['Del celular a la TV, sin intermediarios', 'Lo que escribes viaja por la conexión Bluetooth vinculada, no por un servidor.'],
      ['Fragmentos protegidos', 'Cifrados con una clave en el hardware seguro de tu celular y fuera de las copias en la nube.'],
      ['Los anuncios no ven lo que escribes', 'La versión gratis muestra anuncios, que no tienen acceso a tus fragmentos ni a lo que escribes.'],
    ],
  },
  guides: {
    eyebrow: 'Guías',
    title: '¿Perdiste el control y cambió el wifi?',
    lead: 'Soluciones paso a paso para cuando las apps del celular no encuentran tu TV, uses BeamPad o no. Por ahora están en inglés.',
    read: 'Leer la guía (en inglés)',
    titleSuffix: ' (en inglés)',
  },
  faq: { eyebrow: 'Preguntas', title: 'Antes de instalar', items: FAQ_ES },
  cta: {
    title: 'El mejor control remoto de la casa ya está en tu bolsillo',
    lead: 'Gratis en Google Play. Vincula una vez y listo.',
    languages: 'Disponible en español, inglés, francés y portugués.',
  },
}
