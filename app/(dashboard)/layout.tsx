import { FilterBar } from "@/components/dashboard/filter-bar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardProvider } from "@/components/providers/dashboard-provider";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-[color:var(--bg)]">
        <div className="mx-auto flex min-h-screen max-w-[1880px]">
          <Sidebar />
          <div className="min-w-0 flex-1">
            <FilterBar />
            <MobileNav />
            <main className="px-6 py-6 md:px-8 md:py-8 lg:px-10">{children}</main>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
