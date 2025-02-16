import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificaciones</CardTitle>
        <CardDescription>
          Configura cómo y cuándo quieres recibir notificaciones.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Notificaciones por correo</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="new-recommendations">Nuevas recomendaciones</Label>
              <Switch id="new-recommendations" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="watchlist-updates">Actualizaciones de lista de seguimiento</Label>
              <Switch id="watchlist-updates" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="newsletter">Newsletter semanal</Label>
              <Switch id="newsletter" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Frecuencia de notificaciones</h4>
          <Select defaultValue="weekly">
            <SelectTrigger>
              <SelectValue placeholder="Selecciona la frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diaria</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
