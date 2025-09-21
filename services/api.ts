export const TMDB_CONFIG = {
    BASE_URL : "https://api.themoviedb.org/3",
    API_KEY : process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    Headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}

export const fetchPopularMovies = async ({query}: {query: string}) => {
    const endpoint = query ?
    `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}` :
    `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.Headers,
    })

    if (!response.ok) {
        throw new Error('Failed to fetch movies', response.statusText);
    }

    const data = await response.json();
    return data.results;
}

// const url = 'https://api.themoviedb.org/3/authentication';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5M2IxYjM2NGI4YWY0YTkxZmIxMWI0NmFkMDNkOTI2NiIsIm5iZiI6MTc1ODQ4NjgxMC41OTYsInN1YiI6IjY4ZDA2MTFhNGE2YmU2NWJiY2NkNzg4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ntaxLzO_YltTxBYOHhhNftmPwaGDMDdhAAXQFGIwrIo'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));