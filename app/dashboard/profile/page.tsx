'use client';

import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ProfileInfo } from "@/components/profile/profile-info";
import { SecuritySettings } from "@/components/profile/security-settings";
import { PreferencesSettings } from "@/components/profile/preferences-settings";
import { NotificationSettings } from "@/components/profile/notification-settings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User, Lock, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: "Información Personal", icon: User, component: ProfileInfo },
    { id: "security", label: "Seguridad", icon: Lock, component: SecuritySettings },
    { id: "preferences", label: "Preferencias (proximamente)", icon: Settings, component: PreferencesSettings },
    { id: "notifications", label: "Notificaciones (proximamente)", icon: Bell, component: NotificationSettings },
  ];

  const CurrentComponent = tabs.find(tab => tab.id === activeTab)?.component || ProfileInfo;

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ResizablePanelGroup direction="horizontal">
        {/* Panel de navegación */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
          <div className="flex h-full flex-col">
            <div className="p-6">
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
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Panel de contenido */}
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
