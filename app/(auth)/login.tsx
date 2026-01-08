//route: "/login"
import { login } from "@/src/services/auth.service";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>LOGIN</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="black"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="black"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonRow}>
        <Pressable
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.buttonText}>Signup</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "white",
    alignItems: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: "black",
    padding: 12,
    marginBottom: 14,
    borderRadius: 12,
    color: "black",
    width: "60%",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 8,
    borderColor: "black",
    borderWidth: 2,
  },
  buttonText: {
    padding: 2,
    fontWeight: 500,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 24,
    textAlign: "center",
  },
});
