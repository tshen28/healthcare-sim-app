//route: "/signup"
import RoleSelector from "@/src/components/ui/RoleSelector";
import { useAuth } from "@/src/context/AuthContext";
import { signup } from "@/src/services/auth.service";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"admin" | "student" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // Validation
    if (!role) {
      Alert.alert("Error", "Please select a role");
      return;
    }

    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Call our signup function from auth.service
      await signup(email, password, role);
      // AuthContext will detect the new user and fetch their role
      Alert.alert("Success", "Account created successfully!");
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Create an Account</Text>

          <RoleSelector role={role} onSelect={setRole} />

          <Text style={styles.label}>Name (Optional):</Text>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#666"
            autoCapitalize="words"
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
          />

          <Text style={styles.label}>Email:</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#666"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Confirm Password:</Text>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#666"
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <View style={styles.buttonRow}>
            <Pressable
              style={[
                styles.button,
                (!role || !email || !password || !confirmPassword || loading) &&
                  styles.disabledButton,
              ]}
              disabled={
                !role || !email || !password || !confirmPassword || loading
              }
              onPress={handleSignup}
            >
              <Text style={styles.buttonText}>
                {loading ? "Creating Account..." : "Create Account"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => router.push("/(auth)/login")}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 18,
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
    borderRadius: 30,
    height: 48,
    paddingHorizontal: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: "black",
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
    color: "white",
  },
  disabledButton: {
    opacity: 0.5,
  },
  cancelButton: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 8,
    borderColor: "black",
    borderWidth: 2,
  },
  cancelButtonText: {
    padding: 2,
    fontWeight: 500,
    color: "black",
  },
});
