'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ProfileInfo() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');

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

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Aquí iría la lógica para actualizar el nombre de usuario
      toast({
        title: "Éxito",
        description: "Nombre de usuario actualizado correctamente",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el nombre de usuario",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>
            Gestiona tu información personal y cómo se muestra en la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>{user?.username?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Cambiar nombre de usuario
              </Button>
            ) : (
              <form onSubmit={handleUsernameChange} className="flex space-x-2">
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Nuevo nombre de usuario"
                />
                <Button type="submit">Guardar</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </form>
            )}
          </div>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Nombre de usuario</h4>
              <p className="text-2xl">{user?.username}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Email</h4>
              <p className="text-2xl">{user?.email}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Miembro desde</h4>
              <p className="text-muted-foreground">
                {formattedDate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
