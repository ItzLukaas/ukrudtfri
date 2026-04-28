import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CONTACT_EMAIL, SITE_BRAND } from "@/lib/site-config";

export async function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#174430] bg-[#082e1e] text-[#f2f6f3]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-16">
        <div className="grid gap-8 text-center md:grid-cols-[1.2fr_0.75fr_0.95fr] md:gap-10 md:text-left">
          <div className="space-y-5">
            <p className="text-xl font-semibold tracking-tight">{SITE_BRAND}</p>
            <p className="mx-auto max-w-md text-sm text-[#c6d2ca] md:mx-0">
              Professionel sprøjtning af græsplæner i Vejle og omegn.
            </p>
            <div className="mx-auto flex max-w-sm flex-col gap-2.5 md:mx-0">
              <a
                className="inline-flex items-center justify-center gap-2.5 rounded-md px-1 py-1 text-sm text-[#d7e3da] transition-colors hover:text-white md:justify-start"
                href="tel:+4541820046"
              >
                <Phone className="size-4 text-[#c0d2c4]" />
                <span>
                  <span className="block text-[11px] text-[#c6d2ca]">Ring på</span>
                  <span className="block text-base leading-none font-semibold tracking-tight sm:text-lg">+45 41 82 00 46</span>
                </span>
              </a>
              <a
                className="inline-flex items-center justify-center gap-2.5 rounded-md px-1 py-1 text-sm text-[#d7e3da] transition-colors hover:text-white md:justify-start"
                href={`mailto:${CONTACT_EMAIL}`}
              >
                <Mail className="size-4 shrink-0 text-[#d8e6dc]" aria-hidden />
                <span className="min-w-0">
                  <span className="block text-[11px] text-[#c6d2ca]">Skriv til</span>
                  <span className="block break-all text-base leading-none font-semibold tracking-tight sm:text-lg">{CONTACT_EMAIL}</span>
                </span>
              </a>
            </div>
          </div>

          <div className="space-y-4 md:self-start md:justify-self-start">
            <p className="text-sm font-semibold text-[#f3f8f4]">Navigation</p>
            <div className="flex flex-col items-center gap-2 text-sm text-[#c6d2ca] md:items-start">
              <Link href="/fordele" className="transition-colors hover:text-white">
                Fordele
              </Link>
              <Link href="/proces" className="transition-colors hover:text-white">
                Proces
              </Link>
              <Link href="/om-os" className="transition-colors hover:text-white">
                Om os
              </Link>
              <Link href="/kontakt" className="transition-colors hover:text-white">
                Kontakt os
              </Link>
              <Link href="/faq" className="transition-colors hover:text-white">
                FAQ
              </Link>
              <Link href="/booking" className="transition-colors hover:text-white">
                Book din tid
              </Link>
            </div>
          </div>

          <div className="space-y-3 md:justify-self-start">
            <p className="text-sm font-semibold text-[#f3f8f4]">Vi dækker blandt andet</p>
            <div className="mx-auto grid w-fit grid-cols-1 gap-x-3 gap-y-2 text-sm text-[#c6d2ca] sm:grid-cols-2 md:mx-0">
              {[
                ["give", "Give"],
                ["brande", "Brande"],
                ["grindsted", "Grindsted"],
                ["billund", "Billund"],
                ["jelling", "Jelling"],
                ["bredsten", "Bredsten"],
                ["torring", "Tørring"],
                ["vejle", "Vejle"],
              ].map(([slug, city]) => (
                <Link
                  key={slug}
                  href="/"
                  className="inline-flex items-center justify-center gap-1.5 transition-colors hover:text-white md:justify-start"
                >
                  <MapPin className="size-3.5 opacity-75" />
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <Separator className="my-8 bg-[#415044]" />
        <div className="flex flex-col gap-2 text-center text-xs text-[#b7c5bc] sm:flex-row sm:items-center sm:text-left">
          <p>© 2026 {SITE_BRAND}. Alle rettigheder forbeholdes.</p>
          <div className="sm:mx-auto sm:text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <Link href="/aftalebetingelser" className="font-medium text-[#d7e3da] transition-colors hover:text-white">
                Aftalebetingelser
              </Link>
            </div>
          </div>
          <p className="sm:ml-auto sm:text-right">
            Hjemmesiden udviklet af{" "}
            <a
              href="https://lukassvendsen.dk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#f5fbf6] transition-colors hover:text-[#d4e5d8]"
            >
              Lukas Svendsen
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
