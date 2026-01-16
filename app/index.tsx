//route: "/"
import { useAuth } from "@/src/context/AuthContext";
import { Redirect } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user, role, loading } = useAuth();

  // Step 1: Show loading screen while checking auth state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.text}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Step 2: If no user is logged in, send them to login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Step 3: User is logged in - redirect based on their role
  if (role === "admin") {
    return <Redirect href="/(admin)/dashboard" />;
  }

  // Default to student dashboard
  return <Redirect href="/(student)/dashboard" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
