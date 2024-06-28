import { API_ACCESS_TOKEN } from '@env';

export const fetchMovieById = async (movieId: string) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_ACCESS_TOKEN}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movie');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie by ID:', error);
    throw error;
  }
};
