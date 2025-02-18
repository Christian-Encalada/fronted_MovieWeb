import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function POST(req: Request) {
  try {
    const { analysis } = await req.json();
    
    // Validación de la API key
    if (!TMDB_API_KEY) {
      throw new Error('TMDB_API_KEY no está configurada');
    }

    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'es-ES',
      include_adult: 'false',
      page: '1'
    });

    // Agregar parámetros opcionales si existen
    if (analysis?.genres?.length) {
      params.append('with_genres', analysis.genres.join(','));
    }
    if (analysis?.keywords?.length) {
      params.append('with_keywords', analysis.keywords.join(','));
    }
    if (analysis?.year) {
      params.append('year', analysis.year.toString());
    }

    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Error en TMDB: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      results: [],
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
} 