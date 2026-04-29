import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SITE_BRAND } from "@/lib/site-config";
import { getPublicPricing } from "@/server/public-booking";

export async function SiteFooter() {
  const pricing = await getPublicPricing();
  const footerAddress = pricing.baseLabel === "Give, Danmark" ? "Hyldevang 44, Give" : pricing.baseLabel;
  return (
    <footer className="mt-auto border-t border-[#174430] bg-[#082e1e] text-[#f2f6f3]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-16">
        <div className="grid gap-8 text-center md:grid-cols-[1.2fr_0.75fr_0.95fr] md:gap-10 md:text-left">
          <div className="space-y-5">
            <p className="text-xl font-semibold tracking-tight">{SITE_BRAND}</p>
            <p className="text-sm font-semibold text-[#f3f8f4]">Alle kontaktoplysninger</p>
            <div className="mx-auto flex max-w-sm flex-col gap-2.5 md:mx-0">
              <a
                className="inline-flex items-center justify-center gap-2.5 rounded-md px-1 py-1 text-sm text-[#d7e3da] transition-colors hover:text-white md:justify-start"
                href="tel:+4541820046"
              >
                <Phone className="size-4 text-[#c0d2c4]" />
                <span>
                  <span className="block text-sm leading-none font-semibold tracking-tight sm:text-lg">+45 41 82 00 46</span>
                </span>
              </a>
              <a
                className="inline-flex items-center justify-center gap-2.5 rounded-md px-1 py-1 text-sm text-[#d7e3da] transition-colors hover:text-white md:justify-start"
                href="/kontakt#kontakt-form"
              >
                <Mail className="size-4 shrink-0 text-[#d8e6dc]" aria-hidden />
                <span className="min-w-0">
                  <span className="block break-all text-sm leading-none font-semibold tracking-tight sm:text-lg">
                    Skriv til os via kontaktformular
                  </span>
                </span>
              </a>
              <a
                className="inline-flex items-center justify-center gap-2.5 rounded-md px-1 py-1 text-sm text-[#d7e3da] transition-colors hover:text-white md:justify-start"
                href="https://maps.google.com/?q=Hyldevang%2044%2C%20Give"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="size-4 shrink-0 text-[#d8e6dc]" aria-hidden />
                <span className="min-w-0">
                  <span className="block break-words text-sm leading-none font-semibold tracking-tight sm:text-lg">
                    {footerAddress}
                  </span>
                </span>
              </a>
            </div>
          </div>

          <div className="space-y-4 md:self-start md:justify-self-start">
            <p className="text-sm font-semibold text-[#f3f8f4]">Navigation</p>
            <div className="flex flex-col items-center gap-2 text-sm text-[#c6d2ca] md:items-start">
              <Link href="/#fordele" className="transition-colors hover:text-white">
                Fordele
              </Link>
              <Link href="/#proces" className="transition-colors hover:text-white">
                Proces
              </Link>
              <Link href="/#om-os" className="transition-colors hover:text-white">
                Om os
              </Link>
              <Link href="/kontakt" className="transition-colors hover:text-white">
                Kontakt os
              </Link>
              <Link href="/#faq" className="transition-colors hover:text-white">
                Spørgsmål
              </Link>
              <Link href="/booking" className="transition-colors hover:text-white">
                Book din tid
              </Link>
            </div>
          </div>

          <div className="space-y-3 md:justify-self-start">
            <p className="text-sm font-semibold text-[#f3f8f4]">Vi dækker blandt andet</p>
            <div className="mx-auto grid w-fit grid-cols-2 gap-x-3 gap-y-2 text-sm text-[#c6d2ca] md:mx-0">
              {[
                ["grindsted", "Grindsted"],
                ["bredsten", "Bredsten"],
                ["jelling", "Jelling"],
                ["torring", "Tørring"],
                ["brande", "Brande"],
                ["billund", "Billund"],
                ["vejle", "Vejle"],
                ["give", "Give"],
              ].map(([slug, city]) => (
                <Link
                  key={slug}
                  href={`/byer/${slug}`}
                  className="inline-flex items-center justify-center gap-1.5 transition-colors hover:text-white md:justify-start"
                >
                  <MapPin className="size-3.5 opacity-75" />
                  {city}
                </Link>
              ))}
            </div>
            <Link
              href="/byer"
              className="mx-auto inline-flex w-fit items-center justify-center gap-1.5 pt-2 text-sm text-[#c6d2ca] transition-colors hover:text-white md:mx-0 md:justify-start"
            >
              Se flere byer
            </Link>
          </div>
        </div>
        <Separator className="my-8 bg-[#415044]" />
        <div className="flex flex-col gap-2 text-center text-xs text-[#b7c5bc] sm:flex-row sm:items-center sm:text-left">
          <p>© 2026 {SITE_BRAND}. Alle rettigheder forbeholdes.</p>
          <div className="sm:mx-auto sm:text-center" />
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
