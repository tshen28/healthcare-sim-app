import { updateSimulation } from "@/src/services/adminService";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

interface Props {
  visible: boolean;
  simulationId: string;
  initialTitle: string;
  initialDescription: string;
  onClose: () => void;
  onSave: () => void;
}

export default function EditSimulationModal({
  visible,
  simulationId,
  initialTitle,
  initialDescription,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [uploading, setUploading] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Update state when modal opens with new data
  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
      setDescription(initialDescription);
    }
  }, [visible, initialTitle, initialDescription]);

  useEffect(() => {
    if (visible) {
      // Reset animations to 0 before starting
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  const handleSave = async () => {
    try {
      await updateSimulation(simulationId, {
        title,
        description,
      });
      Alert.alert("Success", "Simulation updated");
      onSave();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setUploading(true);
      // TODO: Upload to Firebase Storage and get URL
      // For now, just show alert
      Alert.alert("Image selected", "Upload to storage not yet implemented");
      setUploading(false);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
    });

    if (!result.canceled) {
      setUploading(true);
      // TODO: Upload to Firebase Storage and get URL
      Alert.alert("Document selected", "Upload to storage not yet implemented");
      setUploading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="none" transparent>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Simulation</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" size={28} color="black" />
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Simulation title"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Simulation description"
              multiline
              numberOfLines={4}
            />

            <View style={styles.uploadSection}>
              <Text style={styles.label}>Attachments</Text>
              <View style={styles.uploadButtons}>
                <Pressable
                  style={styles.uploadButton}
                  onPress={pickImage}
                  disabled={uploading}
                >
                  <Ionicons name="image-outline" size={24} color="white" />
                  <Text style={styles.uploadButtonText}>Add Image</Text>
                </Pressable>

                <Pressable
                  style={styles.uploadButton}
                  onPress={pickDocument}
                  disabled={uploading}
                >
                  <MaterialIcons name="attach-file" size={24} color="white" />
                  <Text style={styles.uploadButtonText}>Add File</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  uploadSection: {
    marginTop: 20,
  },
  uploadButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 30,
    gap: 8,
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
  },
  cancelButtonText: {
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "black",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
