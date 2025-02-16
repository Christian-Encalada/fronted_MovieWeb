'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export function SecuritySettings() {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    try {
      // Aquí iría la lógica para cambiar la contraseña
      toast({
        title: "Éxito",
        description: "Contraseña actualizada correctamente",
      });
      setShowPasswordChange(false);
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la contraseña",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seguridad</CardTitle>
        <CardDescription>
          Gestiona la seguridad de tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showPasswordChange ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-sm font-medium">Contraseña</h4>
                <p className="text-sm text-muted-foreground">
                  Cambia tu contraseña para mantener tu cuenta segura
                </p>
              </div>
              <Button onClick={() => setShowPasswordChange(true)}>
                Cambiar contraseña
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Contraseña actual</label>
              <Input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords(prev => ({
                  ...prev,
                  currentPassword: e.target.value
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Nueva contraseña</label>
              <Input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords(prev => ({
                  ...prev,
                  newPassword: e.target.value
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirmar nueva contraseña</label>
              <Input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords(prev => ({
                  ...prev,
                  confirmPassword: e.target.value
                }))}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit">Guardar cambios</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowPasswordChange(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
