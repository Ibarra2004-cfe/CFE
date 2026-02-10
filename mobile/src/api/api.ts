// src/api/api.ts
import axios from "axios";
import { Platform } from "react-native";

const DEV_PC_IP = "192.168.1.42";
const PORT = "3006";

const baseURL =
  Platform.OS === "web"
    ? `http://localhost:${PORT}`
    : `http://${DEV_PC_IP}:${PORT}`;

export const api = axios.create({
  baseURL,
  timeout: 30000, 
});
