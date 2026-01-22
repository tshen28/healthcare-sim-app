import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  id: string;
  title: string;
  description: string;
  assignedTo?: string;
  locked?: boolean;
}

export default function SimulationCard({
  id,
  title,
  description,
  assignedTo,
  locked,
}: Props) {
  const router = useRouter();

  const handlePress = () => {
    if (locked) {
      Alert.alert("This simulation is locked");
    } else {
      router.push(`/simulation/${id}?assignedTo=${assignedTo}`);
    }
  };

  return (
    <View>
      <Pressable
        style={[styles.card, locked && styles.locked]}
        onPress={handlePress}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {locked && <EvilIcons name="lock" style={styles.lockIcon}></EvilIcons>}
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
  lockIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    fontSize: 36,
    color: "black",
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
