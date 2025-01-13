import { DashboardNav } from '@/components/dashboard-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <DashboardNav />
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}