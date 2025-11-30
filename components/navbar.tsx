"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
interface NavbarProps {
  initalPath: { href: string; label: string }[];
}
export default function Navbar(Props: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="relative flex-shrink-0">
            <span className="text-2xl font-bold text-primary ml-0 mr-15">
              DANU BOOKING
            </span>
          </div>

          <div className="ml-5 w-full hidden md:block">
            <div className="w-full flex justify-between items-center space-x-8">
              {Props.initalPath.map((path) => (
                <Link
                  key={path.href}
                  href={path.href}
                  className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
                >
                  {path.label}
                </Link>
              ))}
              {/* <Link
                href="/"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href={`/bookings`}
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
              >
                Bookings
              </Link>
              <Link
                href="/about-us"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
              >
                Contact
              </Link> */}
              <Button className="bg-primary cursor-pointer hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded transition-colors">
                <Link href={"/login"}> Log In </Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <a
              href="#"
              className="block px-3 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              Bookings
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              About Us
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              Contact
            </a>
            <div className="px-3 py-2 flex gap-2">
              <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded transition-colors text-sm">
                Sign In
              </button>
              <button className="flex-1 bg-coral-500 hover:bg-coral-600 text-white font-semibold px-4 py-2 rounded transition-colors text-sm">
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
