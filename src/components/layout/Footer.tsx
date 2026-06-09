// ─── Footer — 3-column footer with contact, links, social ─────────────────

import { siteConfig, navLinks } from "@/lib/config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary py-12 px-4 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Contact Info */}
        <div>
          <h3 className="text-accent font-bold text-xl mb-3">
            {siteConfig.name}
          </h3>
          <p className="text-gray-300 text-sm mb-2">{siteConfig.contact.address}</p>
          <p className="text-gray-300 text-sm mb-2">{siteConfig.contact.phone}</p>
          <p className="text-gray-300 text-sm">{siteConfig.contact.email}</p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Pautan Pantas</h4>
          <div className="space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-gray-300 hover:text-accent transition text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Column 3: Social Media */}
        <div>
          <h4 className="font-semibold mb-3">Ikuti Kami</h4>
          <div className="flex gap-4">
            <a
              href={siteConfig.social.facebook}
              className="w-10 h-10 bg-gray-700 hover:bg-accent rounded-full flex items-center justify-center transition text-sm font-bold"
              aria-label="Facebook"
            >
              f
            </a>
            <a
              href={siteConfig.social.instagram}
              className="w-10 h-10 bg-gray-700 hover:bg-accent rounded-full flex items-center justify-center transition text-sm font-bold"
              aria-label="Instagram"
            >
              ig
            </a>
            <a
              href={siteConfig.social.tiktok}
              className="w-10 h-10 bg-gray-700 hover:bg-accent rounded-full flex items-center justify-center transition text-sm font-bold"
              aria-label="TikTok"
            >
              tt
            </a>
          </div>
        </div>
      </div>

      {/* Divider + Copyright */}
      <div className="border-t border-gray-700 my-6" />
      <p className="text-center text-gray-400 text-sm">
        &copy; {currentYear} {siteConfig.name}. Hak Cipta Terpelihara. Made with
        {" "}❤️ in Malaysia
      </p>
    </footer>
  );
}
