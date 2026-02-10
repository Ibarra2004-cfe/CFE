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

    // Lecturas
    kwh: string;
    kw: string;
    kwTipo?: string;
    multiplicador?: string;

    indicacion?: "DIRECTA" | "INDICATIVA";
}

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
