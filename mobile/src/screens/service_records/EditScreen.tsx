import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  TextInput,
  Button,
  Card,
  Text,
  SegmentedButtons,
  Divider,
  useTheme,
  ActivityIndicator,
  Avatar
} from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { serviceRecordService } from "../../services/service_records/serviceRecordService";
import MeterForm from "../../components/service_records/MeterForm";
import {
  MedidorData,
  TipoOrden,
  MedicionEn,
} from "../../types/service_records/service_record";
import { Picker } from "@react-native-picker/picker";
import SelectField from "../../components/common/SelectField";
import { MaterialIcons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "Edit">;

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
  indicacion: "DIRECTA"
};

export default function EditScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tipoOrden, setTipoOrden] = useState<TipoOrden>("INSTALACION");

  // General Info
  const [general, setGeneral] = useState({
    fecha: "",
    ordenAtendida: "",
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
    recibidoPor: ""
  });

  // Meter States
  const [installed, setInstalled] = useState<MedidorData>({ ...EMPTY_MEDIDOR });
  const [removed, setRemoved] = useState<MedidorData>({ ...EMPTY_MEDIDOR });

  const setGen = (k: string, v: any) => setGeneral(p => ({ ...p, [k]: v }));

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    try {
      const d = await serviceRecordService.getRecordById(id);

      setTipoOrden(d.tipoOrden as TipoOrden);
      setGeneral({
        fecha: d.fecha || "",
        ordenAtendida: d.ordenAtendida ?? "",
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
        medicionEn: (d.medicionEn as MedicionEn) ?? "BAJA_TENSION",
        cobrar2Porc: d.cobrar2Porc ?? "NO",
        recibidoPor: d.recibidoPor ?? "",
      });

      // Map Installed
      setInstalled({
        noCfe: d.noCfe ?? "",
        noFabrica: d.noFabrica ?? "",
        marcaMedidor: (d.marcaMedidor as any) ?? "WASION",
        tipoMedidor: d.tipoMedidor ?? "",
        codigoMedidor: (d.codigoMedidor as any) ?? "F623",
        codigoLote: d.codigoLote ?? "",
        noCaratulas: d.noCaratulas ?? "",
        faseElementos: d.faseElementos ?? "",
        hilosConexion: d.hilosConexion ?? "",
        khKr: d.khKr ?? "",
        ampsClase: d.ampsClase ?? "",
        volts: d.volts ?? "",
        kwh: d.inst_kwh ?? "",
        kw: d.inst_kw ?? "",
        indicacion: (d.inst_indicacion as any) ?? "DIRECTA",
        kwTipo: d.kwTipo ?? "",
        multiplicador: d.multiplicador ?? "",
        selloEncontrado: d.selloEncontrado ?? "",
        selloDejado: d.selloDejado ?? "",
      });

      // Map Removed
      setRemoved({
        noCfe: d.ret_noCfe ?? "",
        noFabrica: d.ret_noFabrica ?? "",
        marcaMedidor: (d.ret_marcaMedidor as any) ?? "WASION",
        tipoMedidor: d.ret_tipoMedidor ?? "",
        codigoMedidor: (d.ret_codigoMedidor as any) ?? "F623",
        codigoLote: d.ret_codigoLote ?? "",
        noCaratulas: d.ret_noCaratulas ?? "",
        faseElementos: d.ret_faseElementos ?? "",
        hilosConexion: d.ret_hilosConexion ?? "",
        khKr: d.ret_khKr ?? "",
        ampsClase: d.ret_ampsClase ?? "",
        volts: d.ret_volts ?? "",
        kwh: d.ret_kwh ?? "",
        kw: d.ret_kw ?? "",
        indicacion: (d.ret_indicacion as any) ?? "DIRECTA",
        kwTipo: d.ret_kwTipo ?? "",
        multiplicador: d.ret_multiplicador ?? "",
      });

    } catch (e: any) {
      Alert.alert("Error", "No se pudo cargar el registro");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const showInst = useMemo(() => {
    return tipoOrden === "INSTALACION" || tipoOrden === "CAMBIO" || tipoOrden === "MODIFICACION";
  }, [tipoOrden]);

  const showRet = useMemo(() => {
    return tipoOrden === "RETIRO" || tipoOrden === "CAMBIO" || tipoOrden === "MODIFICACION";
  }, [tipoOrden]);

  const save = async () => {
    setSaving(true);
    const payload: any = {
      ...general,
      tipoOrden,
    };

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
      payload.inst_kwh = installed.kwh;
      payload.inst_kw = installed.kw;
      payload.inst_indicacion = installed.indicacion;
      payload.kwTipo = installed.kwTipo;
      payload.multiplicador = installed.multiplicador;
      payload.selloEncontrado = installed.selloEncontrado;
      payload.selloDejado = installed.selloDejado;
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
      payload.ret_kwh = removed.kwh;
      payload.ret_kw = removed.kw;
      payload.ret_indicacion = removed.indicacion;
      payload.ret_kwTipo = removed.kwTipo;
      payload.ret_multiplicador = removed.multiplicador;
    }

    try {
      await serviceRecordService.updateRecord(id, payload);
      Alert.alert("Listo", "Cambios guardados");
      navigation.replace("Detail", { id });
    } catch {
      Alert.alert("Error", "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Cargando datos...</Text>
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
          <Text variant="headlineMedium" style={styles.mainTitle}>Editar Registro</Text>
          <Text variant="bodyLarge" style={styles.mainSubtitle}>M9MEX • IBARRA - SEBAS</Text>
        </View>

        {/* SECTION: TIPO DE ORDEN */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <MaterialIcons name="assignment" size={22} color="#111827" />
            <Text variant="titleMedium" style={styles.sectionTitle}>Orden atendida</Text>
          </View>

          <SelectField
            label="Selecciona orden"
            value={tipoOrden}
            onChange={v => setTipoOrden(v as TipoOrden)}
            options={[
              { value: 'INSTALACION', label: 'Instalación' },
              { value: 'CAMBIO', label: 'Cambio' },
              { value: 'RETIRO', label: 'Retiro' },
              { value: 'MODIFICACION', label: 'Modificación' },
            ]}
          />
        </View>

        {/* SECTION: DATOS GENERALES */}
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
                onChangeText={v => setGen("usuario", v)}
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
                onChangeText={v => setGen("domicilio", v)}
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
                onChangeText={v => setGen("observaciones", v)}
                mode="outlined"
                outlineStyle={styles.inputOutline}
                style={styles.input}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>

        {/* SECTION: SERVICIO */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <MaterialIcons name="bolt" size={22} color="#111827" />
            <Text variant="titleMedium" style={styles.sectionTitle}>S.E. consumidor / Servicio</Text>
          </View>

          <View style={styles.gap}>
            <View style={styles.inputGroup}>
              <Text variant="labelMedium" style={styles.inputLabel}>S.E. consumidor</Text>
              <TextInput
                value={general.seConsumidor}
                onChangeText={v => setGen("seConsumidor", v)}
                mode="outlined"
                outlineStyle={styles.inputOutline}
                style={styles.input}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text variant="labelMedium" style={styles.inputLabel}>Voltaje primario</Text>
                <TextInput
                  placeholder="kV"
                  value={general.voltajePrimario}
                  onChangeText={v => setGen("voltajePrimario", v)}
                  mode="outlined"
                  outlineStyle={styles.inputOutline}
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text variant="labelMedium" style={styles.inputLabel}>Voltaje secundario</Text>
                <TextInput
                  placeholder="V"
                  value={general.voltajeSecundario}
                  onChangeText={v => setGen("voltajeSecundario", v)}
                  mode="outlined"
                  outlineStyle={styles.inputOutline}
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text variant="labelMedium" style={styles.inputLabel}>Subestación o agencia</Text>
              <TextInput
                value={general.subestacion}
                onChangeText={v => setGen("subestacion", v)}
                mode="outlined"
                outlineStyle={styles.inputOutline}
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text variant="labelMedium" style={styles.inputLabel}>Tarifa</Text>
              <TextInput
                value={general.tarifa}
                onChangeText={v => setGen("tarifa", v)}
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
                { label: "Alta Tensión", value: "ALTA_TENSION" }
              ]}
            />
          </View>
        </View>

        {/* DYNAMIC SECTIONS */}
        {showInst && (
          <View style={styles.section}>
            <MeterForm
              title="Medidor Instalado"
              data={installed}
              onChange={setInstalled}
            />
          </View>
        )}

        {showRet && (
          <View style={styles.section}>
            <MeterForm
              title="Medidor Retirado"
              data={removed}
              onChange={setRemoved}
            />
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <MaterialIcons name="edit" size={22} color="#111827" />
            <Text variant="titleMedium" style={styles.sectionTitle}>Cierre de Registro</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text variant="labelMedium" style={styles.inputLabel}>Recibido Por</Text>
            <TextInput
              value={general.recibidoPor}
              onChangeText={v => setGen("recibidoPor", v)}
              mode="outlined"
              outlineStyle={styles.inputOutline}
              style={styles.input}
            />
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* FIXED BOTTOM ACTION BAR */}
      <View style={styles.bottomBar}>
        <Button
          icon="save"
          mode="contained"
          onPress={save}
          style={styles.saveBtn}
          labelStyle={styles.saveBtnLabel}
          loading={saving}
          disabled={saving}
        >
          Guardar Cambios
        </Button>
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
    fontWeight: '500'
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
  gap: {
    gap: 16
  },
  inputGroup: {
    gap: 6
  },
  inputLabel: {
    color: "#64748b",
    fontWeight: "600",
    marginLeft: 4,
    fontSize: 13
  },
  input: {
    backgroundColor: "#ffffff",
    fontSize: 16,
  },
  inputOutline: {
    borderRadius: 12,
    borderColor: "#e2e8f0",
  },
  row: {
    flexDirection: 'row',
    gap: 12
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  saveBtn: {
    borderRadius: 12,
    backgroundColor: '#111827',
    paddingVertical: 6,
  },
  saveBtnLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'none'
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});
