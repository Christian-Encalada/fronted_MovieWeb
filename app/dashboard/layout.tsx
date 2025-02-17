import { redirect } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirigir a "Para ti" si estamos en la ruta /dashboard
  if (typeof window !== 'undefined' && window.location.pathname === '/dashboard') {
    redirect('/dashboard/for-you');
  }

  return (
    <div>
      <DashboardNav />
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}