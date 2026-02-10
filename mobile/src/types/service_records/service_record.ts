export type MarcaMedidor = "WASION" | "ELSTER";
export type Indicacion = "DIRECTA" | "INDICATIVA";
export type TipoOrden = "INSTALACION" | "CAMBIO" | "RETIRO" | "MODIFICACION";
export type MedicionEn = "BAJA_TENSION" | "ALTA_TENSION";
export type SiNo = "SI" | "NO";

export type MedidorCodigo =
  | "F623"
  | "KL28"
  | "KL2R"
  | "KL28BID"
  | "VL28"
  | "VL2R"
  | "VL28BID";

export type MedidorData = {
  noCfe: string;
  noFabrica: string;

  marcaMedidor: MarcaMedidor;
  tipoMedidor: "A3RAL";       // ✅ en tu caso es fijo
  codigoMedidor: MedidorCodigo;

  codigoLote: string;
  noCaratulas: string;
  faseElementos: string;
  hilosConexion: string;
  khKr: string;
  ampsClase: string;
  volts: string;

  // Lecturas
  kwh: string;
  kw: string;
  indicacion: Indicacion;

  // extra (excel/back)
  rrRs: string;
  lectura?: string;
  multiplicador: string;
  kwTipo: string;

  demanda: string;
  kwPeriodo: string;
  dias: string;
  escala: string;

  selloEncontrado: string;
  selloDejado: string;
};

export type ServiceRecord = {
  id: number;
  folio: string;
  fecha: string;
  tipoOrden: TipoOrden;

  ordenAtendida?: string | null;
  rpu?: string | null;

  usuario?: string | null;
  domicilio?: string | null;
  observaciones?: string | null;

  seConsumidor?: string | null;
  voltajePrimario?: string | null;
  voltajeSecundario?: string | null;
  subestacion?: string | null;
  agencia?: string | null;
  tarifa?: string | null;
  demCont?: string | null;
  kws?: string | null;

  medicionEn?: MedicionEn | null;
  cobrar2Porc?: SiNo | null;

  // medidor instalado
  noCfe?: string | null;
  noFabrica?: string | null;
  marcaMedidor?: string | null;
  tipoMedidor?: string | null;
  codigoMedidor?: string | null;
  codigoLote?: string | null;
  faseElementos?: string | null;
  hilosConexion?: string | null;
  ampsClase?: string | null;
  volts?: string | null;
  rrRs?: string | null;
  khKr?: string | null;
  lectura?: string | null;
  noCaratulas?: string | null;
  multiplicador?: string | null;
  kwTipo?: string | null;

  inst_kwh?: string | null;
  inst_kw?: string | null;
  inst_indicacion?: string | null;

  // retirado
  ret_noCfe?: string | null;
  ret_noFabrica?: string | null;
  ret_marcaMedidor?: string | null;
  ret_tipoMedidor?: string | null;
  ret_codigoMedidor?: string | null;
  ret_codigoLote?: string | null;
  ret_faseElementos?: string | null;
  ret_hilosConexion?: string | null;
  ret_ampsClase?: string | null;
  ret_volts?: string | null;
  ret_rrRs?: string | null;
  ret_khKr?: string | null;
  ret_noCaratulas?: string | null;
  ret_multiplicador?: string | null;
  ret_kwTipo?: string | null;

  ret_kwh?: string | null;
  ret_kw?: string | null;
  ret_indicacion?: string | null;

  demanda?: string | null;
  kwPeriodo?: string | null;
  dias?: string | null;
  escala?: string | null;
  selloEncontrado?: string | null;
  selloDejado?: string | null;

  recibidoPor?: string | null;
  creadoEn?: string | null;
};
