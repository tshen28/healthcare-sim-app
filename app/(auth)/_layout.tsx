import { Stack } from "expo-router";
import { KeyboardAvoidingView } from "react-native";
import { enableScreens } from "react-native-screens";

enableScreens(true);

export default function AdminLayout() {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: "fade",
          animationDuration: 400,
        }}
      />
    </KeyboardAvoidingView>
  );
}
