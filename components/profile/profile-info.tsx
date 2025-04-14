'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export function ProfileInfo() {
  const { user } = useAuth();

  // Función para formatear la fecha consistentemente
  const formatDate = () => {
    const date = new Date();
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Memoizar la fecha para evitar re-renders
  const formattedDate = useState(formatDate())[0];

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Información Personal</CardTitle>
          <CardDescription>
            Gestiona tu información personal y cómo se muestra en la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="text-2xl">
                {user?.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1 text-center">
              <h3 className="text-2xl font-semibold">{user?.username}</h3>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="grid gap-4 pt-4 border-t">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Miembro desde
              </h4>
              <p className="text-base">
                {formattedDate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
