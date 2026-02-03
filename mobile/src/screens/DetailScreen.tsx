import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
  ScrollView,
  Linking,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../App";
import { api } from "../api/client";
import { API_BASE_URL } from "../config";

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

export default function DetailScreen({ route, navigation }: Props) {
  const { id } = route.params;

  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/m9mex/${id}`);
      setItem(res.data);
    } catch {
      Alert.alert("Error", "No se pudo cargar el registro.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  // ✅ Eliminar 1 registro (funciona en WEB y Android)
  const del = async () => {
    const doDelete = async () => {
      try {
        console.log("DELETE ->", `/m9mex/${id}`);
        const r = await api.delete(`/m9mex/${id}`);
        console.log("DELETE OK:", r.status);

        Alert.alert("Listo", "Registro eliminado");
        navigation.goBack();
      } catch (e: any) {
        const status = e?.response?.status;
        const data = e?.response?.data;
        console.log("DELETE ERROR:", status, data ?? e?.message ?? e);

        Alert.alert(
          "Error al eliminar",
          `No se pudo eliminar.\n\nStatus: ${status ?? "?"}\n` +
            `${data ? JSON.stringify(data, null, 2) : (e?.message ?? "Sin detalle")}`
        );
      }
    };

    // ✅ Confirmación que sí sirve en WEB
    if (Platform.OS === "web") {
      const ok = window.confirm("¿Eliminar este registro?");
      if (ok) await doDelete();
      return;
    }

    // ✅ Confirmación normal Android/iOS
    Alert.alert("Confirmar", "¿Eliminar este registro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: doDelete },
    ]);
  };

  // ✅ Abrir PDF en navegador
  const abrirPdfEnNavegador = async () => {
    try {
      const url = `${API_BASE_URL}/m9mex/${id}/pdf`;
      const can = await Linking.canOpenURL(url);
      if (!can) {
        Alert.alert("Error", "No se pudo abrir el PDF (URL inválida).");
        return;
      }
      await Linking.openURL(url);
      Alert.alert(
        "Listo",
        "Se abrió el PDF en el navegador.\nEn Chrome dale Descargar y se guardará en Descargas."
      );
    } catch (e: any) {
      console.log("OPEN PDF ERROR:", e?.message ?? e);
      Alert.alert("Error", "No se pudo abrir el PDF en el navegador.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>No encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.folio}>{item.folio}</Text>
      <Text>Tipo: {item.tipoOrden}</Text>
      <Text>Fecha: {String(item.fecha).slice(0, 10)}</Text>

      <Text style={styles.section}>Datos</Text>
      <Text>Orden atendida: {item.ordenAtendida ?? "-"}</Text>
      <Text>Usuario: {item.usuario ?? "-"}</Text>
      <Text>Domicilio: {item.domicilio ?? "-"}</Text>
      <Text>Observaciones: {item.observaciones ?? "-"}</Text>

      <Text style={styles.section}>Medidor</Text>
      <Text>No CFE: {item.noCfe ?? "-"}</Text>
      <Text>No fábrica: {item.noFabrica ?? "-"}</Text>
      <Text>Marca: {item.marcaMedidor ?? "-"}</Text>
      <Text>Tipo: {item.tipoMedidor ?? "-"}</Text>
      <Text>Código: {item.codigoMedidor ?? "-"}</Text>

      <Text style={styles.section}>Instalado / Retirado</Text>
      <Text>INST kWh: {item.inst_kwh ?? "-"}</Text>
      <Text>INST kW: {item.inst_kw ?? "-"}</Text>
      <Text>RET kWh: {item.ret_kwh ?? "-"}</Text>
      <Text>RET kW: {item.ret_kw ?? "-"}</Text>

      {/* ✅ EDITAR */}
      <Pressable onPress={() => navigation.navigate("Edit", { id: Number(id) })} style={styles.btn}>
        <Text style={styles.btnText}>Editar</Text>
      </Pressable>

      <Pressable onPress={abrirPdfEnNavegador} style={styles.btn}>
        <Text style={styles.btnText}>Abrir PDF en navegador (Descargar)</Text>
      </Pressable>

      <Pressable onPress={del} style={[styles.btn, styles.btnDanger]}>
        <Text style={styles.btnText}>Eliminar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, gap: 8 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  folio: { fontSize: 18, fontWeight: "900" },
  section: { marginTop: 10, fontWeight: "900" },
  btn: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  btnDanger: { backgroundColor: "#b00020" },
  btnText: { color: "#fff", fontWeight: "900", textAlign: "center" },
});
