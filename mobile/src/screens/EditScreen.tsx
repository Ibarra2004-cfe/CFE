import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { api } from "../api/client";
import Field from "../components/Field";
import SelectField from "../components/SelectField";

/* =========================
   TIPOS (IGUALES A NEW)
========================= */
type Props = NativeStackScreenProps<RootStackParamList, "Edit">;

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

type MedidorDefaults = {
  noCaratulas: string;
  faseElementos?: string;
  hilosConexion?: string;
  khKr?: string;
  volts?: string;
  ampsClase?: string;
};

/* =========================
   CONSTANTES
========================= */
const MARCAS_MEDIDOR = [
  { label: "WASION", value: "WASION" },
  { label: "ELSTER", value: "ELSTER" },
];

const CODIGOS_MEDIDOR = [
  { label: "F623", value: "F623" },
  { label: "KL28", value: "KL28" },
  { label: "KL2R", value: "KL2R" },
  { label: "KL28BID", value: "KL28BID" },
  { label: "VL28", value: "VL28" },
  { label: "VL2R", value: "VL2R" },
  { label: "VL28BID", value: "VL28BID" },
];

const DEFAULT_TIPO_MEDIDOR = "A3RAL";
const DEFAULT_NO_CARATULAS = "-----";

/* =========================
   DEFAULTS POR CODIGO
========================= */
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

/* =========================
   SCREEN
========================= */
export default function EditScreen({ route, navigation }: Props) {
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({});

  const set = (k: string, v: any) =>
    setForm((p: any) => ({ ...p, [k]: v }));

  /* =========================
     CARGAR REGISTRO (CLAVE)
  ========================== */
  useEffect(() => {
    api
      .get(`/m9mex/${id}`)
      .then((res) => {
        const d = res.data;

        setForm({
          fecha: d.fecha?.slice(0, 10),
          tipoOrden: d.tipoOrden,

          usuario: d.usuario ?? "",
          domicilio: d.domicilio ?? "",
          observaciones: d.observaciones ?? "",

          seConsumidor: d.seConsumidor ?? "",
          voltajePrimario: d.voltajePrimario ?? "",
          voltajeSecundario: d.voltajeSecundario ?? "",
          subestacion: d.subestacion ?? "",
          agencia: d.agencia ?? "",
          tarifa: d.tarifa ?? "",
          demCont: d.demCont ?? "",
          kws: d.kws ?? "",

          medicionEn: d.medicionEn ?? "BAJA_TENSION",
          cobrar2Porc: d.cobrar2Porc ?? "NO",

          noCfe: d.noCfe ?? "",
          noFabrica: d.noFabrica ?? "",
          marcaMedidor: d.marcaMedidor ?? "WASION",
          tipoMedidor: d.tipoMedidor ?? DEFAULT_TIPO_MEDIDOR,
          codigoMedidor: d.codigoMedidor ?? "F623",
          codigoLote: d.codigoLote ?? "",

          noCaratulas: d.noCaratulas ?? DEFAULT_NO_CARATULAS,
          faseElementos: d.faseElementos ?? "",
          hilosConexion: d.hilosConexion ?? "",
          khKr: d.khKr ?? "",
          volts: d.volts ?? "",
          ampsClase: d.ampsClase ?? "",

          inst_kwh: d.inst_kwh ?? "",
          inst_kw: d.inst_kw ?? "",
          ret_kwh: d.ret_kwh ?? "",
          ret_kw: d.ret_kw ?? "",

          recibidoPor: d.recibidoPor ?? "",
        });
      })
      .catch(() => {
        Alert.alert("Error", "No se pudo cargar el registro");
        navigation.goBack();
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* =========================
     VISIBILIDAD
  ========================== */
  const tipoOrden = form.tipoOrden as TipoOrden;

  const showInst = useMemo(
    () =>
      tipoOrden === "INSTALACION" ||
      tipoOrden === "CAMBIO" ||
      tipoOrden === "MODIFICACION",
    [tipoOrden]
  );

  const showRet = useMemo(
    () =>
      tipoOrden === "RETIRO" ||
      tipoOrden === "CAMBIO" ||
      tipoOrden === "MODIFICACION",
    [tipoOrden]
  );

  /* =========================
     CAMBIO CODIGO MEDIDOR
  ========================== */
  const onChangeCodigoMedidor = (codigo: CodigoMedidor) => {
    const d = defaultsPorCodigo(codigo);

    setForm((p: any) => ({
      ...p,
      codigoMedidor: codigo,
      tipoMedidor: p.tipoMedidor?.trim()
        ? p.tipoMedidor
        : DEFAULT_TIPO_MEDIDOR,
      noCaratulas: d.noCaratulas,
      faseElementos: d.faseElementos ?? "",
      hilosConexion: d.hilosConexion ?? "",
      khKr: d.khKr ?? "",
      volts: d.volts ?? "",
      ampsClase: d.ampsClase ?? "",
    }));
  };

  /* =========================
     GUARDAR
  ========================== */
  const save = async () => {
    try {
      await api.patch(`/m9mex/${id}`, form);
      Alert.alert("Listo", "Cambios guardados");
      navigation.replace("Detail", { id });
    } catch {
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  if (loading) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h}>Editar registro</Text>

      <SelectField
        label="Tipo de orden"
        value={form.tipoOrden}
        onChange={(v) => set("tipoOrden", v)}
        options={[
          { label: "Instalación", value: "INSTALACION" },
          { label: "Cambio", value: "CAMBIO" },
          { label: "Retiro", value: "RETIRO" },
          { label: "Modificación", value: "MODIFICACION" },
        ]}
      />

      <Field label="Usuario" value={form.usuario} onChange={(v) => set("usuario", v)} />
      <Field label="Domicilio" value={form.domicilio} onChange={(v) => set("domicilio", v)} />
      <Field label="Observaciones" value={form.observaciones} onChange={(v) => set("observaciones", v)} />

      <Text style={styles.h}>Medidor</Text>
      <Field label="No. CFE" value={form.noCfe} onChange={(v) => set("noCfe", v)} />
      <Field label="No. Fábrica" value={form.noFabrica} onChange={(v) => set("noFabrica", v)} />

      <SelectField
        label="Marca"
        value={form.marcaMedidor}
        onChange={(v) => set("marcaMedidor", v)}
        options={MARCAS_MEDIDOR}
      />

      <Field label="Tipo" value={form.tipoMedidor} onChange={(v) => set("tipoMedidor", v)} />

      <SelectField
        label="Código del medidor"
        value={form.codigoMedidor}
        onChange={(v) => onChangeCodigoMedidor(v as CodigoMedidor)}
        options={CODIGOS_MEDIDOR}
      />

      <Field label="Lote" value={form.codigoLote} onChange={(v) => set("codigoLote", v)} />
      <Field label="Carátulas" value={form.noCaratulas} onChange={(v) => set("noCaratulas", v)} />
      <Field label="Fase" value={form.faseElementos} onChange={(v) => set("faseElementos", v)} />
      <Field label="Hilos" value={form.hilosConexion} onChange={(v) => set("hilosConexion", v)} />
      <Field label="kh-kr" value={form.khKr} onChange={(v) => set("khKr", v)} />
      <Field label="Amps" value={form.ampsClase} onChange={(v) => set("ampsClase", v)} />
      <Field label="Volts" value={form.volts} onChange={(v) => set("volts", v)} />

      {showInst && (
        <>
          <Text style={styles.h}>Instalado</Text>
          <Field label="KWH" value={form.inst_kwh} onChange={(v) => set("inst_kwh", v)} />
          <Field label="KW" value={form.inst_kw} onChange={(v) => set("inst_kw", v)} />
        </>
      )}

      {showRet && (
        <>
          <Text style={styles.h}>Retirado</Text>
          <Field label="KWH" value={form.ret_kwh} onChange={(v) => set("ret_kwh", v)} />
          <Field label="KW" value={form.ret_kw} onChange={(v) => set("ret_kw", v)} />
        </>
      )}

      <Pressable onPress={save} style={styles.btn}>
        <Text style={styles.btnText}>Guardar cambios</Text>
      </Pressable>
    </ScrollView>
  );
}

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  container: { padding: 12, gap: 12 },
  h: { fontWeight: "900", fontSize: 16, marginTop: 10 },
  btn: {
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "900" },
});
