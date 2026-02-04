import { Injectable } from "@nestjs/common";
import * as ExcelJS from "exceljs";
import { join } from "path";
import * as fs from "fs";

@Injectable()
export class M9mexExcelService {
  async generar(dto: any): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("M9MEX", {
      pageSetup: { paperSize: 9, orientation: "portrait" }, // 9 = A4 approx
    });

    // 1. Setup Columns (8 columns: A-H)
    sheet.columns = [
      { key: "A", width: 25 }, // Slightly wider Labels
      { key: "B", width: 12 },
      { key: "C", width: 12 },
      { key: "D", width: 12 },
      { key: "E", width: 12 },
      { key: "F", width: 12 },
      { key: "G", width: 12 },
      { key: "H", width: 15 },
    ];

    // Styles
    const fontNormal: Partial<ExcelJS.Font> = { name: "Arial", size: 9 };
    const fontBold: Partial<ExcelJS.Font> = { name: "Arial", size: 9, bold: true };
    const fontTitle: Partial<ExcelJS.Font> = { name: "Arial", size: 12, bold: true };
    const fontFolio: Partial<ExcelJS.Font> = { name: "Arial", size: 14, bold: true, color: { argb: "FFFF0000" } };

    const alignCenter: Partial<ExcelJS.Alignment> = { vertical: "middle", horizontal: "center", wrapText: true };
    const alignLeft: Partial<ExcelJS.Alignment> = { vertical: "bottom", horizontal: "left", wrapText: true };
    const alignRight: Partial<ExcelJS.Alignment> = { vertical: "middle", horizontal: "right" };

    const borderThin: Partial<ExcelJS.Borders> = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    // Helper: Cell with Border (default true for forms)
    const cell = (r: number, c: number, val: any, font = fontNormal, align = alignCenter, border = true) => {
      const cell = sheet.getCell(r, c);
      cell.value = val !== undefined && val !== null ? val : "";
      cell.font = font;
      cell.alignment = align;
      if (border) cell.border = borderThin;
      return cell;
    };

    // Helper: Merge with Border applied to master
    const merge = (range: string, val: any, font = fontNormal, align = alignCenter, border = true) => {
      sheet.mergeCells(range);
      const [start] = range.split(":");
      const c = sheet.getCell(start);
      c.value = val !== undefined && val !== null ? val : "";
      c.font = font;
      c.alignment = align;
      if (border) c.border = borderThin;
      return c;
    };

    // ================= HEADER =================
    // Row 1-2
    merge("A1:B2", "CFE Distribución\nCentro Oriente", fontBold, alignCenter, true);
    merge("C1:F2", "COMISIÓN FEDERAL DE ELECTRICIDAD\nDIVISIÓN CENTRO ORIENTE", fontTitle, alignCenter, true);

    // Folio (Boxed?)
    cell(1, 7, "FORMA M9MEX", fontBold, alignRight, true); // G1
    cell(1, 8, "", fontBold, alignRight, true); // H1 placeholder or merge G1:H1? User form shows separate boxes? Let's merge title
    merge("G1:H1", "FORMA M9MEX", fontBold, alignRight, true);

    merge("G2:H2", dto.folio, fontFolio, alignRight, true);

    // Date
    merge("G3:H3", "", fontNormal, alignLeft, true); // Box for date
    sheet.getCell("G3").value = "Fecha: " + (dto.fecha ? new Date(dto.fecha).toISOString().split('T')[0] : "");

    // Dept Info
    merge("A3:C4", "DEPTO. DE MEDICIÓN\nEQUIPOS DE MEDICIÓN\nINSTALACIÓN-CAMBIOS-RETIROS", { name: "Arial", size: 8, bold: true }, alignLeft, true);
    // Rows 3-4 D-F empty? Merge them to look clean
    merge("D3:F4", "", fontNormal, alignCenter, true);

    // ================= TIPO ORDEN =================
    const rTipo = 5;
    cell(rTipo, 1, "ORDEN ATENDIDA:", fontBold, alignLeft, true); // A5

    const chk = (cond: boolean) => (cond ? "( X )" : "(   )");
    merge(`B${rTipo}:C${rTipo}`, `${chk(dto.tipoOrden === "INSTALACION")} INSTALACIÓN`, fontNormal, alignLeft, true);
    merge(`D${rTipo}:E${rTipo}`, `${chk(dto.tipoOrden === "CAMBIO")} CAMBIO`, fontNormal, alignLeft, true);
    cell(rTipo, 6, `${chk(dto.tipoOrden === "RETIRO")} RETIRO`, fontNormal, alignLeft, true);
    merge(`G${rTipo}:H${rTipo}`, `${chk(dto.tipoOrden === "MODIFICACION")} MODIFICACIÓN`, fontNormal, alignLeft, true);

    // ================= USER INFO =================
    // Apply borders to label cells too
    const rUser = 6;
    cell(rUser, 1, "USUARIO:", fontBold, alignLeft, true);
    merge(`B${rUser}:H${rUser}`, dto.usuario, fontNormal, alignLeft, true);

    const rDom = 7;
    cell(rDom, 1, "DOMICILIO:", fontBold, alignLeft, true);
    merge(`B${rDom}:H${rDom}`, dto.domicilio, fontNormal, alignLeft, true);

    const rObs = 8;
    cell(rObs, 1, "OBSERVACIONES:", fontBold, alignLeft, true);
    merge(`B${rObs}:H${rObs}`, dto.observaciones, fontNormal, alignLeft, true);

    // ================= SERVICE INFO =================
    const rServ = 9; // Blank row in diagram? or compacted? Let's treat 9 as data
    // The visual form often has this section. Let's map strict rows.

    const rSE = 10;
    cell(rSE, 1, "S.E. CONSUMIDOR:", fontBold, alignLeft, true);
    merge(`B${rSE}:C${rSE}`, dto.seConsumidor, fontNormal, alignCenter, true);

    cell(rSE, 4, "MARCA:", fontBold, alignCenter, true);
    cell(rSE, 5, dto.marcaMedidor, fontNormal, alignCenter, true); // Reusing marca? Or is it TRANSF brand? Leaving simple

    cell(rSE, 6, "DEM. CONT.:", fontBold, alignCenter, true);
    cell(rSE, 7, dto.demCont, fontNormal, alignCenter, true);
    cell(rSE, 8, "KW'S", fontNormal, alignCenter, true);

    const rVolt = 11;
    cell(rVolt, 1, "VOLTAJE PRIMARIO:", fontBold, alignLeft, true);
    cell(rVolt, 2, dto.voltajePrimario, fontNormal, alignCenter, true);

    cell(rVolt, 3, "VOLTAJE SECUNDARIO:", fontBold, alignLeft, true); // Might overlap col C if width 12. Let's merge C-D?
    // Actually "VOLTAJE SECUNDARIO:" is long.
    // Let's merge C-D for label, E for value?
    // Based on cols: A(20), B(12), C(12), D(12), E(12)...
    // "VOLTAJE SECUNDARIO" in C is tight.
    // Let's force it:
    merge(`C${rVolt}:D${rVolt}`, "VOLTAJE SECUNDARIO:", fontBold, alignRight, true);
    merge(`E${rVolt}:F${rVolt}`, dto.voltajeSecundario, fontNormal, alignCenter, true);

    cell(rVolt, 7, "TARIFA:", fontBold, alignRight, true);
    cell(rVolt, 8, dto.tarifa, fontNormal, alignCenter, true);

    const rAg = 12;
    cell(rAg, 1, "SUCURSAL O AGENCIA:", fontBold, alignLeft, true);
    merge(`B${rAg}:H${rAg}`, dto.agencia, fontNormal, alignLeft, true);

    const rMed = 13;
    cell(rMed, 1, "MEDICIÓN EN:", fontBold, alignLeft, true);
    merge(`B${rMed}:D${rMed}`, `${chk(dto.medicionEn === "BAJA_TENSION")} BAJA TENSIÓN   ${chk(dto.medicionEn === "ALTA_TENSION")} ALTA TENSIÓN`, fontNormal, alignLeft, true);

    cell(rMed, 5, "COBRAR 2%:", fontBold, alignRight, true);
    merge(`F${rMed}:H${rMed}`, `${chk(dto.cobrar2Porc === "SI")} SI   ${chk(dto.cobrar2Porc === "NO")} NO`, fontNormal, alignLeft, true);

    // ================= DATA TABLE =================
    let r = 15;

    // Header Block
    merge(`A${r}:A${r + 1}`, "DATOS DE\nREGISTRO", fontBold, alignCenter, true);

    merge(`B${r}:C${r}`, "INSTALADO", fontBold, alignCenter, true);
    cell(r + 1, 2, "KWH", fontBold, alignCenter, true);
    cell(r + 1, 3, "KW", fontBold, alignCenter, true);

    merge(`D${r}:E${r}`, "RETIRADO", fontBold, alignCenter, true);
    cell(r + 1, 4, "KWH", fontBold, alignCenter, true);
    cell(r + 1, 5, "KW", fontBold, alignCenter, true);

    merge(`F${r}:H${r + 1}`, "OBSERVACIONES / OTROS", fontBold, alignCenter, true);

    r += 2; // Data Starts at 17

    const addRow = (label: string, v1: any, v2: any, v3: any, v4: any) => {
      cell(r, 1, label, fontBold, alignLeft, true);
      cell(r, 2, v1, fontNormal, alignCenter, true);
      cell(r, 3, v2, fontNormal, alignCenter, true);
      cell(r, 4, v3, fontNormal, alignCenter, true);
      cell(r, 5, v4, fontNormal, alignCenter, true);
      merge(`F${r}:H${r}`, "", fontNormal, alignCenter, true);
      r++;
    };

    addRow("No. C.F.E.", dto.noCfe, "", "", "");
    addRow("No. DE FABRICA", dto.noFabrica, "", "", "");
    addRow("MARCA", dto.marcaMedidor, "", "", "");
    addRow("TIPO", dto.tipoMedidor, "", "", "");
    addRow("CÓDIGO MEDIDOR", dto.codigoMedidor, "", "", "");
    addRow("CÓDIGO LOTE", dto.codigoLote, "", "", "");
    addRow("FASE - ELEMENTOS", dto.faseElementos, "", "", "");
    addRow("HILOS - CONEXIÓN", dto.hilosConexion, "", "", "");
    addRow("AMPS (CLASE)", dto.ampsClase, "", "", "");
    addRow("VOLTS", dto.volts, "", "", "");
    addRow("Rr-Rs", dto.rrRs, "", "", "");
    addRow("Kh-Kr", dto.khKr, "", "", "");

    // Readings Row
    cell(r, 1, "LECTURA", fontBold, alignLeft, true);
    cell(r, 2, dto.inst_kwh, fontNormal, alignCenter, true);
    cell(r, 3, dto.inst_kw, fontNormal, alignCenter, true);
    cell(r, 4, dto.ret_kwh, fontNormal, alignCenter, true);
    cell(r, 5, dto.ret_kw, fontNormal, alignCenter, true);
    merge(`F${r}:H${r}`, "", fontNormal, alignCenter, true);
    r++;

    addRow("No. DE CARÁTULAS", dto.noCaratulas, "", "", "");
    addRow("MULTIPLICADOR", dto.multiplicador, "", "", "");
    addRow("KW TIPO", dto.kwTipo, "", "", "");

    // Demanda
    cell(r, 1, "DEMANDA", fontBold, alignLeft, true);
    merge(`B${r}:C${r}`, `${chk(dto.inst_indicacion === "INDICATIVA")} INDIC. ${chk(dto.inst_indicacion === "DIRECTA")} DIR.`, { name: "Arial", size: 7 }, alignCenter, true);
    merge(`D${r}:E${r}`, `${chk(dto.ret_indicacion === "INDICATIVA")} INDIC. ${chk(dto.ret_indicacion === "DIRECTA")} DIR.`, { name: "Arial", size: 7 }, alignCenter, true);
    merge(`F${r}:H${r}`, "", fontNormal, alignCenter, true);
    r++;

    addRow("KW PERIODO", dto.kwPeriodo, "", "", "");
    addRow("ESCALA", dto.escala, "", "", "");

    // Sellos
    cell(r, 1, "SELLOS ENCONTRADOS", fontBold, alignLeft, true);
    merge(`B${r}:H${r}`, dto.selloEncontrado, fontNormal, alignLeft, true);
    r++;

    cell(r, 1, "SELLOS DEJADOS", fontBold, alignLeft, true);
    merge(`B${r}:H${r}`, dto.selloDejado, fontNormal, alignLeft, true);
    r++;

    // Signatures
    r += 2;
    const rSig = r + 4;
    const rTxt = r + 5;

    // Line 1
    merge(`B${rSig}:C${rSig}`, "", fontNormal, alignCenter, false);
    sheet.getCell(`B${rSig}`).border = { bottom: { style: "medium" } };
    merge(`B${rTxt}:C${rTxt}`, "NOMBRE Y FIRMA R.P.E.\nCALIBRADOR", fontNormal, alignCenter);

    // Line 2
    merge(`D${rSig}:E${rSig}`, "", fontNormal, alignCenter, false);
    sheet.getCell(`D${rSig}`).border = { bottom: { style: "medium" } };
    merge(`D${rTxt}:E${rTxt}`, "NOMBRE Y FIRMA R.P.E.\nTÉCNICO", fontNormal, alignCenter);

    // Line 3
    merge(`F${rSig}:H${rSig}`, "", fontNormal, alignCenter, false);
    sheet.getCell(`F${rSig}`).border = { bottom: { style: "medium" } };
    merge(`F${rTxt}:H${rTxt}`, "NOMBRE Y FIRMA R.P.E.\nJEFE DE OFICINA", fontNormal, alignCenter);


    // ================= SAVE =================
    const outputDir = join(process.cwd(), "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const outputPath = join(outputDir, `M9MEX_${dto.folio || "SIN_FOLIO"}.xlsx`);
    await workbook.xlsx.writeFile(outputPath);
    return outputPath;
  }
}
