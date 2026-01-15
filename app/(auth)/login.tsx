//route: "/login"
import { useAuth } from "@/src/context/AuthContext";
import { login } from "@/src/services/auth.service";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
  const { user, role, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Login screen - Auth state:', { user: !!user, role, authLoading });
    if (!authLoading && user && role) {
      console.log('Redirecting to dashboard for role:', role);
      if (role === "admin") {
        router.replace("/(admin)/dashboard");
      } else if (role === "student") {
        router.replace("/(student)/dashboard");
      }
    }
  }, [user, role, authLoading]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      // Navigation will happen via useEffect when auth state updates
    } catch (error: any) {
      Alert.alert("Login failed", error.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FontAwesome name="heartbeat" style={styles.icon} />
      <Text style={styles.title}>SIM APP</Text>
      
      <Text style={styles.subtitle}>Log in</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#666"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#666"
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
      </View>
      <Text style={styles.link}>New User? <Text style={styles.createLink} onPress={() => router.push('/(auth)/signup')}>Create an Account.</Text></Text>
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
    borderRadius: 30,
    color: "black",
    width: "60%",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 8,
    borderColor: "black",
    borderWidth: 2,
    width: '40%',
    marginBottom: 12,
  },
  buttonText: {
    padding: 2,
    fontWeight: 600,
    color: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 24,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    textAlign: "left",
    fontWeight: 600,
    marginBottom: 12,
  },
  icon: {
    fontSize: 48,
    color: "black",
    marginBottom: 24,
  },
  link: {
    marginTop: 24,
  },
  createLink: {
    color: "blue",
    textDecorationLine: "underline",
  }
});
