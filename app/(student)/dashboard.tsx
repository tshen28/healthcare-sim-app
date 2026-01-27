//route: "/dashboard"
import DashboardHeader from "@/src/components/ui/DashboardHeader";
import SimulationCard from "@/src/components/ui/SimulationCard";
import { useAuth } from "@/src/context/AuthContext";
import { subscribeToSimulations } from "@/src/services/adminService";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StudentDashboard() {
  const { user, role, loading: authLoading } = useAuth();
  const currentUser = user;
  const currentRole = role;

  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to Firestore simulations
  useEffect(() => {
    const unsubscribe = subscribeToSimulations((sims) => {
      setSimulations(sims);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!currentUser) return null;
  if (authLoading) return null;
  if (currentRole !== "student") {
    return <Redirect href="/(auth)/login" />;
  }

  const studentSims = simulations.filter(
    (sim) => sim.assignedTo === "student" || sim.assignedTo === "all",
  );

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader title="Dashboard" />
      <Text style={styles.subtitle}>Simulations</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : !simulations || simulations.length === 0 ? (
          <Text>No simulations available.</Text>
        ) : (
          studentSims.map((sim) => (
            <SimulationCard
              key={sim.id}
              id={sim.id}
              title={sim.title}
              description={sim.description}
              assignedTo={sim.assignedTo}
              locked={sim.locked}
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
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 48,
    fontWeight: "700",
    marginTop: 48,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "black",
    marginBottom: 12,
    marginTop: 24,
  },
  scrollContainer: {
    paddingBottom: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 30,
    height: "100%",
  },
});
