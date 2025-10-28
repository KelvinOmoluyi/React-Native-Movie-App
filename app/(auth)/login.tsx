import FormInput from '@/components/FormInput';
import PasswordInput from '@/components/PasswordInput';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { auth } from '@/firebaseConfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { router } from 'expo-router';
import * as WebBrowser from "expo-web-browser";
import { signInWithEmailAndPassword } from 'firebase/auth';
import React from 'react';
import { Image, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const [inputObj, setInputObj] = React.useState({
    email: '',
    password: '',
  });
  const [userInfo, setUserInfo] = React.useState(null)
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const validateForm = () => {
    if (!inputObj.email.trim()) {
      setError("invalid email address")
      return false;
    }
    
    if (!inputObj.email.includes('@')) {
      setError("invalid email address")
      return false;
    }
    
    if (!inputObj.password.trim()) {
      setError("invalid password")
      return false;
    }

    return true
  }

  const signIn = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true)
    setError("") // Clear previous errors
    try {
      const user = await signInWithEmailAndPassword(auth, inputObj.email, inputObj.password);
      if (user) router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
      console.log('sign in failed: ' + error.message);
      
      // Show user-friendly error messages
      if (error.code === 'auth/invalid-credential') {
        setError("Login failed. Invalid email or password.")
      } else if (error.code === 'auth/user-not-found') {
        setError("No account found with this email address.")
      } else if (error.code === 'auth/wrong-password') {
        setError("Incorrect password. Please try again.")
      } else if (error.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please try logging in instead.")
      } else if (error.code === 'auth/too-many-requests') {
        setError("Too many failed attempts. Please try again later.")
      } else if (error.code === 'auth/network-request-failed') {
        setError("Network error. Please check your connection.")
      } else {
        setError("Login failed. Please try again.")
      }
    } finally {
      setLoading(false);
    }
  }

  const signUp = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const user = await signInWithEmailAndPassword(auth, inputObj.email, inputObj.password);
      if (user) router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
      console.log('sign in failed: ' + error.message);
    }
  }

  const redirectUri = makeRedirectUri({ scheme: 'mymovieapp' });

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "937381050543-4stolofqj0dlc4a67feo06jsvjgm56b2.apps.googleusercontent.com",
    androidClientId: "937381050543-4f6dl7u7t8dakuevi2prh5g51bkcjqdp.apps.googleusercontent.com",
    iosClientId: "937381050543-8ri74040c8ja72kqp97kshkmi86ev2ks.apps.googleusercontent.com",
    
    scopes: ['profile', 'email', 'openid'], // Requested permissionsscopes: ['openid', 'email', 'profile'],
  })

  React.useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

  async function handleSignInWithGoogle() {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success") {
        await getUserInfo(response.authentication?.accessToken)
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  }

  const getUserInfo = async (token: string | undefined) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };

  const handleTextChange = (field: 'email' | 'password', text: string) => {
    setInputObj((prev) => ({
      ...prev,
      [field]: text,
    }));
  };  


  return (
    <TouchableWithoutFeedback 
    className='flex-1'
    onPress={Keyboard.dismiss} 
    >
      <View 
      className='h-full flex flex-col gap-8 pt-24 bg-primary' >
        <Image source={images.bg} className="absolute w-full z-0" />
        <View className="w-full flex-col justify-center items-center px-8">
            <Image className="w-10 h-10" source={icons.logo} />
            <Text className="text-white text-4xl leading-12 tracking-tight mt-5">Welcome Back!</Text>
        </View>

        <View className="w-full h-full px-8">
          <View className="mt-3 pb-30 w-full flex-col" style={{rowGap: 170}}>
            <View className='w-fit flex-col gap-y-3'>
              <FormInput placeho='Email' 
              onTextChange={(text) => handleTextChange('email', text)} 
              type={'email-address'} value={inputObj.email} 
               />
              <PasswordInput 
              placeho='Password' 
              value={inputObj.password} 
              onTextChange={(text) => handleTextChange('password', text)} 
              /> 
                <Text className='text-red-500 font-semibold text-base mt-2'>{error}</Text>
            </View>

            {/* Buttons */}
            <View className='flex-col gap-y-3'> 
              <TouchableOpacity
              className={`w-full ${loading ? "bg-slate-600" : "bg-accent"} rounded-lg py-5 flex flex-row items-center justify-center`}
              onPress={signIn}>
                <Text className="text-white font-semibold text-base">{loading ? "Loading..." : "Log in"}</Text>
              </TouchableOpacity>  

              <TouchableOpacity
              className="w-full bg-white rounded-lg py-5 flex flex-row items-center justify-center"
              onPress={() => promptAsync()}>
                <Image
                height={20}
                width={20}
                source={icons.googleLogo}
                className="size-5 mr-2 mt-0.5"
                />
                <Text className="text-black font-semibold text-base">Log in with Google!</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}  
          className='w-full text-center flex-row items-center mt-5 justify-center gap-x-2'>
            <Text className='text-lg text-gray-300 font-bold'>Don't have an accounted?</Text>
            <Text className='text-lg text-accent font-bold'>signup.</Text>
          </TouchableOpacity>
        </View>
        <View className='bg-[#483a6b]'></View>
      </View>
    </TouchableWithoutFeedback>
  )
}


export default Login