//route: "/signup"
import RoleSelector from "@/src/components/ui/RoleSelector";
import { signup } from "@/src/services/auth.service";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "student" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!role) {
      Alert.alert("Signup failed", "Please select a role");
      return;
    }

    setLoading(true);

    try {
      await signup(role, email, password);
      if (role === "admin") {
        router.replace("/(admin)/dashboard");
      }
      if (role === "student") {
        router.replace("/(student)/dashboard");
      }
    } catch (error: any) {
      Alert.alert("Signup failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
      >
        <Text style={styles.title}>SIGNUP</Text>

        <RoleSelector role={role} onSelect={setRole} />

        <Text style={styles.label}>Email:</Text>
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password:</Text>
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.button, (!role || !email || !password || loading) && styles.disabledButton]}
            disabled={!role || !email || !password || loading}
            onPress={handleSignup}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 24,
    textAlign: "left",
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
    color: "black",
  },
  input: {
    borderWidth: 2,
    borderColor: "black",
    padding: 12,
    marginBottom: 14,
    borderRadius: 12,
    color: "black",
    height: 48,
    paddingHorizontal: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    justifyContent: "flex-end"
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
  disabledButton: {
    opacity: 0.5,
  },
});
