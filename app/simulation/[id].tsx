import { useAuth } from "@/src/context/AuthContext";
import { simulations } from "@/src/data/simulations";
import { db, storage } from "@/src/services/firebase";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
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
  const [attachments, setAttachments] = useState<
    { name: string; url: string; type: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);

  // Section states
  const [sections, setSections] = useState<
    Record<string, { value: string; locked: boolean }>
  >({});
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Load saved notes from Firestore
  useEffect(() => {
    const loadNotes = async () => {
      if (!id) return;

      try {
        const notesRef = doc(db, "simulationNotes", id as string);
        const notesDoc = await getDoc(notesRef);

        if (notesDoc.exists()) {
          const data = notesDoc.data();
          const savedText = data?.notes || "";
          setNotes(savedText);
          setSavedNotes(savedText);
          setAttachments(data?.attachments || []);
        }
      } catch (error) {
        console.error("Error loading notes:", error);
      }
    };

    loadNotes();
  }, [id]);

  // Load and subscribe to sections in real-time
  useEffect(() => {
    if (!id) return;

    const sectionsRef = doc(db, "simulationSections", id as string);

    const unsubscribe = onSnapshot(sectionsRef, (docSnap) => {
      if (docSnap.exists()) {
        setSections(
          docSnap.data() as Record<string, { value: string; locked: boolean }>,
        );
      } else {
        // Initialize with default values from static data
        const defaultSections = {
          CBC: { value: simulation?.cbc || "", locked: false },
          CMP: { value: simulation?.cmp || "", locked: false },
          EKG: { value: simulation?.ekg || "", locked: false },
          "X-Ray": { value: simulation?.xr || "", locked: false },
          "CT Scan": { value: simulation?.ct || "", locked: false },
          "Blood Gas": {
            value: simulation?.bloodGas || "",
            locked: false,
          },
          Ultrasound: {
            value: simulation?.ultrasound || "",
            locked: false,
          },
        };
        setSections(defaultSections);
      }
    });

    return () => unsubscribe();
  }, [id, simulation]);

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

  const handleEditSection = (label: string) => {
    setEditingSection(label);
    setEditValue(sections[label]?.value || "");
  };

  const handleSaveSection = async (label: string) => {
    if (!id) return;

    try {
      const sectionsRef = doc(db, "simulationSections", id as string);
      await setDoc(sectionsRef, {
        ...sections,
        [label]: { ...sections[label], value: editValue.trim() },
      });
      setEditingSection(null);
      Alert.alert("Success", "Section updated");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleToggleSectionLock = async (label: string) => {
    if (!id) return;

    try {
      const sectionsRef = doc(db, "simulationSections", id as string);
      const currentLocked = sections[label]?.locked || false;
      await setDoc(sectionsRef, {
        ...sections,
        [label]: { ...sections[label], locked: !currentLocked },
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleCancelSectionEdit = () => {
    setEditingSection(null);
    setEditValue("");
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadAttachment(
          result.assets[0].uri,
          result.assets[0].fileName || "image.jpg",
          "image",
        );
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to pick image: " + error.message);
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadAttachment(
          result.assets[0].uri,
          result.assets[0].name,
          "document",
        );
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to pick document: " + error.message);
    }
  };

  const uploadAttachment = async (
    uri: string,
    fileName: string,
    type: string,
  ) => {
    if (!id) return;

    setUploading(true);
    try {
      console.log("Starting upload for:", fileName);
      console.log("Storage instance:", storage);

      // Fetch the file
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log("Blob created:", blob.size, "bytes");

      // Create storage reference
      const timestamp = Date.now();
      const storagePath = `simulationAttachments/${id}/${timestamp}_${fileName}`;
      console.log("Storage path:", storagePath);

      const storageRef = ref(storage, storagePath);
      console.log("Storage ref created:", storageRef);

      // Upload file
      console.log("Starting upload...");
      await uploadBytes(storageRef, blob);
      console.log("Upload complete");

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Download URL obtained:", downloadURL);

      // Update attachments array
      const newAttachment = { name: fileName, url: downloadURL, type };
      const updatedAttachments = [...attachments, newAttachment];
      setAttachments(updatedAttachments);

      // Save to Firestore
      const notesRef = doc(db, "simulationNotes", id as string);
      await setDoc(notesRef, {
        notes: notes.trim(),
        attachments: updatedAttachments,
        simulationId: id,
        updatedAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Attachment uploaded successfully");
    } catch (error: any) {
      console.error("Upload error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      Alert.alert(
        "Error",
        "Failed to upload: " + (error.message || error.toString()),
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAttachment = async (
    attachmentUrl: string,
    index: number,
  ) => {
    if (!id) return;

    Alert.alert(
      "Delete Attachment",
      "Are you sure you want to delete this attachment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete from Storage
              const storageRef = ref(storage, attachmentUrl);
              await deleteObject(storageRef);

              // Update local state
              const updatedAttachments = attachments.filter(
                (_, i) => i !== index,
              );
              setAttachments(updatedAttachments);

              // Update Firestore
              const notesRef = doc(db, "simulationNotes", id as string);
              await setDoc(notesRef, {
                notes: notes.trim(),
                attachments: updatedAttachments,
                simulationId: id,
                updatedAt: new Date().toISOString(),
              });

              Alert.alert("Success", "Attachment deleted");
            } catch (error: any) {
              Alert.alert("Error", "Failed to delete: " + error.message);
            }
          },
        },
      ],
    );
  };

  const handleViewAttachment = async (attachment: {
    name: string;
    url: string;
    type: string;
  }) => {
    try {
      const supported = await Linking.canOpenURL(attachment.url);
      if (supported) {
        await Linking.openURL(attachment.url);
      } else {
        Alert.alert("Error", "Cannot open this file");
      }
    } catch (error: any) {
      Alert.alert("Error", "Failed to open file: " + error.message);
    }
  };

  const handleSaveNotes = async () => {
    if (!id) return;

    try {
      const notesRef = doc(db, "simulationNotes", id as string);
      await setDoc(notesRef, {
        notes: notes.trim(),
        attachments: attachments,
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

  const handleCancelEdit = async () => {
    setNotes(savedNotes);
    setIsEditingNotes(false);
    // Reload attachments from Firestore
    if (id) {
      const notesRef = doc(db, "simulationNotes", id as string);
      const notesDoc = await getDoc(notesRef);
      if (notesDoc.exists()) {
        setAttachments(notesDoc.data()?.attachments || []);
      }
    }
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

              {/* Display attachments */}
              {attachments.length > 0 && (
                <View style={styles.savedAttachmentsList}>
                  <Text style={styles.attachmentsLabel}>Attachments:</Text>
                  {attachments.map((attachment, index) => (
                    <Pressable
                      key={index}
                      style={styles.savedAttachmentItem}
                      onPress={() => handleViewAttachment(attachment)}
                    >
                      {attachment.type === "image" && (
                        <Image
                          source={{ uri: attachment.url }}
                          style={styles.attachmentThumbnail}
                        />
                      )}
                      <Ionicons
                        name={
                          attachment.type === "image" ? "image" : "document"
                        }
                        size={20}
                        color="black"
                      />
                      <Text
                        style={styles.savedAttachmentName}
                        numberOfLines={1}
                      >
                        {attachment.name}
                      </Text>
                      <Ionicons name="open-outline" size={16} color="#666" />
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Notes</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes about this simulation..."
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />

              {/* Attachments */}
              <View style={styles.attachmentsSection}>
                <Text style={styles.attachmentsLabel}>Attachments</Text>
                <View style={styles.attachmentButtons}>
                  <Pressable
                    style={styles.attachmentButton}
                    onPress={handlePickImage}
                    disabled={uploading}
                  >
                    <Ionicons name="image" size={20} color="white" />
                    <Text style={styles.attachmentButtonText}>Add Image</Text>
                  </Pressable>
                  <Pressable
                    style={styles.attachmentButton}
                    onPress={handlePickDocument}
                    disabled={uploading}
                  >
                    <Ionicons name="document" size={20} color="white" />
                    <Text style={styles.attachmentButtonText}>Add File</Text>
                  </Pressable>
                </View>
                {uploading && (
                  <Text style={styles.uploadingText}>Uploading...</Text>
                )}

                {/* Display attachments */}
                {attachments.length > 0 && (
                  <View style={styles.attachmentsList}>
                    {attachments.map((attachment, index) => (
                      <View key={index} style={styles.attachmentItem}>
                        {attachment.type === "image" && (
                          <Image
                            source={{ uri: attachment.url }}
                            style={styles.attachmentThumbnail}
                          />
                        )}
                        <View style={styles.attachmentInfo}>
                          <Text
                            style={styles.attachmentName}
                            numberOfLines={1}
                            onPress={() => handleViewAttachment(attachment)}
                          >
                            {attachment.name}
                          </Text>
                        </View>
                        <Pressable
                          onPress={() =>
                            handleDeleteAttachment(attachment.url, index)
                          }
                        >
                          <Ionicons name="trash" size={20} color="#d32f2f" />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}
              </View>

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

            {/* Display attachments for students */}
            {attachments.length > 0 && (
              <View style={styles.savedAttachmentsList}>
                <Text style={styles.attachmentsLabel}>Attachments:</Text>
                {attachments.map((attachment, index) => (
                  <Pressable
                    key={index}
                    style={styles.savedAttachmentItem}
                    onPress={() => handleViewAttachment(attachment)}
                  >
                    {attachment.type === "image" && (
                      <Image
                        source={{ uri: attachment.url }}
                        style={styles.attachmentThumbnail}
                      />
                    )}
                    <Ionicons
                      name={attachment.type === "image" ? "image" : "document"}
                      size={20}
                      color="black"
                    />
                    <Text style={styles.savedAttachmentName} numberOfLines={1}>
                      {attachment.name}
                    </Text>
                    <Ionicons name="open-outline" size={16} color="#666" />
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ) : null}

        {/* Dynamic Sections */}
        {[
          "CBC",
          "CMP",
          "EKG",
          "X-Ray",
          "CT Scan",
          "Blood Gas",
          "Ultrasound",
        ].map((label) => (
          <SectionComponent
            key={label}
            label={label}
            value={sections[label]?.value}
            locked={sections[label]?.locked}
            isAdmin={role === "admin"}
            isEditing={editingSection === label}
            editValue={editValue}
            onEdit={() => handleEditSection(label)}
            onSave={() => handleSaveSection(label)}
            onCancel={handleCancelSectionEdit}
            onToggleLock={() => handleToggleSectionLock(label)}
            onEditValueChange={setEditValue}
          />
        ))}
      </ScrollView>
      <Pressable style={styles.returnButton} onPress={handleReturn}>
        <Ionicons name="return-down-back" size={36} />
      </Pressable>
    </View>
  );
}

function SectionComponent({
  label,
  value,
  locked,
  isAdmin,
  isEditing,
  editValue,
  onEdit,
  onSave,
  onCancel,
  onToggleLock,
  onEditValueChange,
}: {
  label: string;
  value?: string;
  locked?: boolean;
  isAdmin?: boolean;
  isEditing?: boolean;
  editValue?: string;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onToggleLock?: () => void;
  onEditValueChange?: (value: string) => void;
}) {
  const showValue = isAdmin || !locked;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.label}>{label}</Text>
        {isAdmin && (
          <View style={styles.sectionControls}>
            <Pressable onPress={onEdit} style={styles.editIconButton}>
              <FontAwesome5 name="pen" size={18} color="black" />
            </Pressable>
            <Pressable onPress={onToggleLock} style={styles.iconButton}>
              <EvilIcons
                name={locked ? "lock" : "unlock"}
                size={36}
                color={locked ? "grey" : "black"}
              />
            </Pressable>
          </View>
        )}
      </View>

      {isEditing && isAdmin ? (
        <View>
          <TextInput
            style={styles.sectionInput}
            value={editValue}
            onChangeText={onEditValueChange}
            placeholder={`Enter ${label} value...`}
            multiline
          />
          <View style={styles.sectionButtonRow}>
            <Pressable style={styles.sectionCancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.sectionSaveButton} onPress={onSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : showValue ? (
        <Text style={styles.value}>{value || "Not available"}</Text>
      ) : (
        <Text style={styles.lockedText}>Locked</Text>
      )}
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionControls: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 2,
  },
  editIconButton: {
    padding: 4,
    left: 6,
    top: 4,
  },
  sectionInput: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#f1f8e9",
    minHeight: 60,
    marginBottom: 8,
  },
  sectionButtonRow: {
    flexDirection: "row",
    gap: 8,
  },
  sectionCancelButton: {
    flex: 1,
    backgroundColor: "#f1f8e9",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
  },
  sectionSaveButton: {
    flex: 1,
    backgroundColor: "black",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  lockedText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
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
  attachmentsSection: {
    marginTop: 12,
    marginBottom: 12,
  },
  attachmentsLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "black",
  },
  attachmentButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  attachmentButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
  },
  attachmentButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  uploadingText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginTop: 4,
  },
  attachmentsList: {
    marginTop: 12,
  },
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f8e9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  attachmentThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 8,
  },
  attachmentInfo: {
    flex: 1,
    marginRight: 8,
  },
  attachmentName: {
    fontSize: 14,
    color: "black",
    textDecorationLine: "underline",
  },
  savedAttachmentsList: {
    marginTop: 12,
  },
  savedAttachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f8e9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    gap: 8,
  },
  savedAttachmentName: {
    flex: 1,
    fontSize: 14,
    color: "black",
    textDecorationLine: "underline",
  },
});
