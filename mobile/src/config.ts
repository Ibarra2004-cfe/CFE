import { Platform } from "react-native";

const LAN_IP = "192.168.1.84"; // ✅ tu laptop (misma red WiFi)
const PORT = 3006;

export const API_URL =
  Platform.OS === "web"
    ? `http://localhost:${PORT}` // ✅ si usas Expo Web en la misma laptop
    : `http://${LAN_IP}:${PORT}`; // ✅ si abres en celular/emulador
