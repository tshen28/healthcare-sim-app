//route: "/admin/dashboard"
import DashboardHeader from "@/src/components/ui/DashboardHeader";
import EditSimulationModal from "@/src/components/ui/EditSimulationModal";
import SimulationCard from "@/src/components/ui/SimulationCard";
import { useAuth } from "@/src/context/AuthContext";
import {
    subscribeToSimulations,
    toggleSimulationLock,
} from "@/src/services/adminService";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminLayout() {
  const { user, role, loading: authLoading } = useAuth();
  const currentUser = user;
  const currentRole = role;

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<any>(null);
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to Firestore simulations
  useEffect(() => {
    console.log("Setting up Firestore listener...");
    const unsubscribe = subscribeToSimulations((sims) => {
      console.log("Received simulations from Firestore:", sims.length, sims);
      setSimulations(sims);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!currentUser) return null;
  if (authLoading) return null;
  if (currentRole !== "admin") {
    return <Redirect href="/(auth)/login" />;
  }

  // Admins can see all simulations
  const adminSims = simulations;

  console.log("All simulations:", simulations.length);
  console.log(
    "Simulations data:",
    simulations.map((s) => ({ id: s.id, assignedTo: s.assignedTo })),
  );
  console.log("Admin simulations:", adminSims.length);
  console.log("Loading state:", loading);
  console.log("Auth loading:", authLoading);

  const handleEdit = (simId: string) => {
    const sim = simulations.find((s) => s.id === simId);
    if (sim) {
      setSelectedSimulation(sim);
      setEditModalVisible(true);
    }
  };

  const handleToggleLock = async (simId: string, locked: boolean) => {
    try {
      await toggleSimulationLock(simId, locked);
      Alert.alert("Success", `Simulation ${locked ? "locked" : "unlocked"}`);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleSave = () => {
    setEditModalVisible(false);
    // In production, refresh simulation data here
  };

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
          adminSims.map((sim) => (
            <SimulationCard
              key={sim.id}
              id={sim.id}
              title={sim.title}
              description={sim.description}
              assignedTo={sim.assignedTo}
              locked={sim.locked}
              isAdmin={true}
              onEdit={handleEdit}
              onToggleLock={handleToggleLock}
            />
          ))
        )}
      </ScrollView>

      {selectedSimulation && (
        <EditSimulationModal
          visible={editModalVisible}
          simulationId={selectedSimulation.id}
          initialTitle={selectedSimulation.title}
          initialDescription={selectedSimulation.description}
          onClose={() => setEditModalVisible(false)}
          onSave={handleSave}
        />
      )}
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
