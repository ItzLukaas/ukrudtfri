import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, CalendarCheck2, Sparkles } from "lucide-react";
import type { ComponentType } from "react";
import { buttonVariants } from "@/components/ui/button";
import { buildCityServiceJsonLd } from "@/lib/seo";
import type { CityPageConfig } from "@/lib/city-pages";
import { SITE_BRAND } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { getPublicPricing } from "@/server/public-booking";

type CityServicePageProps = {
  config: CityPageConfig | undefined;
  description: string;
};

export async function CityServicePage({ config, description }: CityServicePageProps) {
  if (!config) {
    throw new Error("Missing city page config");
  }

  const pricing = await getPublicPricing();
  const matchesExpectedBaseline = pricing.pricePerSquareMeter === 1.5 && pricing.minimumPrice === 300;
  const path = `/byer/${config.slug}`;
  const cityJsonLd = buildCityServiceJsonLd(config.city, path, description);

  return (
    <main className="bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cityJsonLd) }} />

      <section className="border-b border-border/60 bg-background">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Professionel sprøjtning af græsplæne i {config.city}
            </h1>
            <div className="mt-4 max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {config.heroParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/booking"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "min-h-11 w-full justify-center whitespace-normal rounded-lg px-8 text-center text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:w-auto sm:whitespace-nowrap",
                )}
              >
                <CalendarCheck2 className="size-4" aria-hidden />
                Book på under 2 minutter
              </Link>
              <Link
                href="/kontakt"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "min-h-11 w-full justify-center whitespace-normal rounded-lg px-8 text-center text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm sm:w-auto sm:whitespace-nowrap",
                )}
              >
                Kontakt os →
              </Link>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.9fr] lg:grid-rows-2">
            <figure className="relative col-span-2 min-h-60 overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm sm:min-h-72 lg:col-span-1 lg:row-span-2 lg:min-h-96">
              <Image
                src={cityHeroImages[0].src}
                alt={cityHeroImages[0].alt}
                fill
                preload
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 38vw"
              />
            </figure>
            {cityHeroImages.slice(1).map((image) => (
              <figure
                key={image.src}
                className="relative min-h-44 overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm sm:min-h-52 lg:min-h-[11rem]"
              >
                <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 20vw" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/20">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-14">
          <SectionHeading title={`Det hjælper vi med i ${config.city}`} />
          <div className="mt-8 grid gap-7 md:grid-cols-3 md:gap-8">
            <CityInfoCard
              icon={BadgeCheck}
              title="Målrettet ukrudtsbekæmpelse"
              body={`Vi behandler bredbladet ukrudt i græsplænen, så græsset igen får bedre plads og vækstvilkår i ${config.city}.`}
            />
            <CityInfoCard
              icon={Sparkles}
              title="Fokus på plænens helhed"
                body="Vi ser samlet på sæson, tæthed og ukrudtstryk, så indsatsen giver mening over tid - ikke kun her og nu."
            />
            <CityInfoCard
              icon={BadgeCheck}
              title="Faglig og realistisk løsning"
              body="Du får ærlig rådgivning og en tydelig løsning. Vi tilbyder kun professionel sprøjtning af plæner - ikke alt muligt andet ved siden af."
            />
          </div>
          <div className="mt-7 space-y-4 text-base leading-relaxed text-muted-foreground">
            {config.serviceParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>
              Målet er en tæt, grøn og mere ensartet plæne med mindre ukrudtskonkurrence. Når ukrudtet reduceres, får græsset bedre adgang til lys,
              vand og næringsstoffer, hvilket styrker plænens robusthed på længere sigt.
            </p>
            <p>
              Vi tilpasser behandlingen til plænens tilstand, størrelse og sæson, og sæsonstart ligger typisk omkring 8 °C jordtemperatur. Vi bruger
              godkendte og effektive midler, og sprøjtningen udføres altid af en person med de nødvendige sprøjtecertifikater.
            </p>
            <p>
              Har du en plæne i {config.city}, hvor ukrudtet stille og roligt har taget over, giver en målrettet behandling ofte bedre ro i haven og
              en pænere helhed gennem sæsonen.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-14">
          <SectionHeading title={`Pris i ${config.city} og hvordan arealet beregnes`} />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Prisen beregnes pr. behandlet m² (kvadratmeter) med en minimumspris, så opgaven kan udføres ordentligt - også ved mindre plæner.
            </p>
            <p>
              Vi er blandt de billigste alternativer i Jylland, samtidig med at vi holder fast i en certificeret og ordentlig udførsel, så du får
              professionel ukrudtsbehandling uden at betale for unødige ekstraydelser.
            </p>
            <p>
              Aktuel pris er <strong className="text-foreground">{pricing.pricePerSquareMeter.toLocaleString("da-DK")} kr. pr. m²</strong> med
              en minimumspris på <strong className="text-foreground">{pricing.minimumPrice.toLocaleString("da-DK")} kr.</strong>
            </p>
            <p>
              {matchesExpectedBaseline
                ? "Det svarer til den forventede basispris på 1,5 kr. pr. m² og minimum 300 kr."
                : "Mange kunder kender niveauet som cirka 1,5 kr. pr. m² og minimum 300 kr., men den aktuelle sats følger altid den viste pris."}
            </p>
            <p>
              Kender du ikke det præcise areal i m², hjælper vi gerne telefonisk. Vi kan som regel også estimere kvadratmeter ret præcist ud fra din
              adresse med kort- og opmålingssystemer.
            </p>
            <p>{config.priceParagraph}</p>
          </div>
        </div>
      </section>

      <section className="bg-muted/20">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-14">
          <SectionHeading title={`Lokal dækning i og omkring ${config.city}`} />
          <p className="mt-7 text-balance text-lg font-semibold text-foreground sm:text-xl">Vi dækker {config.nearbyArea} med faste ruter.</p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Har du adresse i området, tjekker vi hurtigt den aktuelle rute og finder et realistisk behandlingsvindue, der passer til både sæson og
            hverdag.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Vi dækker Give, Grindsted, Brande, Billund, Vejle, Jelling, Bredsten og Tørring samt nærliggende områder.
          </p>
          <div className="mt-7 space-y-4 text-base leading-relaxed text-muted-foreground">
            {config.coverageParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>
              Målet er en enkel proces: du sender adressen, vi bekræfter dækning hurtigt, og du får en plan, der passer til både sæson og din
              hverdag.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-14">
          <SectionHeading title={`Ofte stillede spørgsmål om ukrudtsbekæmpelse i ${config.city}`} className="justify-center text-center" />
          <div className="mx-auto mt-8 max-w-4xl space-y-3">
            {config.faqs.map((faq) => (
              <details key={faq.question} className="group rounded-xl border border-border bg-background px-5 py-4">
                <summary className="cursor-pointer list-none text-base font-semibold text-foreground marker:hidden">
                  <span className="flex min-h-12 items-center justify-between gap-4 py-1">
                    {faq.question}
                    <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 pr-8 text-sm leading-relaxed text-muted-foreground sm:text-base">{faq.answer}</p>
                <p className="mt-2 pr-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {getFaqFollowup(faq.question, config.city)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-14">
          <h2 className="mx-auto max-w-3xl text-balance text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Skal vi hjælpe dig med plænen i {config.city}?
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-relaxed text-muted-foreground">
            Hvis du vil have det nemt, kan du booke en sprøjtning af græsplænen online på under 2 minutter. Du kan også få en uforpligtende pris på
            under 2 minutter, hvis du hellere vil vende areal, pris eller timing først - vi svarer i øjenhøjde og hjælper dig trygt videre.
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
            Hos {SITE_BRAND} holder vi det enkelt: tydelig kommunikation, realistiske forventninger og fokus på det, vi er gode til - professionel
            ukrudtsbehandling af græsplæner.
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
            Du får personlig service, fleksibel booking og professionel udførsel med fokus på holdbare resultater. Du udfylder bare formularen online,
            vælger et tidspunkt der passer dig, og så får du hurtigt svar tilbage.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/booking"
              className={cn(
                buttonVariants({ size: "lg" }),
                  "min-h-11 w-full justify-center whitespace-normal rounded-lg px-8 text-center text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:w-auto sm:whitespace-nowrap",
              )}
            >
              <CalendarCheck2 className="size-4" aria-hidden />
              Book på under 2 minutter
            </Link>
            <Link
              href="/kontakt"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                  "min-h-11 w-full justify-center whitespace-normal rounded-lg px-8 text-center text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm sm:w-auto sm:whitespace-nowrap",
              )}
            >
              Kontakt os →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const cityHeroImages = [
  { src: "/images/hero-3.jpg", alt: "Sund græsplæne efter professionel ukrudtsbehandling" },
  { src: "/images/hero-1.jpg", alt: "Tæt grøn plæne i boligkvarter" },
  { src: "/images/hero-2.jpg", alt: "Plæneområde med jævnt grønt resultat" },
] as const;

function SectionHeading({ title, className }: { title: string; className?: string }) {
  return (
    <h2 className={cn("flex items-center gap-2.5 text-balance text-2xl font-semibold tracking-tight sm:text-3xl", className)}>
      {title}
    </h2>
  );
}

function CityInfoCard({
  title,
  body,
  icon: Icon,
}: {
  title: string;
  body: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}) {
  return (
    <article className="h-full space-y-3 rounded-xl border border-border/50 bg-muted/10 p-5">
      <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
        <Icon className="size-4 text-muted-foreground" aria-hidden />
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{body}</p>
    </article>
  );
}

function getFaqFollowup(question: string, city: string) {
  const lowerQuestion = question.toLowerCase();
  if (lowerQuestion.includes("pris") || lowerQuestion.includes("koster")) {
    return `Når du sender areal eller adresse i ${city}, giver vi et konkret prisoverblik med det samme, så du kan tage stilling på et oplyst grundlag uden overraskelser.`;
  }
  if (lowerQuestion.includes("hvornår") || lowerQuestion.includes("sæson") || lowerQuestion.includes("hurtigt")) {
    return `Det mest præcise tidspunkt vurderes altid efter vækst og vejrforhold i ${city}, så behandlingen planlægges dér, hvor den giver bedst faglig mening.`;
  }
  if (lowerQuestion.includes("dækker") || lowerQuestion.includes("område") || lowerQuestion.includes("rute")) {
    return `Vi bekræfter altid rute og tidspunkt før opstart, så du ved præcis hvad næste skridt er, og hvornår vi forventer at være på adressen i ${city}.`;
  }
  if (lowerQuestion.includes("andre") || lowerQuestion.includes("haveservice") || lowerQuestion.includes("græsslåning")) {
    return `Den afgrænsning holder kvaliteten høj, fordi vi kan fokusere fuldt på professionel ukrudtsbehandling af græsplæner frem for at sprede os over flere forskellige haveydelser.`;
  }
  return `Er du i tvivl om netop din plæne i ${city}, kan du altid sende et kort overblik over areal og udfordringer, så giver vi en rolig og konkret anbefaling til næste skridt.`;
}
