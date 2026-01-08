import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface RoleSelectorProps {
  role: "admin" | "student" | null;
  onSelect: (role: "admin" | "student") => void;
}

export default function RoleSelector({ role, onSelect }: RoleSelectorProps) {
  const data = [
    { label: "Admin", value: "admin" },
    { label: "Student", value: "student" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select your role:</Text>
      <Dropdown
        style={styles.dropdown}
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Choose role..."
        value={role}
        onChange={(item) => onSelect(item.value)}
        containerStyle={styles.containerStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
    color: "black",
  },
  dropdown: {
    borderWidth: 2,
    borderColor: "black",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    color: "black",
    width: 200,
  },
  containerStyle: {
    zIndex: 1000,
  }
});
