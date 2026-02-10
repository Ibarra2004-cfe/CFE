import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Linking,
  Platform,
} from "react-native";
import {
  Text,
  Button,
  ActivityIndicator,
  Divider,
  useTheme,
  IconButton
} from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";

import { RootStackParamList } from "../../../App";
import { serviceRecordService } from "../../services/service_records/serviceRecordService";
import { API_URL } from "../../config";
import { ServiceRecord } from "../../types/service_records/service_record";

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

export default function DetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<ServiceRecord | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await serviceRecordService.getRecordById(id);
      setItem(data);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el registro.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleDelete = async () => {
    const doDelete = async () => {
      try {
        await serviceRecordService.deleteRecord(id);
        Alert.alert("Listo", "Registro eliminado");
        navigation.goBack();
      } catch (e: any) {
        Alert.alert("Error", "No se pudo eliminar el registro");
      }
    };

    if (Platform.OS === "web") {
      const ok = window.confirm("¿Eliminar este registro?");
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
    } catch (e: any) {
      Alert.alert("Error", "No se pudo abrir el PDF.");
    }
  };

  const abrirExcelEnNavegador = async () => {
    try {
      const url = `${API_URL}/m9mex/${id}/excel`;
      await Linking.openURL(url);
    } catch (e: any) {
      Alert.alert("Error", "No se pudo descargar el Excel.");
    }
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
        <Text variant="titleMedium" style={{ marginTop: 16 }}>No se encontró el registro</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={{ marginTop: 24, borderRadius: 12, backgroundColor: '#111827' }}>
          Volver
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.screenHeader}>
          <Text variant="headlineMedium" style={styles.mainTitle}>{item.folio || "Sin Folio"}</Text>
          <Text variant="bodyLarge" style={styles.mainSubtitle}>{item.tipoOrden} • {item.subestacion || "M9MEX"}</Text>
        </View>

        {/* SECTION: DATOS GENERALES */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <MaterialIcons name="person" size={22} color="#111827" />
            <Text variant="titleMedium" style={styles.sectionTitle}>Datos del Usuario</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoField}>
              <Text variant="labelSmall" style={styles.infoLabel}>USUARIO</Text>
              <Text variant="bodyLarge" style={styles.infoValue}>{item.usuario || "N/A"}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoField}>
              <Text variant="labelSmall" style={styles.infoLabel}>DOMICILIO</Text>
              <Text variant="bodyLarge" style={styles.infoValue}>
                {item.calle ? `${item.calle} ${item.numExt || ""}` : (item.domicilio || "N/A")}
                {item.colonia ? `\nCol. ${item.colonia}` : ""}
                {item.poblacion ? `\n${item.poblacion}` : ""}
              </Text>
            </View>
            {(item.entreCalle1 || item.referencia) && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.infoField}>
                  <Text variant="labelSmall" style={styles.infoLabel}>REFERENCIAS</Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>
                    {item.entreCalle1 ? `Entre ${item.entreCalle1}${item.entreCalle2 ? ` y ${item.entreCalle2}` : ""}\n` : ""}
                    {item.referencia || ""}
                  </Text>
                </View>
              </>
            )}
            {item.observaciones && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.infoField}>
                  <Text variant="labelSmall" style={styles.infoLabel}>OBSERVACIONES</Text>
                  <Text variant="bodyMedium" style={styles.infoValue}>{item.observaciones}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* SECTION: MEDIDOR INSTALADO */}
        {item.noCfe && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <MaterialIcons name="speed" size={22} color="#111827" />
              <Text variant="titleMedium" style={styles.sectionTitle}>Medidor Instalado</Text>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.row}>
                <View style={[styles.infoField, { flex: 1 }]}>
                  <Text variant="labelSmall" style={styles.infoLabel}>NO. CFE</Text>
                  <Text variant="bodyLarge" style={styles.infoValue}>{item.noCfe}</Text>
                </View>
                <View style={[styles.infoField, { flex: 1 }]}>
                  <Text variant="labelSmall" style={styles.infoLabel}>MARCA</Text>
                  <Text variant="bodyLarge" style={styles.infoValue}>{item.marcaMedidor || "-"}</Text>
                </View>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.row}>
                <View style={[styles.infoField, { flex: 1 }]}>
                  <Text variant="labelSmall" style={styles.infoLabel}>LECTURA (kWh)</Text>
                  <Text variant="bodyLarge" style={styles.infoValue}>{item.inst_kwh || "-"}</Text>
                </View>
                <View style={[styles.infoField, { flex: 1 }]}>
                  <Text variant="labelSmall" style={styles.infoLabel}>DEMANDA (kW)</Text>
                  <Text variant="bodyLarge" style={styles.infoValue}>{item.inst_kw || "-"}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* SECTION: MEDIDOR RETIRADO */}
        {item.ret_noCfe && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <MaterialIcons name="history" size={22} color="#111827" />
              <Text variant="titleMedium" style={styles.sectionTitle}>Medidor Retirado</Text>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.row}>
                <View style={[styles.infoField, { flex: 1 }]}>
                  <Text variant="labelSmall" style={styles.infoLabel}>NO. CFE</Text>
                  <Text variant="bodyLarge" style={styles.infoValue}>{item.ret_noCfe}</Text>
                </View>
                <View style={[styles.infoField, { flex: 1 }]}>
                  <Text variant="labelSmall" style={styles.infoLabel}>MARCA</Text>
                  <Text variant="bodyLarge" style={styles.infoValue}>{item.ret_marcaMedidor || "-"}</Text>
                </View>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.row}>
                <View style={[styles.infoField, { flex: 1 }]}>
                  <Text variant="labelSmall" style={styles.infoLabel}>LECTURA (kWh)</Text>
                  <Text variant="bodyLarge" style={styles.infoValue}>{item.ret_kwh || "-"}</Text>
                </View>
                <View style={[styles.infoField, { flex: 1 }]}>
                  <Text variant="labelSmall" style={styles.infoLabel}>DEMANDA (kW)</Text>
                  <Text variant="bodyLarge" style={styles.infoValue}>{item.ret_kw || "-"}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* SECTION: DATOS TÉCNICOS */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <MaterialIcons name="bolt" size={22} color="#111827" />
            <Text variant="titleMedium" style={styles.sectionTitle}>Servicio & Medición</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.row}>
              <View style={[styles.infoField, { flex: 1 }]}>
                <Text variant="labelSmall" style={styles.infoLabel}>S.E. CONSUMIDOR</Text>
                <Text variant="bodyLarge" style={styles.infoValue}>{item.seConsumidor || "-"}</Text>
              </View>
              <View style={[styles.infoField, { flex: 1 }]}>
                <Text variant="labelSmall" style={styles.infoLabel}>TARIFA</Text>
                <Text variant="bodyLarge" style={styles.infoValue}>{item.tarifa || "-"}</Text>
              </View>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.row}>
              <View style={[styles.infoField, { flex: 1 }]}>
                <Text variant="labelSmall" style={styles.infoLabel}>VOLT. PRIMARIO</Text>
                <Text variant="bodyLarge" style={styles.infoValue}>{item.voltajePrimario ? `${item.voltajePrimario} kV` : "-"}</Text>
              </View>
              <View style={[styles.infoField, { flex: 1 }]}>
                <Text variant="labelSmall" style={styles.infoLabel}>VOLT. SECUNDARIO</Text>
                <Text variant="bodyLarge" style={styles.infoValue}>{item.voltajeSecundario ? `${item.voltajeSecundario} V` : "-"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECTION: STATUS */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <MaterialIcons name="info" size={22} color="#111827" />
            <Text variant="titleMedium" style={styles.sectionTitle}>Estado del Registro</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.row}>
              <View style={[styles.infoField, { flex: 1 }]}>
                <Text variant="labelSmall" style={styles.infoLabel}>FECHA</Text>
                <Text variant="bodyLarge" style={styles.infoValue}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
                </Text>
              </View>
              <View style={[styles.infoField, { flex: 1 }]}>
                <Text variant="labelSmall" style={styles.infoLabel}>RECIBIDO POR</Text>
                <Text variant="bodyLarge" style={styles.infoValue}>{item.recibidoPor || "-"}</Text>
              </View>
            </View>
          </View>
        </View>

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

      {/* FIXED BOTTOM ACTION BAR */}
      <View style={styles.bottomBar}>
        <View style={styles.actionBarRow}>
          <IconButton
            icon="pencil-outline"
            mode="outlined"
            size={24}
            iconColor="#111827"
            style={styles.editBtn}
            onPress={() => navigation.navigate("Edit", { id })}
          />
          <Button
            icon="file-pdf-box"
            mode="outlined"
            onPress={abrirPdfEnNavegador}
            style={styles.exportBtn}
            labelStyle={styles.exportBtnLabel}
          >
            PDF
          </Button>
          <Button
            icon="file-excel"
            mode="contained"
            onPress={abrirExcelEnNavegador}
            style={styles.saveBtn}
            labelStyle={styles.saveBtnLabel}
          >
            EXCEL
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f9fafb"
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    padding: 20
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb"
  },
  screenHeader: {
    marginBottom: 32,
    marginTop: 12
  },
  mainTitle: {
    fontWeight: "800",
    color: '#111827',
    letterSpacing: -0.5
  },
  mainSubtitle: {
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
    fontSize: 13,
    letterSpacing: 1
  },
  section: {
    marginBottom: 32,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8
  },
  sectionTitle: {
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.2
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  infoField: {
    marginVertical: 4
  },
  infoLabel: {
    color: "#94a3b8",
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 4
  },
  infoValue: {
    color: "#1e293b",
    fontWeight: "500"
  },
  divider: {
    marginVertical: 12,
    backgroundColor: "#f1f5f9"
  },
  row: {
    flexDirection: 'row',
    gap: 12
  },
  deleteBtn: {
    marginTop: 8,
    alignSelf: 'center'
  },
  deleteBtnLabel: {
    fontWeight: '600',
    fontSize: 14
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  editBtn: {
    borderRadius: 12,
    borderColor: '#e2e8f0',
    margin: 0
  },
  exportBtn: {
    flex: 1,
    borderRadius: 12,
    borderColor: '#e2e8f0',
    borderWidth: 1
  },
  exportBtnLabel: {
    color: '#111827',
    fontWeight: '700'
  },
  saveBtn: {
    flex: 1.5,
    borderRadius: 12,
    backgroundColor: '#006341', // Usando el verde CFE para destacar Excel
    paddingVertical: 6,
    elevation: 0
  },
  saveBtnLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  }
});
