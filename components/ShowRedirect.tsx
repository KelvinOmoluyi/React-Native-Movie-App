import { makeRedirectUri } from "expo-auth-session";
import { Text } from "react-native";

export default function ShowRedirect() {
  const redirectUri = makeRedirectUri({
    scheme: "mobilemovieapp",   // must match app.json → "scheme"
  });

  return (
  <Text className="text-white text-sm font-bold"> {redirectUri} Hello</Text>
  );
}