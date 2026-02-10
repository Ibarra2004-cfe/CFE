import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput, Text, Divider } from "react-native-paper";
import SelectField, { SelectOption } from "../common/SelectField";
import { MedidorData, MedidorCodigo, MarcaMedidor } from "../../types/service_records/service_record";

type Props = {
  title: string;
  data: MedidorData;
  onChange: (next: MedidorData) => void;
};

const MARCAS: SelectOption[] = [
  { label: "WASION", value: "WASION" },
  { label: "ELSTER", value: "ELSTER" },
];

const TIPO: SelectOption[] = [
  { label: "A3RAL", value: "A3RAL" },
];

const CODIGOS: SelectOption[] = [
  { label: "F623", value: "F623" },
  { label: "KL28", value: "KL28" },
  { label: "KL2R", value: "KL2R" },
  { label: "KL28BID", value: "KL28BID" },
  { label: "VL28", value: "VL28" },
  { label: "VL2R", value: "VL2R" },
  { label: "VL28BID", value: "VL28BID" },
];

// ✅ reglas de defaults
function defaultsByCodigo(code: MedidorCodigo) {
  const upper = String(code).toUpperCase();

  if (upper.startsWith("KL")) {
    return {
      faseElementos: "3-3",
      hilosConexion: "4-Y",
      khKr: "21.6",
      volts: "120-480",
      noCaratulas: "-----",
      ampsClase: "30(200)",
    };
  }

  if (upper.startsWith("VL")) {
    return {
      faseElementos: "3-3",
      hilosConexion: "4-Y",
      khKr: "1.8",
      volts: "120-480",
      noCaratulas: "-----",
      ampsClase: "2.5(20)",
    };
  }

  // F623 (si quieres)
  if (upper.startsWith("F623")) {
    return {
      faseElementos: "2-2",
      hilosConexion: "2-Y",
      khKr: "1",
      volts: "120",
      noCaratulas: "-----",
      ampsClase: "15(100)",
    };
  }

  return {};
}

export default function MeterForm({ title, data, onChange }: Props) {
  const set = (k: keyof MedidorData, v: any) => onChange({ ...data, [k]: v });

  const onMarca = (v: string) => set("marcaMedidor", v as MarcaMedidor);
  const onTipo = (v: string) => set("tipoMedidor", "A3RAL"); // fijo
  const onCodigo = (v: string) => {
    const codigo = v as MedidorCodigo;
    const defs = defaultsByCodigo(codigo);

    onChange({
      ...data,
      codigoMedidor: codigo,
      ...defs, // ✅ auto rellena
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>No. CFE</Text>
          <TextInput mode="outlined" value={data.noCfe} onChangeText={(v) => set("noCfe", v)} style={styles.input} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>No. de Fábrica</Text>
          <TextInput mode="outlined" value={data.noFabrica} onChangeText={(v) => set("noFabrica", v)} style={styles.input} />
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <SelectField label="Marca" value={data.marcaMedidor} onChange={onMarca} options={MARCAS} />
        </View>
        <View style={{ flex: 1 }}>
          <SelectField label="Modelo" value={data.tipoMedidor} onChange={onTipo} options={TIPO} />
        </View>
      </View>

      <SelectField label="Código Medidor" value={data.codigoMedidor} onChange={onCodigo} options={CODIGOS} />

      <Text style={styles.label}>Código Lote</Text>
      <TextInput mode="outlined" value={data.codigoLote} onChangeText={(v) => set("codigoLote", v)} style={styles.input} />

      <Divider style={{ marginVertical: 16 }} />

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Fase - Elementos</Text>
          <TextInput mode="outlined" value={data.faseElementos} onChangeText={(v) => set("faseElementos", v)} style={styles.input} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Hilos - Conexión</Text>
          <TextInput mode="outlined" value={data.hilosConexion} onChangeText={(v) => set("hilosConexion", v)} style={styles.input} />
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>kh-kr</Text>
          <TextInput mode="outlined" value={data.khKr} onChangeText={(v) => set("khKr", v)} style={styles.input} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Volts</Text>
          <TextInput mode="outlined" value={data.volts} onChangeText={(v) => set("volts", v)} style={styles.input} />
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>No. Carátulas</Text>
          <TextInput mode="outlined" value={data.noCaratulas} onChangeText={(v) => set("noCaratulas", v)} style={styles.input} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Amps (Clase)</Text>
          <TextInput mode="outlined" value={data.ampsClase} onChangeText={(v) => set("ampsClase", v)} style={styles.input} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    padding: 16,
  },
  title: { fontSize: 16, fontWeight: "800", color: "#111827", marginBottom: 12 },
  row: { flexDirection: "row", gap: 12, marginBottom: 12 },
  label: { color: "#64748b", fontWeight: "600", marginLeft: 4, fontSize: 13, marginBottom: 6 },
  input: { backgroundColor: "#fff" },
});
