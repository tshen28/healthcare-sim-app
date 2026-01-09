//route: "/dashboard"
import SimulationCard, { sampleSimulations } from "@/src/components/ui/SimulationCard";
import { useAuth } from "@/src/context/AuthContext";
import { Redirect } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TEST_STUDENT_USER = {
  uid: "TEST_STUDENT_UID",
  email: "student@test.com",
  role: "student" as const,
};

export default function StudentDashboard() {
  const { user, role, loading: authLoading } = useAuth();
  // const [simulations, setSimulations] = useState<any[]>(sampleSimulations || []);
  // const [loading, setLoading] = useState(true);

  const currentUser = user || TEST_STUDENT_USER;
  const currentRole = role || TEST_STUDENT_USER.role;
  const [simulations] = useState(sampleSimulations);
  // useEffect(() => {
  //   if (!currentUser) return;

  //   setSimulations(sampleSimulations);
  //   setLoading(false);

  //   // getStudentSimulations(user.uid)
  //   //   .then(setSimulations)
  //   //   .finally(() => setLoading(false));
  // }, [currentUser]);

  if (!currentUser) return null;
  if (authLoading) return null;
  if (currentRole !== "student") {
    return <Redirect href="/(auth)/login" />;
  }

  // if (loading) {
  //   return <Text>Loading simulations...</Text>;
  // }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Simulations</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!simulations || simulations.length === 0 ? (
          <Text>No simulations available.</Text>
        ) : (
          simulations.map((sim) => (
            <SimulationCard
              key={sim.id}
              title={sim.title}
              description={sim.description}
              locked={sim.locked}
              details={sim.details}
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
