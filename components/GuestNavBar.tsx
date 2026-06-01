"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";

export default function GuestNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const linksObj = [
    { label: "Home", href: "/guest" },
    { label: "Ticket Lookup", href: "/guest/tvn" },
    { label: "About Us", href: "/guest/about-us" },
    { label: "Contact Us", href: "/guest/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 border-b border-border/40 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center shrink-0">
            <Link href="/guest">
              <img src="/logo.png" className="h-26 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center justify-between gap-14 absolute left-1/2 -translate-x-1/2">
            {linksObj.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={clsx(
                    "text-sm font-medium transition-all duration-200 hover:text-primary relative group",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {link.label}
                  {/* Optional: Aesthetic animated underline effect on hover/active */}
                  <span
                    className={clsx(
                      "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                      isActive ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground font-medium"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-10 h-10 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              <Menu
                className={clsx(
                  "absolute h-6 w-6 transition-all duration-300 ease-in-out",
                  isMenuOpen
                    ? "opacity-0 rotate-90 scale-75"
                    : "opacity-100 rotate-0 scale-100",
                )}
              />
              <X
                className={clsx(
                  "absolute h-6 w-6 transition-all duration-300 ease-in-out",
                  isMenuOpen
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-75",
                )}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={clsx(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-[400px] opacity-100 pb-4" : "max-h-0 opacity-0",
          )}
        >
          <div className="pt-4 pb-2 space-y-1 border-t border-border/40">
            {/* Mobile Links */}
            <div className="flex flex-col items-center space-y-1 mb-4">
              {linksObj.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={clsx(
                      "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-2 px-4 pt-2 border-t border-border/40">
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => {
                  router.push("/login");
                  setIsMenuOpen(false);
                }}
              >
                Login
              </Button>
              <Button
                className="w-full justify-center shadow-sm"
                onClick={() => {
                  router.push("/signup");
                  setIsMenuOpen(false);
                }}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
