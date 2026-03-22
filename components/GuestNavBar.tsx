"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";

export default function GuestNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border/90 backdrop-blur supports-[backdrop-filter]:bg-background/95">
      <div className="w-full max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/guest">
              <img src="/logo.png" className="h-26 w-auto" />
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              className="text-foreground cursor-pointer hover:bg-muted"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button
              className="bg-primary cursor-pointer hover:bg-primary text-white"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-6 h-6 text-gray-700 hover:text-primary"
            >
              <Menu
                className={clsx(
                  "absolute cursor-pointer inset-0 transition-all duration-300",
                  isMenuOpen
                    ? "opacity-0 rotate-90 scale-75"
                    : "opacity-100 rotate-0 scale-100",
                )}
              />

              <X
                className={clsx(
                  "absolute inset-0 cursor-pointer transition-all duration-300",
                  isMenuOpen
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-75",
                )}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4 space-y-3">
            <Button
              variant="ghost"
              className="w-full text-foreground hover:bg-muted"
              onClick={() => {
                router.push("/login");
                setIsMenuOpen(false);
              }}
            >
              Login
            </Button>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={() => {
                router.push("/signup");
                setIsMenuOpen(false);
              }}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
