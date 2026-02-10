import React, { useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    Animated,
    Dimensions,
    SafeAreaView,
} from "react-native";
import {
    Text,
    Drawer,
    useTheme,
    Surface,
    Avatar,
    Divider
} from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDrawer } from "../../context/DrawerContext";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.75;

export default function CustomDrawer() {
    const { isDrawerOpen, closeDrawer } = useDrawer();
    const navigation = useNavigation<any>();
    const theme = useTheme();

    // Animation Refs
    const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isDrawerOpen) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -DRAWER_WIDTH,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isDrawerOpen]);

    const navigateTo = (screen: string) => {
        navigation.navigate(screen);
        closeDrawer();
    };

    return (
        <View
            style={[styles.container, !isDrawerOpen && { pointerEvents: 'none' }]}
        >
            {/* Backdrop */}
            <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
                <Surface style={styles.backdropPressable} elevation={0}>
                    <Drawer.Item label="" onPress={closeDrawer} style={{ flex: 1, backgroundColor: 'transparent' }} />
                </Surface>
            </Animated.View>

            {/* Drawer Content */}
            <Animated.View
                style={[styles.drawer, { transform: [{ translateX: slideAnim }], backgroundColor: theme.colors.surface }]}
            >
                <SafeAreaView style={styles.content}>
                    <View style={styles.header}>
                        <Avatar.Icon size={50} icon="account-hard-hat" style={{ backgroundColor: theme.colors.primaryContainer }} color={theme.colors.primary} />
                        <View>
                            <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>CFE Mobile</Text>
                            <Text variant="bodySmall">Sistema de Registros</Text>
                        </View>
                    </View>

                    <Divider style={{ marginVertical: 10 }} />

                    <Drawer.Section title="Principal">
                        <Drawer.Item
                            label="Inicio (Registros)"
                            icon="format-list-bulleted"
                            onPress={() => navigateTo("List")}
                        />
                        <Drawer.Item
                            label="Catálogo de Estilos"
                            icon="palette-swatch-outline"
                            onPress={() => navigateTo("Styles")}
                        />
                    </Drawer.Section>

                    <Drawer.Section title="Configuración">
                        <Drawer.Item
                            label="Sincronizar Datos"
                            icon="sync"
                            onPress={() => { }}
                        />
                        <Drawer.Item
                            label="Cerrar Sesión"
                            icon="logout-variant"
                            onPress={() => { }}
                        />
                    </Drawer.Section>

                    <View style={styles.footer}>
                        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>v1.1.0 (MD3 + Paper)</Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>SDK 54 Refactor</Text>
                    </View>
                </SafeAreaView>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
        elevation: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    backdropPressable: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    drawer: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    content: {
        flex: 1,
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 15,
        marginBottom: 10
    },
    footer: {
        marginTop: "auto",
        alignItems: "center",
        paddingBottom: 20
    },
});
