import React from "react";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DrawerProvider } from "./src/context/DrawerContext";

import ListScreen from "./src/screens/service_records/ListScreens";
import NewScreen from "./src/screens/service_records/NewScreen";
import DetailScreen from "./src/screens/service_records/DetailScreen";
import EditScreen from "./src/screens/service_records/EditScreen"; // ✅ NUEVO

export type RootStackParamList = {
  List: undefined;
  New: undefined;
  Detail: { id: number };
  Edit: { id: number }; // ✅ NUEVO
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider>
      <DrawerProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="List" component={ListScreen} />
            <Stack.Screen name="New" component={NewScreen} />
            <Stack.Screen name="Detail" component={DetailScreen} />
            <Stack.Screen name="Edit" component={EditScreen} />{/* ✅ */}
          </Stack.Navigator>
        </NavigationContainer>
      </DrawerProvider>
    </PaperProvider>
  );
}
