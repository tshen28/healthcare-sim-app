//route: "/dashboard"
import SimulationCard from "@/src/components/ui/SimulationCard";
import { useAuth } from "@/src/context/AuthContext";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getStudentSimulations } from "./service";

export default function StudentDashboard() {
  const { user, role, loading: authLoading } = useAuth();
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    getStudentSimulations(user.uid)
      .then(setSimulations)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;
  if (authLoading) return null;
  if (role !== "student") {
    return <Redirect href='/(auth)/login' />;
  }

  if (loading) {
    return <Text>Loading simulations...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Simulations</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : simulations.length === 0 ? (
          <Text>No simulations available.</Text>
        ) : (
          simulations.map((sim) => (
            <SimulationCard
              key={sim.id}
              title={sim.title}
              description={sim.description}
              locked={sim.locked}
              onPress={() => console.log("Clicked simulation:", sim.id)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "grey",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "green",
    marginBottom: 12,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});
