export default {
  expo: {
    name: 'MovieFlix',
    slug: 'mobile_movie_app',
    version: '1.0.0',
    updates: {
      url: "https://u.expo.dev/01c82d8a-30d1-4a62-8a63-b9afbc6b215a",
      checkAutomatically: "NEVER"
    },
    runtimeVersion: {
      policy: "appVersion"
    },
    orientation: 'portrait',
    icon: './assets/images/logo.png',
    scheme: 'mobilemovieapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.kaylordtech.movieflix'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/logo.png',
        backgroundColor: '#ffffff'
      },
      edgeToEdgeEnabled: true,
      package: 'com.kaylordtech.movieflix'
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/logo.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff'
        }
      ],
      'expo-web-browser',
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: '01c82d8a-30d1-4a62-8a63-b9afbc6b215a'
      },
      movieApiKey: process.env.MOVIE_API_KEY,
      appwriteProjectId: process.env.APPWRITE_PROJECT_ID,
      appwriteDatabaseId: process.env.APPWRITE_DATABASE_ID,
      appwriteMetricsTableId: process.env.APPWRITE_METRICS_TABLE_ID,
      appwriteSavedTableId: process.env.APPWRITE_SAVED_TABLE_ID,
      appwriteEndpoint: process.env.APPWRITE_ENDPOINT,
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
    }
  }
};