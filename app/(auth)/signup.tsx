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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React from 'react';
import { Image, Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const Signup = () => {
  const [inputObj, setInputObj] = React.useState({
    email: '',
    password: '',
    confirmPassword: ''
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
    
    if (!inputObj.password.trim() || !inputObj.confirmPassword.trim()) {
      setError("invalid password")
      return false;
    }
    
    if (inputObj.password.trim() !== inputObj.confirmPassword.trim()) {
      setError("Password doesn't match")
      return false;
    }

    return true
  }

  const handleSignUp = async () => {
    if (!validateForm()) {
      setLoading(false)
      return;
    }
    setLoading(true);
    setError("") // Clear previous errors

    try {
      const user = await createUserWithEmailAndPassword(auth, inputObj.email, inputObj.password);
      if (user) router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
      console.log('sign up failed: ' + error.message);
      
      // Show user-friendly error messages
      if (error.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please try logging in instead.")
      } else if (error.code === 'auth/invalid-email') {
        setError("Please enter a valid email address.")
      } else if (error.code === 'auth/weak-password') {
        setError("Password is too weak. Please choose a stronger password.")
      } else if (error.code === 'auth/too-many-requests') {
        setError("Too many failed attempts. Please try again later.")
      } else if (error.code === 'auth/network-request-failed') {
        setError("Network error. Please check your connection.")
      } else {
        setError("Sign up failed. Please try again.")
      }
    } finally {
      setLoading(false);
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

  const handleTextChange = (field: 'email' | 'password' | 'confirmPassword', text: string) => {
    setInputObj((prev) => ({
      ...prev,
      [field]: text,
    }));
  };

  return (
    <TouchableWithoutFeedback 
    onPress={Keyboard.dismiss} >
      <View 
      style={styles.container}
      className='bg-primary' >
        <Image source={images.bg} className="absolute w-full z-0" />
          <View style={styles.topContent}>
              <Image style={styles.logo} source={icons.logo} />
              <Text style={{color: "white", fontSize: 35, lineHeight: 50, letterSpacing: -1, marginTop: 20 }}>Welcome!</Text>
          </View>

          <View style={styles.mainContent}>
            <View style={styles.inputContainer}>
              <View className='flex-col gap-y-3'>
                <FormInput placeho='Email' onTextChange={(text) => handleTextChange('email', text)} type={'email-address'} value={inputObj.email}  />
                <PasswordInput placeho='Password' value={inputObj.password} onTextChange={(text) => handleTextChange('password', text)} />
                <PasswordInput placeho='Confirm your password' value={inputObj.confirmPassword} onTextChange={(text) => handleTextChange('confirmPassword', text)} />
                <Text className='text-red-500 font-semibold text-base'>{error}</Text>
              </View>

              {/* Buttons */}
              <View className='flex-col gap-y-3'>
              <TouchableOpacity
              className={`w-full ${loading ? "bg-slate-600" : "bg-accent"} rounded-lg py-5 flex flex-row items-center justify-center`}
              onPress={handleSignUp}>
                <Text className="text-white font-semibold text-base">{loading ? "Loading..." : "Sign up"}</Text>
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
            <Text className='text-lg text-gray-300 font-bold'>Have an accounted?</Text>
            <Text className='text-lg text-accent font-bold'>login.</Text>
          </TouchableOpacity>
        </View>
      </View>
        
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    rowGap: 32,
    paddingTop: 100,
    fontFamily: "Inter-Medium",
  },
  text: {
    fontSize: 40,
    color: "white",
    textAlign: "center",
    lineHeight: 49,
    fontFamily: "Inter-ExtraBold"
  },
  topContent: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingInline: 32,
  },
  logo: {
    width: 41,
    height: 41,
  },
  mainContent: {
    width: "100%",
    height: "64%",
    paddingHorizontal: 32
  },
  inputContainer: {
    marginTop: 12,
    width: "100%",
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    rowGap: 10,
  }
});

export default Signup