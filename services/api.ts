import Constants from 'expo-constants';

const movieApiKey = Constants.expoConfig?.extra?.movieApiKey
const appwriteEndpoint = Constants.expoConfig?.extra?.appwriteEndpoint;  // Unused here, but kept

if (!movieApiKey) {
  console.warn('TMDB API key not loaded! Check app.config.js and env injection.');
}

export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  // No API_KEY needed in config since we're using Bearer
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${movieApiKey}`,
    'Accept': 'application/json'  // Ensures JSON response
  }
};

export const fetchPopularMovies = async ({ query }: { query?: string } = {}) => {
  console.log(movieApiKey)
  // Made query optional with default
  console.log('TMDB Key Loaded:', !!movieApiKey);  // Debug: Confirm key presence (don't log full key!)

  const searchParams = new URLSearchParams();
  if (query) {
    searchParams.append('query', query);
  } else {
    searchParams.append('sort_by', 'popularity.desc');
  }
  // Optional: Add defaults like language or page
  searchParams.append('language', 'en-US');
  searchParams.append('page', '1');

  const path = query ? '/search/movie' : '/discover/movie';
  const endpoint = `${TMDB_CONFIG.BASE_URL}${path}?${searchParams.toString()}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      const errorText = await response.text();  // TMDB sends JSON error details
      console.error('TMDB API Error Response:', errorText);
      throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (movieId: string): Promise<MovieDetails> => {
  if (!movieId) {
    throw new Error('Movie ID is required');
  }

  const searchParams = new URLSearchParams({
    language: 'en-US'  // Optional: Customize as needed
    // Do NOT add api_key here!
  });

  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?${searchParams.toString()}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TMDB Details Error Response:', errorText);
      throw new Error(`Failed to fetch movie details: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};