import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView, Alert } from "react-native";
import {
    Text,
    Card,
    IconButton,
    Avatar,
    useTheme,
    ProgressBar,
    MD3Colors,
    Surface,
    Button
} from "react-native-paper";

const INITIAL_PHOTOS = [
    { id: '1', uri: 'https://picsum.photos/200/200?random=1' },
    { id: '2', uri: 'https://picsum.photos/200/200?random=2' },
    { id: '3', uri: 'https://picsum.photos/200/200?random=3' },
];

export default function StyleMultimedia() {
    const theme = useTheme();
    const [photos, setPhotos] = useState(INITIAL_PHOTOS);
    const [isPlaying, setIsPlaying] = useState(false);

    const removePhoto = (id: string) => {
        Alert.alert("Eliminar Foto", "¿Estás seguro?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Eliminar", style: "destructive", onPress: () => setPhotos(photos.filter(p => p.id !== id)) }
        ]);
    };

    const addPhoto = () => {
        if (photos.length >= 5) {
            Alert.alert("Límite alcanzado", "Máximo 5 fotos.");
            return;
        }
        const newId = Date.now().toString();
        setPhotos([...photos, { id: newId, uri: `https://picsum.photos/200/200?random=${newId}` }]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Avatar.Icon size={40} icon="image-multiple-outline" style={{ backgroundColor: theme.colors.tertiaryContainer }} color={theme.colors.tertiary} />
                <Text variant="titleLarge" style={styles.sectionHeader}>Multimedia & Attachment</Text>
            </View>

            {/* Photo Grid */}
            <Text variant="labelLarge" style={styles.subHeader}>Site Documentation Photos</Text>
            <View style={styles.photoGrid}>
                {photos.map((photo) => (
                    <Surface key={photo.id} style={styles.photoSurface} elevation={1}>
                        <Image source={{ uri: photo.uri }} style={styles.photo} />
                        <IconButton
                            icon="close-circle-outline"
                            size={14}
                            containerColor="rgba(0,0,0,0.6)"
                            iconColor="#fff"
                            style={styles.removeBtn}
                            onPress={() => removePhoto(photo.id)}
                        />
                    </Surface>
                ))}

                {photos.length < 5 && (
                    <Surface style={[styles.photoSurface, styles.addBtnSurface]} elevation={0}>
                        <IconButton
                            icon="camera-plus-outline"
                            size={32}
                            onPress={addPhoto}
                            iconColor={theme.colors.outline}
                        />
                        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>AÑADIR</Text>
                    </Surface>
                )}
            </View>
            <Text variant="bodySmall" style={styles.counterText}>{photos.length} de 5 fotos utilizadas</Text>

            {/* File List */}
            <Text variant="labelLarge" style={[styles.subHeader, { marginTop: 24 }]}>Attached Files</Text>
            <Card style={styles.card} mode="outlined">
                <Card.Content style={{ padding: 0 }}>
                    <List.Item
                        title="Safety_Inspection_v2.pdf"
                        description="2.4 MB • 10:30 AM"
                        left={props => <Avatar.Icon {...props} icon="file-pdf-box" size={40} style={{ backgroundColor: '#ffebee' }} color="#d32f2f" />}
                        right={props => <IconButton {...props} icon="dots-vertical" />}
                    />
                    <Divider />
                    <List.Item
                        title="Inventory_Sheet.xlsx"
                        description="850 KB • Yesterday"
                        left={props => <Avatar.Icon {...props} icon="file-excel-box" size={40} style={{ backgroundColor: '#e8f5e9' }} color="#2e7d32" />}
                        right={props => <IconButton {...props} icon="dots-vertical" />}
                    />
                </Card.Content>
            </Card>

            {/* Audio Player */}
            <Text variant="labelLarge" style={[styles.subHeader, { marginTop: 24 }]}>Voice Note</Text>
            <Card style={styles.playerCard}>
                <Card.Content style={styles.playerContent}>
                    <IconButton
                        icon={isPlaying ? "pause-circle-outline" : "play-circle-outline"}
                        mode="contained"
                        containerColor={isPlaying ? theme.colors.primary : theme.colors.surfaceVariant}
                        iconColor={isPlaying ? theme.colors.onPrimary : theme.colors.primary}
                        onPress={() => setIsPlaying(!isPlaying)}
                    />
                    <View style={styles.trackInfo}>
                        <Text variant="titleSmall">Field_Report_001.mp3</Text>
                        <ProgressBar
                            progress={isPlaying ? 0.45 : 0}
                            color={theme.colors.primary}
                            style={styles.progress}
                        />
                    </View>
                    <Text variant="labelSmall" style={styles.timeText}>{isPlaying ? "0:12" : "0:00"}</Text>
                </Card.Content>
            </Card>
        </View>
    );
}

import { List, Divider } from "react-native-paper";

const styles = StyleSheet.create({
    container: { marginBottom: 24 },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    sectionHeader: { fontWeight: "bold" },
    subHeader: { color: '#666', marginBottom: 12, textTransform: 'uppercase' },
    photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    photoSurface: { width: 80, height: 80, borderRadius: 12, overflow: 'hidden', position: 'relative' },
    photo: { width: '100%', height: '100%' },
    removeBtn: { position: 'absolute', top: -4, right: -4, margin: 0 },
    addBtnSurface: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        backgroundColor: 'transparent'
    },
    counterText: { textAlign: 'right', marginTop: 8, color: '#666' },
    card: { borderRadius: 12 },
    playerCard: { borderRadius: 12 },
    playerContent: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
    trackInfo: { flex: 1 },
    progress: { height: 4, borderRadius: 2, marginTop: 8 },
    timeText: { fontVariant: ['tabular-nums'], minWidth: 35 }
});
