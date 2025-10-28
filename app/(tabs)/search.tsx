//import liraries
import MoviesCard from '@/components/MoviesCard';
import SearchBar from '@/components/SearchBar';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { fetchPopularMovies } from '@/services/api';
import { updateSearchCount } from '@/services/appwrite';
import useFetch from '@/services/useFetch';
import { router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';

// create a component
const Search = () => {
    const [searchQuery, setSearchQuery] = React.useState('');

    // navigating on signout
    getAuth().onAuthStateChanged((user) => {
        if (!user) router.replace('/(auth)/login');
    })

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    }

    const { 
        data: movies, 
        loading, 
        error,
        refetch: loadMovies,
        reset } = useFetch(() => fetchPopularMovies({
        query: searchQuery,
    }), {autoFetch: false});

    useEffect(() => {

        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim()) {
                await loadMovies();
            } else {
                reset();
            }
        }, 500)

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    useEffect(() => {
        if (movies?.[0] && movies.length > 0) {
            setTimeout(() => {
                updateSearchCount(searchQuery, movies[0]);
            }, 1000);
        }
    }, [movies])

    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bg}
                className="flex-1 absolute w-full z-0"
                resizeMode="cover"
            />

            <FlatList
                className="px-5"
                data={movies as Movie[]}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MoviesCard {...item} />}
                numColumns={3}
                columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 16,
                marginVertical: 16,
                }}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent={
                <>
                    <View className="w-full flex-row justify-center mt-20 items-center">
                    <Image source={icons.logo} className="w-12 h-10" />
                    </View>

                    <View className="my-5">
                    <SearchBar
                        placeholder="Search for a movie"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    </View>

                    {loading && (
                    <ActivityIndicator
                        size="large"
                        color="#0000ff"
                        className="my-3"
                    />
                    )}

                    {error && (
                    <Text className="text-red-500 px-5 my-3">
                        Error: {error.message}
                    </Text>
                    )}

                    {!loading &&
                    !error &&
                    searchQuery.trim() &&
                    movies?.length! > 0 && (
                        <Text className="text-xl text-white font-bold">
                        Search Results for{" "}
                        <Text className="text-accent">{searchQuery}</Text>
                        </Text>
                    )}
                </>
                }
                ListEmptyComponent={
                !loading && !error ? (
                    <View className="mt-10 px-5">
                    <Text className="text-center text-gray-500">
                        {searchQuery.trim()
                        ? "No movies found"
                        : "Start typing to search for movies"}
                    </Text>
                    </View>
                ) : null
                }
            />
            </View>
    );
};

//make this component available to the app
export default Search;
