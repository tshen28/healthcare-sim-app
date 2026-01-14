//route: "/admin/dashboard"
import SimulationCard from "@/src/components/ui/SimulationCard";
import { useAuth } from "@/src/context/AuthContext";
import { simulations } from "@/src/data/simulations";
import { Redirect } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TEST_ADMIN_USER = {
  email: "admin@test.com",
  password: "test1234",
  uid: "TEST_ADMIN_UID",
  role: "admin" as const,
};

export default function AdminLayout() {
  const { user, role, loading: authLoading } = useAuth();
  const currentUser = user || TEST_ADMIN_USER;
  const currentRole = role || TEST_ADMIN_USER.role;

  if (!currentUser) return null;
  if (authLoading) return null;
  if (currentRole !== "admin") {
    return <Redirect href="/(auth)/login" />;
  }

  const adminSims = simulations.filter(
    (sim) => sim.assignedTo === "admin" || sim.assignedTo === "all"
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Simulations</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!simulations || simulations.length === 0 ? (
          <Text>No simulations available.</Text>
        ) : (
          adminSims.map((sim) => (
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
    backgroundColor: "pink",
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "500",
    color: "green",
    marginBottom: 12,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});
