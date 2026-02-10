import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";
import SelectField from "../../components/common/SelectField";
import { MedidorData, MedidorCodigo, MedidorMarca } from "../../types/service_records/service_record";

type Props = {
  title: string;
  data: MedidorData;
  onChange: (next: MedidorData) => void;
};

const MARCAS: { label: string; value: MedidorMarca }[] = [
  { label: "WASION", value: "WASION" },
  { label: "ELSTER", value: "ELSTER" },
];

const CODIGOS: { label: string; value: MedidorCodigo }[] = [
  { label: "F623", value: "F623" },
  { label: "KL28", value: "KL28" },
  { label: "KL2R", value: "KL2R" },
  { label: "KL28BID", value: "KL28BID" },
  { label: "VL28", value: "VL28" },
  { label: "VL2R", value: "VL2R" },
  { label: "VL28BID", value: "VL28BID" },
];

function defaultsPorCodigo(codigo: string) {
  const c = (codigo || "").toUpperCase();

  if (c.startsWith("KL")) {
    return { faseElementos: "3-3", hilosConexion: "4-Y", khKr: "21.6", volts: "120-480", ampsClase: "30(200)" };
  }
  if (c.startsWith("VL")) {
    return { faseElementos: "3-3", hilosConexion: "4-Y", khKr: "1.8", volts: "120-480", ampsClase: "2.5(20)" };
  }
  if (c === "F623") {
    return { faseElementos: "2-2", hilosConexion: "2-Y", khKr: "1", volts: "120", ampsClase: "15(100)" };
  }
  return {};
}

export default function MeterForm({ title, data, onChange }: Props) {
  const set = (k: keyof MedidorData, v: any) => onChange({ ...data, [k]: v });

  // ✅ Vista rápida
  const preview = useMemo(() => {
    const parts = [
      data.noCfe && `No CFE: ${data.noCfe}`,
      data.noFabrica && `No Fábrica: ${data.noFabrica}`,
      data.marcaMedidor && `Marca: ${data.marcaMedidor}`,
      data.tipoMedidor && `Tipo: ${data.tipoMedidor}`,
      data.codigoMedidor && `Código: ${data.codigoMedidor}`,
      data.rrRs && `Rr-Rs: ${data.rrRs}`,
      (data.kwh || data.kw) && `Lectura: ${data.kwh || data.kw}`,
    ].filter(Boolean);
    return parts.length ? parts.join(" | ") : "Sin datos aún";
  }, [data]);

  const onChangeCodigo = (v: string) => {
    const codigo = v as MedidorCodigo;
    const d = defaultsPorCodigo(codigo);

    onChange({
      ...data,
      codigoMedidor: codigo,
      tipoMedidor: data.tipoMedidor?.trim() ? data.tipoMedidor : "A3RAL",
      noCaratulas: data.noCaratulas?.trim() ? data.noCaratulas : "-----",
      ...d,
    });
  };

  // ✅ regla fuerte: un input de Lectura y lo copias a KWH y KW
  const onChangeLectura = (v: string) => {
    onChange({ ...data, kwh: v, kw: v });
  };

  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.preview}>{preview}</Text>

      <View style={styles.gap}>
        <TextInput label="No. CFE" value={data.noCfe} onChangeText={(v) => set("noCfe", v)} mode="outlined" />
        <TextInput label="No. de fábrica" value={data.noFabrica} onChangeText={(v) => set("noFabrica", v)} mode="outlined" />

        <SelectField label="Marca" value={data.marcaMedidor} onChange={(v) => set("marcaMedidor", v as any)} options={MARCAS} />
        <TextInput label="Tipo (default A3RAL)" value={data.tipoMedidor} onChangeText={(v) => set("tipoMedidor", v)} mode="outlined" />

        <SelectField label="Código medidor" value={data.codigoMedidor} onChange={(v) => onChangeCodigo(v)} options={CODIGOS} />
        <TextInput label="Código lote" value={data.codigoLote} onChangeText={(v) => set("codigoLote", v)} mode="outlined" />

        <TextInput label="No. de carátulas (default -----)" value={data.noCaratulas} onChangeText={(v) => set("noCaratulas", v)} mode="outlined" />
        <TextInput label="Fase - elementos" value={data.faseElementos} onChangeText={(v) => set("faseElementos", v)} mode="outlined" />
        <TextInput label="Hilos - conexión" value={data.hilosConexion} onChangeText={(v) => set("hilosConexion", v)} mode="outlined" />
        <TextInput label="Kh - Kr" value={data.khKr} onChangeText={(v) => set("khKr", v)} mode="outlined" />
        <TextInput label="Amps (clase)" value={data.ampsClase} onChangeText={(v) => set("ampsClase", v)} mode="outlined" />
        <TextInput label="Volts" value={data.volts} onChangeText={(v) => set("volts", v)} mode="outlined" />

        {/* ✅ CAMPOS EXTRA (bloque Excel) */}
        <TextInput label="Rr - Rs" value={data.rrRs} onChangeText={(v) => set("rrRs", v)} mode="outlined" />

        {/* ✅ LECTURA (se copia a KWH y KW) */}
        <TextInput
          label="Lectura (se copia a KWH y KW)"
          value={data.kwh || data.kw}
          onChangeText={onChangeLectura}
          mode="outlined"
        />

        <TextInput label="Multiplicador" value={data.multiplicador} onChangeText={(v) => set("multiplicador", v)} mode="outlined" />
        <TextInput label="KW Tipo" value={data.kwTipo} onChangeText={(v) => set("kwTipo", v)} mode="outlined" />

        <TextInput label="Demanda" value={data.demanda} onChangeText={(v) => set("demanda", v)} mode="outlined" />
        <TextInput label="KW Periodo" value={data.kwPeriodo} onChangeText={(v) => set("kwPeriodo", v)} mode="outlined" />
        <TextInput label="Días" value={data.dias} onChangeText={(v) => set("dias", v)} mode="outlined" />
        <TextInput label="Escala" value={data.escala} onChangeText={(v) => set("escala", v)} mode="outlined" />

        <TextInput label="Sellos encontrado" value={data.selloEncontrado} onChangeText={(v) => set("selloEncontrado", v)} mode="outlined" />
        <TextInput label="Sellos dejado" value={data.selloDejado} onChangeText={(v) => set("selloDejado", v)} mode="outlined" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: 16, backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#f1f5f9" },
  title: { fontWeight: "900", fontSize: 16, marginBottom: 6, color: "#111827" },
  preview: { color: "#64748b", marginBottom: 12, fontWeight: "600" },
  gap: { gap: 12 },
});
