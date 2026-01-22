import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";

enableScreens(true);

export default function AuthLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          gestureEnabled: true,
          headerShown: false,
          gestureDirection: "horizontal",
        }}
      />
    </GestureHandlerRootView>
  );
}
