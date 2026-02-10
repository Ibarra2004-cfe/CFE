import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PaperProvider, MD3LightTheme, configureFonts } from "react-native-paper";
import ListScreen from "./src/screens/service_records/ListScreens";
import NewScreen from "./src/screens/service_records/NewScreen";
import DetailScreen from "./src/screens/service_records/DetailScreen";
import EditScreen from "./src/screens/service_records/EditScreen";
import StylesScreen from "./src/screens/styles/StylesScreen";

export type RootStackParamList = {
  List: undefined;
  New: undefined;
  Detail: { id: number };
  Edit: { id: number };
  Styles: undefined;
};

import { DrawerProvider } from "./src/context/DrawerContext";
import { ServiceRecordsProvider } from "./src/context/service_records/ServiceRecordsContext";
import CustomDrawer from "./src/components/common/CustomDrawer";

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#006341", // CFE Green
    primaryContainer: "#e8f5e9",
    secondary: "#d4af37", // Gold
    secondaryContainer: "#fffde7",
    tertiary: "#004d33",
    error: "#b00020",
    background: "#f5f5f5",
    surface: "#ffffff",
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <ServiceRecordsProvider>
        <DrawerProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="List" component={ListScreen} options={{ headerShown: false }} />
              <Stack.Screen name="New" component={NewScreen} options={{ title: "Nuevo M9MEX" }} />
              <Stack.Screen name="Edit" component={EditScreen} />
              <Stack.Screen name="Detail" component={DetailScreen} options={{ title: "Detalle M9MEX" }} />
              <Stack.Screen name="Styles" component={StylesScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
            <CustomDrawer />
          </NavigationContainer>
        </DrawerProvider>
      </ServiceRecordsProvider>
    </PaperProvider>
  );
}
