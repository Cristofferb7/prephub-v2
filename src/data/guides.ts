// Contenido sintetizado de fuentes oficiales — NO inventado. Base legal:
// FEMA/Ready.gov + ShakeOut (dominio público) y OPS/PAHO (CC BY-NC-SA 3.0 IGO),
// cotejado con FUNVISIS, CENAPRED (México) y SENAPRED (Chile).
// Ver /fuentes. En emergencia siguen mandando las autoridades locales.

export interface GuideSection {
  heading: string
  steps: string[]
  warning?: string
}

export interface Guide {
  id: string
  title: string
  subtitle: string
  sections: GuideSection[]
  sources: { label: string; url: string }[]
}

export const GUIDES: Guide[] = [
  {
    id: 'durante-el-sismo',
    title: 'Durante el sismo',
    subtitle: 'Agáchate, cúbrete y sujétate — y sus variantes según dónde estés.',
    sections: [
      {
        heading: 'La regla general: Agáchate, Cúbrete, Sujétate',
        steps: [
          'AGÁCHATE de inmediato, en cuatro puntos (manos y rodillas). Así el sismo no te tumba y puedes gatear.',
          'CÚBRETE la cabeza y el cuello con un brazo. Métete debajo de una mesa fuerte si hay una cerca. Si no hay, pégate a una pared interior, lejos de ventanas.',
          'SUJÉTATE de la mesa con la otra mano y muévete con ella si se desplaza. Quédate ahí hasta que pare de temblar.',
          'No corras hacia afuera mientras tiembla: la mayoría de las heridas ocurren por vidrios y objetos que caen sobre gente en movimiento.',
        ],
        warning:
          'El "triángulo de la vida" es un mito descartado por los organismos de protección civil. Debajo de la mesa, no al lado.',
      },
      {
        heading: 'Si estás en la cama',
        steps: [
          'Quédate en la cama, boca abajo.',
          'Cúbrete la cabeza y el cuello con la almohada.',
          'No intentes correr a oscuras entre vidrios rotos. Ten zapatos y linterna al lado de la cama desde ya.',
        ],
      },
      {
        heading: 'Si usas silla de ruedas o andadera',
        steps: [
          'Frena las ruedas (¡ponle el freno!).',
          'Agáchate lo que puedas e inclínate hacia adelante.',
          'Cúbrete la cabeza y el cuello con los brazos, un libro o lo que tengas a mano.',
          'Quédate así hasta que pare de temblar.',
        ],
      },
      {
        heading: 'Si vas manejando',
        steps: [
          'Reduce la velocidad y detente en un lugar despejado: lejos de puentes, elevados, postes, cables y edificios.',
          'Pon los frenos y quédate dentro del carro con el cinturón puesto hasta que pare.',
          'Si un cable eléctrico cae sobre el carro, no salgas: espera ayuda adentro.',
          'Al continuar, evita puentes y rampas que puedan estar dañados.',
        ],
      },
      {
        heading: 'Si estás en la calle',
        steps: [
          'Aléjate de edificios, paredes de bloques, postes, cables y vidrieras.',
          'Busca un espacio abierto y agáchate cubriéndote la cabeza.',
          'Lo más peligroso de la calle son las fachadas y cornisas que caen: no te pegues a los edificios.',
        ],
      },
      {
        heading: 'Si vives cerca de la costa',
        steps: [
          'Si el sismo fue tan fuerte que te costó mantenerte de pie, o duró mucho: al terminar, camina de inmediato a una zona alta.',
          'No esperes ningún aviso oficial: en Venezuela no hay sistema de alerta de tsunami a tiempo. El sismo fuerte ES la alerta.',
          'Aléjate de la playa, ríos y desembocaduras. Quédate en alto varias horas: las olas llegan en series.',
        ],
      },
    ],
    sources: [
      { label: 'ShakeOut — Agáchese, cúbrase y sujétese (situaciones especiales)', url: 'https://www.terremotos.org' },
      { label: 'Ready.gov — Terremotos', url: 'https://www.ready.gov/es/terremotos' },
      { label: 'FUNVISIS — Manual de Autoprotección', url: 'http://www.funvisis.gob.ve' },
    ],
  },
  {
    id: 'despues-del-sismo',
    title: 'Inmediatamente después',
    subtitle: 'Los primeros minutos y las primeras horas: tú y tus vecinos son los primeros en responder.',
    sections: [
      {
        heading: 'Apenas pare de temblar',
        steps: [
          'Espera un momento antes de moverte: mira alrededor, arriba y abajo. Ponte zapatos cerrados antes de caminar.',
          'Revisa si tú o alguien cerca está herido. Atiende primero las hemorragias fuertes (guía de primeros auxilios).',
          'Sal con calma si el edificio está dañado, por las escaleras. NUNCA uses el ascensor.',
          'Espera réplicas: vendrán, y pueden tumbar lo que quedó débil. Cada vez que tiemble: agáchate, cúbrete, sujétate otra vez.',
        ],
      },
      {
        heading: 'Gas, electricidad y fuego',
        steps: [
          'Si hueles gas: no enciendas NADA — ni interruptores, ni yesqueros, ni velas. Abre puertas y ventanas, cierra la llave del gas (bombona o tubería) y sal.',
          'Nunca velas ni fósforos después de un sismo. Solo linterna.',
          'Si ves cables caídos, aléjate y avisa. No toques nada metálico que esté en contacto con ellos.',
          'Apaga fuegos pequeños si puedes hacerlo sin riesgo. El fuego es el peligro más común después de un terremoto.',
        ],
        warning: 'Ni velas, ni fósforos, ni yesqueros hasta estar seguro de que no hay fugas de gas.',
      },
      {
        heading: 'Comunicación y familia',
        steps: [
          'Manda UN mensaje de texto o WhatsApp corto a tu contacto fuera de la zona: "Estoy bien, estoy en X". No llames: las llamadas saturan la red; los mensajes pasan.',
          'Activa el plan familiar: cada quien va al punto de encuentro acordado.',
          'Prende la radio de pilas para oír instrucciones oficiales. No difundas rumores ni cadenas sin fuente.',
          'Usa el teléfono lo menos posible: la batería tiene que durar días.',
        ],
      },
      {
        heading: 'Tus vecinos',
        steps: [
          'Las primeras 72 horas dependen de ti y de tus vecinos: la ayuda organizada tarda en llegar.',
          'Pregunta casa por casa si todos están bien, empezando por adultos mayores y personas solas.',
          'Si hay personas atrapadas, avisa a los rescatistas. No muevas escombros pesados sin ayuda: puedes causar otro derrumbe.',
          'Tres pitidos con el pito = alguien pide auxilio.',
        ],
      },
    ],
    sources: [
      { label: 'Ready.gov — Después de un terremoto', url: 'https://www.ready.gov/es/terremotos' },
      { label: 'SENAPRED Chile — Familia Preparada', url: 'https://senapred.cl/familia-preparada/' },
      { label: 'FUNVISIS — Manual de Autoprotección', url: 'http://www.funvisis.gob.ve' },
    ],
  },
  {
    id: 'agua-segura',
    title: 'Agua segura',
    subtitle: 'Sin agua segura llegan la diarrea, el cólera y la hepatitis. Así se trata el agua en casa.',
    sections: [
      {
        heading: 'Hervir (lo más seguro)',
        steps: [
          'Si el agua está turbia, primero fíltrala con un paño limpio y déjala asentar.',
          'Hiérvela hasta que burbujee fuerte durante 1 minuto completo.',
          'Déjala enfriar tapada y guárdala en envases limpios con tapa.',
        ],
      },
      {
        heading: 'Desinfectar con cloro',
        steps: [
          'Usa cloro doméstico SIN aroma, al 5–6 % (lee la etiqueta). Nada de cloro perfumado ni con jabón.',
          'Dosis: 2 gotas por cada litro de agua clara. Si el agua está turbia, fíltrala primero y usa el doble (4 gotas por litro).',
          'Mezcla y espera 30 minutos antes de tomarla. Debe quedar un ligero olor a cloro; si no huele a nada, repite la dosis y espera 15 minutos más.',
        ],
        warning: 'Nunca uses cloro para piscinas ni productos con fragancia: son tóxicos para beber.',
      },
      {
        heading: 'Guardar el agua',
        steps: [
          'Envases plásticos limpios con tapa, mejor de boca angosta (se contamina menos al servir).',
          'No metas las manos ni tazas dentro del envase: sirve vertiendo.',
          'Marca la fecha. El agua embotellada sellada dura años; la tratada en casa, úsala en pocos días.',
          'Reserva mínima del kit: 4 litros por persona por día, para 3 días.',
        ],
      },
      {
        heading: 'Higiene en refugios',
        steps: [
          'Lávate las manos con agua y jabón antes de comer y después del baño. Si no hay, usa alcohol o agua clorada.',
          'Si hay brotes de diarrea, TODO lo que se bebe se hierve o se clora, sin excepciones.',
          'La deshidratación por diarrea se trata con suero oral: 1 litro de agua segura + 6 cucharaditas rasas de azúcar + media cucharadita de sal.',
        ],
      },
    ],
    sources: [
      { label: 'OPS/PAHO — Agua segura en emergencias', url: 'https://www.paho.org' },
      { label: 'CDC — Cómo desinfectar el agua (es)', url: 'https://www.cdc.gov/es' },
      { label: 'Ready.gov — Agua de emergencia', url: 'https://www.ready.gov/es/agua' },
    ],
  },
  {
    id: 'primeros-auxilios',
    title: 'Primeros auxilios esenciales',
    subtitle: 'Lo mínimo para sostener una vida mientras llega (o no llega) ayuda médica.',
    sections: [
      {
        heading: 'Hemorragias (lo primero que mata)',
        steps: [
          'Presiona directo sobre la herida con un paño limpio, fuerte y sin soltar, mínimo 10 minutos.',
          'Si el paño se empapa, pon otro encima SIN quitar el primero.',
          'Eleva la parte herida si puedes. Mantén a la persona acostada y abrigada.',
          'Torniquete solo si la hemorragia de un brazo o pierna no para con presión y hay riesgo de muerte: átalo 5 cm por encima de la herida, aprieta hasta que pare el sangrado y ANOTA LA HORA. No lo aflojes tú.',
        ],
      },
      {
        heading: 'Fracturas y golpes',
        steps: [
          'No enderece ni acomodes el hueso. Inmoviliza la zona como está, con tablillas, cartón o revistas amarradas.',
          'No muevas a una persona con posible golpe fuerte en la cabeza, cuello o espalda, salvo peligro inmediato (fuego, derrumbe).',
          'Frío local (nunca hielo directo sobre la piel) para el dolor y la hinchazón.',
        ],
      },
      {
        heading: 'RCP básica (adulto que no respira)',
        steps: [
          'Compruébalo: no responde y no respira normal. Pide ayuda y que alguien llame al 911.',
          'Arrodíllate a su lado, talón de una mano en el centro del pecho, la otra encima.',
          'Comprime fuerte y rápido: 5 cm de profundidad, 100–120 por minuto (el ritmo de "La Macarena" o "Stayin\' Alive"). Deja que el pecho suba entre compresiones.',
          'No pares hasta que respire, llegue alguien entrenado, o no puedas más. Túrnate cada 2 minutos si hay más gente.',
        ],
      },
      {
        heading: 'Persona atrapada (síndrome de aplastamiento)',
        steps: [
          'Si una pierna, brazo o el tronco lleva MÁS DE 15 MINUTOS aplastado: NO liberes a la persona sin ayuda médica. Al soltar la presión, las toxinas acumuladas pueden matarla en minutos.',
          'Mientras llega ayuda: háblale, dale agua a sorbos pequeños si está consciente, protégela del polvo y del sol.',
          'Marca el lugar y busca rescatistas. Tres pitidos = auxilio.',
          'Si el aplastamiento lleva menos de 15 minutos y puedes liberar sin causar derrumbe, hazlo y trata las heridas.',
        ],
        warning: 'Liberar a alguien aplastado por horas, sin médicos, puede matarlo. Es contraintuitivo y es real.',
      },
    ],
    sources: [
      { label: 'Cruz Roja — Primeros auxilios', url: 'https://www.ifrc.org/es' },
      { label: 'OPS/PAHO — Manejo de víctimas en desastres', url: 'https://www.paho.org' },
    ],
  },
  {
    id: 'volver-a-entrar',
    title: '¿Es seguro volver a entrar?',
    subtitle: 'Señales para decidir si tu casa aguanta las réplicas — o si duermes afuera esta noche.',
    sections: [
      {
        heading: 'NO entres (ni por cinco minutos) si ves',
        steps: [
          'Grietas en forma de X en paredes o columnas, o grietas diagonales anchas (pasa un lápiz: si cabe, es ancha).',
          'Muros o columnas inclinados, desplomados o desplazados de su base.',
          'El techo o alguna losa se ve hundida, o hay columnas rotas con las cabillas dobladas a la vista.',
          'La casa "suena" (crujidos) con las réplicas, o puertas y ventanas quedaron trabadas porque el marco se deformó.',
          'Olor a gas o cables sueltos adentro.',
        ],
        warning: 'Ninguna cosa que esté adentro vale más que tu vida. Las réplicas tumban lo que quedó débil.',
      },
      {
        heading: 'La regla del adobe y la autoconstrucción',
        steps: [
          'Si tu casa es de adobe, bahareque o autoconstrucción sin ingeniería (rancho, anexos hechos por partes): sé mucho más estricto.',
          'En estos materiales, cualquier grieta nueva o pérdida de pedazos de pared ya es señal de peligro estructural.',
          'Con daño visible: duerme afuera o donde un vecino con estructura sana hasta que alguien calificado revise.',
        ],
      },
      {
        heading: 'Si parece estar bien',
        steps: [
          'Entra de día, con linterna (no enciendas la luz hasta descartar olor a gas), en pareja, y con salida despejada.',
          'Revisa cuarto por cuarto: techos, esquinas de puertas y ventanas (ahí salen primero las grietas), y la platabanda si tienes acceso.',
          'Entradas cortas al principio: saca documentos, medicinas y el kit primero.',
          'Grietas finas superficiales en la pintura o el friso suelen ser cosméticas — márcalas con lápiz y fecha; si crecen con las réplicas, trátalas como estructurales.',
        ],
      },
      {
        heading: 'Pide inspección',
        steps: [
          'Solicita evaluación a Protección Civil, los bomberos o un ingeniero antes de reocupar una casa con daños.',
          'No permitas que nadie "repare" grietas estructurales solo con friso y pintura.',
        ],
      },
    ],
    sources: [
      { label: 'CENAPRED México — Revisión de vivienda después de un sismo', url: 'https://www.cenapred.gob.mx' },
      { label: 'SENAPRED Chile — Familia Preparada', url: 'https://senapred.cl/familia-preparada/' },
      { label: 'FEMA — Evaluación de seguridad posterior al terremoto', url: 'https://www.fema.gov/es' },
    ],
  },
  {
    id: 'lluvias-deslizamientos',
    title: 'Lluvias, inundaciones y deslizamientos',
    subtitle: 'Los cerros que el terremoto aflojó se vienen abajo con las lluvias. Vargas 1999 no se olvida.',
    sections: [
      {
        heading: 'Por qué esta temporada es peor',
        steps: [
          'Un terremoto fuerte agrieta y afloja los taludes. Las lluvias de los próximos uno o dos años encuentran el terreno suelto.',
          'Si vives en ladera, al pie de un cerro o cerca de una quebrada, tu riesgo subió aunque tu casa no sufriera daños.',
        ],
      },
      {
        heading: 'Señales de que el cerro se mueve',
        steps: [
          'Grietas nuevas en el terreno, en pisos o paredes; puertas que de pronto no cierran.',
          'Postes, árboles o cercas que se inclinan; escalones o muros que se separan.',
          'Agua turbia o lodosa brotando del talud, o manantiales nuevos donde no había.',
          'La quebrada suena más fuerte de lo normal, o de pronto baja MENOS agua (puede haber una represa de escombros aguas arriba a punto de romper).',
          'Ante cualquiera de estas señales con lluvia: sal ya hacia una zona alta y firme, y avisa a los vecinos.',
        ],
        warning: 'Si la quebrada crece o suena a piedras: no intentes cruzarla. Medio metro de agua arrastra un carro.',
      },
      {
        heading: 'Durante lluvias fuertes',
        steps: [
          'No duermas en la planta baja si hay riesgo de crecida; acuerda desde ya a dónde evacúan.',
          'Nunca cruces caminando ni en carro una corriente de agua: no se ve el fondo ni la fuerza.',
          'Ten el kit y los documentos listos para salir en minutos.',
          'Después del deslizamiento, no vuelvas a la zona: suelen venir más.',
        ],
      },
    ],
    sources: [
      { label: 'Ready.gov — Deslizamientos y flujos de escombros (es)', url: 'https://www.ready.gov/es/deslizamientos-de-tierra-y-flujos-de-escombros' },
      { label: 'Ready.gov — Inundaciones (es)', url: 'https://www.ready.gov/es/inundaciones' },
      { label: 'OPS/PAHO — Deslizamientos: lecciones de Vargas 1999', url: 'https://www.paho.org' },
    ],
  },
]

export const getGuide = (id: string) => GUIDES.find((g) => g.id === id)
