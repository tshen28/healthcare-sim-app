//route: "/login"
import { login } from "@/src/services/auth.service";
import FontAwesome from '@expo/vector-icons/FontAwesome';
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

const TEST_STUDENT_USER = {
  email: "student@test.com",
  password: "test1234",
  uid: "TEST_STUDENT_UID",
  role: "student" as const,
};

const TEST_ADMIN_USER = {
  email: "admin@test.com",
  password: "test1234",
  uid: "TEST_ADMIN_UID",
  role: "admin" as const,
}; 

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

      if (email === TEST_STUDENT_USER.email && password === TEST_STUDENT_USER.password) {
        router.replace("/(student)/dashboard");
        return;
      }
      if (email === TEST_ADMIN_USER.email && password === TEST_ADMIN_USER.password) {
        router.replace("/(admin)/dashboard");
        return;
      }

      await login(email, password);
      router.replace("/(student)/dashboard");
    } catch (error: any) {
      Alert.alert("Login failed", error.message)
    } finally {
      setLoading(false);
    }

    // try {
    //   setLoading(true);
    //   await login(email, password);
    //   router.replace("/");
    // } catch (error: any) {
    //   Alert.alert("Login failed", error.message);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FontAwesome name="heartbeat" style={styles.icon} />
      <Text style={styles.title}>SIM APP</Text>
      
      <Text style={styles.subtitle}>Log in</Text>
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

        {/* <Pressable
          style={styles.button}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.buttonText}>Signup</Text>
        </Pressable> */}
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
