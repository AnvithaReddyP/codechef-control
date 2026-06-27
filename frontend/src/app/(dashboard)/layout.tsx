import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gradient-to-br from-[var(--color-background)] to-[var(--color-surface-container-lowest)]">
          <div className="max-w-[1440px] mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
