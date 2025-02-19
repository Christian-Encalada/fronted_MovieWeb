'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { ProfileInfo } from "@/components/profile/profile-info";
import { SecuritySettings } from "@/components/profile/security-settings";
import { PreferencesSettings } from "@/components/profile/preferences-settings";
import { NotificationSettings } from "@/components/profile/notification-settings";
import { User, Lock, Settings, Bell, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const tabs = [
    { id: "info", label: "Información Personal", icon: User, component: ProfileInfo },
    { id: "security", label: "Seguridad", icon: Lock, component: SecuritySettings },
    { id: "preferences", label: "Preferencias", icon: Settings, component: PreferencesSettings },
    { id: "notifications", label: "Notificaciones", icon: Bell, component: NotificationSettings },
  ];

  const CurrentComponent = tabs.find(tab => tab.id === activeTab)?.component || ProfileInfo;

  return (
    <div className="min-h-screen bg-background">
      {/* Navegación móvil - Ahora fija en la parte superior */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-50 bg-background border-b">
        <div className="flex overflow-x-auto py-2 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                className={cn(
                  "flex-shrink-0 mr-2",
                  activeTab === tab.id && "bg-secondary"
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Navegación para desktop */}
      <div className="hidden md:block fixed left-0 w-64 h-[calc(100vh-4rem)] border-r bg-card/50 backdrop-blur-sm">
        <div className="py-4">
          <div className="px-4 py-2">
            <h2 className="text-lg font-semibold">Configuración</h2>
            <p className="text-sm text-muted-foreground">
              Gestiona tu cuenta
            </p>
          </div>
          <div className="mt-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2 px-4",
                    activeTab === tab.id && "bg-secondary"
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenido principal - Ajustado el padding superior para móvil */}
      <div className="md:pl-64">
        <div className="container mx-auto p-4 max-w-4xl md:pt-4 pt-16">
          <CurrentComponent />
        </div>
      </div>
    </div>
  );
}
