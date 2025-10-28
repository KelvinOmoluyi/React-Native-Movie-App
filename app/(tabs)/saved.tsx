import SavedMovieCard from "@/components/SavedMovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { getSavedMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useFocusEffect } from '@react-navigation/native';
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Save = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  // navigating on signout
  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace('/(auth)/login');
  })

  const { data: movies, loading: moviesloading, error: moviesError } = useFetch(() => getSavedMovies(), {
    trigger: [refreshKey]
  });

  // This will run every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Trigger a refresh by updating the refresh key
      console.log('Screen focused - refreshing saved movies');
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  return (
    <SafeAreaView className="bg-primary flex-1">
      <Image source={images.bg} className="absolute w-full z-0" />

      <ScrollView 
      className="flex-1 px-5" 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {moviesloading? (
          <ActivityIndicator 
          size= 'large'
          color= '#0000FF'
          className= 'mt-10 self-center' /> 
        ) : moviesError ? (
          <Text>Error: movies error {moviesError?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            <>
              <Text className="text-lg text-white mt-3">Saved Movies</Text>

              <FlatList
              data={movies || []}
              renderItem={({item}) => (
                <SavedMovieCard {...item} />
              )}
              keyExtractor={(item) => item.id}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10
              }}
              className="mt-2 pb-32"
              contentContainerStyle={{ paddingBottom: 100 }}
              scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Save;
