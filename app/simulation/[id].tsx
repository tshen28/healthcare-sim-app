import { useAuth } from "@/src/context/AuthContext";
import { simulations } from "@/src/data/simulations";
import { db } from "@/src/services/firebase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SimulationDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const simulation = simulations.find((s) => s.id === id);
  const { role } = useAuth();

  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Load saved notes from Firestore
  useEffect(() => {
    const loadNotes = async () => {
      if (!id) return;

      try {
        const notesRef = doc(db, "simulationNotes", id as string);
        const notesDoc = await getDoc(notesRef);

        if (notesDoc.exists()) {
          const savedText = notesDoc.data()?.notes || "";
          setNotes(savedText);
          setSavedNotes(savedText);
        }
      } catch (error) {
        console.error("Error loading notes:", error);
      }
    };

    loadNotes();
  }, [id]);

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
      default:
        return "/(auth)/login";
    }
  };

  const handleReturn = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(getDashboardForRole());
    }
  };

  const handleSaveNotes = async () => {
    if (!id) return;

    try {
      const notesRef = doc(db, "simulationNotes", id as string);
      await setDoc(notesRef, {
        notes: notes.trim(),
        simulationId: id,
        updatedAt: new Date().toISOString(),
      });

      setSavedNotes(notes.trim());
      setIsEditingNotes(false);
      Alert.alert("Success", "Notes saved successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleEditNotes = () => {
    setIsEditingNotes(true);
  };

  const handleCancelEdit = () => {
    setNotes(savedNotes);
    setIsEditingNotes(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{simulation.title}</Text>

      <ScrollView style={styles.scrollView}>
        {/* Notes Section - Show above other sections */}
        {role === "admin" ? (
          savedNotes && !isEditingNotes ? (
            <View style={styles.savedNotesSection}>
              <View style={styles.savedNotesHeader}>
                <Text style={styles.label}>Notes</Text>
                <Pressable onPress={handleEditNotes} style={styles.editButton}>
                  <Ionicons name="create-outline" size={24} color="black" />
                  <Text style={styles.editButtonText}>Edit</Text>
                </Pressable>
              </View>
              <Text style={styles.savedNotesText}>{savedNotes}</Text>
            </View>
          ) : (
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Notes</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Enter notes..."
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              <View style={styles.buttonRow}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={handleCancelEdit}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.saveButton,
                    notes.trim() === savedNotes && styles.saveButtonDisabled,
                  ]}
                  onPress={handleSaveNotes}
                  disabled={notes.trim() === savedNotes || notes.trim() === ""}
                >
                  <Text style={styles.saveButtonText}>
                    {notes.trim() === savedNotes ? "Saved" : "Save"}
                  </Text>
                </Pressable>
              </View>
            </View>
          )
        ) : savedNotes ? (
          <View style={styles.savedNotesSection}>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.savedNotesText}>{savedNotes}</Text>
          </View>
        ) : null}

        {/* Other sections */}
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
    backgroundColor: "#aed581",
  },
  scrollView: {
    flex: 1,
  },
  notesSection: {
    marginBottom: 20,
    backgroundColor: "#dcedc8",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "black",
  },
  notesLabel: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "black",
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f1f8e9",
    minHeight: 120,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f1f8e9",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "black",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "black",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#333",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  readOnlyNotes: {
    backgroundColor: "#f1f8e9",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "black",
    minHeight: 120,
  },
  readOnlyNotesText: {
    fontSize: 16,
    color: "#333",
  },
  savedNotesSection: {
    marginBottom: 20,
    backgroundColor: "#dcedc8",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "black",
  },
  savedNotesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  savedNotesText: {
    fontSize: 16,
    color: "black",
    lineHeight: 24,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    padding: 8,
    bottom: 6,
  },
  editButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f8e9",
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
    backgroundColor: "#f1f8e9",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
});
