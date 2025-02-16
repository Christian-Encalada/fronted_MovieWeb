import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

export function PreferencesSettings() {
  const genres = [
    { id: "action", label: "Acción" },
    { id: "comedy", label: "Comedia" },
    { id: "drama", label: "Drama" },
    { id: "horror", label: "Terror" },
    { id: "scifi", label: "Ciencia Ficción" },
    { id: "romance", label: "Romance" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferencias</CardTitle>
        <CardDescription>
          Personaliza tus preferencias de películas y recomendaciones.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Géneros favoritos</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            {genres.map((genre) => (
              <div key={genre.id} className="flex items-center space-x-2">
                <Checkbox id={genre.id} />
                <Label htmlFor={genre.id}>{genre.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Opciones de recomendación</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="similar-movies">Películas similares</Label>
              <Switch id="similar-movies" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="popular-movies">Películas populares</Label>
              <Switch id="popular-movies" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-releases">Nuevos lanzamientos</Label>
              <Switch id="new-releases" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
