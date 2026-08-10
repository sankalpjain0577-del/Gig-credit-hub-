import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <MobileNav />
        <main className="max-w-[1400px] mx-auto px-5 sm:px-8 py-8 pb-28 lg:pb-10">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-white/45 mt-1.5">{subtitle}</p>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
