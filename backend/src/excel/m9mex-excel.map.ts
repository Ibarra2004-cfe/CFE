export const M9MEX_EXCEL_MAP = {
  // ======================
  // ENCABEZADO
  // ======================
  fecha: "H2",

  tipoOrden: {
    INSTALACION: "B4",
    CAMBIO: "D4",
    RETIRO: "F4",
    MODIFICACION: "H4",
  },

  usuario: "B6",
  domicilio: "B7",
  observaciones: "B8",

  // ======================
  // SERVICIO
  // ======================
  seConsumidor: "B10",
  voltajePrimario: "B11",
  voltajeSecundario: "E11",
  subestacionAgencia: "B12",
  tarifa: "H11",
  kws: "H10",

  medicionEn: {
    BAJA_TENSION: "B14",
    ALTA_TENSION: "D14",
  },

  cobrar2Porc: {
    SI: "F14",
    NO: "H14",
  },

  // ======================
  // MEDIDOR
  // ======================
  medidor: {
    noCfe: "B17",
    noFabrica: "B18",
    marcaMedidor: "B19",
    tipoMedidor: "B20",
    codigoMedidor: "B21",
    codigoLote: "B22",
    faseElementos: "B23",
    hilosConexion: "B24",
    ampsClase: "B25",
    volts: "B26",
  },

  // ======================
  // KWH / KW
  // ======================
  instalado: {
    kwh: "D17",
    kw: "E17",
  },

  retirado: {
    kwh: "F17",
    kw: "G17",
  },

  // ======================
  // DEMANDA
  // ======================
  demanda: {
    INSTALADO: {
      INDICATIVA: "D25",
      DIRECTA: "D26",
    },
    RETIRADO: {
      INDICATIVA: "F25",
      DIRECTA: "F26",
    },
  },

  kwPeriodo: "B28",
  escala: "B29",

  // ======================
  // SELLOS
  // ======================
  sellos: {
    encontrado: "B31",
    dejado: "B32",
  },

  // ======================
  // TRANSFORMADORES
  // ======================
  transformador: {
    noSerie: "B35",
    marcaTipo: "B36",
    relacion: "B37",
    corriente: "D35",
    potencial: "E35",
    garganta: "F37",
  },

  // ======================
  // FIRMAS
  // ======================
  recibidoPor: "H36",
};
