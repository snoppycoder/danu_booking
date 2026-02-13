import { AgentSideBar } from "@/components/AgentSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SidebarProvider>
        {/* Sidebar */}
        <AgentSideBar />
        <body className="font-sans antialiased">{children}</body>
      </SidebarProvider>
    </html>
  );
}
