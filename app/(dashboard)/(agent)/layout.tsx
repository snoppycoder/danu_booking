import { AgentSideBar } from "@/components/AgentSideBar";
import AvatarHero from "@/components/HeroAvatar";
import QueryProvider from "@/components/QueryProvide";
import { SidebarProvider } from "@/components/ui/sidebar";

import { AuthProvider } from "@/lib/authContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en">
    //   <AuthProvider blackListRoles={["passenger", "operator-admin"]}>
    //     <SidebarProvider>
    //       <AgentSideBar />
    //       <AvatarHero />
    //       <body className="font-sans antialiased">{children}</body>
    //     </SidebarProvider>
    //   </AuthProvider>
    // </html>
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider
          blackListRoles={["passenger", "operator-admin"]}
        >
          <QueryProvider>
            <div className="min-h-screen  flex flex-col md:flex-row">
              <SidebarProvider>  
          
                  <AgentSideBar />
              
              </SidebarProvider>
            
              <div className="md:flex md:flex-col w-full h-full">
                <div className="h-12 w-full hidden md:flex md:flex-row-reverse px-4 py-3">
                  <AvatarHero />
                </div>
                <main className="flex-1">{children}</main>
              </div>
            </div>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
