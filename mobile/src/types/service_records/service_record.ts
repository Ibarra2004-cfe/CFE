export type TipoOrden = "INSTALACION" | "CAMBIO" | "RETIRO" | "MODIFICACION";
export type MedicionEn = "BAJA_TENSION" | "ALTA_TENSION";
export type MarcaMedidor = "WASION" | "ELSTER";
export type CodigoMedidor =
    | "F623"
    | "KL28"
    | "KL2R"
    | "KL28BID"
    | "VL28"
    | "VL2R"
    | "VL28BID";

export const MARCAS_MEDIDOR: { label: string; value: MarcaMedidor }[] = [
    { label: "WASION", value: "WASION" },
    { label: "ELSTER", value: "ELSTER" },
];

export const CODIGOS_MEDIDOR: { label: string; value: CodigoMedidor }[] = [
    { label: "F623", value: "F623" },
    { label: "KL28", value: "KL28" },
    { label: "KL2R", value: "KL2R" },
    { label: "KL28BID", value: "KL28BID" },
    { label: "VL28", value: "VL28" },
    { label: "VL2R", value: "VL2R" },
    { label: "VL28BID", value: "VL28BID" },
];

export const TIPO_MEDIDOR_OPTIONS = [
    { label: "A3RAL", value: "A3RAL" },
    { label: "A3RAL7", value: "A3RAL7" },
    { label: "S12S", value: "S12S" },
];

export interface MedidorData {
    noCfe: string;
    noFabrica: string;
    marcaMedidor: MarcaMedidor;
    tipoMedidor: string;
    codigoMedidor: CodigoMedidor;
    codigoLote: string;
    noCaratulas: string;
    faseElementos: string;
    hilosConexion: string;
    khKr: string;
    ampsClase: string;
    volts: string;
    selloEncontrado?: string;
    selloDejado?: string;
    kwh: string;
    kw: string;
    kwTipo?: string;
    multiplicador?: string;
    indicacion?: "DIRECTA" | "INDICATIVA";
}

export interface ServiceRecord {
    id: number;
    folio: string;
    tipoOrden: string;
    fecha?: string;
    ordenAtendida?: string;
    usuario?: string;
    domicilio?: string;
    observaciones?: string;

    seConsumidor?: string;
    voltajePrimario?: string;
    voltajeSecundario?: string;
    subestacion?: string;
    agencia?: string;
    tarifa?: string;
    demCont?: string;
    kws?: string;
    medicionEn?: string;
    cobrar2Porc?: string;
    recibidoPor?: string;

    // Installed Meter Data (Mapped to flat structure by backend presumably)
    noCfe?: string;
    noFabrica?: string;
    marcaMedidor?: string;
    tipoMedidor?: string;
    codigoMedidor?: string;
    codigoLote?: string;
    noCaratulas?: string;
    faseElementos?: string;
    hilosConexion?: string;
    khKr?: string;
    ampsClase?: string;
    volts?: string;

    inst_kwh?: string;
    inst_kw?: string;
    inst_indicacion?: string;
    kwTipo?: string;
    multiplicador?: string;
    selloEncontrado?: string;
    selloDejado?: string;

    // Removed Meter Data
    ret_noCfe?: string;
    ret_noFabrica?: string;
    ret_marcaMedidor?: string;
    ret_tipoMedidor?: string;
    ret_codigoMedidor?: string;
    ret_codigoLote?: string;
    ret_noCaratulas?: string;
    ret_faseElementos?: string;
    ret_hilosConexion?: string;
    ret_khKr?: string;
    ret_ampsClase?: string;
    ret_volts?: string;
    ret_kwh?: string;
    ret_kw?: string;
    ret_indicacion?: string;
    ret_kwTipo?: string;
    ret_multiplicador?: string;

    sector?: string;
    noSerie?: string;
    noMedidor?: string;
    clave?: string;
    poblacion?: string;
    colonia?: string;
    calle?: string;
    numExt?: string;
    numInt?: string;
    entreCalle1?: string;
    entreCalle2?: string;
    referencia?: string;
    giro?: string;
    estado?: string;
    anomalia?: string;

    coordenadas?: {
        latitude: number;
        longitude: number;
    };
    fotos?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export type CreateServiceRecordData = Omit<ServiceRecord, "id" | "createdAt" | "updatedAt">;
export type UpdateServiceRecordData = Partial<CreateServiceRecordData>;
