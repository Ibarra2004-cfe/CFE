import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
    Text,
    Card,
    List,
    Avatar,
    useTheme,
    IconButton,
    Surface
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

export default function StyleMotion() {
    const theme = useTheme();
    const [expanded, setExpanded] = React.useState(true);

    const handlePress = () => setExpanded(!expanded);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Avatar.Icon size={40} icon="animation-outline" style={{ backgroundColor: theme.colors.secondaryContainer }} color={theme.colors.secondary} />
                <Text variant="titleLarge" style={styles.sectionHeader}>Motion & Physics</Text>
            </View>

            {/* 01. Physics Demo */}
            <Card style={styles.card}>
                <Card.Title title="Transition Curves" titleVariant="titleMedium" />
                <Card.Content>
                    <View style={styles.grid}>
                        <Surface style={styles.curveCard} elevation={1}>
                            <MaterialIcons name="gesture" size={32} color={theme.colors.primary} />
                            <Text variant="labelLarge">Spring</Text>
                            <Text variant="bodySmall" style={styles.curveDesc}>Bouncy</Text>
                        </Surface>
                        <Surface style={styles.curveCard} elevation={1}>
                            <MaterialIcons name="show-chart" size={32} color={theme.colors.secondary} />
                            <Text variant="labelLarge">Ease-Out</Text>
                            <Text variant="bodySmall" style={styles.curveDesc}>Smooth</Text>
                        </Surface>
                        <Surface style={styles.curveCard} elevation={1}>
                            <MaterialIcons name="linear-scale" size={32} color={theme.colors.outline} />
                            <Text variant="labelLarge">Linear</Text>
                            <Text variant="bodySmall" style={styles.curveDesc}>Constant</Text>
                        </Surface>
                    </View>
                </Card.Content>
            </Card>

            {/* 02. Interactive Accordion */}
            <Text variant="labelLarge" style={[styles.subHeader, { marginTop: 24 }]}>ACCCORDION SYSTEM</Text>

            <List.Accordion
                title="Project Alpha Phase 1"
                description="Viewing details"
                left={props => <List.Icon {...props} icon="folder-outline" />}
                expanded={expanded}
                onPress={handlePress}
                style={styles.accordion}
            >
                <List.Item
                    title="Due Date"
                    description="Oct 12, 2024"
                    left={props => <List.Icon {...props} icon="calendar-outline" />}
                />
                <List.Item
                    title="Assigned Team"
                    description="Team Alpha"
                    left={props => <List.Icon {...props} icon="account-group-outline" />}
                />
            </List.Accordion>

            <List.Accordion
                title="Project Alpha Phase 2"
                description="Tap to expand"
                left={props => <List.Icon {...props} icon="folder-outline" />}
                style={styles.accordion}
            >
                <List.Item
                    title="Due Date"
                    description="Oct 20, 2024"
                    left={props => <List.Icon {...props} icon="calendar-outline" />}
                />
                <List.Item
                    title="Assigned Team"
                    description="Team Beta"
                    left={props => <List.Icon {...props} icon="account-group-outline" />}
                />
            </List.Accordion>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 24 },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    sectionHeader: { fontWeight: "bold" },
    card: { borderRadius: 12 },
    grid: { flexDirection: 'row', gap: 12 },
    curveCard: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        gap: 4
    },
    curveDesc: { color: '#666', textAlign: 'center' },
    subHeader: { color: '#666', marginBottom: 8, marginLeft: 4 },
    accordion: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 4,
        borderWidth: 1,
        borderColor: '#eee'
    }
});
