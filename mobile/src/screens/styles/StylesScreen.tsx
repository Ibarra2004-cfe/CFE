import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import {
    Text,
    Divider,
    useTheme,
    Surface,
    Appbar
} from "react-native-paper";

// Import Modular Components from new common subfolder
import StyleInteractive from "../../components/styles/common/StyleInteractive";
import StyleMotion from "../../components/styles/common/StyleMotion";
import StyleMultimedia from "../../components/styles/common/StyleMultimedia";
import StyleFeedback from "../../components/styles/common/StyleFeedback";
import StyleDataTables from "../../components/styles/common/StyleDataTables";

import { useDrawer } from "../../context/DrawerContext";

type Props = NativeStackScreenProps<RootStackParamList, "Styles">;

export default function StylesScreen({ navigation }: Props) {
    const theme = useTheme();
    const { openDrawer } = useDrawer();

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header style={{ backgroundColor: theme.colors.background, elevation: 0 }}>
                <Appbar.Action icon="menu" onPress={openDrawer} />
                <Appbar.Content title="Design System" titleStyle={{ fontWeight: 'bold' }} />
            </Appbar.Header>
            <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.contentContainer}>
                <Text variant="headlineMedium" style={styles.mainTitle}>CFE Design System</Text>
                <Text variant="bodyMedium" style={styles.subTitle}>Librería de Componentes (MD3 + Paper)</Text>

                <Divider style={styles.divider} />

                <StyleInteractive />
                <Divider style={styles.divider} />

                <StyleMotion />
                <Divider style={styles.divider} />

                <StyleMultimedia />
                <Divider style={styles.divider} />

                <StyleFeedback />
                <Divider style={styles.divider} />

                <StyleDataTables />

                <View style={{ height: 60 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f7f8",
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#0d141c",
        marginBottom: 4,
        marginTop: 12
    },
    subTitle: {
        fontSize: 14,
        color: "#64748b",
        marginBottom: 24
    },
    divider: {
        height: 1,
        backgroundColor: "#e2e8f0",
        marginVertical: 24
    }
});
