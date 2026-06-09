// ─── Navbar — Fixed top navigation bar with cart indicator ─────────────────
"use client";

import { useCart } from "@/lib/cart-context";
import { navLinks } from "@/lib/config";
import Link from "next/link";

export default function Navbar() {
  const { itemCount } = useCart();

  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-sm nav-sticky"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-accent">
              iTQAN Mobile
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
              className="text-white hover:text-accent transition duration-300 font-medium"
            >
                {link.label}
            </Link>
            ))}
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative text-white hover:text-accent transition duration-300"
              aria-label="Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: Cart icon + Hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              href="/cart"
              className="relative text-white"
              aria-label="Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <button
              id="mobile-menu-btn"
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  className="hamburger-line"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu"
        className="hidden md:hidden bg-primary/95 backdrop-blur-sm overflow-hidden transition-all duration-500 max-h-0"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
          <Link
              key={link.href}
              href={link.href}
            className="block px-3 py-2 text-white hover:text-accent transition duration-300 font-medium"
          >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

