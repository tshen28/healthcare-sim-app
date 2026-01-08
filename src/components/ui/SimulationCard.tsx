import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
    <Pressable
      style={({pressed}) => [
        styles.card, 
        locked && styles.locked,
        pressed && !locked && styles.pressed
      ]}
      onPress={onPress}
      disabled={locked}
    >
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {locked && <Text style={styles.lockText}>Locked</Text>}
      </View>
    </Pressable>
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
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
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
