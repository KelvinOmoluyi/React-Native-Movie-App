//import liraries
import { auth } from '@/firebaseConfig';
import { router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// create a component
const Profile = () => {

  // navigating on signout
  getAuth().onAuthStateChanged((user) => {
    if (!user) router.replace('/(auth)/login');
  })

  const handleLogout = () => {
    auth.signOut().then(() => router.replace('/(auth)/login'))
  }

    return (
    <SafeAreaView className="bg-primary flex-1 px-10">
      <View className="flex justify-center items-center flex-1 flex-col gap-5">
      <Text className='text-white font-semibold text-base'>
      </Text>
        <TouchableOpacity
            className="w-full bg-accent rounded-lg py-5 flex flex-row items-center justify-center mt-4"
            onPress={handleLogout}
          >
              <Text className="text-white font-semibold text-base">Log out</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
    );
};

//make this component available to the app
export default Profile;
