import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_BRAND, SITE_URL } from "@/lib/site-config";
import { DEFAULT_SEO_DESCRIPTION, SITE_KEYWORDS } from "@/lib/seo";
import { HeroTitle } from "@/components/hero-title";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicPricing } from "@/server/public-booking";
import { cn } from "@/lib/utils";
import { ArrowRight, BadgeCheck, CalendarDays, ClipboardCheck, Leaf, ShieldCheck, Sprout } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "Ukrudtsbekæmpelse og sprøjtning af græsplæner | Ukrudtfri.dk" },
  description: DEFAULT_SEO_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
    title: "Ukrudtsbekæmpelse og sprøjtning af græsplæner | Ukrudtfri.dk",
    description: DEFAULT_SEO_DESCRIPTION,
    images: [{ url: `${SITE_URL}/images/hero-3.jpg`, width: 1200, height: 630, alt: SITE_BRAND }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ukrudtsbekæmpelse og sprøjtning af græsplæner | Ukrudtfri.dk",
    description: DEFAULT_SEO_DESCRIPTION,
    images: [`${SITE_URL}/images/hero-3.jpg`],
  },
};

const shell = "mx-auto w-full max-w-6xl px-4 py-16 sm:py-20 lg:py-24";

const eyebrowClass =
  "text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:text-xs";

/** Neutral dot grid — Tailwind-marketing “texture” uden farvet gradient */
function DotTexture({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 opacity-[0.38]",
        "bg-[radial-gradient(circle_at_center,_rgb(15_23_42_/_0.055)_1px,_transparent_1px)]",
        "bg-[size:18px_18px]",
        className,
      )}
      aria-hidden
    />
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <div className={cn("max-w-3xl", centered ? "mx-auto text-center" : "text-left")}>
      {centered ? (
        <div className="mx-auto mb-4 flex justify-center" aria-hidden>
          <span className="h-1 w-14 rounded-full bg-gradient-to-r from-primary/15 via-primary/65 to-primary/15" />
        </div>
      ) : (
        <span className="mb-3 block h-1 w-10 rounded-full bg-primary/55" aria-hidden />
      )}
      <p className={eyebrowClass}>{eyebrow}</p>
      <h2
        className={cn(
          "mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]",
          align === "left" && "sm:text-4xl",
        )}
      >
        {title}
      </h2>
      <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{subtitle}</p>
    </div>
  );
}

function PrimaryCtas({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)}>
      <Link
        className={cn(
          buttonVariants({ size: "lg" }),
          "group min-h-12 w-full rounded-xl px-8 text-base font-semibold shadow-md shadow-primary/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/15 sm:w-auto",
        )}
        href="/booking"
      >
        Book tid
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </Link>
      <Link
        className={cn(
          buttonVariants({ size: "lg", variant: "outline" }),
          "min-h-12 w-full rounded-xl border-border/80 bg-background/80 px-8 text-base font-semibold shadow-sm backdrop-blur-[2px] transition-all duration-200 hover:border-primary/25 hover:bg-muted/50 hover:shadow-md sm:w-auto",
        )}
        href="/kontakt"
      >
        Kontakt os
      </Link>
    </div>
  );
}

/** hero-3 = primært (størst); hero-1 og hero-2 i sidestolpen. */
const heroImages = [
  { file: "hero-3" as const, alt: "Sund og tæt græsplæne", variant: "primary" as const },
  { file: "hero-1" as const, alt: "Græsplæne efter behandling", variant: "secondary" as const },
  { file: "hero-2" as const, alt: "Professionel plænepleje", variant: "secondary" as const },
] as const;

export default async function HomePage() {
  const pricing = await getPublicPricing();

  return (
    <main className="bg-background">
      {/* Hero — split + texture + trust pills (Tailwind UI-lignende) */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background to-muted/15">
        <DotTexture />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent sm:h-40"
        />
        <div
          className={cn(
            "mx-auto w-full max-w-6xl px-4 py-12 sm:py-16 lg:py-24",
            "relative grid justify-items-center gap-8 sm:gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:justify-items-stretch",
          )}
        >
          <div className="mx-auto w-full max-w-xl px-1 text-center lg:mx-0 lg:px-0 lg:text-left">
            <HeroTitle />
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg lg:mx-0 lg:text-xl">
              Vi gør din græsplæne ukrudtfri og flot igen i Give, Grindsted, Brande, Vejle, Billund og nærliggende byer.
            </p>
            <PrimaryCtas className="mx-auto mt-7 w-full max-w-[22rem] justify-center sm:mt-8 sm:max-w-none lg:mx-0 lg:justify-start" />
          </div>
          <div className="w-full max-w-md px-1 justify-self-center sm:max-w-2xl sm:px-0 lg:max-w-none lg:justify-self-end">
            <div className="rounded-2xl bg-gradient-to-br from-muted/50 via-muted/25 to-transparent p-1 shadow-lg ring-1 ring-border/50 sm:p-1.5">
              <div className="grid grid-cols-2 gap-1.5 md:grid-cols-[1.12fr_0.42fr] md:grid-rows-2 md:gap-2.5 md:min-h-[20rem] lg:min-h-[24rem]">
              {heroImages.map(({ file, alt, variant }, i) => (
                <div
                  key={file}
                  className={cn(
                    "group relative overflow-hidden rounded-none bg-transparent sm:rounded-xl sm:bg-muted/80",
                    variant === "primary" &&
                      "col-span-2 aspect-[4/3] min-h-[11.5rem] sm:min-h-[14rem] sm:aspect-[16/9] md:col-span-1 md:row-span-2 md:aspect-auto md:h-full md:min-h-[16rem] lg:min-h-[18rem]",
                    variant === "secondary" &&
                      "aspect-[4/5] min-h-[6.5rem] sm:min-h-[7.5rem] md:aspect-auto md:min-h-0 md:h-full",
                  )}
                >
                  <Image
                    src={`/images/${file}.jpg`}
                    alt={alt}
                    fill
                    priority={i === 0}
                    className="object-cover p-0 transition-transform duration-500 ease-out md:group-hover:scale-[1.015]"
                    sizes={
                      variant === "primary"
                        ? "(max-width: 768px) 100vw, 55vw"
                        : "(max-width: 768px) 50vw, 22vw"
                    }
                  />
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sådan foregår det */}
      <section
        className="relative scroll-mt-36 border-b border-border/60 bg-gradient-to-b from-muted/30 via-muted/20 to-background"
        id="proces"
      >
        <DotTexture className="opacity-25" />
        <div className={cn(shell, "relative")}>
          <SectionHeader
            eyebrow="Sådan foregår det"
            title="Nem og enkel proces"
            subtitle="Fra booking til færdig behandling."
          />

          <div className="mx-auto mt-10 hidden max-w-5xl items-center gap-3 md:flex">
            <ProcessIcon icon={<CalendarDays className="size-4" />} />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <ProcessIcon icon={<ClipboardCheck className="size-4" />} />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <ProcessIcon icon={<BadgeCheck className="size-4" />} />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <ProcessIcon icon={<Leaf className="size-4" />} />
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <ProcessStep
              index="01"
              title="Du starter booking"
              text="Du starter online, når det passer dig, og sender de vigtigste oplysninger om din plæne."
              className="reveal-up"
            />
            <ProcessStep
              index="02"
              title="Du udfylder info"
              text="Du udfylder adresse, areal og kontaktinfo, så vi hurtigt kan vurdere opgaven korrekt."
              className="reveal-up [animation-delay:70ms]"
            />
            <ProcessStep
              index="03"
              title="Vi bekræfter booking"
              text="Vi gennemgår din booking og bekræfter tidspunktet, så du har helt styr på hvornår vi kommer."
              className="reveal-up [animation-delay:140ms]"
            />
            <ProcessStep
              index="04"
              title="Vi sprøjter din græsplæne"
              text="Vi udfører behandlingen professionelt med godkendte produkter og fokus på et flot, jævnt resultat."
              className="reveal-up [animation-delay:210ms]"
            />
          </div>
        </div>
      </section>

      {/* Hvorfor vælge os */}
      <section className="relative scroll-mt-36 border-b border-border/60 bg-gradient-to-b from-background via-background to-muted/10" id="fordele">
        <DotTexture className="opacity-28" />
        <div className={cn(shell, "relative")}>
          <SectionHeader
            eyebrow="Fordele"
            title="Hvorfor vælge os?"
            subtitle="Du får en afslappet og professionel løsning, hvor vi tager os af ukrudtet og hjælper græsset med at stå tættere og grønnere gennem sæsonen."
          />
          <div className="mt-10 grid grid-cols-1 text-center sm:mt-14 sm:grid-cols-2 sm:[&>*:nth-child(2n)]:border-l sm:[&>*:nth-child(n+3)]:border-t sm:[&>*]:border-border/50 lg:mt-18">
            <WhyCard
              icon={<Sprout className="size-5" />}
              iconBgClass="bg-emerald-100"
              title="Bekæmper ukrudt effektivt"
              text="Vi behandler målrettet mod det ukrudt, der typisk tager over i plænen, så græsset får ro til at komme tilbage og stå stærkere over tid."
              className="reveal-up"
            />
            <WhyCard
              icon={<Leaf className="size-5" />}
              iconBgClass="bg-teal-100"
              title="Giver tættere og grønnere græs"
              text="Når ukrudtet bliver holdt nede i tide, får græsset plads til at vokse stærkere, så plænen bliver mere tæt, grøn og ensartet over sæsonen."
              className="reveal-up [animation-delay:70ms]"
            />
            <WhyCard
              icon={<ShieldCheck className="size-5" />}
              iconBgClass="bg-amber-100"
              title="Godkendte produkter"
              text="Vi anvender skånsomme og godkendte produkter, der passer til opgaven, så behandlingen bliver udført ansvarligt og med fokus på et stabilt resultat."
              className="reveal-up [animation-delay:140ms]"
            />
            <WhyCard
              icon={<BadgeCheck className="size-5" />}
              iconBgClass="bg-lime-100"
              title="Sprøjtecertifikat og erfaring"
              text="Vi har de nødvendige sprøjtecertifikater og solid erfaring i feltet, så arbejdet bliver udført korrekt, trygt og professionelt fra første besøg."
              className="reveal-up [animation-delay:210ms]"
            />
          </div>
        </div>
      </section>

      {/* Om os */}
      <section className="relative scroll-mt-36 border-b border-border/60 bg-muted/20" id="om-os">
        <DotTexture className="opacity-20" />
        <div className={cn(shell, "relative")}>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
            <div className="reveal-up space-y-6 lg:order-1">
              <p className={eyebrowClass}>Om os</p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Lær os at kende
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {SITE_BRAND} er en mindre, privat forretning med personlig kontakt hele vejen. Vi tilpasser behandlingen
                til din plæne, årstiden og ukrudtstrykket, så du får en løsning der faktisk giver mening i praksis.
              </p>

              <ul className="space-y-2 text-sm text-foreground sm:text-base">
                {[
                  {
                    text: "Certificeret udførelse",
                  },
                  {
                    text: "Betaling efter arbejdet",
                  },
                  {
                    text: "Personlig og venlig betjening",
                  },
                  {
                    text: "Lokal dækning i nærområdet",
                  },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-2.5">
                    <BadgeCheck className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                    <span className="text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/kontakt"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "group min-h-11 rounded-xl border-border/80 bg-background/90 px-6 text-base font-semibold shadow-sm transition-all duration-200 hover:border-primary/25 hover:bg-muted/40 hover:shadow-md",
                )}
              >
                Kontakt os
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>

            <div className="reveal-up relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-md ring-1 ring-black/[0.04] lg:order-2">
              <Image
                src="/images/image-5.webp"
                alt="Tæt grøn græsplæne i haven"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Billede: public/images/image-4.webp */}
      <section className="scroll-mt-32 border-b border-border/60 bg-gradient-to-b from-background to-muted/10">
        <div className={cn(shell, "relative")}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-12">
            <div className="reveal-up relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted shadow-md ring-1 ring-border/40">
              <Image
                src="/images/image-4.webp"
                alt="Professionel pleje af græsplæne med udstyr i brug"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="max-w-xl space-y-5 lg:max-w-none">
              <p className={eyebrowClass}>Resultat</p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
                Skal din græsplæne også se sådan ud?
              </h2>
              <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
                Med den rette behandling kan de fleste plæner gå fra ujævne og ukrudtsfyldte til tætte, grønne og mere
                ensartede. Du slipper for selv at stå med sprøjten og kan i stedet nyde resultatet i haven.
              </p>
              <p className="text-pretty text-base leading-relaxed text-muted-foreground">
                Vi vurderer din plæne, tilpasser behandlingen og planlægger et forløb, der passer til sæsonen. Målet er
                en plæne, der både ser godt ud og er rar at opholde sig i hele perioden.
              </p>
              <Link
                href="/booking"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group inline-flex min-h-12 w-full max-w-xs items-center justify-center rounded-xl text-base font-semibold shadow-md shadow-primary/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/15 sm:w-auto",
                )}
              >
                Book tid
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ekstra brødtekst + interne links (SEO) */}
      <section className="scroll-mt-36 border-b border-border/60 bg-background" id="mere-om-service">
        <div className={shell}>
          <SectionHeader
            align="left"
            eyebrow="Godt at vide"
            title="Ukrudtsbekæmpelse og sprøjtning med fokus på din græsplæne"
            subtitle="Kort fortalt: vi hjælper private og virksomheder med målrettet ukrudtsbekæmpelse, så græsset får bedre plads og plænen bliver pænere og mere ensartet gennem sæsonen."
          />
          <div className="mt-10 max-w-3xl space-y-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              Hos {SITE_BRAND} arbejder vi med professionel sprøjtning af græsplæner og ukrudtsbekæmpelse i Give,
              Grindsted, Brande, Vejle, Billund, Jelling og mange andre byer i området. Når du{" "}
              <Link href="/booking" className="font-medium text-primary underline-offset-4 hover:underline">
                booker en tid online
              </Link>
              , sender du adresse og areal — derefter gennemgår vi bookingen og bekræfter tidspunktet, så du ved
              præcis, hvornår vi kommer.
            </p>
            <p>
              Prisen følger dit plæneareal (kr. pr. m² med minimumspris), og du kan altid starte med en uforpligtende
              snak via vores{" "}
              <Link href="/kontakt" className="font-medium text-primary underline-offset-4 hover:underline">
                kontaktformular
              </Link>
              . Vil du læse mere om lokalt indhold og søgeord pr. by, finder du oversigten på{" "}
              <Link href="/byer" className="font-medium text-primary underline-offset-4 hover:underline">
                vores bysider
              </Link>{" "}
              — fx dedikerede sider for enkelte byer med beskrivelse og mulighed for booking.
            </p>
            <p>
              Vi kombinerer erfaring, godkendte produkter og de nødvendige sprøjtecertifikater, så behandlingen bliver
              udført forsvarligt. Har du brug for inspiration til Grindsted-området, kan du også læse siden{" "}
              <Link
                href="/ukrudtsbekaempelse-grindsted"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                ukrudtsbekæmpelse Grindsted
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-36 border-b border-border/60 bg-gradient-to-b from-muted/40 via-muted/25 to-background">
        <div className={shell}>
          <SectionHeader
            eyebrow="FAQ"
            title="Ofte stillede spørgsmål"
            subtitle="Her får du de spørgsmål vi oftest får, med klare og lidt mere uddybende svar."
          />
          <div className="mx-auto mt-10 max-w-4xl space-y-3">
            {[
              {
                q: "Hvornår på året starter behandlingerne?",
                a: "Vi starter typisk, når jordtemperaturen ligger omkring 8 grader, fordi græsset dér begynder at vokse igen. Det er også her en tidlig indsats mod ukrudt giver bedst mening, så plænen får de rigtige betingelser fra starten af sæsonen.",
              },
              {
                q: "Hvordan beregnes prisen?",
                a: `Prisen beregnes ud fra arealet på din græsplæne. Vores pris er ${pricing.pricePerSquareMeter.toLocaleString("da-DK")} kr. pr. m² med en minimumspris på ${pricing.minimumPrice.toLocaleString("da-DK")} kr., så mindre opgaver stadig kan udføres ordentligt og rentabelt.`,
              },
              {
                q: "Hvilket område dækker I?",
                a: `Vi dækker som udgangspunkt op til ${pricing.serviceRadiusKm.toLocaleString("da-DK")} km fra ${pricing.baseLabel}. Når du sender en booking, tjekker vi hurtigt adressen og bekræfter med det samme, om du ligger inden for ruten.`,
              },
              {
                q: "Bruger I godkendte produkter?",
                a: "Ja. Vi anvender godkendte produkter og udfører behandlingen med de nødvendige sprøjtecertifikater. Det betyder, at du får en løsning der både er effektiv, ansvarlig og udført korrekt.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-border/70 bg-background/90 px-5 py-4 shadow-sm ring-1 ring-black/[0.03] transition-[box-shadow,background-color] duration-200 open:bg-background open:shadow-md open:ring-primary/10 hover:border-border hover:bg-muted/25"
              >
                <summary className="cursor-pointer list-none text-base font-semibold text-foreground marker:hidden outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2">
                  <span className="flex min-h-12 items-center justify-between gap-4 py-1">
                    {item.q}
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground transition-transform duration-200 group-open:rotate-45 group-open:border-primary/20 group-open:bg-primary/10 group-open:text-primary"
                      aria-hidden
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-1 border-t border-border/50 pr-2 pt-4 text-sm leading-relaxed text-muted-foreground sm:pr-8 sm:text-base">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

function WhyCard({
  icon,
  iconBgClass,
  title,
  text,
  className,
}: {
  icon: React.ReactNode;
  iconBgClass: string;
  title: string;
  text: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border-0 px-4 py-10 transition-colors duration-300 sm:px-8 sm:py-12 sm:hover:bg-muted/15 lg:px-12 lg:py-14",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex size-14 items-center justify-center rounded-full text-foreground shadow-sm ring-1 ring-black/[0.05] transition-transform duration-300 md:hover:scale-105",
          iconBgClass,
        )}
      >
        <span className="text-foreground">{icon}</span>
      </span>
      <h3 className="mt-8 text-xl font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-4 max-w-sm text-pretty text-base leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

function ProcessIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-border/80 bg-background/95 text-muted-foreground shadow-sm ring-1 ring-black/[0.04]">
      {icon}
    </span>
  );
}

function ProcessStep({ title, text, index, className }: { title: string; text: string; index: string; className?: string }) {
  return (
    <Card
      className={cn(
        "h-full rounded-2xl border-border/60 bg-background/95 py-0 shadow-sm ring-1 ring-black/[0.04] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/15 hover:shadow-md",
        className,
      )}
    >
      <CardHeader className="pb-1 pt-5">
        <Badge variant="secondary" className="h-6 w-fit px-2 font-semibold tabular-nums">
          {index}
        </Badge>
        <CardTitle className="pt-2 text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-6 text-base leading-relaxed text-muted-foreground">{text}</CardContent>
    </Card>
  );
}
