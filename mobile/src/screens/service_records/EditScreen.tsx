import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View, Platform } from "react-native";
import { Appbar, Button, Text, TextInput, ActivityIndicator } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { serviceRecordService } from "../../services/service_records/serviceRecordService";
import MeterForm from "../../components/service_records/MeterForm";
import SelectField from "../../components/common/SelectField";
import { MedidorData, TipoOrden, MedicionEn, ServiceRecord } from "../../types/service_records/service_record";
import { MaterialIcons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "Edit">;
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

export default function EditScreen({ route, navigation }: Props) {
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tipoOrden, setTipoOrden] = useState<TipoOrden>("INSTALACION");

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

  // ===== Cargar registro y poblar estados =====
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const r: ServiceRecord = await serviceRecordService.getRecordById(id);

        setTipoOrden(r.tipoOrden);

        setGeneral({
          fecha: r.fecha ?? new Date().toISOString(),
          ordenAtendida: r.ordenAtendida ?? "",
          rpu: r.rpu ?? "",
          usuario: r.usuario ?? "",
          domicilio: r.domicilio ?? "",
          observaciones: r.observaciones ?? "",
          seConsumidor: r.seConsumidor ?? "",
          voltajePrimario: r.voltajePrimario ?? "",
          voltajeSecundario: r.voltajeSecundario ?? "",
          subestacion: r.subestacion ?? "",
          agencia: r.agencia ?? "",
          tarifa: r.tarifa ?? "",
          demCont: r.demCont ?? "",
          kws: r.kws ?? "",
          medicionEn: (r.medicionEn ?? "BAJA_TENSION") as MedicionEn,
          cobrar2Porc: (r.cobrar2Porc ?? "NO") as any,
          recibidoPor: r.recibidoPor ?? "",
        });

        setInstalled({
          ...EMPTY_MEDIDOR,
          noCfe: r.noCfe ?? "",
          noFabrica: r.noFabrica ?? "",
          marcaMedidor: (r.marcaMedidor ?? "WASION") as any,
          tipoMedidor: (r.tipoMedidor ?? "A3RAL") as any,
          codigoMedidor: (r.codigoMedidor ?? "F623") as any,
          codigoLote: r.codigoLote ?? "",
          noCaratulas: r.noCaratulas ?? "-----",
          faseElementos: r.faseElementos ?? "",
          hilosConexion: r.hilosConexion ?? "",
          khKr: r.khKr ?? "",
          ampsClase: r.ampsClase ?? "",
          volts: r.volts ?? "",
          kwh: r.inst_kwh ?? "",
          kw: r.inst_kw ?? "",
          indicacion: (r.inst_indicacion ?? "DIRECTA") as any,
          rrRs: r.rrRs ?? "",
          lectura: r.lectura ?? "",
          multiplicador: r.multiplicador ?? "",
          kwTipo: r.kwTipo ?? "",
          demanda: r.demanda ?? "",
          kwPeriodo: r.kwPeriodo ?? "",
          dias: r.dias ?? "",
          escala: r.escala ?? "",
          selloEncontrado: r.selloEncontrado ?? "",
          selloDejado: r.selloDejado ?? "",
        });

        setRemoved({
          ...EMPTY_MEDIDOR,
          noCfe: r.ret_noCfe ?? "",
          noFabrica: r.ret_noFabrica ?? "",
          marcaMedidor: (r.ret_marcaMedidor ?? "WASION") as any,
          tipoMedidor: (r.ret_tipoMedidor ?? "A3RAL") as any,
          codigoMedidor: (r.ret_codigoMedidor ?? "F623") as any,
          codigoLote: r.ret_codigoLote ?? "",
          noCaratulas: r.ret_noCaratulas ?? "-----",
          faseElementos: r.ret_faseElementos ?? "",
          hilosConexion: r.ret_hilosConexion ?? "",
          khKr: r.ret_khKr ?? "",
          ampsClase: r.ret_ampsClase ?? "",
          volts: r.ret_volts ?? "",
          kwh: r.ret_kwh ?? "",
          kw: r.ret_kw ?? "",
          indicacion: (r.ret_indicacion ?? "DIRECTA") as any,
          rrRs: r.ret_rrRs ?? "",
          multiplicador: r.ret_multiplicador ?? "",
          kwTipo: r.ret_kwTipo ?? "",
          // demanda/periodo/sellos los dejamos del general instalado
        });
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "No se pudo cargar el registro para editar.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id, navigation]);

  // ===== armar payload PATCH =====
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
      payload.inst_indicacion = installed.indicacion;

      payload.demanda = installed.demanda;
      payload.kwPeriodo = installed.kwPeriodo;
      payload.dias = installed.dias;
      payload.escala = installed.escala;

      payload.selloEncontrado = installed.selloEncontrado;
      payload.selloDejado = installed.selloDejado;
    } else {
      // si no aplica instalado, limpia lecturas instaladas (opcional)
      payload.inst_kwh = "";
      payload.inst_kw = "";
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
      payload.ret_khKr = removed.khKr;
      payload.ret_ampsClase = removed.ampsClase;
      payload.ret_volts = removed.volts;

      payload.ret_rrRs = removed.rrRs;
      payload.ret_multiplicador = removed.multiplicador;
      payload.ret_kwTipo = removed.kwTipo;

      payload.ret_kwh = removed.kwh;
      payload.ret_kw = removed.kw;
      payload.ret_indicacion = removed.indicacion;
    } else {
      payload.ret_kwh = "";
      payload.ret_kw = "";
    }

    return payload;
  };

  const save = async () => {
    if (!general.usuario?.trim()) {
      Alert.alert("Falta información", "El usuario es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload();
      const updated = await serviceRecordService.updateRecord(id, payload);
      Alert.alert("Listo", "Registro actualizado");
      navigation.replace("Detail", { id: updated.id });
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo actualizar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Appbar.Header style={{ backgroundColor: "#ffffff", elevation: 0 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#111827" />
        <Appbar.Content title="Editar M9MEX" titleStyle={{ fontWeight: "800", color: "#111827" }} />
      </Appbar.Header>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, !IS_WEB && { paddingBottom: 160 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
            <TextInput
              label="Orden"
              value={general.ordenAtendida}
              onChangeText={(v) => setGen("ordenAtendida", v)}
              mode="outlined"
            />
            <TextInput
              label="RPU"
              value={general.rpu}
              onChangeText={(v) => setGen("rpu", v)}
              mode="outlined"
            />
          </View>
        </View>

        {/* DATOS GENERALES */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <MaterialIcons name="person" size={22} color="#111827" />
            <Text variant="titleMedium" style={styles.sectionTitle}>Datos generales</Text>
          </View>

          <View style={styles.gap}>
            <TextInput label="Usuario" value={general.usuario} onChangeText={(v) => setGen("usuario", v)} mode="outlined" />
            <TextInput label="Domicilio" value={general.domicilio} onChangeText={(v) => setGen("domicilio", v)} mode="outlined" multiline />
            <TextInput label="Observaciones" value={general.observaciones} onChangeText={(v) => setGen("observaciones", v)} mode="outlined" multiline />
          </View>
        </View>

        {/* SERVICIO */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <MaterialIcons name="bolt" size={22} color="#111827" />
            <Text variant="titleMedium" style={styles.sectionTitle}>Servicio</Text>
          </View>

          <View style={styles.gap}>
            <TextInput label="S.E. consumidor" value={general.seConsumidor} onChangeText={(v) => setGen("seConsumidor", v)} mode="outlined" />
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <TextInput label="Voltaje primario" value={general.voltajePrimario} onChangeText={(v) => setGen("voltajePrimario", v)} mode="outlined" />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput label="Voltaje secundario" value={general.voltajeSecundario} onChangeText={(v) => setGen("voltajeSecundario", v)} mode="outlined" />
              </View>
            </View>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <TextInput label="Subestación" value={general.subestacion} onChangeText={(v) => setGen("subestacion", v)} mode="outlined" />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput label="Agencia" value={general.agencia} onChangeText={(v) => setGen("agencia", v)} mode="outlined" />
              </View>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <TextInput label="Tarifa" value={general.tarifa} onChangeText={(v) => setGen("tarifa", v)} mode="outlined" />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput label="Dem. Cont." value={general.demCont} onChangeText={(v) => setGen("demCont", v)} mode="outlined" />
              </View>
            </View>

            <TextInput label="KWS" value={general.kws} onChangeText={(v) => setGen("kws", v)} mode="outlined" />

            <SelectField
              label="Medición En"
              value={general.medicionEn}
              onChange={(v) => setGen("medicionEn", v as MedicionEn)}
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

          <TextInput label="Recibido por" value={general.recibidoPor} onChangeText={(v) => setGen("recibidoPor", v)} mode="outlined" />
        </View>

        {IS_WEB && (
          <Button mode="contained" onPress={save} loading={saving} disabled={saving} style={styles.saveBtn}>
            Guardar cambios
          </Button>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {!IS_WEB && (
        <View style={styles.bottomBar}>
          <Button mode="contained" onPress={save} loading={saving} disabled={saving} style={styles.saveBtn}>
            Guardar cambios
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
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  section: { marginBottom: 28 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  sectionTitle: { fontWeight: "700" },

  gap: { gap: 12 },
  row: { flexDirection: "row", gap: 12 },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 30 : 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  saveBtn: { borderRadius: 12, backgroundColor: "#111827" },
});
