import React from "react";
import { TextInput, Text, View, StyleSheet } from "react-native";

type Props = {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value ?? ""}
        placeholder={placeholder}
        editable={!disabled}
        style={[
          styles.input,
          disabled && styles.disabled,
        ]}
        onChangeText={(text: string) => onChange(text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  label: { fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  disabled: {
    backgroundColor: "#eee",
    color: "#777",
  },
});
