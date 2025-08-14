"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Play, 
  Cpu, 
  Settings, 
  Menu,
  X,
  Grid3X3,
  Code
} from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Blockly", href: "/blockly", icon: Grid3X3 },
  { name: "Program", href: "/program", icon: Code },
  { name: "Simulator", href: "/simulator", icon: Play },
  { name: "Controller", href: "/controller", icon: Cpu },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-card border-r">
          <div className="flex h-16 items-center justify-between px-4">
            <h2 className="text-lg font-semibold">Robot Platform</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:block">
        <div className="flex h-full flex-col bg-card border-r">
          <div className="flex h-16 items-center px-4">
            <h2 className="text-lg font-semibold">Robot Platform</h2>
          </div>
          <nav className="flex-1 space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

        <main className="p-6 max-h-screen lg:pl-72 overflow-y-auto">
          {children}
        </main>
      
    </div>
  );
}
