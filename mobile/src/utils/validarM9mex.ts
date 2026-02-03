type TipoOrden = "INSTALACION" | "CAMBIO" | "RETIRO" | "MODIFICACION";
type MedicionEn = "BAJA_TENSION" | "ALTA_TENSION";
type SiNo = "SI" | "NO";

type MarcaMedidor = "WASION" | "ELSTER";
type CodigoMedidor =
  | "F623"
  | "KL28"
  | "KL2R"
  | "KL28BID"
  | "VL28"
  | "VL2R"
  | "VL28BID";

export function validarM9mex(form: any): string | null {
  // ===== ORDEN =====
  if (!form.tipoOrden) return "Selecciona el tipo de orden";

  // ===== MEDICIÓN =====
  if (!form.medicionEn) return "Selecciona la medición";
  if (!form.cobrar2Porc) return "Selecciona si se cobra el 2%";

  // ===== DATOS GENERALES =====
  if (!form.usuario?.trim()) return "El usuario es obligatorio";
  if (!form.domicilio?.trim()) return "El domicilio es obligatorio";

  // ===== MEDIDOR =====
  if (!form.noCfe?.trim()) return "No. CFE es obligatorio";
  if (!form.marcaMedidor) return "Selecciona la marca del medidor";
  if (!form.codigoMedidor) return "Selecciona el código del medidor";

  const marcasValidas: MarcaMedidor[] = ["WASION", "ELSTER"];
  if (!marcasValidas.includes(form.marcaMedidor)) {
    return "Marca de medidor inválida";
  }

  const codigosValidos: CodigoMedidor[] = [
    "F623",
    "KL28",
    "KL2R",
    "KL28BID",
    "VL28",
    "VL2R",
    "VL28BID",
  ];
  if (!codigosValidos.includes(form.codigoMedidor)) {
    return "Código de medidor inválido";
  }

  // ===== INSTALADO / RETIRADO =====
  const esInst =
    form.tipoOrden === "INSTALACION" ||
    form.tipoOrden === "CAMBIO" ||
    form.tipoOrden === "MODIFICACION";

  const esRet =
    form.tipoOrden === "RETIRO" ||
    form.tipoOrden === "CAMBIO" ||
    form.tipoOrden === "MODIFICACION";

  if (esInst) {
    if (!form.inst_kwh) return "KWH instalado obligatorio";
    if (!form.inst_kw) return "KW instalado obligatorio";
  }

  if (esRet) {
    if (!form.ret_kwh) return "KWH retirado obligatorio";
    if (!form.ret_kw) return "KW retirado obligatorio";
  }

  // ===== NUMÉRICOS =====
  const num = /^\d+(\.\d+)?$/;
  if (form.inst_kwh && !num.test(form.inst_kwh)) return "KWH instalado inválido";
  if (form.inst_kw && !num.test(form.inst_kw)) return "KW instalado inválido";
  if (form.ret_kwh && !num.test(form.ret_kwh)) return "KWH retirado inválido";
  if (form.ret_kw && !num.test(form.ret_kw)) return "KW retirado inválido";

  // ===== CIERRE =====
  if (!form.recibidoPor?.trim()) return "Recibido por es obligatorio";

  return null;
}
