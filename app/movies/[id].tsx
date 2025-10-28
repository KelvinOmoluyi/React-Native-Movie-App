import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ConfirmationModal from "@/components/ConfirmationModal";
import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import { checkMovieSaved, deleteSavedMovies, saveMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import React, { useEffect } from "react";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}


const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const[saved, setSaved] = React.useState<boolean | null>(false);
  const[showModal, setShowModal] = React.useState(false);

  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  const { data: movieSaved } = useFetch(() => checkMovieSaved(id.toString() as string));

  useEffect(() => {
    if (movieSaved !== undefined) {
      setSaved(movieSaved); // hydrate local state
    }
  }, [movieSaved]);


  const handleSaveMovie = async (movie: MovieDetails | null) => {
    if (movie && movie.id) {
      if(saved) {
        setShowModal(true)
      } else {
        const isSaved = await saveMovies(movie, movie.id.toString());
        if (isSaved) setSaved(true);
      }
    }
  }
  
  const toggleModal = () => {
    setShowModal((prev) => !prev)
  }

  const handleDeleteMovies = () => {
    const isDeleted = deleteSavedMovies(id as string);
    setSaved(false);
    setShowModal(false);
  }

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1" style={{ paddingBottom: Platform.OS === 'android' ? 80 : 40, position: "relative" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 150 : 80, zIndex: 2 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          <TouchableOpacity 
          onPress={()=>handleSaveMovie(movie)}
          className={`absolute bottom-5 right-5 rounded-full size-14 ${saved ? "bg-accent" : "bg-primary"} border-2 border-accent  flex items-center justify-center`}>
            <Image
              source={saved ? icons.saveWhite : icons.save}
              className="w-6 h-7 ml-1"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        style={{ bottom: Platform.OS === 'android' ? 50 : 20 }}
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
      <ConfirmationModal
        visible={showModal}
        title="Are you sure you want to unsave?"
        message="This movie will be removed from your saved movies."
        confirmText="Yes"
        cancelText="Cancel"
        onConfirm={handleDeleteMovies}
        onCancel={toggleModal}
        confirmButtonColor="bg-accent/30"
        cancelButtonColor="bg-accent"
      />
    </View>
  );
};

export default Details;
