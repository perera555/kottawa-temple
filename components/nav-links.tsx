"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

type Item = { href: string; label: string };

export function NavLinks({ items, extra }: { items: Item[]; extra: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" || href === "/dhamma-school" || href === "/montessori" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <nav className="hidden xl:flex items-center gap-1">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className={`rounded-full px-2.5 py-2 text-sm font-medium whitespace-nowrap transition ${
              isActive(i.href) ? "bg-accent text-white" : "text-ink hover:bg-accent-soft hover:text-accent"
            }`}
          >
            {i.label}
          </Link>
        ))}
      </nav>
      <button
        className="xl:hidden rounded-full p-2 text-ink hover:bg-accent-soft"
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <div className="xl:hidden absolute left-0 right-0 top-full border-b border-line bg-white shadow-lg">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {items.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 font-medium ${isActive(i.href) ? "bg-accent-soft text-accent" : "text-ink"}`}
              >
                {i.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-line pt-3">{extra}</div>
          </nav>
        </div>
      )}
    </>
  );
}
