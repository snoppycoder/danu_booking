"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export default function RootLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selected, setSelected] = useState<string>(
    typeof window !== "undefined" ? window.location.pathname : "/driver"
  );
  const path = usePathname();

  useEffect(() => {
    if (path) setSelected(path);
  }, [path]);

  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <div className="flex min-h-screen bg-background">
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <aside
            className={`fixed lg:static w-64 h-screen bg-sidebar border-r border-sidebar-border shadow-sm transition-transform duration-300 ease-in-out z-50 ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="p-6">
              <div className="text-xl font-bold text-sidebar-foreground">
                BUS365
              </div>
            </div>
            <nav className="space-y-2 px-4">
              <Link
                href="/driver"
                className={`block px-4 py-2 rounded-md transition-colors font-medium ${
                  selected.startsWith("/driver") && selected === "/driver"
                    ? "bg-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                Dashboard
              </Link>

              <Link
                href="/driver/passengers"
                className={`block px-4 py-2 rounded-md transition-colors ${
                  selected.startsWith("/driver/passengers")
                    ? "bg-primary text-sidebar-primary-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                Passengers
              </Link>

              <a
                href="#"
                className="block px-4 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                Routes
              </a>
              <a
                href="#"
                className="block px-4 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                Vehicles
              </a>
              <a
                href="#"
                className="block px-4 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                Reports
              </a>
              <a
                href="#"
                className="block px-4 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                Settings
              </a>
            </nav>
          </aside>

          <main className="flex-1 flex flex-col">
            <header className="bg-card md:border-none border-b border-border px-4 lg:px-8  shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  {/* <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                    Dashboard
                  </h1> */}
                </div>
                {/* <div className="text-xs lg:text-sm text-muted-foreground">
                  Welcome, Admin
                </div> */}
              </div>
            </header>

            <div className="flex-1 overflow-auto p-4 lg:p-8 bg-background">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
