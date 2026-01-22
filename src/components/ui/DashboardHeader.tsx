import { useAuth } from "@/src/context/AuthContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

interface DashboardHeaderProps {
  title: string;
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/(auth)/login");
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutButtonPressed,
        ]}
        onPress={handleLogout}
      >
        <MaterialIcons name="logout" style={styles.logoutText} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 48,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
  },
  logoutButton: {
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  logoutButtonPressed: {
    backgroundColor: "#333",
    opacity: 0.8,
  },
  logoutText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
