import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
    Text,
    DataTable,
    useTheme,
    Avatar,
    IconButton,
    Surface,
    MD3Colors
} from "react-native-paper";

// Dummy Data
const INITIAL_DATA = [
    { id: '1', date: 'Jun 12', service: 'Electricity', amount: 12.50, status: 'Paid' },
    { id: '2', date: 'Jun 11', service: 'Water', amount: 4.20, status: 'Pending' },
    { id: '3', date: 'Jun 10', service: 'Electricity', amount: 16.85, status: 'Paid' },
    { id: '4', date: 'Jun 09', service: 'Internet', amount: 29.99, status: 'Overdue' },
    { id: '5', date: 'Jun 08', service: 'Gas', amount: 8.50, status: 'Paid' },
];

export default function StyleDataTables() {
    const theme = useTheme();
    const [data, setData] = useState(INITIAL_DATA);
    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([2, 3, 4]);
    const [itemsPerPage, setItemsPerPage] = useState(numberOfItemsPerPageList[0]);

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, data.length);

    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return '#4CAF50';
            case 'Pending': return '#FF9800';
            case 'Overdue': return theme.colors.error;
            default: return theme.colors.outline;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Avatar.Icon size={40} icon="table-outline" style={{ backgroundColor: theme.colors.primaryContainer }} color={theme.colors.primary} />
                <Text variant="titleLarge" style={styles.sectionHeader}>Data Tables (MD3)</Text>
            </View>

            {/* Smart Table */}
            <Surface style={styles.tableCard} elevation={1}>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title sortDirection='descending'>DATE</DataTable.Title>
                        <DataTable.Title>SERVICE</DataTable.Title>
                        <DataTable.Title numeric>COST</DataTable.Title>
                        <DataTable.Title style={{ justifyContent: 'center' }}>STATUS</DataTable.Title>
                    </DataTable.Header>

                    {data.slice(from, to).map((item) => (
                        <DataTable.Row key={item.id}>
                            <DataTable.Cell>{item.date}</DataTable.Cell>
                            <DataTable.Cell>{item.service}</DataTable.Cell>
                            <DataTable.Cell numeric>${item.amount.toFixed(2)}</DataTable.Cell>
                            <DataTable.Cell style={{ justifyContent: 'center' }}>
                                <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))}

                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(data.length / itemsPerPage)}
                        onPageChange={(page) => setPage(page)}
                        label={`${from + 1}-${to} of ${data.length}`}
                        numberOfItemsPerPageList={numberOfItemsPerPageList}
                        numberOfItemsPerPage={itemsPerPage}
                        onItemsPerPageChange={setItemsPerPage}
                        showFastPaginationControls
                        selectPageDropdownLabel={'Rows per page'}
                    />
                </DataTable>
            </Surface>

            {/* Simple Visual Component */}
            <Text variant="labelLarge" style={[styles.subHeader, { marginTop: 24 }]}>LIVE USAGE DATA</Text>
            <Surface style={styles.chartCard} elevation={1}>
                <View style={styles.chartHeader}>
                    <Text variant="titleSmall" style={{ color: '#666' }}>Daily Consumption</Text>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>14.5 kWh</Text>
                </View>
                <View style={styles.barsContainer}>
                    {[60, 40, 75, 50, 90, 80, 55].map((h, i) => (
                        <View key={i} style={styles.barCol}>
                            <View style={[styles.barFill, { height: `${h}%`, backgroundColor: theme.colors.primary }]} />
                            <Text variant="labelSmall" style={styles.barLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text>
                        </View>
                    ))}
                </View>
            </Surface>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 24 },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    sectionHeader: { fontWeight: "bold" },
    subHeader: { color: '#666', marginBottom: 8, marginLeft: 4, textTransform: 'uppercase' },
    tableCard: { borderRadius: 12, backgroundColor: '#fff', overflow: 'hidden' },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    chartCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12 },
    chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
    barsContainer: { flexDirection: 'row', height: 100, alignItems: 'flex-end', justifyContent: 'space-between' },
    barCol: { width: 24, alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 4 },
    barFill: { width: 10, borderRadius: 5 },
    barLabel: { fontWeight: 'bold', color: '#666' }
});
