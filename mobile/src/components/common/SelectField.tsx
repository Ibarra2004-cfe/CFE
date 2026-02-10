import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

export type SelectOption = { label: string; value: string };

type Props = {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  options?: SelectOption[]; // ✅ puede venir undefined
  disabled?: boolean;
};

export default function SelectField({
  label,
  value,
  onChange,
  options,
  disabled,
}: Props) {
  const safeOptions: SelectOption[] = Array.isArray(options) ? options : [];

  const safeValue =
    value && safeOptions.some((o) => o.value === value)
      ? value
      : safeOptions[0]?.value ?? "";

  return (
    <View style={styles.wrapper}>
      {!!label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.pickerBox, disabled && { opacity: 0.6 }]}>
        <Picker
          enabled={!disabled}
          selectedValue={safeValue}
          onValueChange={(v) => onChange(String(v))}
          style={styles.picker}
        >
          {safeOptions.length === 0 ? (
            <Picker.Item label="Sin opciones" value="" />
          ) : (
            safeOptions.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))
          )}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: {
    color: "#64748b",
    fontWeight: "600",
    marginLeft: 4,
    fontSize: 13,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    height: Platform.OS === "web" ? 48 : 52,
    width: "100%",
  },
});
