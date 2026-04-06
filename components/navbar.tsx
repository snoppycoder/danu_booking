"use client";

import { useEffect, useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import AvatarHero from "./HeroAvatar";
import { authAPI } from "@/app/api/api";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import db from "@/lib/dixiedb";
import "@/i18n";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  initalPath: { href: string; label: string }[];
  onLoaded: () => void;
}

export default function Navbar(props: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, count } = useAuth();
  const pathUrl = usePathname();
  const { t } = useTranslation();
  const [toggleOpen, setToggleOpen] = useState(false);

  useEffect(() => {
    if (user) {
      props.onLoaded();
    }
  }, [user, props.onLoaded]);

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="relative h-full flex items-center shrink-0 mr-10">
            <Link href="/passenger">
              <img src="/logo.png" className="h-25 w-auto" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="w-full hidden md:block">
            <div className="w-full flex justify-between items-center">
              {props.initalPath.map((path) => (
                <Link
                  key={path.href}
                  href={path.href}
                  className={clsx(
                    `text-gray-700 hover:text-teal-600 font-medium transition-colors`,
                    {
                      "text-teal-600 animate-pulse": pathUrl === path.href,
                    },
                  )}
                >
                  {path.label}
                </Link>
              ))}
              <div className="flex gap-4 items-center">
                <AvatarHero />
                <Link
                  href="/notifications"
                  onClick={async () => {
                    await db.settings.put({
                      key: "unreadCount",
                      value: "0",
                    });
                  }}
                >
                  <div
                    className="relative cursor-pointer"
                    onClick={() => setToggleOpen(!toggleOpen)}
                  >
                    <Bell className="w-6 h-6" />

                    {count > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                        {count > 99 ? "99+" : count}
                      </span>
                    )}
                  </div>
                </Link>
              </div>

              {!user && (
                <Button className="bg-primary cursor-pointer hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded transition-colors">
                  <Link href="/login">{t("login")}</Link>
                </Button>
              )}
            </div>
          </div>

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
          <div className="md:hidden w-full pb-4 border-t border-gray-200">
            <Link
              onClick={() => setIsMenuOpen(false)}
              href="/passenger"
              className="block text-center px-3 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              {t("home")}
            </Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              href="/passenger/about-us"
              className="block text-center px-3 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              {t("about")}
            </Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              href="/passenger/contact"
              className="block text-center px-3 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              {t("contact")}
            </Link>

            <Link
              onClick={() => setIsMenuOpen(false)}
              href="/profile"
              className="block text-center px-3 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              {t("profile")}
            </Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              href="/history"
              className="block text-center px-3 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              {t("myBookings")}
            </Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              href="/manage-sessions"
              className="block text-center px-3 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              {t("manageSessions")}
            </Link>

            {/* Logout Button */}
            <div className="px-3 mt-2 w-full py-2 flex justify-center gap-2">
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={async () => {
                  await authAPI.logout();
                }}
              >
                {t("logout")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
