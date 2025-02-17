import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { MovieCardProps } from './movie-card.types';
import { UserService } from '../../services/user.service';

const MovieCard = ({ movie }: MovieCardProps) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        checkIsFavorite();
    }, [movie.movie_id]);

    const checkIsFavorite = async () => {
        try {
            const result = await UserService.checkFavorite(movie.movie_id);
            setIsFavorite(result);
        } catch (error) {
            console.error('Error checking favorite:', error);
            setIsFavorite(false);
        }
    };

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                await UserService.removeFromFavorites(movie.movie_id);
            } else {
                await UserService.addToFavorites(movie.movie_id);
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast({
                title: "Error",
                description: "No se pudo actualizar favoritos",
                variant: "destructive"
            });
        }
    };

    return (
        // ... resto del componente
    );
};

export default MovieCard; 