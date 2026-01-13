import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  title: string;
  description: string;
  locked: boolean;
  details?: string;
  onPress: () => void;
}

export const sampleSimulations = [
  {
    id: "1",
    title: "Test Sim 1",
    description: "Patient details...",
    locked: false,
    details: "Simulation details...",
  },
  {
    id: "2",
    title: "Test Sim 2",
    description: "Another test simulation.",
    locked: true,
    details: "Locked simulation.",
  },
];

export default function SimulationCard({
  title,
  description,
  locked,
  details,
  onPress,
}: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const handlePress = () => {
    if (locked) {
      Alert.alert("This simulation is locked")
    } else {
      setShowDetails(true);
      onPress();
    }
  };

  return (
    <View>
      <Pressable
        style={[styles.card, locked && styles.locked]}
        onPress={handlePress}
        disabled={locked}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {locked && <Text style={styles.lockText}>Locked</Text>}
      </Pressable>

      <Modal visible={showDetails} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>{title}</Text>
              <Text style={styles.modalDescription}>{description}</Text>
              <Text style={styles.modalDetails}>
                {details || "No additional details."}
              </Text>
            </ScrollView>
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowDetails(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function SimulationCardTest() {
  return (
    <View>
      {sampleSimulations.map((sim) => (
        <SimulationCard
          key={sim.id}
          title={sim.title}
          description={sim.description}
          locked={sim.locked}
          details={sim.details}
          onPress={() => console.log(`Clicked ${sim.title}`)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "grey",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  locked: {
    opacity: 0.5,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 6,
  },
  description: {
    color: "grey",
  },
  lockText: {
    marginTop: 6,
    color: "yellow",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "90%",
    maxHeight: "80%",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalDetails: {
    fontSize: 14,
    color: "grey",
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
