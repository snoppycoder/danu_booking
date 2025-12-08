// "use client";
// import { Menu, Globe, Map, User } from "lucide-react";
// import { Button } from "./ui/button";
// import { useState } from "react";
// import { menuOptions } from "./sidebar";

// export default function Header() {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <header className="lg:hidden bg-background border-b border-border px-6 py-4 flex items-center justify-between">
//       <div className="flex items-center gap-4">
//         <Button
//           className="p-2 hover:bg-muted rounded-lg"
//           onClick={() => {
//             setCollapsed(!collapsed);
//           }}
//         >
//           <Menu className="w-6 h-6" />
//         </Button>
//         {collapsed && (
//           <div className="w-full mt-2.5 absolute top-12 left-0  bg-card border border-border rounded-lg shadow-lg p-2 space-y-1 z-50">
//             {menuOptions.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
//               >
//                 <item.icon className="w-4 h-4" />
//                 <span className="text-sm">{item.label}</span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="flex items-center gap-4">
//         {/* Language Selector */}

//         {/* Map Icon */}
//         {/* <button className="p-2 hover:bg-muted rounded-lg">
//           <Map className="w-6 h-6" />
//         </button> */}

//         {/* User Icon */}
//         <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted cursor-pointer">
//           <Globe className="w-4 h-4" />
//           <span className="text-sm font-medium">English</span>
//         </div>
//         <button className="p-2 hover:bg-muted rounded-lg">
//           <User className="w-6 h-6" />
//         </button>
//       </div>
//     </header>
//   );
// }
