import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListScreen from "./src/screens/ListScreens";
import NewScreen from "./src/screens/NewScreen";
import DetailScreen from "./src/screens/DetailScreen";
import EditScreen from "./src/screens/EditScreen";


export type RootStackParamList = {
  List: undefined;
  New: undefined;
  Detail: { id: number };
    Edit: { id: number }; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List" component={ListScreen} options={{ title: "Registros M9MEX" }} />
        <Stack.Screen name="New" component={NewScreen} options={{ title: "Nuevo M9MEX" }} />
        <Stack.Screen name="Edit" component={EditScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: "Detalle M9MEX" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
