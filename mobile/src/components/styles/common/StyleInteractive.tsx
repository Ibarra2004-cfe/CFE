import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
    Text,
    Chip,
    Checkbox,
    RadioButton,
    Switch,
    Card,
    List,
    Avatar,
    useTheme,
    IconButton
} from "react-native-paper";

// Dummy Data for Logic Demo
const ALL_ASSETS = [
    { id: '1', name: 'Generator A-1', status: 'Critical', type: 'Generator' },
    { id: '2', name: 'Substation North', status: 'Online', type: 'Substation' },
    { id: '3', name: 'Pump Station 4', status: 'Maintenance', type: 'Pump' },
    { id: '4', name: 'Control Panel X', status: 'Online', type: 'Control' },
    { id: '5', name: 'Backup Gen B', status: 'Offline', type: 'Generator' },
];

export default function StyleInteractive() {
    const theme = useTheme();
    const [activeChip, setActiveChip] = useState("All");
    const [assets, setAssets] = useState(ALL_ASSETS);

    // Toggle States
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // Radio/Check States
    const [selectedFrequency, setSelectedFrequency] = useState("daily");
    const [checkedOptions, setCheckedOptions] = useState<string[]>(["opt1"]);

    // Filter Logic
    const handleFilter = (status: string) => {
        setActiveChip(status);
        if (status === "All") {
            setAssets(ALL_ASSETS);
        } else {
            setAssets(ALL_ASSETS.filter(a => a.status === status));
        }
    };

    const toggleCheckbox = (id: string) => {
        if (checkedOptions.includes(id)) {
            setCheckedOptions(checkedOptions.filter(c => c !== id));
        } else {
            setCheckedOptions([...checkedOptions, id]);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Avatar.Icon size={40} icon="gesture-tap-button" style={{ backgroundColor: theme.colors.primaryContainer }} color={theme.colors.primary} />
                <Text variant="titleLarge" style={styles.sectionHeader}>Interactive Controls</Text>
            </View>

            {/* 01. Functional Filter & List */}
            <Card style={styles.card}>
                <Card.Title
                    title="Asset Status Filter"
                    subtitle="Tap chips to filter the list below"
                    titleVariant="titleMedium"
                />
                <Card.Content>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                        {["All", "Critical", "Maintenance", "Offline", "Online"].map((status) => (
                            <Chip
                                key={status}
                                selected={activeChip === status}
                                onPress={() => handleFilter(status)}
                                style={styles.chip}
                                icon={status === "All" ? "dns-outline" :
                                    status === "Critical" ? "alert-circle-outline" :
                                        status === "Maintenance" ? "wrench-outline" :
                                            status === "Offline" ? "wifi-off" : "check-circle-outline"}
                            >
                                {status}
                            </Chip>
                        ))}
                    </ScrollView>

                    <List.Section>
                        {assets.map((item) => (
                            <List.Item
                                key={item.id}
                                title={item.name}
                                description={`${item.type} • ${item.status}`}
                                left={props => (
                                    <View style={[styles.statusIndicator, {
                                        backgroundColor: item.status === 'Critical' ? theme.colors.error :
                                            item.status === 'Online' ? '#4CAF50' :
                                                item.status === 'Maintenance' ? '#FF9800' : theme.colors.outline
                                    }]} />
                                )}
                                right={props => <List.Icon {...props} icon="chevron-right" />}
                                style={styles.listItem}
                            />
                        ))}
                        {assets.length === 0 && (
                            <Text variant="bodyMedium" style={styles.emptyText}>No assets found for this filter.</Text>
                        )}
                    </List.Section>
                </Card.Content>
            </Card>

            {/* 02. Form Controls */}
            <Text variant="titleMedium" style={[styles.sectionHeader, { marginTop: 24 }]}>Form Controls</Text>

            <Card style={styles.card}>
                <Card.Content>
                    {/* Checkboxes */}
                    <Text variant="labelLarge" style={styles.groupLabel}>PREFERENCES</Text>

                    <List.Item
                        title="Enable Auto-Sync"
                        left={props => (
                            <Checkbox
                                status={checkedOptions.includes("opt1") ? 'checked' : 'unchecked'}
                                onPress={() => toggleCheckbox("opt1")}
                            />
                        )}
                        onPress={() => toggleCheckbox("opt1")}
                    />

                    <List.Item
                        title="Use Cellular Data"
                        left={props => (
                            <Checkbox
                                status={checkedOptions.includes("opt2") ? 'checked' : 'unchecked'}
                                onPress={() => toggleCheckbox("opt2")}
                            />
                        )}
                        onPress={() => toggleCheckbox("opt2")}
                    />

                    <Divider style={styles.divider} />

                    {/* Radio Group */}
                    <Text variant="labelLarge" style={styles.groupLabel}>SYNC FREQUENCY</Text>
                    <RadioButton.Group onValueChange={value => setSelectedFrequency(value)} value={selectedFrequency}>
                        <List.Item
                            title="Daily (Midnight)"
                            left={props => <RadioButton value="daily" />}
                            onPress={() => setSelectedFrequency("daily")}
                        />
                        <List.Item
                            title="Manual Only"
                            left={props => <RadioButton value="manual" />}
                            onPress={() => setSelectedFrequency("manual")}
                        />
                    </RadioButton.Group>

                    <Divider style={styles.divider} />

                    {/* Toggles */}
                    <Text variant="labelLarge" style={styles.groupLabel}>SYSTEM SETTINGS</Text>
                    <List.Item
                        title="Push Notifications"
                        description="Get alerts for critical failures"
                        right={props => (
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                            />
                        )}
                    />
                </Card.Content>
            </Card>
        </View>
    );
}

import { Divider } from "react-native-paper";

const styles = StyleSheet.create({
    container: { marginBottom: 24 },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    sectionHeader: { fontWeight: "bold" },
    card: { borderRadius: 12, overflow: 'hidden' },
    chipRow: { gap: 8, paddingBottom: 8, paddingHorizontal: 4 },
    chip: { marginBottom: 8 },
    listItem: { paddingLeft: 0 },
    statusIndicator: { width: 12, height: 12, borderRadius: 6, alignSelf: 'center', marginLeft: 16, marginRight: 8 },
    groupLabel: { color: '#666', marginTop: 8, marginBottom: 4 },
    divider: { marginVertical: 8 },
    emptyText: { textAlign: 'center', padding: 20, color: '#666', fontStyle: 'italic' },
});
