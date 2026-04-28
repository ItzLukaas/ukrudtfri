import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Aftalebetingelser for certificeret plæneservice",
  description:
    "Læs aftalebetingelser for certificeret plænesprøjtning i Give, Grindsted, Brande og Vejle, inkl. booking, afbestilling, priser og udførelse.",
  alternates: { canonical: `${SITE_URL}/aftalebetingelser` },
};

const TERMS_MD = `# Aftalebetingelser for LawnGuard

## Definitioner

**Tjenesteyder:** LawnGuard
**Kunden:** Den person eller juridiske enhed, der afgiver en booking eller bestilling
**Service:** Professionel behandling af græsplæner, herunder ukrudtsbekæmpelse, pleje og relaterede ydelser udført af LawnGuard for private og erhvervskunder.

## Generelle betingelser

Ved afgivelse af en booking eller bestilling hos LawnGuard accepterer kunden nærværende aftalebetingelser.

## Booking og bekræftelse

Booking foretages via LawnGuards hjemmeside gennem det digitale bookingsystem.

En booking er **uforpligtende og ikke bindende**, indtil LawnGuard manuelt har bekræftet aftalen. Når bookingen er godkendt, modtager kunden bekræftelse via de oplyste kontaktoplysninger.

LawnGuard forbeholder sig retten til at afvise eller annullere en booking uden begrundelse. Kunden vil i så fald blive informeret hurtigst muligt med henblik på eventuel ombooking.

## Pris og arealberegning

Ved booking oplyser kunden et vejledende antal kvadratmeter græsplæne. Den viste pris ved booking er derfor vejledende.

Det endelige areal vurderes ved ankomst, og prisen reguleres herefter, hvis plænen viser sig at være større eller mindre end oplyst ved booking.

**Standardpris:** 1,5 kr. pr. m²  
**Minimumspris:** 300 kr.

## Afbestilling og ændringer

Afbestilling eller ændring af en bekræftet booking skal ske senest **24 timer før aftalt tidspunkt**.

Ved senere afbestilling forbeholder LawnGuard sig retten til at opkræve et gebyr eller afvise fremtidige bookinger.

## Kundens oplysninger

Ved booking oplyser kunden navn, adresse, telefonnummer og e-mailadresse.

Oplysningerne anvendes udelukkende til:

* Behandling af booking
* Kontakt vedrørende aftalen
* Fremsendelse af bekræftelser og påmindelser
* Udførelse af den bestilte service

## Adgangsforhold

Det er kundens ansvar at sikre fri og forsvarlig adgang til det område, hvor behandlingen skal udføres.

Hvis LawnGuard møder forgæves på grund af manglende adgang, forbeholder LawnGuard sig retten til at opkræve et gebyr.

## Udførelse af service

LawnGuard anvender godkendte produkter og besidder de nødvendige sprøjtecertifikater til lovlig udførelse af behandlingerne.

Behandling udføres typisk, når jordtemperaturen og vækstforholdene gør det fagligt forsvarligt. Sæsonstart sker som udgangspunkt, når jordtemperaturen når cirka 8 grader.

## Påmindelser

LawnGuard sender som udgangspunkt en påmindelse cirka 2 timer før aftalt besøg, men dette kan ikke garanteres.

## Ansvar og resultat

LawnGuard bestræber sig på at levere professionel service af høj kvalitet.

Da vækstforhold, vejr, jordbund, vedligeholdelse og andre eksterne faktorer kan påvirke resultatet, gives der ikke garanti for et bestemt visuelt resultat eller fuldstændig ukrudtsfri plæne.

Eventuelle fejl eller mangler skal meddeles inden rimelig tid efter udført service.

## Force majeure

LawnGuard kan uden ansvar udsætte eller aflyse aftaler ved forhold uden for virksomhedens kontrol, herunder vejrlig, sygdom, tekniske problemer eller myndighedskrav.

## Tvister

Eventuelle uenigheder mellem kunden og LawnGuard søges først løst i mindelighed.

Kan dette ikke lade sig gøre, afgøres tvisten efter dansk ret.

## Accept

Ved booking af service bekræfter kunden at have læst, forstået og accepteret disse aftalebetingelser.
`;

export default function TermsPage() {
  return (
    <main className="bg-background">
      <section className="border-b border-border/60 bg-muted/25">
        <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:py-16">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Aftalebetingelser</h1>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
        <article className="prose prose-sm max-w-none text-foreground sm:prose-base prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-3xl prose-h1:sm:text-4xl prose-h2:mt-9 prose-h2:text-2xl prose-h2:sm:text-3xl prose-p:leading-relaxed prose-strong:font-bold prose-strong:text-foreground prose-li:leading-relaxed prose-a:text-primary">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {TERMS_MD}
          </ReactMarkdown>
        </article>
      </section>
    </main>
  );
}
