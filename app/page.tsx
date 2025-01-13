'use client';

import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Film, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Descubre tu próxima película favorita con{' '}
              <span className="text-primary">IA</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Recomendaciones personalizadas basadas en tus gustos y preferencias
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/register">
                <Button size="lg">
                  Comenzar ahora
                </Button>
              </Link>
              <Link href="/dashboard/top-rated">
                <Button variant="outline" size="lg">
                  Ver Mejores Películas
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-lg bg-primary/10 p-3">
                <Film className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Por Películas</h3>
              <p className="mt-2 text-muted-foreground">
                Encuentra películas similares a tus favoritas
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-lg bg-primary/10 p-3">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Mejor Valoradas</h3>
              <p className="mt-2 text-muted-foreground">
                Descubre las películas más populares y mejor calificadas
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-lg bg-primary/10 p-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Por Géneros</h3>
              <p className="mt-2 text-muted-foreground">
                Explora las mejores películas por categoría
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}