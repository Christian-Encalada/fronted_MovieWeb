import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const SYSTEM_PROMPT = `Eres un experto en cine amigable y entusiasta. Al recomendar películas, sigue EXACTAMENTE este formato:

🎬 RECOMENDACIONES PERSONALIZADAS 🎬
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Saludo personalizado basado en la solicitud del usuario]

PELÍCULA #1
━━━━━━━━━
📽️ TÍTULO: [NOMBRE DE LA PELÍCULA] ([AÑO])
🎭 Género: [Géneros separados por comas]
📖 Sinopsis: [Breve descripción en 2-3 líneas]
💫 Por qué verla: [Razones específicas por las que coincide con la solicitud]
🎨 Director: [Nombre del director]
⭐ Calificación: [Puntuación]/10
🏆 Reconocimientos: [Si aplica]

PELÍCULA #2
━━━━━━━━━
[Mismo formato que arriba]

PELÍCULA #3
━━━━━━━━━
[Mismo formato que arriba]

💡 SUGERENCIA FINAL
━━━━━━━━━━━━━━━
[Breve conclusión personal y consejo sobre cómo disfrutar mejor estas películas]

¿Te gustaría que te recomiende más películas similares? 😊`;

// Definir la interfaz para el género
interface Genre {
  id: number;
  name: string;
}

// Definir la interfaz para los detalles de la película
interface MovieDetails {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string | null;
  vote_average: number;
  genres: Genre[];
  release_date: string;
}

async function searchMovieInTMDB(title: string) {
  try {
    // Primero buscamos la película
    const searchResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=es-ES`
    );
    
    if (!searchResponse.ok) return null;
    
    const searchData = await searchResponse.json();
    const movie = searchData.results[0];
    
    if (!movie) return null;

    // Luego obtenemos los detalles completos de la película
    const detailsResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=es-ES`
    );

    if (!detailsResponse.ok) return null;

    const movieDetails = await detailsResponse.json();

    // Adaptamos la estructura para que coincida con nuestra interfaz Movie
    const formattedMovie = {
      movie_id: movieDetails.id,
      title: movieDetails.title,
      poster_path: movieDetails.poster_path,
      overview: movieDetails.overview,
      vote_average: movieDetails.vote_average,
      genres: movieDetails.genres.map((g: Genre) => g.name).join('|'),
      release_date: movieDetails.release_date
    };

    return formattedMovie;
  } catch (error) {
    console.error('Error buscando en TMDB:', error);
    return null;
  }
}

async function extractAndEnrichMovies(content: string) {
  // Buscar títulos de películas en el formato "TÍTULO: [nombre] ([año])"
  const movieRegex = /TÍTULO:\s*([^(]+)\s*\((\d{4})\)/g;
  const movies = [];
  let match;

  while ((match = movieRegex.exec(content)) !== null) {
    const title = match[1].trim();
    const year = match[2];
    
    // Buscar la película en TMDB
    const tmdbMovie = await searchMovieInTMDB(title);
    
    if (tmdbMovie) {
      movies.push(tmdbMovie);
    }
  }

  return movies;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content;
    
    console.log('Mensaje del usuario:', userMessage);

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY no está configurada');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Movie Recommendations App'
      },
      body: JSON.stringify({
        model: "google/gemini-pro",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de OpenRouter:', errorData);
      throw new Error('Error al comunicarse con el servicio de chat');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Buscar las películas mencionadas en TMDB
    const movies = await extractAndEnrichMovies(content);

    return NextResponse.json({
      messages: [
        {
          role: 'assistant',
          content,
          movies // Incluimos la información de TMDB
        }
      ]
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      messages: [
        {
          role: 'assistant',
          content: 'Lo siento, tuve un problema al procesar tu solicitud. ¿Podrías intentarlo de nuevo?'
        }
      ]
    });
  }
}

function analyzeResponse(content: string) {
  // Función simple para extraer información relevante del texto
  const genres = extractGenres(content);
  const keywords = extractKeywords(content);
  const year = extractYear(content);

  return {
    genres,
    keywords,
    year
  };
}

function extractGenres(text: string) {
  const commonGenres = [
    'acción', 'aventura', 'comedia', 'drama', 'ciencia ficción',
    'terror', 'romántico', 'documental', 'animación', 'thriller'
  ];
  
  return commonGenres.filter(genre => 
    text.toLowerCase().includes(genre.toLowerCase())
  );
}

function extractKeywords(text: string) {
  // Extraer palabras clave relevantes del texto
  const words = text.toLowerCase().split(/\W+/);
  const stopWords = ['el', 'la', 'los', 'las', 'un', 'una', 'y', 'o', 'pero', 'si'];
  
  return words
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 5); // Limitamos a 5 palabras clave
}

function extractYear(text: string) {
  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? parseInt(yearMatch[0]) : null;
} 