//route: "/dashboard"
import SimulationCard from "@/src/components/ui/SimulationCard";
import { useAuth } from "@/src/context/AuthContext";
import { simulations } from "@/src/data/simulations";
import { Redirect } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TEST_STUDENT_USER = {
  uid: "TEST_STUDENT_UID",
  email: "student@test.com",
  role: "student" as const,
};

export default function StudentDashboard() {
  const { user, role, loading: authLoading } = useAuth();
  const currentUser = user || TEST_STUDENT_USER;
  const currentRole = role || TEST_STUDENT_USER.role;

  if (!currentUser) return null;
  if (authLoading) return null;
  if (currentRole !== "student") {
    return <Redirect href="/(auth)/login" />;
  }

  const studentSims = simulations.filter(
    (sim) => sim.assignedTo === "student" || sim.assignedTo === "all"
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Simulations</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!simulations || simulations.length === 0 ? (
          <Text>No simulations available.</Text>
        ) : (
          studentSims.map((sim) => (
            <SimulationCard key={sim.id} id={sim.id} title={sim.title} description={sim.description} assignedTo={sim.assignedTo} locked={sim.locked}/>
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
  },
});
