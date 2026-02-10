import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";
import {
  Text,
  Searchbar,
  Card,
  Avatar,
  IconButton,
  FAB,
  Chip,
  useTheme,
  ActivityIndicator,
  Appbar,
} from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";

import { RootStackParamList } from "../../../App";
import { serviceRecordService } from "../../services/service_records/serviceRecordService";
import { ServiceRecord } from "../../types/service_records/service_record";
import { useDrawer } from "../../context/DrawerContext";

type Props = NativeStackScreenProps<RootStackParamList, "List">;

export default function ListScreen({ navigation }: Props) {
  const theme = useTheme();
  const { openDrawer } = useDrawer();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<ServiceRecord[]>([]);
  const [filter, setFilter] = useState<string>("TODOS");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await serviceRecordService.getRecords();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.folio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.usuario?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === "TODOS") return matchesSearch;
    return matchesSearch && item.tipoOrden === filter;
  });

  const renderItem = ({ item }: { item: ServiceRecord }) => (
    <Card
      style={styles.premiumCard}
      onPress={() => navigation.navigate("Detail", { id: item.id })}
    >
      <View style={styles.cardIndicator} />
      <Card.Title
        title={item.folio || "Sin Folio"}
        subtitle={`${item.tipoOrden} • ${item.usuario || "N/A"}`}
        titleStyle={styles.cardTitle}
        subtitleStyle={styles.cardSubtitle}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon={
              item.tipoOrden === "INSTALACION" ? "plus-circle-outline" :
                item.tipoOrden === "CAMBIO" ? "swap-horizontal-circle-outline" :
                  item.tipoOrden === "RETIRO" ? "minus-circle-outline" : "circle-edit-outline"
            }
            size={44}
            style={{ backgroundColor: '#f1f5f9' }}
            color="#006341"
          />
        )}
        right={(props) => (
          <IconButton
            {...props}
            icon="chevron-right"
            onPress={() => navigation.navigate("Detail", { id: item.id })}
          />
        )}
      />
      <Card.Content style={styles.cardContent}>
        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={14} color="#64748b" />
          <Text variant="bodySmall" style={styles.locationText} numberOfLines={1}>
            {item.calle ? `${item.calle} ${item.numExt || ""}, ${item.colonia || ""}` : (item.domicilio || "N/A")}
          </Text>
        </View>
        <View style={styles.footerRow}>
          <Text variant="labelSmall" style={styles.dateText}>
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Appbar.Header style={{ backgroundColor: '#ffffff', elevation: 0 }}>
        <Appbar.Action icon="menu" onPress={openDrawer} color="#111827" />
        <Appbar.Content title="Registros M9MEX" titleStyle={{ fontWeight: '800', color: '#111827' }} />
        <Appbar.Action icon="dots-vertical" onPress={() => { }} color="#64748b" />
      </Appbar.Header>

      <View style={styles.header}>
        <Searchbar
          placeholder="Buscar folio o usuario..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          elevation={0}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
          {["TODOS", "INSTALACION", "CAMBIO", "RETIRO", "MODIFICACION"].map((t) => (
            <Chip
              key={t}
              selected={filter === t}
              onPress={() => setFilter(t)}
              style={styles.filterChip}
              textStyle={[styles.filterChipText, filter === t && styles.selectedChipText]}
              showSelectedCheck={false}
              mode="flat"
              selectedColor="#ffffff"
            >
              {t}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006341" />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#006341"]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="search-off" size={64} color="#e2e8f0" />
              <Text variant="titleMedium" style={styles.emptyText}>No se encontraron registros</Text>
            </View>
          }
        />
      )}

      <FAB
        icon="plus"
        label="Nuevo"
        style={styles.fab}
        color="#ffffff"
        onPress={() => navigation.navigate("New")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  searchBar: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    height: 48,
  },
  searchInput: {
    fontSize: 15,
  },
  filterBar: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
  },
  selectedChipText: {
    color: "#ffffff",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  premiumCard: {
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    elevation: 0,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    overflow: "hidden",
  },
  cardIndicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#006341",
  },
  cardTitle: {
    fontWeight: "800",
    fontSize: 16,
    color: "#111827",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  cardContent: {
    paddingTop: 0,
    paddingBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  locationText: {
    color: "#475569",
    flex: 1,
  },
  footerRow: {
    marginTop: 4,
  },
  dateText: {
    color: "#94a3b8",
    textAlign: "right",
  },
  fab: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: "#5db8abe1",
    borderRadius: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
  },
  emptyText: {
    marginTop: 16,
    color: "#64748b",
  },
});
