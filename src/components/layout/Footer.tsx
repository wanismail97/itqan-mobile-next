// ─── Footer — Premium 4-column footer for iTQAN Mobile ───────────────────

import { siteConfig } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";

const produkLinks = [
  { label: "Telefon", href: "/produk" },
  { label: "SIM Kad", href: "/produk" },
  { label: "Topup & Reload", href: "/reload" },
  { label: "Aksesori", href: "/produk" },
  { label: "Modem WiFi", href: "/produk" },
];

const bantuanLinks = [
  { label: "Hubungi Kami", href: "/hubungi" },
  { label: "Terma & Syarat", href: "/terma-syarat" },
  { label: "Polisi Privasi", href: "/polisi-privasi" },
  { label: "Polisi Pemulangan Wang", href: "/polisi-pemulangan-wang" },
];

const hubungiItems = [
  {
    label: "WhatsApp",
    iconSrc: "/images/icon-whatsapp.png",
    href: `https://wa.me/${siteConfig.contact.phoneRaw}`,
    external: true,
  },
  {
    label: siteConfig.contact.email,
    iconSrc: "/images/icon-email.png",
    href: `mailto:${siteConfig.contact.email}`,
    external: false,
  },
  {
    label: "Facebook",
    iconSrc: "/images/icon-facebook.png",
    href: siteConfig.social.facebook,
    external: true,
  },
  {
    label: "TikTok",
    iconSrc: "/images/icon-tiktok.png",
    href: siteConfig.social.tiktok,
    external: true,
  },
];

/** Shared link style with hover translate and accent color transition */
function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const props = external
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  return (
    <a
      {...props}
      className="group text-gray-400 hover:text-accent transition-all duration-300 ease-out text-sm flex items-center w-fit"
    >
      <span className="group-hover:translate-x-1 transition-transform duration-300 ease-out">
        {children}
      </span>
    </a>
  );
}

function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-semibold text-white/90 mb-4 text-xs uppercase tracking-[0.15em]">
        {title}
      </h4>
      {children}
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary pt-14 md:pt-20 pb-8 px-4 font-inter text-white">
      {/* ─── Grid ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

        {/* Column 1: Produk */}
        <FooterSection title="Produk">
          <ul className="space-y-3">
            {produkLinks.map((item) => (
              <li key={item.label}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
          </ul>
        </FooterSection>

        {/* Column 2: Bantuan */}
        <FooterSection title="Bantuan">
          <ul className="space-y-3">
            {bantuanLinks.map((item) => (
              <li key={item.href}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
          </ul>
        </FooterSection>

        {/* Column 3: Syarikat */}
        <FooterSection title="Syarikat">
          <div className="mb-4">
            <Image
              src="/images/logo.png"
              alt="iTQAN Mobile"
              width={140}
              height={44}
              className="h-10 md:h-14 w-auto object-contain opacity-90"
            />
          </div>
          <ul className="space-y-3">
            <li>
              <Link
                href="/tentang-kami"
                className="text-gray-400 hover:text-accent transition-all duration-300 ease-out text-sm hover:translate-x-1 inline-block"
              >
                Tentang Kami
              </Link>
            </li>
            <li className="pt-2">
              <span className="text-gray-500 text-[11px] block uppercase tracking-wider">
                Dikendalikan oleh
              </span>
              <span className="text-white/80 font-medium text-sm">
                Seteguh Gading Enterprise
              </span>
            </li>
            <li className="text-gray-500 text-xs">
              SSM: TR0341143-D
            </li>
          </ul>
        </FooterSection>

        {/* Column 4: Hubungi */}
        <FooterSection title="Hubungi">
          <ul className="space-y-3">
            {hubungiItems.map((item) => (
              <li key={item.label}>
                <FooterLink href={item.href} external={item.external}>
                  <span className="inline-flex items-center gap-3">
                    <span className="w-5 h-5 flex-shrink-0 inline-block transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-12">
                      <Image
                        src={item.iconSrc}
                        alt={item.label}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </span>
                    <span className="text-sm">{item.label}</span>
                  </span>
                </FooterLink>
              </li>
            ))}
          </ul>
        </FooterSection>
      </div>

      {/* ─── Divider ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto">
        <div className="border-t border-white/10" />
      </div>

      {/* ─── Copyright ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto pt-8 text-center">
        <p className="text-accent font-bold text-base mb-1">{siteConfig.name}</p>
        <p className="text-gray-500 text-xs leading-relaxed">
          &copy; {currentYear} {siteConfig.name}. Hak Cipta Terpelihara.
        </p>
        <p className="text-gray-600 text-[11px] leading-relaxed mt-1">
          Dikendalikan oleh Seteguh Gading Enterprise
          <span className="mx-1.5 text-gray-700">·</span>
          SSM: TR0341143-D
        </p>
      </div>
    </footer>
  );
}