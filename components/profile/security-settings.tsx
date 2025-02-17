'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserService } from "@/services/user.service";

export function SecuritySettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await UserService.updatePassword({
        current_password: formData.current_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password
      });

      toast({
        title: "Éxito",
        description: result.message || "Contraseña actualizada correctamente",
      });

      // Limpiar el formulario
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_password">Contraseña actual</Label>
              <Input
                id="current_password"
                type="password"
                value={formData.current_password}
                onChange={(e) => setFormData(prev => ({ ...prev, current_password: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password">Nueva contraseña</Label>
              <Input
                id="new_password"
                type="password"
                value={formData.new_password}
                onChange={(e) => setFormData(prev => ({ ...prev, new_password: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirmar nueva contraseña</Label>
              <Input
                id="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={(e) => setFormData(prev => ({ ...prev, confirm_password: e.target.value }))}
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Actualizando..." : "Cambiar contraseña"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
