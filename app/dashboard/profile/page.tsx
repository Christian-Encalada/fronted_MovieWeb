'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ProfileInfo } from "@/components/profile/profile-info";
import { SecuritySettings } from "@/components/profile/security-settings";
import { PreferencesSettings } from "@/components/profile/preferences-settings";
import { NotificationSettings } from "@/components/profile/notification-settings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User, Lock, Settings, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info");
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const tabs = [
    { id: "info", label: "Información Personal", icon: User, component: ProfileInfo },
    { id: "security", label: "Seguridad", icon: Lock, component: SecuritySettings },
    { id: "preferences", label: "Preferencias (proximamente)", icon: Settings, component: PreferencesSettings },
    { id: "notifications", label: "Notificaciones (proximamente)", icon: Bell, component: NotificationSettings },
  ];

  const CurrentComponent = tabs.find(tab => tab.id === activeTab)?.component || ProfileInfo;

  const NavigationContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-6">
        <h2 className="text-lg font-semibold">Configuración de Perfil</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Gestiona tu cuenta y preferencias
        </p>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  activeTab === tab.id && "bg-secondary"
                )}
                onClick={() => {
                  setActiveTab(tab.id);
                }}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen pb-16">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-lg font-semibold">Perfil</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[280px] p-0">
              <NavigationContent />
            </SheetContent>
          </Sheet>
        </div>
        <div className="p-4">
          <CurrentComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
          <NavigationContent />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <ScrollArea className="h-full">
            <div className="p-6">
              <CurrentComponent />
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
