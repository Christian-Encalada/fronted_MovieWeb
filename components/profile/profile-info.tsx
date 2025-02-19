'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserService } from "@/services/user.service";

export function ProfileInfo() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await UserService.updateProfile(formData);
      updateUser(response.data);
      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada exitosamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Error al actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Información Personal</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Gestiona tu información personal y cómo se muestra en la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Avatar className="h-20 w-20 md:h-24 md:w-24">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>{user?.username?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Nombre de usuario</h4>
                <p className="text-xl md:text-2xl">{user?.username}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Email</h4>
                <p className="text-xl md:text-2xl break-all">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium text-sm">Miembro desde</h4>
            <p className="text-muted-foreground mt-1">
              {formattedDate}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Editar Información</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Actualiza tu información personal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Tu nombre de usuario"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="tu@email.com"
                  className="w-full"
                />
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
              {isLoading ? "Actualizando..." : "Guardar cambios"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
