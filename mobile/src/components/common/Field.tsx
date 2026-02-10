import React from "react";
import { StyleSheet, View } from "react-native";
import { TextInput, Text, useTheme } from "react-native-paper";

type Props = {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
  editable?: boolean;
};

export default function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = "default",
  editable = true,
}: Props) {
  return (
    <View style={styles.wrap}>
      <TextInput
        label={label}
        value={value ?? ""}
        placeholder={placeholder}
        disabled={disabled || !editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        onChangeText={onChange}
        mode="outlined"
        dense
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 8 },
  input: { backgroundColor: "#fff" }
});
