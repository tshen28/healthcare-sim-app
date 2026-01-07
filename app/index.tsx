//route: "/"
import { useAuth } from "@/src/context/AuthContext";
import { Redirect } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Healthcare Simulation App</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (role === "admin") {
    return <Redirect href="/(admin)/dashboard" />;
  }

  return <Redirect href="/(student)/dashboard" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "black",
  },
});
