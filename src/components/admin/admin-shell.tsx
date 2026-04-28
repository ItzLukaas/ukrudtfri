"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CalendarRange,
  LayoutDashboard,
  MapPin,
  Settings2,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/server/auth-actions";

const nav = [
  { href: "/admin", label: "Overblik", icon: LayoutDashboard },
  { href: "/admin/calendar", label: "Kalender", icon: CalendarDays },
  { href: "/admin/bookings", label: "Bookinger", icon: CalendarRange },
  { href: "/admin/availability", label: "Tider", icon: Timer },
  { href: "/admin/blocks", label: "Blokeringer", icon: MapPin },
  { href: "/admin/settings", label: "Priser & område", icon: Settings2 },
] as const;

function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav className={cn("flex flex-col gap-0.5", className)}>
      {nav.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/12 text-primary"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row lg:gap-10">
      <aside className="lg:w-56 lg:shrink-0">
        <div className="lg:sticky lg:top-6 lg:rounded-xl lg:border lg:border-border/60 lg:bg-card/50 lg:p-3">
          <p className="mb-2 hidden px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground lg:block">
            Menu
          </p>
          <div className="-mx-1 flex gap-1 overflow-x-auto pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:pb-0">
            <NavLinks className="min-w-0 flex-row lg:flex-col" />
          </div>
          <form action={signOutAction} className="mt-4 hidden border-t border-border/60 pt-3 lg:block">
            <Button variant="outline" size="sm" type="submit" className="w-full">
              Log ud
            </Button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 space-y-6">{children}</main>
      <form action={signOutAction} className="lg:hidden">
        <Button variant="outline" size="sm" type="submit" className="w-full">
          Log ud
        </Button>
      </form>
    </div>
  );
}
