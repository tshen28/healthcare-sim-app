import { Stack } from "expo-router";
import { enableScreens } from "react-native-screens";

enableScreens(true);

export default function StudentLayout() {
    return (
        <Stack 
            screenOptions={{
                animation: "slide_from_right",
                gestureEnabled: true,
                headerShown: false,
                gestureDirection: "horizontal",
            }}
        />
    );
}