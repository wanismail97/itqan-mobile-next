// ─── Footer — 3-column footer with contact, links, social ─────────────────

import { siteConfig, navLinks } from "@/lib/config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary section-spacing px-4 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Column 1: Contact Info */}
        <div>
          <h3 className="text-accent font-bold text-xl mb-4">
            {siteConfig.name}
          </h3>
          <div className="space-y-2">
            <p className="text-gray-400 text-sm leading-relaxed">{siteConfig.contact.address}</p>
            <p className="text-gray-400 text-sm">{siteConfig.contact.phone}</p>
            <p className="text-gray-400 text-sm">{siteConfig.contact.email}</p>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="font-semibold text-white mb-4">Pautan Pantas</h4>
          <div className="space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-gray-400 hover:text-accent transition-all duration-300 ease-out text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Column 3: Social Media */}
        <div>
          <h4 className="font-semibold text-white mb-4">Ikuti Kami</h4>
          <div className="flex gap-3">
            <a
              href={siteConfig.social.facebook}
              className="w-11 h-11 bg-white/10 hover:bg-accent rounded-xl flex items-center justify-center transition-all duration-300 ease-out text-sm font-bold text-white hover:text-primary"
              aria-label="Facebook"
            >
              f
            </a>
            <a
              href={siteConfig.social.instagram}
              className="w-11 h-11 bg-white/10 hover:bg-accent rounded-xl flex items-center justify-center transition-all duration-300 ease-out text-sm font-bold text-white hover:text-primary"
              aria-label="Instagram"
            >
              ig
            </a>
            <a
              href={siteConfig.social.tiktok}
              className="w-11 h-11 bg-white/10 hover:bg-accent rounded-xl flex items-center justify-center transition-all duration-300 ease-out text-sm font-bold text-white hover:text-primary"
              aria-label="TikTok"
            >
              tt
            </a>
          </div>
        </div>
      </div>

      {/* Divider + Copyright */}
      <div className="border-t border-white/10 my-8" />
      <p className="text-center text-gray-500 text-sm">
        &copy; {currentYear} {siteConfig.name}. Hak Cipta Terpelihara. Made with
        {" "}❤️ in Malaysia
      </p>
    </footer>
  );
}
