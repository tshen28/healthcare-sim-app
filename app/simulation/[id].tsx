import { simulations } from "@/src/data/simulations";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface Props {
  role: "admin" | "student";
}

export default function SimulationDetails({ role }: Props) {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const simulation = simulations.find((s) => s.id === id);

  if (!simulation) {
    return (
      <View style={styles.blank}>
        <Text>Simulation not found.</Text>
      </View>
    );
  }

  const getDashboardForRole = () => {
    switch (role) {
      case "admin":
        return "/(admin)/dashboard";
      case "student":
        return "/(student)/dashboard";
    }
  };

  const handleReturn = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(getDashboardForRole());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{simulation.title}</Text>
      <ScrollView>
        <Section label="CBC" value={simulation.cbc} />
        <Section label="CMP" value={simulation.cmp} />
        <Section label="EKG" value={simulation.ekg} />
        <Section label="X-Ray" value={simulation.xr} />
        <Section label="CT Scan" value={simulation.ct} />
        <Section label="Blood Gas" value={simulation.bloodGas} />
        <Section label="Ultrasound" value={simulation.ultrasound} />
      </ScrollView>
      <Pressable style={styles.returnButton} onPress={handleReturn}>
        <Ionicons name="return-down-back" size={36} />
      </Pressable>
    </View>
  );
}

function Section({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "Not available"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  section: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 64,
    marginBottom: 24,
    textDecorationLine: "underline",
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
    color: "black",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  value: {
    color: "black",
  },
  blank: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  returnButton: {
    position: "absolute",
    bottom: 28,
    right: 28,
    width: 56,
    height: 56,
    borderRadius: 30,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
});
