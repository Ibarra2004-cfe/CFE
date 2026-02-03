import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, Pressable, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { api } from "../api/client";
import Field from "../components/Field";
import { validarM9mex } from "../utils/validarM9mex";
import SelectField from "../components/SelectField";

type Props = NativeStackScreenProps<RootStackParamList, "New">;

type TipoOrden = "INSTALACION" | "CAMBIO" | "RETIRO" | "MODIFICACION";
type MedicionEn = "BAJA_TENSION" | "ALTA_TENSION";
type SiNo = "SI" | "NO";

type MarcaMedidor = "WASION" | "ELSTER";
type CodigoMedidor =
  | "F623"
  | "KL28"
  | "KL2R"
  | "KL28BID"
  | "VL28"
  | "VL2R"
  | "VL28BID";

const MARCAS_MEDIDOR: { label: string; value: MarcaMedidor }[] = [
  { label: "WASION", value: "WASION" },
  { label: "ELSTER", value: "ELSTER" },
];

const CODIGOS_MEDIDOR: { label: string; value: CodigoMedidor }[] = [
  { label: "F623", value: "F623" },
  { label: "KL28", value: "KL28" },
  { label: "KL2R", value: "KL2R" },
  { label: "KL28BID", value: "KL28BID" },
  { label: "VL28", value: "VL28" },
  { label: "VL2R", value: "VL2R" },
  { label: "VL28BID", value: "VL28BID" },
];
const save = async () => {
  const error = validarM9mex(form);
  if (error) {
    Alert.alert("Validación CFE", error);
    return;
  }

  try {
    const res = await api.post("/m9mex", form);
    Alert.alert("Listo", "Registro creado");
    navigation.replace("Detail", { id: res.data.id });
  } catch {
    Alert.alert("Error", "No se pudo guardar");
  }
};


const DEFAULT_TIPO_MEDIDOR = "A3RAL";
const DEFAULT_NO_CARATULAS = "-----";

type MedidorDefaults = {
  noCaratulas: string;
  faseElementos?: string;
  hilosConexion?: string;
  khKr?: string;
  volts?: string;
  ampsClase?: string;
};

function defaultsPorCodigo(codigo: string): MedidorDefaults {
  const c = (codigo || "").toUpperCase();

  const base: MedidorDefaults = {
    noCaratulas: DEFAULT_NO_CARATULAS,
  };


  if (c.startsWith("KL")) {
    return {
      ...base,
      faseElementos: "3-3",
      hilosConexion: "4-Y",
      khKr: "21.6",
      volts: "120-480",
      ampsClase: "30(200)",
    };
  }

 
  if (c.startsWith("VL")) {
    return {
      ...base,
      faseElementos: "3-3",
      hilosConexion: "4-Y",
      khKr: "1.8",
      volts: "120-480",
      ampsClase: "2.5(20)",
    };
  }

  // F623
  if (c === "F623") {
    return {
      ...base,
      faseElementos: "2-2",
      hilosConexion: "2-Y",
      khKr: "1",
      volts: "120",
      ampsClase: "15(100)",
    };
  }

  return base;
}

export default function NewScreen({ navigation }: Props) {
  const [form, setForm] = useState<any>({
    // Encabezado
    fecha: new Date().toISOString(),
    tipoOrden: "INSTALACION" as TipoOrden,

    // Datos generales
    ordenAtendida: "",
    usuario: "",
    domicilio: "",
    observaciones: "",

    // Servicio
    seConsumidor: "",
    voltajePrimario: "",
    voltajeSecundario: "",
    subestacion: "",
    agencia: "",
    tarifa: "",
    demCont: "",
    kws: "",

    medicionEn: "BAJA_TENSION" as MedicionEn,
    cobrar2Porc: "NO" as SiNo,

    // Medidor
    noCfe: "",
    noFabrica: "",
    marcaMedidor: "WASION" as MarcaMedidor,
    tipoMedidor: DEFAULT_TIPO_MEDIDOR,
    codigoMedidor: "F623" as CodigoMedidor,
    codigoLote: "",

    noCaratulas: DEFAULT_NO_CARATULAS,
    faseElementos: "",
    hilosConexion: "",
    khKr: "",
    ampsClase: "",
    volts: "",

    // Lecturas
    inst_kwh: "",
    inst_kw: "",
    ret_kwh: "",
    ret_kw: "",

    recibidoPor: "",
  });

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));
  const tipoOrden = form.tipoOrden as TipoOrden;

  const showInst = useMemo(() => {
    return tipoOrden === "INSTALACION" || tipoOrden === "CAMBIO" || tipoOrden === "MODIFICACION";
  }, [tipoOrden]);

  const showRet = useMemo(() => {
    return tipoOrden === "RETIRO" || tipoOrden === "CAMBIO" || tipoOrden === "MODIFICACION";
  }, [tipoOrden]);

 const onChangeCodigoMedidor = (newCodigoRaw: string) => {
  const newCodigo = newCodigoRaw as CodigoMedidor;
  const d = defaultsPorCodigo(newCodigo);

  setForm((p: any) => ({
    ...p,
    codigoMedidor: newCodigo,

    tipoMedidor: p.tipoMedidor?.trim() ? p.tipoMedidor : DEFAULT_TIPO_MEDIDOR,

   
    noCaratulas: d.noCaratulas,

    faseElementos: d.faseElementos ?? "",
    hilosConexion: d.hilosConexion ?? "",
    khKr: d.khKr ?? "",
    volts: d.volts ?? "",
    ampsClase: d.ampsClase ?? "",
  }));
};
  const previewMedidor = useMemo(() => {
    const parts = [
      form.noCfe ? `No CFE: ${form.noCfe}` : null,
      form.noFabrica ? `No Fabrica: ${form.noFabrica}` : null,
      form.marcaMedidor ? `Marca: ${form.marcaMedidor}` : null,
      form.tipoMedidor ? `Tipo: ${form.tipoMedidor}` : null,
      form.codigoMedidor ? `Codigo: ${form.codigoMedidor}` : null,
      form.codigoLote ? `Lote: ${form.codigoLote}` : null,
      form.noCaratulas ? `Caratulas: ${form.noCaratulas}` : null,
      form.faseElementos ? `Fase: ${form.faseElementos}` : null,
      form.hilosConexion ? `Hilos: ${form.hilosConexion}` : null,
      form.khKr ? `kh-kr: ${form.khKr}` : null,
      form.volts ? `Volts: ${form.volts}` : null,
      form.ampsClase ? `Amps: ${form.ampsClase}` : null,
    ].filter(Boolean);

    return parts.length ? parts.join(" | ") : "Sin datos del medidor aun";
  }, [form]);

  const validar = () => {
    if (!form.tipoOrden) return "Selecciona Orden atendida (tipo de orden).";
    if (!form.medicionEn) return "Selecciona Medicion.";
    if (!form.cobrar2Porc) return "Selecciona Cobrar 2%.";
    if (!form.marcaMedidor) return "Selecciona Marca del medidor.";
    if (!form.codigoMedidor) return "Selecciona Codigo del medidor.";
    return null;
  };

  const save = async () => {
    const err = validar();
    if (err) {
      Alert.alert("Falta info", err);
      return;
    }

    const payload = { ...form };

    if (!showInst) {
      payload.inst_kwh = "";
      payload.inst_kw = "";
    }
    if (!showRet) {
      payload.ret_kwh = "";
      payload.ret_kw = "";
    }

    try {
      const res = await api.post("/m9mex", payload);
      Alert.alert("Listo", "Registro creado");
      navigation.replace("Detail", { id: res.data.id });
    } catch {
      Alert.alert("Error", "No se pudo guardar. Revisa los selects y la conexion.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h}>Orden atendida</Text>

      <SelectField
        label="Selecciona orden"
        value={form.tipoOrden}
        onChange={(v) => set("tipoOrden", v)}
        options={[
          { label: "Instalacion", value: "INSTALACION" },
          { label: "Cambio", value: "CAMBIO" },
          { label: "Retiro", value: "RETIRO" },
          { label: "Modificacion", value: "MODIFICACION" },
        ]}
      />

      <Text style={styles.h}>Datos generales</Text>
      <Field label="Usuario" value={form.usuario} onChange={(v) => set("usuario", v)} />
      <Field label="Domicilio" value={form.domicilio} onChange={(v) => set("domicilio", v)} />
      <Field label="Observaciones" value={form.observaciones} onChange={(v) => set("observaciones", v)} />

      <Text style={styles.h}>S.E. consumidor / Servicio</Text>
      <Field label="S.E. consumidor" value={form.seConsumidor} onChange={(v) => set("seConsumidor", v)} />
      <Field label="Voltaje primario" value={form.voltajePrimario} onChange={(v) => set("voltajePrimario", v)} />
      <Field label="Voltaje secundario" value={form.voltajeSecundario} onChange={(v) => set("voltajeSecundario", v)} />

      {/* ✅ 1 solo campo visual */}
      <Field
        label="Subestacion o agencia"
        value={(form.subestacion || form.agencia) ? `${form.subestacion}${form.subestacion && form.agencia ? " / " : ""}${form.agencia}` : ""}
        onChange={(v) => setForm((p: any) => ({ ...p, subestacion: v, agencia: "" }))}
      />

      <Field label="Tarifa" value={form.tarifa} onChange={(v) => set("tarifa", v)} />
      <Field label="Dem. cont." value={form.demCont} onChange={(v) => set("demCont", v)} />
      <Field label="KWS" value={form.kws} onChange={(v) => set("kws", v)} />

      <Text style={styles.h}>Medicion</Text>
      <SelectField
        label="Medicion"
        value={form.medicionEn}
        onChange={(v) => set("medicionEn", v)}
        options={[
          { label: "Baja tension", value: "BAJA_TENSION" },
          { label: "Alta tension", value: "ALTA_TENSION" },
        ]}
      />

      <SelectField
        label="Cobrar 2%"
        value={form.cobrar2Porc}
        onChange={(v) => set("cobrar2Porc", v)}
        options={[
          { label: "No", value: "NO" },
          { label: "Si", value: "SI" },
        ]}
      />

      <Text style={styles.h}>Datos del medidor</Text>
      <Field label="No. CFE" value={form.noCfe} onChange={(v) => set("noCfe", v)} />
      <Field label="No. fabrica" value={form.noFabrica} onChange={(v) => set("noFabrica", v)} />

      <SelectField
        label="Marca (WASION / ELSTER)"
        value={form.marcaMedidor}
        onChange={(v) => set("marcaMedidor", v)}
        options={MARCAS_MEDIDOR}
      />

      <Field label="Tipo (default A3RAL)" value={form.tipoMedidor} onChange={(v) => set("tipoMedidor", v)} />

      <SelectField
        label="Codigo del medidor"
        value={form.codigoMedidor}
        onChange={(v) => onChangeCodigoMedidor(v as CodigoMedidor)}
        options={CODIGOS_MEDIDOR}
      />

      <Field label="Codigo del lote" value={form.codigoLote} onChange={(v) => set("codigoLote", v)} />
      <Field label="No. de caratulas (default -----)" value={form.noCaratulas} onChange={(v) => set("noCaratulas", v)} />
      <Field label="Fase / elementos" value={form.faseElementos} onChange={(v) => set("faseElementos", v)} />
      <Field label="Hilos / conexion" value={form.hilosConexion} onChange={(v) => set("hilosConexion", v)} />
      <Field label="kh-kr" value={form.khKr} onChange={(v) => set("khKr", v)} />
      <Field label="Amps (clase)" value={form.ampsClase} onChange={(v) => set("ampsClase", v)} />
      <Field label="Volts" value={form.volts} onChange={(v) => set("volts", v)} />

      <Text style={styles.h}>Vista previa (tabla azul)</Text>
      <View style={styles.previewBox}>
        <Text style={styles.previewText}>{previewMedidor}</Text>
      </View>

      {showInst && (
        <>
          <Text style={styles.h}>Instalado</Text>
          <Field label="KWH (Instalado)" value={form.inst_kwh} onChange={(v) => set("inst_kwh", v)} />
          <Field label="KW (Instalado)" value={form.inst_kw} onChange={(v) => set("inst_kw", v)} />
        </>
      )}

      {showRet && (
        <>
          <Text style={styles.h}>Retirado</Text>
          <Field label="KWH (Retirado)" value={form.ret_kwh} onChange={(v) => set("ret_kwh", v)} />
          <Field label="KW (Retirado)" value={form.ret_kw} onChange={(v) => set("ret_kw", v)} />
        </>
      )}

      <Text style={styles.h}>Cierre</Text>
      <Field label="Recibido por" value={form.recibidoPor} onChange={(v) => set("recibidoPor", v)} />

      <Pressable onPress={save} style={styles.btn}>
        <Text style={styles.btnText}>Guardar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, gap: 12 },
  h: { marginTop: 6, fontWeight: "900", fontSize: 16 },
  btn: { backgroundColor: "#222", padding: 12, borderRadius: 12, alignItems: "center", marginTop: 10 },
  btnText: { color: "#fff", fontWeight: "900" },
  previewBox: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12 },
  previewText: { fontWeight: "700" },
});
