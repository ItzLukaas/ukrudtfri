export type CityPageConfig = {
  slug: string;
  city: string;
  heroParagraphs: readonly string[];
  serviceParagraphs: readonly string[];
  coverageParagraphs: readonly string[];
  priceParagraph: string;
  faqs: readonly { question: string; answer: string }[];
  nearbyArea: string;
  metaDescription: string;
};

const ADDITIONAL_CITY_CONFIG_SEEDS = [
  { slug: "thyregod", city: "Thyregod", nearbyArea: "Thyregod og nærområdet" },
  { slug: "kollemorten", city: "Kollemorten", nearbyArea: "Kollemorten og nærområdet" },
  { slug: "givskud", city: "Givskud", nearbyArea: "Givskud og nærområdet" },
  { slug: "gadbjerg", city: "Gadbjerg", nearbyArea: "Gadbjerg og nærområdet" },
  { slug: "vandel", city: "Vandel", nearbyArea: "Vandel og nærområdet" },
  { slug: "odsted", city: "Ødsted", nearbyArea: "Ødsted og nærområdet" },
  { slug: "egtved", city: "Egtved", nearbyArea: "Egtved og nærområdet" },
  { slug: "randbol", city: "Randbøl", nearbyArea: "Randbøl og nærområdet" },
  { slug: "norup", city: "Nørup", nearbyArea: "Nørup og nærområdet" },
  { slug: "lindeballe", city: "Lindeballe", nearbyArea: "Lindeballe og nærområdet" },
  { slug: "godding", city: "Gødding", nearbyArea: "Gødding og nærområdet" },
  { slug: "torskind", city: "Tørskind", nearbyArea: "Tørskind og nærområdet" },
  { slug: "filskov", city: "Filskov", nearbyArea: "Filskov og nærområdet" },
  { slug: "hejnsvig", city: "Hejnsvig", nearbyArea: "Hejnsvig og nærområdet" },
  { slug: "vorbasse", city: "Vorbasse", nearbyArea: "Vorbasse og nærområdet" },
  { slug: "sdr-omme", city: "Sdr. Omme", nearbyArea: "Sdr. Omme og nærområdet" },
  { slug: "stenderup-krogager", city: "Stenderup-Krogager", nearbyArea: "Stenderup-Krogager og nærområdet" },
  { slug: "hampen", city: "Hampen", nearbyArea: "Hampen og nærområdet" },
  { slug: "hjollund", city: "Hjøllund", nearbyArea: "Hjøllund og nærområdet" },
  { slug: "norre-snede", city: "Nørre Snede", nearbyArea: "Nørre Snede og nærområdet" },
  { slug: "olgod", city: "Ølgod", nearbyArea: "Ølgod og nærområdet" },
  { slug: "farre", city: "Farre", nearbyArea: "Farre og nærområdet" },
] as const;

function buildAdditionalCityConfig(seed: (typeof ADDITIONAL_CITY_CONFIG_SEEDS)[number]): CityPageConfig {
  const { slug, city, nearbyArea } = seed;
  return {
    slug,
    city,
    heroParagraphs: [
      `I ${city} hjælper vi med professionel ukrudtsbehandling af græsplæner, når du vil have en pænere og mere rolig plæne gennem sæsonen.`,
      `Skal du have fjernet ukrudt i græsplænen i ${city}, får du en enkel proces med certificeret sprøjtning og tydelig forventningsafstemning fra start.`,
      `Vores ukrudt i græsplæne behandling i ${city} er specialiseret, så du får en fokuseret løsning med realistisk rådgivning og klar prisstruktur.`,
    ],
    serviceParagraphs: [
      `Behandlingen i ${city} er målrettet bredbladet ukrudt, så græsset gradvist får bedre vækstvilkår og et mere ensartet udtryk.`,
      "Vi arbejder nøgternt og fagligt, fordi plæner reagerer forskelligt afhængigt af årstid, jordbund og hvor længe ukrudtet har været etableret.",
      `Målet er at reducere ukrudtspres over tid med en løsning, der er nem at forstå og let at planlægge i hverdagen.`,
    ],
    coverageParagraphs: [
      `Vi planlægger løbende ruter i og omkring ${city}, så behandling kan gennemføres effektivt uden unødig ventetid.`,
      `Er du i tvivl om adressen ligger inden for vores køreområde ved ${city}, afklarer vi det hurtigt ud fra placering og postnummer.`,
    ],
    priceParagraph: `Spørger du "Hvad koster ukrudtsbekæmpelse i ${city}?", får du en konkret pris ud fra areal i m² og vores minimumspris, så tilbuddet er let at gennemskue.`,
    faqs: [
      {
        question: `Tilbyder I ukrudtsbekæmpelse i ${city}?`,
        answer: `Ja, vi tilbyder professionel ukrudtsbekæmpelse af græsplæner i ${city} med fokus på bredbladet ukrudt og plænens trivsel.`,
      },
      {
        question: `Kan jeg få hjælp til min græsplæne i ${city}?`,
        answer: `Ja, helt sikkert. Vi hjælper med en konkret vurdering, så du får et realistisk forløb, der passer til plænens behov.`,
      },
      {
        question: `Hvad koster behandling i ${city}?`,
        answer: `Prisen beregnes efter antal m², og ved mindre plæner gælder en minimumspris. Du får altid tydelig pris, før vi planlægger besøget.`,
      },
      {
        question: `Hvordan bestiller jeg i ${city}?`,
        answer: `Du sender adresse i ${city} og gerne et cirka areal i m², så vender vi hurtigt tilbage med pris og forslag til tid.`,
      },
    ],
    nearbyArea,
    metaDescription: `Professionel sprøjtning af græsplæne i ${city} med ukrudtsbekæmpelse i græsplænen, tydelig pris pr. m² og lokal service i ${city}.`,
  };
}

export const CITY_PAGE_CONFIGS: readonly CityPageConfig[] = [
  {
    slug: "grindsted",
    city: "Grindsted",
    heroParagraphs: [
      "Vil du have hjælp til at fjerne ukrudt i græsplænen i Grindsted, tilbyder vi en enkel og fagligt udført behandling med fokus på plænens sundhed. Du får certificeret sprøjtning, og vi holder processen tydelig fra første kontakt til udført behandling.",
      "I mange haver i Grindsted tager mælkebøtter, kløver og andet bredbladet ukrudt over i perioder. Her giver ukrudtsbekæmpelse i Grindsted bedst mening, når indsatsen planlægges efter sæson, vækst og ukrudtstryk frem for hurtige standardløsninger.",
      "Når du vælger ukrudt i græsplæne behandling i Grindsted hos os, får du realistisk rådgivning, en klar prisstruktur og en løsning, der holder sig til det, vi faktisk leverer: professionel sprøjtning af græsplænen.",
    ],
    serviceParagraphs: [
      "Behandlingen er målrettet bredbladet ukrudt i plænen, så græsset gradvist får bedre vilkår for tæthed og jævn vækst. Vi lover ikke mirakler fra dag ét, men arbejder med den effekt, der opnås under danske forhold.",
      "Vi holder en nøgtern tilgang til forventninger, fordi forskellige plæner reagerer forskelligt. Jordbund, fugt og hvor længe ukrudtet har været etableret, har betydning for både hastighed og synligt resultat.",
      "Formålet er en mere ensartet græsplæne med mindre ukrudtspres over tid. Derfor er kommunikationen om timing, opfølgning og vurdering en vigtig del af den samlede løsning i Grindsted.",
    ],
    coverageParagraphs: [
      "Vi planlægger ruter i og omkring Grindsted løbende, så kunder i nærområdet kan få en effektiv gennemførsel uden unødig ventetid.",
      "Er du i tvivl om adressen ligger inden for vores køreområde, afklarer vi det hurtigt på baggrund af postnummer og placering i lokalområdet.",
    ],
    priceParagraph:
      "Spørgsmål som \"Hvad koster ukrudtsbekæmpelse?\" og \"Hvad er ukrudtsbekæmpelse pris pr. m²?\" besvarer vi konkret ud fra areal og minimumspris, så du kan sammenligne tilbud på et oplyst grundlag.",
    faqs: [
      {
        question: "Tilbyder I ukrudtsbekæmpelse i Grindsted?",
        answer:
          "Ja, vi tilbyder professionel ukrudtsbekæmpelse af græsplæner i Grindsted. Vi holder os til plænebehandling med sprøjtning mod bredbladet ukrudt og lover ikke ydelser uden for den ramme.",
      },
      {
        question: "Kan jeg få hjælp til min græsplæne i Grindsted?",
        answer:
          "Det kan du sagtens. Hvis din plæne er presset af mælkebøtter, kløver eller andet ukrudt, hjælper vi med en rolig plan, så græsset får bedre vilkår over tid.",
      },
      {
        question: "Hvad koster behandling i Grindsted?",
        answer:
          "Prisen beregnes efter areal i m² og vores minimumspris ved små plæner. Du får altid en tydelig pris, så du ved hvad behandlingen koster, før vi går i gang.",
      },
      {
        question: "Hvordan bestiller jeg i Grindsted?",
        answer:
          "Du bestiller ved at kontakte os med adresse og et cirka areal, så finder vi en tid i vores rute i Grindsted. Vi bekræfter pris og forløb, inden behandlingen planlægges.",
      },
    ],
    nearbyArea: "Grindsted og nærliggende områder",
    metaDescription: "Professionel sprøjtning af græsplæne i Grindsted med tydelig pris pr. m² og lokal ukrudtsbekæmpelse i Grindsted.",
  },
  {
    slug: "bredsten",
    city: "Bredsten",
    heroParagraphs: [
      "I Bredsten hjælper vi boligejere, der vil have styr på ukrudt i plænen, med en enkel proces og en tydelig faglig ramme. Har du brug for at få fjernet ukrudt i græsplænen i Bredsten, leverer vi certificeret sprøjtning uden overflødige tillægsydelser.",
      "Ukrudtsbekæmpelse i Bredsten handler ofte om at få balancen tilbage i plænen, så græsset får plads i stedet for at blive presset af bredbladet ukrudt. Vi planlægger indsatsen efter sæson og den faktiske vækst i haven.",
      "Med ukrudt i græsplæne behandling i Bredsten får du klar kommunikation om pris, timing og forventet effekt. Vi holder fokus på plænens sundhed og tilbyder ikke græsslåning eller almindelig haveservice.",
    ],
    serviceParagraphs: [
      "En god behandling bygger på vurdering af både tæthed, ukrudtstryk og årstid. Derfor får du en løsning, der er tilpasset din plæne frem for en ens standardpakke.",
      "Vi arbejder med godkendte midler til den konkrete opgave og sikrer korrekt udførelse, så behandlingen understøtter en mere ensartet og sund græsplæne over tid.",
      "Forløbet i Bredsten er gjort enkelt: afklaring af areal, pris og forventning, efterfulgt af professionel udførsel inden for det planlagte tidsrum.",
    ],
    coverageParagraphs: [
      "Vi dækker Bredsten og det omkringliggende lokalområde som en fast del af vores ruteplanlægning.",
      "Har du adresse nær Bredsten, kan vi hurtigt vurdere dækning og foreslå næste realistiske behandlingsvindue.",
    ],
    priceParagraph:
      "Når du spørger \"Hvad koster ukrudtsbekæmpelse i Bredsten?\", svarer vi med en konkret m²-pris og minimumspris. Det gør ukrudtsbekæmpelse pris pr. m² let at gennemskue, så du kan vurdere prisen på et fair grundlag.",
    faqs: [
      {
        question: "Tilbyder I ukrudtsbekæmpelse i Bredsten?",
        answer:
          "Ja, vi tilbyder ukrudtsbekæmpelse af græsplæner i Bredsten. Behandlingen er målrettet bredbladet ukrudt, så græsset kan få mere plads i plænen.",
      },
      {
        question: "Kan jeg få hjælp til min græsplæne i Bredsten?",
        answer:
          "Ja, det kan du. Vi hjælper både ved tydelige ukrudtsområder og når plænen bare virker ujævn, så du får en konkret vurdering af næste skridt.",
      },
      {
        question: "Hvad koster behandling i Bredsten?",
        answer:
          "Prisen afhænger af plænens størrelse i m², og ved mindre arealer gælder en minimumspris. Vi giver dig en klar prisramme, så der ikke kommer overraskelser.",
      },
      {
        question: "Hvordan bestiller jeg i Bredsten?",
        answer:
          "Du sender os adressen i Bredsten og gerne et overslag over m², så vender vi hurtigt tilbage med pris og forslag til tidspunkt. Når du accepterer, booker vi behandlingen.",
      },
    ],
    nearbyArea: "Bredsten og lokalområdet",
    metaDescription:
      "Professionel sprøjtning af græsplæne i Bredsten med ukrudtsbekæmpelse i græsplænen, klar m²-pris og lokal service i Bredsten.",
  },
  {
    slug: "jelling",
    city: "Jelling",
    heroParagraphs: [
      "I Jelling tilbyder vi professionel behandling til kunder, der oplever, at ukrudt gradvist tager over i plænen. Vil du have fjernet ukrudt i græsplænen i Jelling, får du en enkel og tydelig løsning med certificeret udførsel og fokus på plænens langsigtede sundhed.",
      "Ukrudtsbekæmpelse i Jelling udføres med nøgtern rådgivning om sæson, areal og forventet effekt. Vi prioriterer gennemsigtighed, så du ved, hvad behandlingen omfatter, og hvad du kan forvente bagefter.",
      "Vores ukrudt i græsplæne behandling i Jelling er målrettet bredbladet ukrudt og leveres som en specialiseret service. Vi tilbyder ikke græsslåning eller generel haveservice.",
    ],
    serviceParagraphs: [
      "Når plænen mister tæthed på grund af ukrudt, påvirker det både udseende og trivsel. Vi arbejder for at reducere ukrudtspres, så græsset igen får bedre vilkår.",
      "Vi tager udgangspunkt i konkrete forhold i den enkelte have, blandt andet vækstniveau og fordeling af ukrudt. Den tilgang giver en mere robust løsning end ensartede standardforløb.",
      "Målet i Jelling er en pænere og mere rolig plæne med realistisk forventning til proces og resultat, uden overdrivelser eller uklare løfter.",
    ],
    coverageParagraphs: [
      "Vi har jævnligt opgaver i Jelling og omkringliggende adresser, hvilket gør planlægningen fleksibel i store dele af sæsonen.",
      "Bor du i området tæt på Jelling, afklarer vi hurtigt om adressen ligger inden for rækkevidde af vores aktuelle kørerute.",
    ],
    priceParagraph:
      "Spørger du \"Hvad koster ukrudtsbekæmpelse i Jelling?\", får du et tydeligt svar med ukrudtsbekæmpelse pris pr. m² og oplysning om minimumspris, før du booker.",
    faqs: [
      {
        question: "Tilbyder I ukrudtsbekæmpelse i Jelling?",
        answer:
          "Ja, vi tilbyder ukrudtsbekæmpelse i Jelling med fokus på græsplæner. Vi arbejder med professionel sprøjtning mod plæneukrudt og holder servicen enkel og tydelig.",
      },
      {
        question: "Kan jeg få hjælp til min græsplæne i Jelling?",
        answer:
          "Selvfølgelig. Vi hjælper med at vurdere plænens tilstand og planlægger behandling, så du får en løsning der passer til både sæson og ukrudtstryk.",
      },
      {
        question: "Hvad koster behandling i Jelling?",
        answer:
          "Vi beregner prisen ud fra areal i m² og en minimumspris for små opgaver. Du får altid prisen oplyst på forhånd, så du nemt kan tage stilling.",
      },
      {
        question: "Hvordan bestiller jeg i Jelling?",
        answer:
          "Det gør du ved at kontakte os med adresse i Jelling og størrelsen på plænen, hvis du kender den. Vi sender en tydelig pris og booker en tid, når det passer dig.",
      },
    ],
    nearbyArea: "Jelling og omkringliggende adresser",
    metaDescription:
      "Professionel sprøjtning af græsplæne i Jelling med ukrudtsbekæmpelse i græsplænen, gennemsigtig pris og lokal dækning i Jelling.",
  },
  {
    slug: "torring",
    city: "Tørring",
    heroParagraphs: [
      "I Tørring hjælper vi kunder, der ønsker professionel ukrudtsbehandling af græsplænen, med en enkel proces. Skal du have fjernet ukrudt i græsplænen i Tørring, er vores certificerede service fokuseret på netop den opgave.",
      "Ukrudtsbekæmpelse i Tørring udføres med afsæt i plænens aktuelle tilstand, så indsatsen passer til mængden af ukrudt og sæsonens vækstforhold.",
      "Vores ukrudt i græsplæne behandling i Tørring er specialiseret og tydeligt afgrænset: Vi arbejder med plæneukrudt og plænens sundhed, ikke med øvrig haveservice.",
    ],
    serviceParagraphs: [
      "En tæt og jævn plæne kræver, at ukrudtspresset håndteres i tide. Derfor vurderer vi både forhold i plænen og tidspunkt i sæsonen, inden behandling planlægges.",
      "Vi arbejder med fokus på faglig udførsel og tydelig kommunikation. Det betyder, at du får forklaring på både hvad der gøres, og hvorfor det er relevant i netop din situation.",
      "Målet i Tørring er at give græsset bedre plads og stabilitet over tid gennem målrettet ukrudtsindsats, frem for kortsigtede eller overdrevne løfter.",
    ],
    coverageParagraphs: [
      "Tørring og nærområdet indgår i vores dækningsplan, så opgaver kan koordineres effektivt med øvrige ruter i området.",
      "Hvis du bor tæt på Tørring, bekræfter vi hurtigt dækning og giver et realistisk bud på første mulige behandlingstidspunkt.",
    ],
    priceParagraph:
      "Ved spørgsmål som \"Hvad koster ukrudtsbekæmpelse i Tørring?\" får du tydelig information om ukrudtsbekæmpelse pris pr. m², og hvordan minimumsprisen anvendes.",
    faqs: [
      {
        question: "Tilbyder I ukrudtsbekæmpelse i Tørring?",
        answer:
          "Ja, vi tilbyder ukrudtsbekæmpelse i Tørring for private græsplæner. Vi er specialiserede i behandling af ukrudt i plænen og ikke i generel haveservice.",
      },
      {
        question: "Kan jeg få hjælp til min græsplæne i Tørring?",
        answer:
          "Ja, vi hjælper gerne, også hvis ukrudtet har fået godt fat. Du får en ærlig vurdering af, hvordan behandlingen kan løfte plænen trin for trin.",
      },
      {
        question: "Hvad koster behandling i Tørring?",
        answer:
          "Prisen regnes ud fra antal m² og en minimumspris ved mindre arealer. På den måde får du et konkret og gennemskueligt tilbud, inden vi planlægger besøget.",
      },
      {
        question: "Hvordan bestiller jeg i Tørring?",
        answer:
          "Du bestiller ved at sende adresse i Tørring og gerne plænens størrelse i m². Vi vender tilbage med pris og næste ledige tidspunkt, så du hurtigt kan komme videre.",
      },
    ],
    nearbyArea: "Tørring og nærområdet",
    metaDescription:
      "Professionel sprøjtning af græsplæne i Tørring med ukrudtsbekæmpelse i græsplænen, klar m²-pris og lokal service i Tørring.",
  },
  {
    slug: "brande",
    city: "Brande",
    heroParagraphs: [
      "I Brande tilbyder vi målrettet hjælp til plæner, hvor ukrudt fylder for meget i forhold til græsset. Har du brug for at få fjernet ukrudt i græsplænen i Brande, får du en enkel service med certificeret og faglig udførelse.",
      "Ukrudtsbekæmpelse i Brande handler om at skabe bedre balance i plænen over tid. Vi arbejder struktureret og realistisk, så du ved, hvad indsatsen omfatter fra start.",
      "Med ukrudt i græsplæne behandling i Brande får du specialiseret behandling af plæneukrudt, en tydelig prisramme og klar forventningsafstemning om resultatet.",
    ],
    serviceParagraphs: [
      "Vi vurderer plænens udgangspunkt og planlægger behandlingen, så den passer til sæson og ukrudtstryk. Det giver en mere brugbar løsning end generiske anbefalinger.",
      "Fokus er at forbedre græssets konkurrencestyrke ved at reducere bredbladet ukrudt. På den måde understøttes et mere roligt og ensartet udtryk i plænen.",
      "Vi holder os til kerneydelsen: professionel sprøjtning af græsplæner. Det gør leverancen tydelig, sammenlignelig og let at forstå.",
    ],
    coverageParagraphs: [
      "Brande og de nærmeste bydele er en fast del af vores dækningsområde gennem sæsonen.",
      "Ved adresse i eller omkring Brande afklarer vi hurtigt, om du ligger inden for den aktuelle rute, så planlægning bliver enkel.",
    ],
    priceParagraph:
      "Hvis du undersøger \"Hvad koster ukrudtsbekæmpelse i Brande?\", giver vi et konkret svar baseret på ukrudtsbekæmpelse pris pr. m² samt minimumspris ved små arealer.",
    faqs: [
      {
        question: "Tilbyder I ukrudtsbekæmpelse i Brande?",
        answer:
          "Ja, vi tilbyder ukrudtsbekæmpelse i Brande, hvor fokus er græsplæner med bredbladet ukrudt. Vi holder os til den ydelse, så du ved præcis hvad du køber.",
      },
      {
        question: "Kan jeg få hjælp til min græsplæne i Brande?",
        answer:
          "Ja, det kan du. Vi hjælper med at få styr på ukrudtspresset, så plænen i Brande får ro til at blive mere tæt og ensartet.",
      },
      {
        question: "Hvad koster behandling i Brande?",
        answer:
          "Prisen afhænger af plænens areal i m², og for små haver bruges en minimumspris. Vi giver altid en tydelig samlet pris, inden du booker.",
      },
      {
        question: "Hvordan bestiller jeg i Brande?",
        answer:
          "Kontakt os med din adresse i Brande og gerne et estimat af m², så får du hurtigt svar. Når prisen er accepteret, finder vi første passende behandlingstid.",
      },
    ],
    nearbyArea: "Brande og de nærmeste bydele",
    metaDescription:
      "Professionel sprøjtning af græsplæne i Brande med ukrudtsbekæmpelse i græsplænen, enkel proces og tydelig pris i Brande.",
  },
  {
    slug: "billund",
    city: "Billund",
    heroParagraphs: [
      "I Billund hjælper vi med professionel ukrudtsbehandling af græsplæner for kunder, der ønsker en pænere og mere ensartet plæne. Vil du have hjælp til at fjerne ukrudt i græsplænen i Billund, får du en fokuseret og certificeret løsning uden unødige ekstraelementer.",
      "Ukrudtsbekæmpelse i Billund handler ikke kun om udseende, men også om at styrke plænens generelle trivsel. Derfor planlægger vi behandlingen efter plænens behov og sæsonens forhold.",
      "Vores ukrudt i græsplæne behandling i Billund er specialiseret i netop ukrudt i plænen. Vi holder os til serviceområdet og lover ikke ydelser uden for den faglige kerne.",
    ],
    serviceParagraphs: [
      "Vi arbejder med bredbladet ukrudt i græsplænen, hvor målet er at skabe bedre betingelser for græssets vækst og tæthed.",
      "Indsatsen baseres på en realistisk vurdering af plænens udgangspunkt. Det giver en tydelig forventningsafstemning og et mere brugbart forløb.",
      "I Billund får du en enkel kunderejse med klar pris og mulighed for hurtig afklaring, hvis du er i tvivl om areal eller timing.",
    ],
    coverageParagraphs: [
      "Vi kører faste ruter i Billund og omkringliggende kvarterer, hvilket gør det muligt at planlægge behandling effektivt.",
      "Hvis din adresse ligger tæt på Billund, kan vi hurtigt afklare dækning og foreslå næste ledige vindue for indsats.",
    ],
    priceParagraph:
      "På spørgsmålet \"Hvad koster ukrudtsbekæmpelse i Billund?\" svarer vi med en konkret ukrudtsbekæmpelse pris pr. m² og tydelig information om minimumspris.",
    faqs: [
      {
        question: "Tilbyder I ukrudtsbekæmpelse i Billund?",
        answer:
          "Ja, vi tilbyder ukrudtsbekæmpelse i Billund med fokus på græsplæner. Det er en specialiseret service, hvor vi arbejder målrettet med ukrudt i plænen.",
      },
      {
        question: "Kan jeg få hjælp til min græsplæne i Billund?",
        answer:
          "Ja, både små og store plæner i Billund kan få hjælp. Vi vurderer opgaven konkret og anbefaler en løsning, der passer til plænens behov.",
      },
      {
        question: "Hvad koster behandling i Billund?",
        answer:
          "Prisen bliver beregnet på areal i m², og ved mindre plæner gælder en minimumspris. Du får en klar pris på forhånd, så du ved præcis hvad du siger ja til.",
      },
      {
        question: "Hvordan bestiller jeg i Billund?",
        answer:
          "Du bestiller ved at sende os adressen i Billund og gerne størrelsen på plænen i m². Derefter får du pris og forslag til tidspunkt, som du kan godkende.",
      },
    ],
    nearbyArea: "Billund og de omkringliggende kvarterer",
    metaDescription:
      "Professionel sprøjtning af græsplæne i Billund med ukrudtsbekæmpelse i græsplænen, lokal dækning og tydelig pris i Billund.",
  },
  {
    slug: "vejle",
    city: "Vejle",
    heroParagraphs: [
      "I Vejle tilbyder vi professionel sprøjtning af græsplæner til kunder, der vil have bedre kontrol over ukrudt i plænen. Vil du have fjernet ukrudt i græsplænen i Vejle, får du en certificeret løsning med klart fokus og en enkel proces.",
      "Ukrudtsbekæmpelse i Vejle udføres med respekt for plænens forskellige vækstforhold. Vi vurderer opgaven konkret, så indsatsen matcher virkeligheden i haven.",
      "Med ukrudt i græsplæne behandling i Vejle får du specialiseret hjælp, tydelig prisstruktur og ærlig rådgivning om, hvad behandlingen kan og ikke kan.",
    ],
    serviceParagraphs: [
      "Et højt ukrudtstryk giver ofte ujævnt udtryk i plænen. Vores mål er at reducere ukrudtet, så græsset igen kan få bedre plads og konkurrencestyrke.",
      "Vi arbejder med en rolig, faglig tilgang og undgår at love mere end forholdene kan bære. Det giver bedre beslutningsgrundlag for dig som kunde.",
      "I Vejle løser vi kun opgaver relateret til ukrudtsbehandling i græsplæner. Vi tilbyder ikke græsslåning eller generel haveservice.",
    ],
    coverageParagraphs: [
      "Vejle og oplandet er en central del af vores dækningsområde, og vi koordinerer løbende ruter i området.",
      "Er du placeret i bynære områder omkring Vejle, kan vi normalt afklare dækning og timing hurtigt.",
    ],
    priceParagraph:
      "Hvis du undersøger \"Hvad koster ukrudtsbekæmpelse i Vejle?\", giver vi et konkret svar med ukrudtsbekæmpelse pris pr. m² samt et samlet prisudgangspunkt, så du nemt kan sammenligne.",
    faqs: [
      {
        question: "Tilbyder I ukrudtsbekæmpelse i Vejle?",
        answer:
          "Ja, vi tilbyder ukrudtsbekæmpelse i Vejle med fokus på græsplæner. Vi arbejder professionelt med sprøjtning mod ukrudt og holder rådgivningen nøgtern og ærlig.",
      },
      {
        question: "Kan jeg få hjælp til min græsplæne i Vejle?",
        answer:
          "Ja, du kan få hjælp, uanset om det er begyndende ukrudt eller en plæne der er mere udfordret. Vi gennemgår forholdene og foreslår en praktisk behandling.",
      },
      {
        question: "Hvad koster behandling i Vejle?",
        answer:
          "Behandlingen prissættes efter antal m², og der er en minimumspris ved små arealer. Du får en tydelig samlet pris, så det er let at sammenligne.",
      },
      {
        question: "Hvordan bestiller jeg i Vejle?",
        answer: "Du sender adresse i Vejle og gerne plænens størrelse i m², så vender vi hurtigt tilbage med pris og ledige tider. Når du har godkendt, planlægger vi behandlingen.",
      },
    ],
    nearbyArea: "Vejle og oplandet",
    metaDescription:
      "Professionel sprøjtning af græsplæne i Vejle med ukrudtsbekæmpelse i græsplænen, klar prisstruktur og lokal behandling i Vejle.",
  },
  {
    slug: "give",
    city: "Give",
    heroParagraphs: [
      "I Give tilbyder vi professionel behandling til kunder, der vil have styr på ukrudt i græsplænen, med en enkel og gennemsigtig proces. Skal du have fjernet ukrudt i græsplænen i Give, er vores certificerede service målrettet netop den opgave.",
      "Ukrudtsbekæmpelse i Give udføres med fokus på plænens samlede sundhed, så indsatsen ikke kun handler om kortsigtet udseende, men om bedre vækstvilkår over tid.",
      "Når du vælger ukrudt i græsplæne behandling i Give hos os, får du en tydelig prisramme, nøgtern rådgivning og en leverance, der er afgrænset til professionel sprøjtning af plæner.",
    ],
    serviceParagraphs: [
      "Vi behandler bredbladet ukrudt i plænen og hjælper græsset med at få bedre plads i konkurrencen om lys, vand og næring.",
      "Hver plæne er forskellig, derfor baseres anbefalinger på aktuelle forhold i haven frem for en ens plan til alle kunder.",
      "I Give lægger vi vægt på klar kommunikation før behandling, så du ved, hvordan forløbet er tænkt, og hvad der er realistisk at forvente.",
    ],
    coverageParagraphs: [
      "Give er vores lokale baseområde, og vi har løbende kapacitet i byen samt nærliggende adresser.",
      "Bor du i eller tæt på Give, kan vi ofte give hurtig afklaring om både dækning, prisramme og næste ledige tidspunkt.",
    ],
    priceParagraph:
      "Spørger du \"Hvad koster ukrudtsbekæmpelse i Give?\", får du et præcist svar ud fra ukrudtsbekæmpelse pris pr. m² kombineret med minimumspris ved mindre arealer.",
    faqs: [
      {
        question: "Tilbyder I ukrudtsbekæmpelse i Give?",
        answer:
          "Ja, vi tilbyder ukrudtsbekæmpelse i Give med fokus på græsplæner. Vi arbejder kun med behandling af plæneukrudt, så opgaven er klart afgrænset.",
      },
      {
        question: "Kan jeg få hjælp til min græsplæne i Give?",
        answer:
          "Ja, det kan du. Vi hjælper både når du kender arealet præcist, og når du bare har brug for en hurtig vurdering af plænens behov først.",
      },
      {
        question: "Hvad koster behandling i Give?",
        answer:
          "Prisen bliver regnet ud fra plænens størrelse i m² og en minimumspris ved mindre arealer. Vi oplyser den samlede pris tydeligt, før du beslutter dig.",
      },
      {
        question: "Hvordan bestiller jeg i Give?",
        answer:
          "Du bestiller ved at kontakte os med adresse i Give og et cirka m²-tal, hvis du har det. Så får du hurtigt et konkret tilbud og forslag til behandlingstid.",
      },
    ],
    nearbyArea: "Give og nærliggende adresser",
    metaDescription:
      "Professionel sprøjtning af græsplæne i Give med ukrudtsbekæmpelse i græsplænen, tydelig m²-pris og lokal service i Give.",
  },
  ...ADDITIONAL_CITY_CONFIG_SEEDS.map((seed) => buildAdditionalCityConfig(seed)),
] as const;

export const CITY_PAGE_SLUGS = CITY_PAGE_CONFIGS.map((city) => city.slug);

export function getCityPageConfigBySlug(slug: string) {
  return CITY_PAGE_CONFIGS.find((city) => city.slug === slug);
}

export function requireCityPageConfigBySlug(slug: string): CityPageConfig {
  const cityConfig = getCityPageConfigBySlug(slug);

  if (!cityConfig) {
    throw new Error(`Missing city page config for ${slug}`);
  }

  return cityConfig;
}
