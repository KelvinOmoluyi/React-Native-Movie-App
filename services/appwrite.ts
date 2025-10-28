import Constants from 'expo-constants';
import { Client, Databases, ID, Query } from 'react-native-appwrite';

// track searches made by the users
const Database_ID = Constants.expoConfig?.extra?.appwriteDatabaseId!;
const Metrics_Table_ID = Constants.expoConfig?.extra?.appwriteMetricsTableId!;
const Saved_Table_ID = Constants.expoConfig?.extra?.appwriteSavedTableId!;
const Project_ID = Constants.expoConfig?.extra?.appwriteProjectId!;

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
    .setProject(Project_ID); // Your project ID

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
        console.log("Updating search count for query:", query);
        const result = await database.listDocuments(Database_ID, Metrics_Table_ID, [
            Query.equal('searchTerm', query)
        ]);

        if (result.documents.length > 0) {
            const existingMovie = result.documents[0];

            await database.updateDocument(Database_ID, Metrics_Table_ID, existingMovie.$id, {
                count: existingMovie.count + 1,
            });
        } else {
            await database.createDocument(Database_ID, Metrics_Table_ID, ID.unique(), {
                searchTerm: query,
                movie_id: movie?.id,
                title: movie?.title,
                count: 1,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            });
        }
    } catch (error) {
        console.error("Error updating search count:", error);
        throw error;
    }
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(Database_ID, Metrics_Table_ID, [
            Query.limit(10),
            Query.orderDesc('count')
        ]);
        return result.documents as unknown as TrendingMovie[];
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        throw error;
    }
}

export const saveMovies = async (movie: MovieDetails, movie_id: string) => {
  try {
    // First check if doc exists
    const result = await database.listDocuments(Database_ID, Saved_Table_ID, [
      Query.equal("movie_id", movie_id),
    ]);

    if (result.total === 0) {
      // Create new doc
      const created = await database.createDocument(Database_ID, Saved_Table_ID, "unique()", {
          movie_id,
          title: movie?.title,
          poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      });

      if (!created) {
        return false
      }

      return true
    } else if (result.total > 0) {
      return true
    }
  } catch (error) {
    console.error("Error in saveMovies:", error);
    throw error;
  }
};

export const getSavedMovies = async (): Promise<SavedMovie[] | undefined> => {
   try {
    // First check if doc exists
    const result = await database.listDocuments(Database_ID, Saved_Table_ID);

    console.log("Saved movies fetched succesfully:", result.documents.map(doc => doc.$id));
    return result.documents as unknown as SavedMovie[];

  } catch (error) {
    console.error("Error in getSaveMovies:", error);
    throw error;
  }
};

export const checkMovieSaved = async (movie_id: string): Promise<boolean> => {
   try {
    // First check if doc exists
    const result = await database.listDocuments(Database_ID, Saved_Table_ID, [
      Query.equal("movie_id", movie_id),
      Query.limit(1),
    ]);

    if (result.total > 0) {
      console.log("Movie is saved");
      return true;
    } else {
      return false
    }

  } catch (error) {
    console.error("Error in checkMovieSaved:", error);
    return false;
  }
};

export const deleteSavedMovies = async (movie_id: string): Promise<boolean> => {
   try {
    const response = await database.listDocuments(Database_ID, Saved_Table_ID, [
      Query.equal("movie_id", movie_id),
      Query.limit(1),
    ]);

    const targetDoc = response.documents[0]; // assuming only one match
    // First check if doc exist

    if (targetDoc) {
      await database.deleteDocument(Database_ID, Saved_Table_ID, targetDoc.$id);
      console.log('Movie deleted successfully');
    } else {
      console.log('No movie found with that movie_id');
    }

    return true

  } catch (error) {
    console.error("Error unsaving movies:", error);
    return false;
  }
};