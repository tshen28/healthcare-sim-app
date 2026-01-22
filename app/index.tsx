import { useAuth } from "@/src/context/AuthContext";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (role === "admin") {
    return <Redirect href="/(admin)/dashboard" />;
  }

  if (role === "student") {
    return <Redirect href="/(student)/dashboard" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Please log in to continue.</Text>
    </View>
  );
}
