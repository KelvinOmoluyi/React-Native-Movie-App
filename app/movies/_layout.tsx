import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen 
        name="[id]"
        options={{headerShown: false}}
        />
      </Stack>
    </>
  )
}
