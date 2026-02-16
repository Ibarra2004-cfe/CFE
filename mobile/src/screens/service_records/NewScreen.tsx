import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, View, Platform } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";

import { RootStackParamList } from "../../../App";
import { serviceRecordService } from "../../services/service_records/serviceRecordService";
import MeterForm from "../../components/service_records/MeterForm";
import SelectField from "../../components/common/SelectField";
import { padronService } from "../../services/padron/padronService";

import { MedidorData, TipoOrden, MedicionEn } from "../../types/service_records/service_record";

type Props = NativeStackScreenProps<RootStackParamList, "New">;

const IS_WEB = Platform.OS === "web";

const EMPTY_MEDIDOR: MedidorData = {
  noCfe: "",
  noFabrica: "",
  marcaMedidor: "WASION",
  tipoMedidor: "A3RAL",
  codigoMedidor: "F623",
  codigoLote: "",

  noCaratulas: "-----",
  faseElementos: "",
  hilosConexion: "",
  khKr: "",
  ampsClase: "",
  volts: "",

  kwh: "",
  kw: "",
  indicacion: "DIRECTA",

  rrRs: "",
  lectura: "",
  multiplicador: "",
  kwTipo: "",

  demanda: "",
  kwPeriodo: "",
  dias: "",
  escala: "",

  selloEncontrado: "",
  selloDejado: "",
};

const pick = (...vals: any[]) => {
  for (const v of vals) {
    const s = v === null || v === undefined ? "" : String(v).trim();
    if (s) return s;
  }
  return "";
};

const mergeEmptyOnly = (prev: any, patch: any) => {
  const out = { ...prev };
  for (const k of Object.keys(patch)) {
    const cur = prev[k];
    const curStr = cur === null || cur === undefined ? "" : String(cur).trim();
    const nextStr = patch[k] === null || patch[k] === undefined ? "" : String(patch[k]).trim();
    if (!curStr && nextStr) out[k] = patch[k];
  }
  return out;
};

export default function NewScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [tipoOrden, setTipoOrden] = useState<TipoOrden>("INSTALACION");

  const [buscandoRpu, setBuscandoRpu] = useState(false);
  const lastRpuRef = useRef<string>("");
  const triedRpuRef = useRef<string>(""); // para no spamear alerts

  const [general, setGeneral] = useState({
    fecha: new Date().toISOString(),

    ordenAtendida: "",
    rpu: "",

    usuario: "",
    domicilio: "",
    observaciones: "",

    seConsumidor: "",
    voltajePrimario: "",
    voltajeSecundario: "",
    subestacion: "",
    agencia: "",
    tarifa: "",
    demCont: "",
    kws: "",

    medicionEn: "BAJA_TENSION" as MedicionEn,
    cobrar2Porc: "NO",

    recibidoPor: "",
  });

  const [installed, setInstalled] = useState<MedidorData>({ ...EMPTY_MEDIDOR });
  const [removed, setRemoved] = useState<MedidorData>({ ...EMPTY_MEDIDOR });

  const setGen = (k: keyof typeof general, v: any) => setGeneral((p) => ({ ...p, [k]: v }));

  const showInst = useMemo(
    () => tipoOrden === "INSTALACION" || tipoOrden === "CAMBIO" || tipoOrden === "MODIFICACION",
    [tipoOrden]
  );

  const showRet = useMemo(
    () => tipoOrden === "RETIRO" || tipoOrden === "CAMBIO" || tipoOrden === "MODIFICACION",
    [tipoOrden]
  );

  // ✅ AUTO-RELLENAR por RPU (debounce)
  useEffect(() => {
    const rpu = (general.rpu || "").trim();
    if (!rpu || rpu.length < 6) return;
    if (lastRpuRef.current === rpu) return;

    const t = setTimeout(async () => {
      setBuscandoRpu(true);
      try {
        const row = await padronService.getByRpu(rpu);

        lastRpuRef.current = rpu;
        triedRpuRef.current = rpu;

        if (!row) {
          // solo avisa una vez por RPU
          if (!IS_WEB) Alert.alert("RPU no encontrado", "No hay datos en el padrón para ese RPU.");
          return;
        }

        // ✅ mapeo general (ajusta nombres cuando confirmes columnas reales)
        const generalPatch = {
          usuario: pick(row.usuario, row.nombre, row.razon_social),
          domicilio: pick(row.domicilio, row.direccion, row.calle, row.direccion_completa),
          seConsumidor: pick(row.seConsumidor, row.servicio, row.claveSolicitud, row.clave_solicitud),
          tarifa: pick(row.tarifa),
          voltajePrimario: pick(row.voltajePrimario, row.tension),
          agencia: pick(row.agencia, row.sucursal),
          kws: pick(row.kws),
        };

        setGeneral((prev) => mergeEmptyOnly(prev, generalPatch));

        // ✅ mapeo a medidor instalado (si tu excel trae info)
        const instPatch: Partial<MedidorData> = {
          multiplicador: pick(row.multiplicador),
          kwh: pick(row.kwh),
          kw: pick(row.kwh), // regla: iguales si solo viene uno
          hilosConexion: pick(row.hilos),
          noFabrica: pick(row.numeroMedidor, row.numero_medidor),
        };

        setInstalled((prev) => mergeEmptyOnly(prev, instPatch));
      } catch (e: any) {
        console.error(e);
        if (!IS_WEB) Alert.alert("Error", "Falló la consulta del padrón. Revisa el backend.");
      } finally {
        setBuscandoRpu(false);
      }
    }, 500);

    return () => clearTimeout(t);
  }, [general.rpu]);

  const buildPayload = () => {
    const payload: any = { ...general, tipoOrden };

    if (showInst) {
      payload.noCfe = installed.noCfe;
      payload.noFabrica = installed.noFabrica;
      payload.marcaMedidor = installed.marcaMedidor;
      payload.tipoMedidor = installed.tipoMedidor;
      payload.codigoMedidor = installed.codigoMedidor;
      payload.codigoLote = installed.codigoLote;

      payload.noCaratulas = installed.noCaratulas;
      payload.faseElementos = installed.faseElementos;
      payload.hilosConexion = installed.hilosConexion;
      payload.khKr = installed.khKr;
      payload.ampsClase = installed.ampsClase;
      payload.volts = installed.volts;

      payload.rrRs = installed.rrRs;
      payload.lectura = installed.lectura;
      payload.multiplicador = installed.multiplicador;
      payload.kwTipo = installed.kwTipo;

      payload.inst_kwh = installed.kwh;
      payload.inst_kw = installed.kw;

      payload.demanda = installed.demanda;
      payload.kwPeriodo = installed.kwPeriodo;
      payload.dias = installed.dias;
      payload.escala = installed.escala;

      payload.selloEncontrado = installed.selloEncontrado;
      payload.selloDejado = installed.selloDejado;

      payload.inst_indicacion = installed.indicacion;
    }

    if (showRet) {
      payload.ret_noCfe = removed.noCfe;
      payload.ret_noFabrica = removed.noFabrica;
      payload.ret_marcaMedidor = removed.marcaMedidor;
      payload.ret_tipoMedidor = removed.tipoMedidor;
      payload.ret_codigoMedidor = removed.codigoMedidor;
      payload.ret_codigoLote = removed.codigoLote;

      payload.ret_noCaratulas = removed.noCaratulas;
      payload.ret_faseElementos = removed.faseElementos;
      payload.ret_hilosConexion = removed.hilosConexion;
      payload.ret_khKr = removed.khKr; // ✅ SOLO UNA VEZ
      payload.ret_ampsClase = removed.ampsClase;
      payload.ret_volts = removed.volts;

      payload.ret_rrRs = removed.rrRs;
      payload.ret_multiplicador = removed.multiplicador;
      payload.ret_kwTipo = removed.kwTipo;

      payload.ret_kwh = removed.kwh;
      payload.ret_kw = removed.kw;

      payload.ret_indicacion = removed.indicacion;
    }

    return payload;
  };

  const save = async () => {
    if (!general.usuario?.trim()) {
      Alert.alert("Falta información", "El usuario es obligatorio");
      return;
    }

    setLoading(true);
    try {
      const payload = buildPayload();
      const res = await serviceRecordService.createRecord(payload);
      Alert.alert("Éxito", "Registro creado correctamente");
      navigation.replace("Detail", { id: res.id });
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo guardar el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, !IS_WEB && { paddingBottom: 160 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.screenHeader}>
          <Text variant="headlineMedium" style={styles.mainTitle}>Nuevo Registro</Text>
          <Text variant="bodyLarge" style={styles.mainSubtitle}>M9MEX • IBARRA - SEBAS</Text>
        </View>

        {/* ORDEN */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <MaterialIcons name="assignment" size={22} color="#111827" />
            <Text variant="titleMedium" style={styles.sectionTitle}>Orden atendida</Text>
          </View>

          <SelectField
            label="Selecciona orden"
            value={tipoOrden}
            onChange={(v) => setTipoOrden(v as TipoOrden)}
            options={[
              { value: "INSTALACION", label: "Instalación" },
              { value: "CAMBIO", label: "Cambio" },
              { value: "RETIRO", label: "Retiro" },
              { value: "MODIFICACION", label: "Modificación" },
            ]}
          />

          <View style={styles.gap}>
            <View style={styles.inputGroup}>
              <Text variant="labelMedium" style={styles.inputLabel}>Orden</Text>
              <TextInput
                placeholder="Número de orden"
                value={general.ordenAtendida}
                onChangeText={(v) => setGen("ordenAtendida", v)}
                mode="outlined"
                outlineStyle={styles.inputOutline}
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text variant="labelMedium" style={styles.inputLabel}>RPU</Text>
              <TextInput
                placeholder="RPU"
                value={general.rpu}
                onChangeText={(v) => {
                  lastRpuRef.current = "";
                  setGen("rpu", v);
                }}
                mode="outlined"
                outlineStyle={styles.inputOutline}
                style={styles.input}
                right={
                  buscandoRpu ? <TextInput.Icon icon="progress-clock" /> : undefined
                }
              />
            </View>
          </View>
        </View>

        {/* DATOS GENERALES */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <MaterialIcons name="person" size={22} color="#111827" />
            <Text variant="titleMedium" style={styles.sectionTitle}>Datos generales</Text>
          </View>

          <View style={styles.gap}>
            <View style={styles.inputGroup}>
              <Text variant="labelMedium" style={styles.inputLabel}>Usuario</Text>
              <TextInput
                placeholder="Nombre completo"
                value={general.usuario}
                onChangeText={(v) => setGen("usuario", v)}
                mode="outlined"
                outlineStyle={styles.inputOutline}
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text variant="labelMedium" style={styles.inputLabel}>Domicilio</Text>
              <TextInput
                placeholder="Calle, número y colonia"
                value={general.domicilio}
                onChangeText={(v) => setGen("domicilio", v)}
                mode="outlined"
                outlineStyle={styles.inputOutline}
                style={styles.input}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text variant="labelMedium" style={styles.inputLabel}>Observaciones</Text>
              <TextInput
                placeholder="Detalles adicionales..."
                value={general.observaciones}
                onChangeText={(v) => setGen("observaciones", v)}
                mode="outlined"
                outlineStyle={styles.inputOutline}
                style={styles.input}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>

        {/* SERVICIO */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <MaterialIcons name="bolt" size={22} color="#111827" />
            <Text variant="titleMedium" style={styles.sectionTitle}>Servicio</Text>
          </View>

          <View style={styles.gap}>
            <View style={styles.inputGroup}>
              <Text variant="labelMedium" style={styles.inputLabel}>S.E. consumidor</Text>
              <TextInput
                value={general.seConsumidor}
                onChangeText={(v) => setGen("seConsumidor", v)}
                mode="outlined"
                outlineStyle={styles.inputOutline}
                style={styles.input}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text variant="labelMedium" style={styles.inputLabel}>Voltaje primario</Text>
                <TextInput
                  value={general.voltajePrimario}
                  onChangeText={(v) => setGen("voltajePrimario", v)}
                  mode="outlined"
                  outlineStyle={styles.inputOutline}
                  style={styles.input}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text variant="labelMedium" style={styles.inputLabel}>Voltaje secundario</Text>
                <TextInput
                  value={general.voltajeSecundario}
                  onChangeText={(v) => setGen("voltajeSecundario", v)}
                  mode="outlined"
                  outlineStyle={styles.inputOutline}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text variant="labelMedium" style={styles.inputLabel}>Subestación</Text>
                <TextInput
                  value={general.subestacion}
                  onChangeText={(v) => setGen("subestacion", v)}
                  mode="outlined"
                  outlineStyle={styles.inputOutline}
                  style={styles.input}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text variant="labelMedium" style={styles.inputLabel}>Agencia</Text>
                <TextInput
                  value={general.agencia}
                  onChangeText={(v) => setGen("agencia", v)}
                  mode="outlined"
                  outlineStyle={styles.inputOutline}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text variant="labelMedium" style={styles.inputLabel}>Tarifa</Text>
                <TextInput
                  value={general.tarifa}
                  onChangeText={(v) => setGen("tarifa", v)}
                  mode="outlined"
                  outlineStyle={styles.inputOutline}
                  style={styles.input}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text variant="labelMedium" style={styles.inputLabel}>Dem. Cont.</Text>
                <TextInput
                  value={general.demCont}
                  onChangeText={(v) => setGen("demCont", v)}
                  mode="outlined"
                  outlineStyle={styles.inputOutline}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text variant="labelMedium" style={styles.inputLabel}>KWS</Text>
              <TextInput
                value={general.kws}
                onChangeText={(v) => setGen("kws", v)}
                mode="outlined"
                outlineStyle={styles.inputOutline}
                style={styles.input}
              />
            </View>

            <SelectField
              label="Medición En"
              value={general.medicionEn}
              onChange={(v) => setGen("medicionEn", v)}
              options={[
                { label: "Baja Tensión", value: "BAJA_TENSION" },
                { label: "Alta Tensión", value: "ALTA_TENSION" },
              ]}
            />

            <SelectField
              label="Cobrar 2%"
              value={general.cobrar2Porc}
              onChange={(v) => setGen("cobrar2Porc", v)}
              options={[
                { label: "NO", value: "NO" },
                { label: "SI", value: "SI" },
              ]}
            />
          </View>
        </View>

        {showInst && (
          <View style={styles.section}>
            <MeterForm title="Medidor Instalado" data={installed} onChange={setInstalled} />
          </View>
        )}

        {showRet && (
          <View style={styles.section}>
            <MeterForm title="Medidor Retirado" data={removed} onChange={setRemoved} />
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <MaterialIcons name="edit" size={22} color="#111827" />
            <Text variant="titleMedium" style={styles.sectionTitle}>Cierre</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text variant="labelMedium" style={styles.inputLabel}>Recibido Por</Text>
            <TextInput
              value={general.recibidoPor}
              onChangeText={(v) => setGen("recibidoPor", v)}
              mode="outlined"
              outlineStyle={styles.inputOutline}
              style={styles.input}
            />
          </View>
        </View>

        {IS_WEB && (
          <View style={{ marginTop: 24, marginBottom: 40 }}>
            <Button
              icon="content-save"
              mode="contained"
              onPress={save}
              style={styles.saveBtn}
              labelStyle={styles.saveBtnLabel}
              loading={loading}
              disabled={loading}
            >
              Guardar Registro
            </Button>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {!IS_WEB && (
        <View style={styles.bottomBar}>
          <Button
            icon="content-save"
            mode="contained"
            onPress={save}
            style={styles.saveBtn}
            labelStyle={styles.saveBtnLabel}
            loading={loading}
            disabled={loading}
          >
            Guardar Registro
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#f9fafb" },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },

  screenHeader: { marginBottom: 32, marginTop: 12 },
  mainTitle: { fontWeight: "800", color: "#111827", letterSpacing: -0.5 },
  mainSubtitle: { color: "#64748b", marginTop: 4, fontWeight: "500" },

  section: { marginBottom: 32 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 8 },
  sectionTitle: { fontWeight: "700", color: "#111827", letterSpacing: -0.2 },

  gap: { gap: 16 },
  inputGroup: { gap: 6 },
  inputLabel: { color: "#64748b", fontWeight: "600", marginLeft: 4, fontSize: 13 },

  input: { backgroundColor: "#ffffff", fontSize: 16 },
  inputOutline: { borderRadius: 12, borderColor: "#e2e8f0" },

  row: { flexDirection: "row", gap: 12 },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },

  saveBtn: { borderRadius: 12, backgroundColor: "#111827", paddingVertical: 6 },
  saveBtnLabel: { fontSize: 16, fontWeight: "700", color: "#ffffff", textTransform: "none" },
});
