import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  id: string;
  title: string;
  description: string;
  assignedTo?: string;
  locked?: boolean;
  isAdmin?: boolean;
  onEdit?: (id: string) => void;
  onToggleLock?: (id: string, locked: boolean) => void;
}

export default function SimulationCard({
  id,
  title,
  description,
  assignedTo,
  locked,
  isAdmin = false,
  onEdit,
  onToggleLock,
}: Props) {
  const router = useRouter();

  const handlePress = () => {
    if (locked && !isAdmin) {
      Alert.alert("This simulation is locked");
    } else {
      router.push(`/simulation/${id}?assignedTo=${assignedTo}`);
    }
  };

  const handleEdit = (e: any) => {
    e.stopPropagation();
    onEdit?.(id);
  };

  const handleToggleLock = (e: any) => {
    e.stopPropagation();
    onToggleLock?.(id, !locked);
  };

  return (
    <View>
      <Pressable
        style={[styles.card, locked && !isAdmin && styles.locked]}
        onPress={handlePress}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {locked && !isAdmin && (
          <EvilIcons name="lock" style={styles.lockIcon}></EvilIcons>
        )}

        {isAdmin && (
          <View style={styles.adminControls}>
            <Pressable style={styles.iconButton} onPress={handleEdit}>
              <FontAwesome5 name="pen" style={styles.penIcon} />
            </Pressable>
            <Pressable style={styles.iconButton} onPress={handleToggleLock}>
              <EvilIcons
                name={locked ? "lock" : "unlock"}
                size={36}
                color={locked ? "grey" : "black"}
              />
            </Pressable>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 30,
    marginBottom: 12,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderColor: "black",
    borderWidth: 2,
    marginTop: 2,
  },
  locked: {
    opacity: 0.7,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 6,
  },
  description: {
    color: "black",
  },
  penIcon: {
    position: "absolute",
    right: -5,
    top: "35%",
    fontSize: 20,
    color: "black",
  },
  lockIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    fontSize: 36,
    color: "black",
  },
  adminControls: {
    position: "absolute",
    right: 12,
    top: 12,
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 4,
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
