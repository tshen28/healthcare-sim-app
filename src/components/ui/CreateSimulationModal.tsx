import { db } from "@/src/services/firebase";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { collection, doc, setDoc } from "firebase/firestore";
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
  onClose: () => void;
  onCreate: () => void;
}

export default function CreateSimulationModal({
  visible,
  onClose,
  onCreate,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      setTitle("");
      setDescription("");
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
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

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    try {
      // Generate a unique ID for the new simulation
      const simsRef = collection(db, "simulations");
      const newSimRef = doc(simsRef);

      await setDoc(newSimRef, {
        title: title.trim(),
        description: description.trim(),
        locked: false,
        assignedTo: "all",
        cbc: "",
        cmp: "",
        ekg: "",
        xr: "",
        ct: "",
        bloodGas: "",
        ultrasound: "",
        files: [],
        images: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Simulation created");
      onCreate();
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
            <Text style={styles.headerTitle}>New Simulation</Text>
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
              placeholder="Simulation Title"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Simulation Description"
              multiline
              numberOfLines={4}
            />

            <View style={styles.uploadSection}>
              <Text style={styles.label}>Attachments (Optional)</Text>
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
            <Pressable style={styles.createButton} onPress={handleCreate}>
              <Text style={styles.createButtonText}>Create</Text>
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
    backgroundColor: "#dcedc8",
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
    borderBottomColor: "black",
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
    borderColor: "black",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f1f8e9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    backgroundColor: "#f1f8e9",
    color: "black",
  },
  uploadSection: {
    marginTop: 20,
  },
  uploadButtons: {
    flexDirection: "row",
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: "black",
    padding: 12,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "black",
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
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  createButton: {
    flex: 1,
    padding: 12,
    borderRadius: 30,
    backgroundColor: "black",
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
