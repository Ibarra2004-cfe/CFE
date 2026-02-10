import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Alert, ScrollView, Linking, Platform } from "react-native";
import { Text, Button, ActivityIndicator, Divider, IconButton, Appbar } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";

import { RootStackParamList } from "../../../App";
import { serviceRecordService } from "../../services/service_records/serviceRecordService";
import { API_URL } from "../../config";
import { ServiceRecord } from "../../types/service_records/service_record";

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

const IS_WEB = Platform.OS === "web";

// string safe
const s = (v: any) => (v === null || v === undefined || String(v).trim() === "" ? "-" : String(v));

/**
 * ✅ Getter seguro: evita TS errors si tu ServiceRecord type no trae esas props todavía
 * (porque tu backend sí las tiene, pero tu type puede estar atrasado).
 */
function get<T = any>(obj: any, key: string, fallback: any = undefined): T {
  if (!obj) return fallback;
  const val = obj[key];
  return val === undefined ? fallback : (val as T);
}

export default function DetailScreen({ route, navigation }: Props) {
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<ServiceRecord | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await serviceRecordService.getRecordById(id);
      setItem(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo cargar el registro.");
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    const doDelete = async () => {
      try {
        await serviceRecordService.deleteRecord(id);
        Alert.alert("Listo", "Registro eliminado");
        navigation.goBack();
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "No se pudo eliminar el registro");
      }
    };

    if (IS_WEB) {
      const ok = typeof window !== "undefined" ? window.confirm("¿Eliminar este registro?") : false;
      if (ok) await doDelete();
      return;
    }

    Alert.alert("Confirmar", "¿Eliminar este registro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: doDelete },
    ]);
  };

  const abrirPdfEnNavegador = async () => {
    try {
      const url = `${API_URL}/m9mex/${id}/pdf`;
      await Linking.openURL(url);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo abrir el PDF.");
    }
  };

  const abrirExcelEnNavegador = async () => {
    try {
      const url = `${API_URL}/m9mex/${id}/excel`;
      await Linking.openURL(url);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo descargar el Excel.");
    }
  };

  const goEdit = () => {
    // ✅ Si tu RootStackParamList no tiene "Edit", esto truena.
    // Mejor lo protegemos:
    const routes = (navigation as any).getState?.()?.routeNames ?? [];
    if (!routes.includes("Edit")) {
      Alert.alert(
        "Falta pantalla",
        "No existe la pantalla 'Edit' en tu Stack. Agrégala en App.tsx (Stack.Screen name='Edit')."
      );
      return;
    }
    (navigation as any).navigate("Edit", { id });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111827" />
        <Text style={{ marginTop: 12, color: "#64748b" }}>Cargando detalle...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="error-outline" size={48} color="#ef4444" />
        <Text variant="titleMedium" style={{ marginTop: 16 }}>
          No se encontró el registro
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 24, borderRadius: 12, backgroundColor: "#111827" }}
        >
          Volver
        </Button>
      </View>
    );
  }

  const tipoOrden = get<string>(item, "tipoOrden", "");
  const showInst = tipoOrden === "INSTALACION" || tipoOrden === "CAMBIO" || tipoOrden === "MODIFICACION";
  const showRet = tipoOrden === "RETIRO" || tipoOrden === "CAMBIO" || tipoOrden === "MODIFICACION";

  const fechaRegistro = get<any>(item, "fecha") ? new Date(get(item, "fecha")).toLocaleDateString() : "-";
  const creadoTxt = get<any>(item, "creadoEn") ? new Date(get(item, "creadoEn")).toLocaleString() : "-";

  return (
    <View style={styles.wrapper}>
      <Appbar.Header style={{ backgroundColor: "#ffffff", elevation: 0 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#111827" />
        <Appbar.Content title="Detalle M9MEX" titleStyle={{ fontWeight: "800", color: "#111827" }} />
      </Appbar.Header>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.screenHeader}>
          <Text variant="headlineMedium" style={styles.mainTitle}>
            {s(get(item, "folio"))}
          </Text>
          <Text variant="bodyLarge" style={styles.mainSubtitle}>
            {s(get(item, "tipoOrden"))} • {s(get(item, "subestacion", "M9MEX"))}
          </Text>
        </View>

        {/* DATOS GENERALES */}
        <Section title="Datos del usuario" icon="person">
          <Field label="Orden atendida" value={get(item, "ordenAtendida")} />
          <Divider style={styles.divider} />
          <Field label="RPU" value={get(item, "rpu")} />
          <Divider style={styles.divider} />
          <Field label="Usuario" value={get(item, "usuario")} />
          <Divider style={styles.divider} />
          <Field label="Domicilio" value={get(item, "domicilio")} />
          {get(item, "observaciones") ? (
            <>
              <Divider style={styles.divider} />
              <Field label="Observaciones" value={get(item, "observaciones")} />
            </>
          ) : null}
        </Section>

        {/* SERVICIO */}
        <Section title="Servicio" icon="bolt">
          <Row>
            <Field label="S.E. consumidor" value={get(item, "seConsumidor")} flex />
            <Field label="Tarifa" value={get(item, "tarifa")} flex />
          </Row>
          <Divider style={styles.divider} />
          <Row>
            <Field label="Voltaje primario" value={get(item, "voltajePrimario")} flex />
            <Field label="Voltaje secundario" value={get(item, "voltajeSecundario")} flex />
          </Row>
          <Divider style={styles.divider} />
          <Row>
            <Field label="Agencia" value={get(item, "agencia")} flex />
            <Field label="Dem. Cont." value={get(item, "demCont")} flex />
          </Row>
          <Divider style={styles.divider} />
          <Row>
            <Field label="KWS" value={get(item, "kws")} flex />
            <Field label="Medición" value={get(item, "medicionEn")} flex />
          </Row>
          <Divider style={styles.divider} />
          <Row>
            <Field label="Cobrar 2%" value={get(item, "cobrar2Porc")} flex />
            <Field label="Recibido por" value={get(item, "recibidoPor")} flex />
          </Row>
        </Section>

        {/* MEDIDOR INSTALADO */}
        {showInst ? (
          <Section title="Medidor instalado" icon="speed">
            <Row>
              <Field label="No. CFE" value={get(item, "noCfe")} flex />
              <Field label="No. fábrica" value={get(item, "noFabrica")} flex />
            </Row>
            <Divider style={styles.divider} />
            <Row>
              <Field label="Marca" value={get(item, "marcaMedidor")} flex />
              <Field label="Tipo" value={get(item, "tipoMedidor")} flex />
            </Row>
            <Divider style={styles.divider} />
            <Row>
              <Field label="Código medidor" value={get(item, "codigoMedidor")} flex />
              <Field label="Código lote" value={get(item, "codigoLote")} flex />
            </Row>

            <Divider style={styles.divider} />
            <Row>
              <Field label="Fase - elementos" value={get(item, "faseElementos")} flex />
              <Field label="Hilos - conexión" value={get(item, "hilosConexion")} flex />
            </Row>

            <Divider style={styles.divider} />
            <Row>
              <Field label="Amps (Clase)" value={get(item, "ampsClase")} flex />
              <Field label="Volts" value={get(item, "volts")} flex />
            </Row>

            <Divider style={styles.divider} />
            <Row>
              <Field label="RR - RS" value={get(item, "rrRs")} flex />
              <Field label="KH - KR" value={get(item, "khKr")} flex />
            </Row>

            <Divider style={styles.divider} />
            <Row>
              <Field label="Lectura" value={get(item, "lectura")} flex />
              <Field label="No. carátulas" value={get(item, "noCaratulas")} flex />
            </Row>

            <Divider style={styles.divider} />
            <Row>
              <Field label="Multiplicador" value={get(item, "multiplicador")} flex />
              <Field label="KW tipo" value={get(item, "kwTipo")} flex />
            </Row>

            <Divider style={styles.divider} />
            <Row>
              <Field label="KWH" value={get(item, "inst_kwh")} flex />
              <Field label="KW" value={get(item, "inst_kw")} flex />
            </Row>

            <Divider style={styles.divider} />
            <Row>
              <Field label="Reactiva" value={get(item, "inst_reactiva")} flex />
              <Field label="Indicación" value={get(item, "inst_indicacion")} flex />
            </Row>
          </Section>
        ) : null}

        {/* MEDIDOR RETIRADO */}
        {showRet ? (
          <Section title="Medidor retirado" icon="history">
            <Row>
              <Field label="No. CFE" value={get(item, "ret_noCfe")} flex />
              <Field label="No. fábrica" value={get(item, "ret_noFabrica")} flex />
            </Row>
            <Divider style={styles.divider} />
            <Row>
              <Field label="Marca" value={get(item, "ret_marcaMedidor")} flex />
              <Field label="Tipo" value={get(item, "ret_tipoMedidor")} flex />
            </Row>
            <Divider style={styles.divider} />
            <Row>
              <Field label="Código medidor" value={get(item, "ret_codigoMedidor")} flex />
              <Field label="Código lote" value={get(item, "ret_codigoLote")} flex />
            </Row>

            <Divider style={styles.divider} />
            <Row>
              <Field label="Fase - elementos" value={get(item, "ret_faseElementos")} flex />
              <Field label="Hilos - conexión" value={get(item, "ret_hilosConexion")} flex />
            </Row>

            <Divider style={styles.divider} />
            <Row>
              <Field label="Amps (Clase)" value={get(item, "ret_ampsClase")} flex />
              <Field label="Volts" value={get(item, "ret_volts")} flex />
            </Row>

            <Divider style={styles.divider} />
            <Row>
              <Field label="RR - RS" value={get(item, "ret_rrRs")} flex />
              <Field label="KH - KR" value={get(item, "ret_khKr")} flex />
            </Row>

            <Divider style={styles.divider} />
            <Row>
              <Field label="No. carátulas" value={get(item, "ret_noCaratulas")} flex />
              <Field label="Multiplicador" value={get(item, "ret_multiplicador")} flex />
            </Row>

            <Divider style={styles.divider} />
            <Row>
              <Field label="KW tipo" value={get(item, "ret_kwTipo")} flex />
              <Field label="Indicación" value={get(item, "ret_indicacion")} flex />
            </Row>

            <Divider style={styles.divider} />
            <Row>
              <Field label="KWH" value={get(item, "ret_kwh")} flex />
              <Field label="KW" value={get(item, "ret_kw")} flex />
            </Row>

            <Divider style={styles.divider} />
            <Row>
              <Field label="Reactiva" value={get(item, "ret_reactiva")} flex />
              <Field label="Demanda" value={get(item, "demanda")} flex />
            </Row>
          </Section>
        ) : null}

        {/* DEMANDA / PERIODO */}
        {get(item, "kwPeriodo") || get(item, "dias") || get(item, "escala") || get(item, "demanda") ? (
          <Section title="Demanda & Periodo" icon="timeline">
            <Row>
              <Field label="Demanda" value={get(item, "demanda")} flex />
              <Field label="KW Periodo" value={get(item, "kwPeriodo")} flex />
            </Row>
            <Divider style={styles.divider} />
            <Row>
              <Field label="Días" value={get(item, "dias")} flex />
              <Field label="Escala" value={get(item, "escala")} flex />
            </Row>
          </Section>
        ) : null}

        {/* SELLOS */}
        {get(item, "selloEncontrado") || get(item, "selloDejado") ? (
          <Section title="Sellos" icon="lock">
            <Field label="Sello encontrado" value={get(item, "selloEncontrado")} />
            <Divider style={styles.divider} />
            <Field label="Sello dejado" value={get(item, "selloDejado")} />
          </Section>
        ) : null}

        {/* ESTADO */}
        <Section title="Estado del registro" icon="info">
          <Row>
            <Field label="Fecha" value={fechaRegistro} flex />
            <Field label="Creado" value={creadoTxt} flex />
          </Row>
        </Section>

        <Button
          icon="delete-outline"
          mode="text"
          textColor="#ef4444"
          onPress={handleDelete}
          style={styles.deleteBtn}
          labelStyle={styles.deleteBtnLabel}
        >
          Eliminar este registro
        </Button>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* BARRA DE ACCIONES */}
      <View style={styles.bottomBar}>
        <View style={styles.actionBarRow}>
          <IconButton
            icon="pencil-outline"
            mode="outlined"
            size={24}
            iconColor="#111827"
            style={styles.editBtn}
            onPress={goEdit}
          />

          <Button icon="file-pdf-box" mode="outlined" onPress={abrirPdfEnNavegador} style={styles.exportBtn} labelStyle={styles.exportBtnLabel}>
            PDF
          </Button>

          <Button icon="file-excel" mode="contained" onPress={abrirExcelEnNavegador} style={styles.saveBtn} labelStyle={styles.saveBtnLabel}>
            EXCEL
          </Button>
        </View>
      </View>
    </View>
  );
}

/** ================= UI Helpers ================= */

function Section({ title, icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <MaterialIcons name={icon} size={22} color="#111827" />
        <Text variant="titleMedium" style={styles.sectionTitle}>
          {title}
        </Text>
      </View>
      <View style={styles.infoCard}>{children}</View>
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

function Field({ label, value, flex }: { label: string; value?: any; flex?: boolean }) {
  return (
    <View style={[styles.infoField, flex && { flex: 1 }]}>
      <Text variant="labelSmall" style={styles.infoLabel}>
        {label.toUpperCase()}
      </Text>
      <Text variant="bodyLarge" style={styles.infoValue}>
        {s(value)}
      </Text>
    </View>
  );
}

/** ================= Styles ================= */

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#f9fafb" },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb" },

  screenHeader: { marginBottom: 24, marginTop: 8 },
  mainTitle: { fontWeight: "800", color: "#111827", letterSpacing: -0.5 },
  mainSubtitle: {
    color: "#64748b",
    marginTop: 4,
    fontWeight: "500",
    textTransform: "uppercase",
    fontSize: 13,
    letterSpacing: 1,
  },

  section: { marginBottom: 28 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 },
  sectionTitle: { fontWeight: "700", color: "#111827", letterSpacing: -0.2 },

  infoCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#f1f5f9" },
  infoField: { marginVertical: 4 },
  infoLabel: { color: "#94a3b8", fontWeight: "800", letterSpacing: 0.5, marginBottom: 4 },
  infoValue: { color: "#1e293b", fontWeight: "500" },
  divider: { marginVertical: 12, backgroundColor: "#f1f5f9" },
  row: { flexDirection: "row", gap: 12 },

  deleteBtn: { marginTop: 8, alignSelf: "center" },
  deleteBtnLabel: { fontWeight: "600", fontSize: 14 },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 30,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  actionBarRow: { flexDirection: "row", alignItems: "center", gap: 12 },

  editBtn: { borderRadius: 12, borderColor: "#e2e8f0", margin: 0 },

  exportBtn: { flex: 1, borderRadius: 12, borderColor: "#e2e8f0", borderWidth: 1 },
  exportBtnLabel: { color: "#111827", fontWeight: "800" },

  saveBtn: { flex: 1.5, borderRadius: 12, backgroundColor: "#006341", paddingVertical: 6, elevation: 0 },
  saveBtnLabel: { fontSize: 14, fontWeight: "900", color: "#ffffff" },
});
