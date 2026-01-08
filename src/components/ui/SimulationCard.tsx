import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Props {
  title: string;
  description: string;
  locked: boolean;
  onPress: () => void;
}

export default function SimulationCard({
  title,
  description,
  locked,
  onPress,
}: Props) {
  return (
    <View>
      <Pressable
        style={[styles.card, locked && styles.locked]}
        onPress={onPress}
        disabled={locked}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {locked && <Text style={styles.lockText}>Locked</Text>}
      </Pressable>
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
    color: "red",
    fontWeight: "600",
  },
});
