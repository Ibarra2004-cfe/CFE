import React from "react";
import { View, StyleSheet } from "react-native";
import {
    Text,
    TextInput,
    Divider,
    Card,
    useTheme,
    HelperText,
    Avatar,
    IconButton
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import {
    MedidorData,
    MARCAS_MEDIDOR,
    CODIGOS_MEDIDOR,
    CodigoMedidor,
    MarcaMedidor,
    TIPO_MEDIDOR_OPTIONS
} from "../../types/service_records/service_record";
import SelectField from "../common/SelectField";

// Helper for local select (Simple Menu simulation for now or just generic buttons)
// We'll use local buttons or just standard inputs that looks like selects if paper select is complex
// Actually we can use a basic implementation or standard picker.
import { Picker } from "@react-native-picker/picker";

type Props = {
    title: string;
    data: MedidorData;
    onChange: (data: MedidorData) => void;
};

const DEFAULT_TIPO_MEDIDOR = "A3RAL";
const DEFAULT_NO_CARATULAS = "-----";

export default function MeterForm({ title, data, onChange }: Props) {
    const theme = useTheme();

    const update = (key: keyof MedidorData, value: any) => {
        onChange({ ...data, [key]: value });
    };

    const onCodeChange = (code: CodigoMedidor) => {
        const newData = { ...data, codigoMedidor: code };
        const c = (code || "").toUpperCase();
        newData.noCaratulas = DEFAULT_NO_CARATULAS;

        if (!newData.tipoMedidor?.trim()) {
            newData.tipoMedidor = DEFAULT_TIPO_MEDIDOR;
        }

        if (c.startsWith("KL")) {
            newData.faseElementos = "3-3";
            newData.hilosConexion = "4-Y";
            newData.khKr = "21.6";
            newData.volts = "120-480";
            newData.ampsClase = "30(200)";
        } else if (c.startsWith("VL")) {
            newData.faseElementos = "3-3";
            newData.hilosConexion = "4-Y";
            newData.khKr = "1.8";
            newData.volts = "120-480";
            newData.ampsClase = "2.5(20)";
        } else if (c === "F623") {
            newData.faseElementos = "2-2";
            newData.hilosConexion = "2-Y";
            newData.khKr = "1";
            newData.volts = "120";
            newData.ampsClase = "15(100)";
        }

        onChange(newData);
    };

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeaderRow}>
                <MaterialIcons name="speed" size={22} color="#111827" />
                <Text variant="titleMedium" style={styles.sectionTitle}>{title}</Text>
            </View>

            <View style={styles.content}>
                {/* SECTION: METADATA */}
                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text variant="labelMedium" style={styles.inputLabel}>No. CFE</Text>
                        <TextInput
                            value={data.noCfe}
                            onChangeText={(v) => update("noCfe", v)}
                            mode="outlined"
                            outlineStyle={styles.inputOutline}
                            style={styles.input}
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text variant="labelMedium" style={styles.inputLabel}>No. de Fabrica</Text>
                        <TextInput
                            value={data.noFabrica}
                            onChangeText={(v) => update("noFabrica", v)}
                            mode="outlined"
                            outlineStyle={styles.inputOutline}
                            style={styles.input}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        <SelectField
                            label="Marca"
                            value={data.marcaMedidor}
                            onChange={(v) => update("marcaMedidor", v)}
                            options={MARCAS_MEDIDOR}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <SelectField
                            label="Modelo"
                            value={data.tipoMedidor}
                            onChange={(v) => update("tipoMedidor", v)}
                            options={TIPO_MEDIDOR_OPTIONS}
                        />
                    </View>
                </View>

                <SelectField
                    label="Código Medidor"
                    value={data.codigoMedidor}
                    onChange={(v) => onCodeChange(v as CodigoMedidor)}
                    options={CODIGOS_MEDIDOR}
                />

                <View style={styles.inputGroup}>
                    <Text variant="labelMedium" style={styles.inputLabel}>Código Lote</Text>
                    <TextInput
                        value={data.codigoLote}
                        onChangeText={(v) => update("codigoLote", v)}
                        mode="outlined"
                        outlineStyle={styles.inputOutline}
                        style={styles.input}
                    />
                </View>

                <Divider style={styles.divider} />

                {/* SECTION: TECHNICAL SPECS */}
                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text variant="labelMedium" style={styles.inputLabel}>Fase - Elem</Text>
                        <TextInput
                            value={data.faseElementos}
                            onChangeText={(v) => update("faseElementos", v)}
                            mode="outlined"
                            outlineStyle={styles.inputOutline}
                            style={styles.input}
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text variant="labelMedium" style={styles.inputLabel}>Hilos - Conex</Text>
                        <TextInput
                            value={data.hilosConexion}
                            onChangeText={(v) => update("hilosConexion", v)}
                            mode="outlined"
                            outlineStyle={styles.inputOutline}
                            style={styles.input}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text variant="labelMedium" style={styles.inputLabel}>Amps (Clase)</Text>
                        <TextInput
                            value={data.ampsClase}
                            onChangeText={(v) => update("ampsClase", v)}
                            mode="outlined"
                            outlineStyle={styles.inputOutline}
                            style={styles.input}
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text variant="labelMedium" style={styles.inputLabel}>Volts</Text>
                        <TextInput
                            value={data.volts}
                            onChangeText={(v) => update("volts", v)}
                            mode="outlined"
                            outlineStyle={styles.inputOutline}
                            style={styles.input}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text variant="labelMedium" style={styles.inputLabel}>Rr - Rs (KhKr)</Text>
                    <TextInput
                        value={data.khKr}
                        onChangeText={(v) => update("khKr", v)}
                        mode="outlined"
                        outlineStyle={styles.inputOutline}
                        style={styles.input}
                    />
                </View>

                <Divider style={styles.divider} />

                {/* SECTION: READINGS */}
                <View style={[styles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                    <Text variant="titleSmall" style={styles.sectionTitle}>Lecturas ({data.noCaratulas || "-----"})</Text>
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text variant="labelMedium" style={styles.inputLabel}>KWH</Text>
                        <TextInput
                            value={data.kwh}
                            onChangeText={(v) => update("kwh", v)}
                            mode="outlined"
                            outlineStyle={styles.inputOutline}
                            style={styles.input}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text variant="labelMedium" style={styles.inputLabel}>KW</Text>
                        <TextInput
                            value={data.kw}
                            onChangeText={(v) => update("kw", v)}
                            mode="outlined"
                            outlineStyle={styles.inputOutline}
                            style={styles.input}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {title.includes("Instalado") && (
                    <View style={styles.gap}>
                        <Divider style={styles.divider} />
                        <View style={styles.inputGroup}>
                            <Text variant="labelMedium" style={styles.inputLabel}>Sello Encontrado</Text>
                            <TextInput
                                value={data.selloEncontrado || ""}
                                onChangeText={(v) => update("selloEncontrado", v)}
                                mode="outlined"
                                outlineStyle={styles.inputOutline}
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text variant="labelMedium" style={styles.inputLabel}>Sello Dejado</Text>
                            <TextInput
                                value={data.selloDejado || ""}
                                onChangeText={(v) => update("selloDejado", v)}
                                mode="outlined"
                                outlineStyle={styles.inputOutline}
                                style={styles.input}
                            />
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
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
    content: {
        gap: 16,
    },
    gap: {
        gap: 16
    },
    row: {
        flexDirection: 'row',
        gap: 12
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
    divider: {
        marginVertical: 8
    }
});
