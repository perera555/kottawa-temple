/**
 * Separate web addresses per section (one app, three sites).
 *   DHAMMA_HOSTS=kottawa-dhamma-school.vercel.app,dhamma.example.lk
 *   MONTESSORI_HOSTS=kottawa-montessori.vercel.app,montessori.example.lk
 *   TEMPLE_URL / DHAMMA_URL / MONTESSORI_URL = full links used by the section switcher
 * Safe to import from proxy.ts (no server-only modules).
 */
import type { Section } from "./site";

/** Remove whitespace and invisible characters (BOM / zero-width) from env values. */
const clean = (v?: string) => (v ?? "").replace(/[﻿​-‍]/g, "").trim();

const list = (v?: string) =>
  clean(v)
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

export function sectionForHost(host: string | null): Section | null {
  const h = (host ?? "").toLowerCase().split(":")[0];
  if (list(process.env.DHAMMA_HOSTS).includes(h)) return "dhamma";
  if (list(process.env.MONTESSORI_HOSTS).includes(h)) return "montessori";
  return null;
}

export const SECTION_BASE: Record<Section, string> = { temple: "", dhamma: "/dhamma-school", montessori: "/montessori" };

/** Paths shared by every site (accounts, admin, assets). Never rewritten. */
export const SHARED_PREFIXES = ["/admin", "/account", "/login", "/register", "/forgot-password", "/reset-password", "/guide", "/images", "/uploads", "/api", "/_next"];

/** Link to a section's home, absolute when that section has its own address. */
export function sectionHomeUrl(section: Section) {
  const env = clean({ temple: process.env.TEMPLE_URL, dhamma: process.env.DHAMMA_URL, montessori: process.env.MONTESSORI_URL }[section]);
  // only use absolute links that are real http(s) URLs
  return /^https?:\/\//.test(env) ? env.replace(/\/$/, "") : SECTION_BASE[section] || "/";
}
