'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";

interface MovieCardProps {
  movie_id: number;
  title: string;
  poster_path: string;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export function MovieCard({ movie_id, title, poster_path, isFavorite = false, onFavoriteToggle }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);
  const { toast } = useToast();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (favorite) {
        await api.delete(`/favorites/${movie_id}`);
      } else {
        await api.post('/favorites', { movie_id });
      }
      setFavorite(!favorite);
      if (onFavoriteToggle) onFavoriteToggle();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar favoritos",
        variant: "destructive",
      });
    }
  };

  return (
    <Card 
      className="group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3]">
        <Image
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold truncate">{title}</h3>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavoriteClick}
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full",
            "bg-black/50 hover:bg-black/70 transition-colors",
            favorite ? "text-yellow-400" : "text-white"
          )}
        >
          <Star className="w-5 h-5" fill={favorite ? "currentColor" : "none"} />
        </motion.button>
      </div>
    </Card>
  );
} 