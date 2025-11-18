import Constants from "expo-constants";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import "../global.css";

export default function RootLayout() {
  useEffect(() => {
  console.log('Env check:', {
    movieApiKey: Constants.expoConfig?.extra?.movieApiKey ? 'SET' : 'MISSING',
    appwriteProjectId: Constants.expoConfig?.extra?.appwriteEndpoint ? 'SET' : 'MISSING',
    appwriteDatabaseId: Constants.expoConfig?.extra?.firebaseApiKey ? 'SET' : 'MISSING',
    appwriteMetricsTableId: Constants.expoConfig?.extra?.firebaseApiKey ? 'SET' : 'MISSING',
    appwriteSavedTableId: Constants.expoConfig?.extra?.firebaseApiKey ? 'SET' : 'MISSING',
    firebaseEndpoint: Constants.expoConfig?.extra?.firebaseApiKey ? 'SET' : 'MISSING',
    
    firebaseApiKey: Constants.expoConfig?.extra?.movieApiKey ? 'SET' : 'MISSING',
    firebaseAuthDomain: Constants.expoConfig?.extra?.appwriteEndpoint ? 'SET' : 'MISSING',
    firebaseProjectId: Constants.expoConfig?.extra?.firebaseApiKey ? 'SET' : 'MISSING',
    firebaseStorageBucket: Constants.expoConfig?.extra?.firebaseApiKey ? 'SET' : 'MISSING',
    firebaseMessagingSenderId: Constants.expoConfig?.extra?.firebaseApiKey ? 'SET' : 'MISSING',
    firebaseAppId: Constants.expoConfig?.extra?.firebaseApiKey ? 'SET' : 'MISSING',
    firebaseMeasurementId: Constants.expoConfig?.extra?.firebaseApiKey ? 'SET' : 'MISSING',
  });
}, []);

  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen 
        name="(auth)"
        options={{headerShown: false}}
        />

        <Stack.Screen 
        name="(tabs)"
        options={{headerShown: false}}
        />

        <Stack.Screen 
        name="movies"
        options={{headerShown: false}}
        />
      </Stack>
    </>
  )
}
