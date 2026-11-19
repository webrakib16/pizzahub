import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

const NAV_LINKS = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "Browse Menu", href: "/menu" },
    { label: "Sign In", href: "/sign-in" },
    { label: "Create Account", href: "/sign-up" },
  ],
  "For Restaurants": [
    { label: "Partner with Us", href: "/vendor/register" },
    { label: "Vendor Dashboard", href: "/dashboard/vendor" },
    { label: "Premium Plans", href: "/vendor/pricing" },
    { label: "Vendor Support", href: "/support" },
  ],
  Support: [
    { label: "Help Centre", href: "/help" },
    { label: "Track Order", href: "/orders" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

// Social icons as inline SVGs (lucide-react does NOT have Facebook/Instagram/Youtube/Twitter)
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon, hoverColor: "hover:text-blue-500" },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon, hoverColor: "hover:text-pink-500" },
  { label: "X (Twitter)", href: "https://x.com", Icon: XIcon, hoverColor: "hover:text-white" },
  { label: "YouTube", href: "https://youtube.com", Icon: YoutubeIcon, hoverColor: "hover:text-red-500" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image
                src="/assets/logo-icon.png"
                alt="PizzaHub logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-2xl font-black">
                <span className="text-white">Pizza</span>
                <span className="text-orange-500">Hub</span>
              </span>
            </Link>

            <p className="text-zinc-400 text-sm leading-relaxed mb-5">
              Your one-stop destination for authentic, freshly baked pizzas from
              the best local restaurants. Order in minutes, delivered hot.
            </p>

            {/* Contact */}
            <div className="space-y-2">
              <a
                href="mailto:support@pizzahub.com"
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-orange-400 transition-colors"
              >
                <Mail size={15} className="text-orange-500 shrink-0" />
                support@pizzahub.com
              </a>
              <a
                href="tel:+18005550199"
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-orange-400 transition-colors"
              >
                <Phone size={15} className="text-orange-500 shrink-0" />
                +1 (800) 555-0199
              </a>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {SOCIAL_LINKS.map(({ label, href, Icon, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 ${hoverColor} hover:bg-zinc-700 transition-all duration-200`}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Columns */}
          {Object.entries(NAV_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-zinc-400 text-sm hover:text-orange-400 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-500 text-sm text-center sm:text-left">
            © {year} PizzaHub. All rights reserved. Made with ❤️ for pizza lovers.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-zinc-500 text-xs hover:text-zinc-300 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-zinc-500 text-xs hover:text-zinc-300 transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-zinc-500 text-xs hover:text-zinc-300 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
