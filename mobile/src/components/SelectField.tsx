import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function SelectField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{props.label}</Text>

      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={props.value}
          onValueChange={(value) => props.onChange(String(value))}
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
  wrap: { gap: 6 },
  label: { fontWeight: "800" },
  pickerWrap: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, overflow: "hidden" },
});
