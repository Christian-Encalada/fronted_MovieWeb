'use client';

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

export const FeaturedMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const moviesPerPage = 5;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          'https://api.themoviedb.org/3/movie/popular?api_key=3bed567a505e80a29720f85f0cebaadb&language=es-ES'
        );
        const data = await response.json();
        setMovies(data.results.slice(0, 15)); // Aumentamos a 15 películas
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + moviesPerPage >= movies.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, movies.length - moviesPerPage) : prevIndex - 1
    );
  };

  const visibleMovies = movies.slice(currentIndex, currentIndex + moviesPerPage);

  return (
    <div className="relative h-[400px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />
      
      <div className="container mx-auto relative z-20">
        <div className="flex items-center justify-center h-[400px]">
          {/* Botón Anterior */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 z-30 h-12 w-12 rounded-full bg-background/80 hover:bg-background/90 backdrop-blur-sm transition-all"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Películas */}
          <div className="flex gap-6 transition-all duration-500 ease-out">
            {visibleMovies.map((movie, index) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                index={index} 
              />
            ))}
          </div>

          {/* Botón Siguiente */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 z-30 h-12 w-12 rounded-full bg-background/80 hover:bg-background/90 backdrop-blur-sm transition-all"
            onClick={nextSlide}
            disabled={currentIndex + moviesPerPage >= movies.length}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Indicadores de página */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {Array.from({ length: Math.ceil(movies.length / moviesPerPage) }).map((_, idx) => (
            <button
              key={idx}
              className={`h-2 w-2 rounded-full transition-all ${
                idx === Math.floor(currentIndex / moviesPerPage)
                  ? "w-4 bg-primary"
                  : "bg-primary/30"
              }`}
              onClick={() => setCurrentIndex(idx * moviesPerPage)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MovieCard = ({ movie, index }: { movie: Movie; index: number }) => {
  const controls = useAnimation();

  const handleHover = async () => {
    await controls.start({
      scale: 1.1,
      y: -20,
      transition: { duration: 0.3 }
    });
  };

  const handleHoverEnd = async () => {
    await controls.start({
      scale: 1,
      y: 0,
      transition: { duration: 0.3 }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
    >
      <motion.div
        animate={controls}
        onHoverStart={handleHover}
        onHoverEnd={handleHoverEnd}
        className="relative w-48 h-72 rounded-lg overflow-hidden shadow-lg transform-gpu"
      >
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-0 left-0 right-0 p-4 text-white"
        >
          <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">★</span>
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}; 