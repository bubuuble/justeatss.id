// app/admin/dashboard/components/dashboard-nav.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useState } from "react"
// Assuming cn and Button are correctly imported/defined in your project
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
import { LayoutDashboard, ShoppingBag, Package, Users, Settings, BarChart3, CreditCard } from "lucide-react"

// --- Temporary placeholder for cn and Button for this example ---
const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');
const Button = ({ variant, className, children, ...props }: any) => (
  <button className={`${className} ${variant === 'default' ? 'bg-accent' : 'bg-ghost'}`} {...props}>{children}</button>
);
// --- End placeholder ---


interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, }, // <-- Root dashboard
  { title: "Pesanan", href: "/admin/dashboard/orders", icon: ShoppingBag, },
  { title: "Produk", href: "/admin/dashboard/products", icon: Package, },
  { title: "Pelanggan", href: "/admin/dashboard/customers", icon: Users, },
  { title: "Pembayaran", href: "/admin/dashboard/payments", icon: CreditCard, },
  { title: "Analitik", href: "/admin/dashboard/analytics", icon: BarChart3, },
  { title: "Pengaturan", href: "/admin/dashboard/settings", icon: Settings, },
]

export default function DashboardNav() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-zinc-900 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar menu"
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar nav */}
      <nav
        className={cn(
          "grid items-start gap-2 p-2 fixed top-0 left-0 h-full w-64 bg-zinc-900 z-50 transform transition-transform duration-300 md:static md:translate-x-0 md:w-full md:bg-transparent md:h-auto md:p-2",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        aria-label="Sidebar navigation"
      >
        {/* Close button for mobile */}
        <div className="flex md:hidden justify-end mb-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-zinc-400 hover:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Close sidebar menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Logo at the top */}
        <div className="flex items-center mb-6 px-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="/assets/logo.png" alt="Justeatss Logo" className="w-10 h-10 rounded-full" />
            <span className="font-bold text-lg text-white hidden md:inline">Justeatss</span>
          </Link>
        </div>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
            <Button
              variant={pathname === item.href ? "default" : "ghost"}
              className={cn(
                "w-full justify-start text-left px-3 py-2 rounded-md text-sm font-medium",
                pathname === item.href
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:bg-zinc-700/50 hover:text-white",
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        ))}
      </nav>
    </>
  );
}