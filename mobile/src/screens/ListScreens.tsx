import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { api } from "../api/client";

type Props = NativeStackScreenProps<RootStackParamList, "List">;

export default function ListScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/m9mex");
      setItems(res.data);
    } catch {
      Alert.alert("Error", "No se pudieron cargar los registros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registros M9MEX</Text>

      <Pressable
        style={styles.newBtn}
        onPress={() => navigation.navigate("New")}
      >
        <Text style={styles.newBtnText}>Nuevo registro</Text>
      </Pressable>

      {loading && <Text>Cargando...</Text>}

      {!loading && items.length === 0 && (
        <Text>No hay registros</Text>
      )}

      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.folio}>{item.folio}</Text>
          <Text>Tipo: {item.tipoOrden}</Text>
          <Text>Usuario: {item.usuario ?? "-"}</Text>

          {/* 👇 VER DETALLE */}
          <Pressable
            style={styles.btn}
            onPress={() =>
              navigation.navigate("Detail", { id: item.id })
            }
          >
            <Text style={styles.btnText}>Ver detalle</Text>
          </Pressable>

          {/* 👇 EDITAR (ESTO ES LO QUE FALTABA BIEN HECHO) */}
          <Pressable
            style={styles.btn}
            onPress={() =>
              navigation.navigate("Edit", { id: item.id })
            }
          >
            <Text style={styles.btnText}>Editar</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
  },
  newBtn: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  newBtnText: {
    color: "#fff",
    fontWeight: "900",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  folio: {
    fontWeight: "900",
  },
  btn: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
});
