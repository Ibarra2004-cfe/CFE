import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
    Text,
    Card,
    Avatar,
    useTheme,
    ProgressBar,
    MD3Colors,
    Button,
    List,
    HelperText,
    ActivityIndicator,
    Banner,
    Portal,
    Snackbar
} from "react-native-paper";

export default function StyleFeedback() {
    const theme = useTheme();
    const [visible, setVisible] = useState(true);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [alerts, setAlerts] = useState([
        { id: '1', type: 'success', title: 'Data Synced', desc: 'All records updated.' },
        { id: '2', type: 'warning', title: 'Low Storage', desc: 'Device is 90% full.' },
        { id: '3', type: 'info', title: 'New Version', desc: 'Update available.' },
    ]);

    const removeAlert = (id: string) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Avatar.Icon size={40} icon="bell-outline" style={{ backgroundColor: theme.colors.errorContainer }} color={theme.colors.error} />
                <Text variant="titleLarge" style={styles.sectionHeader}>Feedback & Alerts</Text>
            </View>

            {/* Banner Section */}
            <Banner
                visible={visible}
                actions={[
                    { label: 'Entendido', onPress: () => setVisible(false) },
                    { label: 'Ver más', onPress: () => setSnackbarVisible(true) },
                ]}
                icon={({ size }) => <Avatar.Icon icon="shield-alert-outline" size={size} style={{ backgroundColor: 'transparent' }} color={theme.colors.error} />}
                style={styles.banner}
            >
                Hay cambios críticos en la configuración del servidor que requieren su atención inmediata.
            </Banner>

            {/* Dismissible Alerts */}
            <Text variant="labelLarge" style={styles.subHeader}>INTERACTIVE ALERTS</Text>
            <View style={styles.alertList}>
                {alerts.map((alert) => (
                    <Card key={alert.id} style={styles.alertCard} mode="outlined">
                        <List.Item
                            title={alert.title}
                            description={alert.desc}
                            left={props => (
                                <Avatar.Icon
                                    {...props}
                                    icon={alert.type === 'success' ? 'check-circle-outline' : alert.type === 'warning' ? 'alert-outline' : 'information-outline'}
                                    size={40}
                                    style={{ backgroundColor: 'transparent' }}
                                    color={alert.type === 'success' ? '#4CAF50' : alert.type === 'warning' ? '#FF9800' : theme.colors.primary}
                                />
                            )}
                            right={props => <IconButton {...props} icon="close-circle-outline" onPress={() => removeAlert(alert.id)} />}
                        />
                    </Card>
                ))}
            </View>

            <Button mode="text" style={{ alignSelf: 'center' }} onPress={() => setAlerts([
                { id: '1', type: 'success', title: 'Data Synced', desc: 'All records updated.' },
                { id: '2', type: 'warning', title: 'Low Storage', desc: 'Device is 90% full.' },
                { id: '3', type: 'info', title: 'New Version', desc: 'Update available.' },
            ])}>RESETEAR ALERTAS</Button>

            {/* Progress Indicators */}
            <Text variant="labelLarge" style={[styles.subHeader, { marginTop: 24 }]}>LOADERS & PROGRESS</Text>
            <Card style={styles.progressCard}>
                <Card.Content>
                    <View style={styles.rowBetween}>
                        <Text variant="bodyMedium">Completing Upload...</Text>
                        <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>75%</Text>
                    </View>
                    <ProgressBar progress={0.75} color={theme.colors.primary} style={styles.bar} />

                    <View style={{ marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <ActivityIndicator animating={true} color={theme.colors.primary} />
                        <View style={{ flex: 1 }}>
                            <Text variant="bodyMedium">Optimizing Database</Text>
                            <ProgressBar progress={0.4} indeterminate color={theme.colors.secondary} style={styles.bar} />
                        </View>
                    </View>

                    <HelperText type="info" visible={true} style={{ marginTop: 8 }}>
                        Este proceso puede tardar unos segundos dependiendo de su conexión.
                    </HelperText>
                </Card.Content>
            </Card>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                action={{
                    label: 'Cerrar',
                    onPress: () => { },
                }}
            >
                Detalles de configuración actualizados.
            </Snackbar>
        </View>
    );
}

import { IconButton } from "react-native-paper";

const styles = StyleSheet.create({
    container: { marginBottom: 24 },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    sectionHeader: { fontWeight: "bold" },
    subHeader: { color: '#666', marginBottom: 12, textTransform: 'uppercase' },
    banner: { marginBottom: 16, borderRadius: 12, borderBottomWidth: 0 },
    alertList: { gap: 8 },
    alertCard: { borderRadius: 12 },
    progressCard: { borderRadius: 12 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    bar: { height: 6, borderRadius: 3 }
});
