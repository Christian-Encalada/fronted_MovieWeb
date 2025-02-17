'use client';

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MovieCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Imagen */}
      <Skeleton className="aspect-[2/3] w-full" />
      <CardContent className="p-4">
        {/* Título */}
        <Skeleton className="h-6 w-3/4 mb-2" />
        {/* Géneros */}
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        {/* Rating */}
        <Skeleton className="h-4 w-16" />
        {/* Botón de favorito */}
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardFooter>
    </Card>
  );
} 