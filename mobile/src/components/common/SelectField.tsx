import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Text, useTheme } from "react-native-paper";

export default function SelectField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <Text variant="labelMedium" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
        {props.label}
      </Text>

      <View style={[styles.pickerWrap, { borderColor: theme.colors.outline }]}>
        <Picker
          selectedValue={props.value}
          onValueChange={(value) => props.onChange(String(value))}
          style={styles.picker}
          dropdownIconColor={theme.colors.primary}
        >
          {props.options.map((o) => (
            <Picker.Item key={o.value} label={o.label} value={o.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { marginBottom: 6, marginLeft: 4, fontWeight: '600', fontSize: 13 },
  pickerWrap: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff"
  },
  picker: {
    height: 52,
  }
});
