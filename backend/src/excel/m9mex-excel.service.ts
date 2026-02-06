import { Injectable } from "@nestjs/common";
import * as ExcelJS from "exceljs";
import { join } from "path";
import * as fs from "fs";

@Injectable()
export class M9mexExcelService {
  async generar(dto: any): Promise<string> {
    const templatePath = join(process.cwd(), "src/excel/templates/M9MEX.xlsx");

    // Verify template exists
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found at ${templatePath}`);
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const sheet = workbook.getWorksheet("M9MEX") || workbook.worksheets[0];

    // Helper: Set Value
    const set = (ref: string, val: any) => {
      const c = sheet.getCell(ref);
      c.value = val !== undefined && val !== null ? val : "";
    };

    // Helper: Checkbox
    const chk = (cond: boolean, text: string) => cond ? `( X ) ${text}` : `(   ) ${text}`;

    // ================= HEADER =================
    set("H2", dto.folio);
    set("H3", dto.fecha ? new Date(dto.fecha).toISOString().split('T')[0] : "");

    // ================= TIPO ORDEN (Row 5) =================
    // Based on debug output, these are text cells.
    set("B5", chk(dto.tipoOrden === "INSTALACION", "INSTALACIÓN"));
    // B5 merges B-C usually? Script showed B5 and C5 with same text? 
    // If merged, setting B5 is enough.

    set("D5", chk(dto.tipoOrden === "CAMBIO", "CAMBIO"));
    set("F5", chk(dto.tipoOrden === "RETIRO", "RETIRO"));
    set("G5", chk(dto.tipoOrden === "MODIFICACION", "MODIFICACIÓN"));

    // ================= USER INFO =================
    set("B8", dto.usuario);
    set("B9", dto.domicilio);
    set("B10", dto.observaciones);

    // ================= SERVICE INFO =================
    set("B12", dto.seConsumidor);
    set("E12", dto.marcaMedidor); // Label D12 MARCA, Value E12?
    set("G12", dto.demCont);      // Label F12 DEM CONT, Value G12?
    // H12 is KW'S label

    set("B13", dto.voltajePrimario);
    set("D13", dto.voltajeSecundario);

    // Agencia E13 label, Value F13?
    set("F13", dto.agencia);

    // H13 is TARIFA label. Usually value next to it? Or appended?
    // Template might have formatted text "TARIFA: [value]". 
    // Let's modify H13 content if it matches "TARIFA:"
    const tarifaCell = sheet.getCell("H13");
    if (tarifaCell.value && String(tarifaCell.value).includes("TARIFA")) {
      tarifaCell.value = `TARIFA: ${dto.tarifa || ''}`;
    } else {
      // Fallback or if empty
      tarifaCell.value = dto.tarifa;
    }

    // ================= MEDICION EN (Row 15) =================
    const medText = `${chk(dto.medicionEn === "BAJA_TENSION", "BAJA TENSIÓN")}   ${chk(dto.medicionEn === "ALTA_TENSION", "ALTA TENSIÓN")}`;
    set("B15", medText);

    const cobText = `${chk(dto.cobrar2Porc === "SI", "SI")}   ${chk(dto.cobrar2Porc === "NO", "NO")}`;
    set("F15", cobText);
    // Wait, debug showed F15, G15, H15 all having text? Likely merged F-H.

    // ================= GRID DATA (Rows 19-30) =================
    // Columns: B (Inst KWH?), C (Inst KW?), D (Ret KWH?), E (Ret KW?)
    // Based on headers at Row 18: B=KWH, C=KW, D=KWH, E=KW.
    // However, mapping logic:
    // "No CFE" -> B19. Does it have 4 values? Usually only one?
    // If it's the meter number, it's usually one value.
    // But the form allows Inst/Ret. 
    // DTO `noCfe` is single string. I'll put it in B19 (Instalo?) or replicate?
    // Let's assume B19 for now as per previous logic which filled B column.
    console.log("DEBUG EXCEL GENERATION", {
      folio: dto.folio,
      noCfe: dto.noCfe,
      ret_noCfe: dto.ret_noCfe,
      B19_Value: sheet.getCell("B19").value
    });

    // Updated Logic: Unmerge B:C and D:E if merged, and write same data to both columns.
    // Rows: 19-30, 32-34

    // Helper to write dual columns (B&C, D&E)
    // Assumes merged cells exist in template. We attempt to unmerge.
    const setDual = (row: number, valInst: any, valRet: any) => {
      // Installed (B, C)
      try {
        sheet.unMergeCells(`B${row}:C${row}`);
      } catch (e) { /* Ignore if not merged */ }
      set(`B${row}`, valInst);
      set(`C${row}`, valInst);

      // Removed (D, E)
      try {
        sheet.unMergeCells(`D${row}:E${row}`);
      } catch (e) { /* Ignore if not merged */ }
      set(`D${row}`, valRet);
      set(`E${row}`, valRet);
    };

    setDual(19, dto.noCfe, dto.ret_noCfe);
    setDual(20, dto.noFabrica, dto.ret_noFabrica);
    setDual(21, dto.marcaMedidor, dto.ret_marcaMedidor);
    setDual(22, dto.tipoMedidor, dto.ret_tipoMedidor);
    setDual(23, dto.codigoMedidor, dto.ret_codigoMedidor);
    setDual(24, dto.codigoLote, dto.ret_codigoLote);
    setDual(25, dto.faseElementos, dto.ret_faseElementos);
    setDual(26, dto.hilosConexion, dto.ret_hilosConexion);
    setDual(27, dto.ampsClase, dto.ret_ampsClase);
    setDual(28, dto.volts, dto.ret_volts);
    setDual(29, dto.rrRs, dto.ret_rrRs);
    setDual(30, dto.khKr, dto.ret_khKr);

    // ================= READINGS (Row 31) - Already distinct =================
    set("B31", dto.inst_kwh);
    set("C31", dto.inst_kw);
    set("D31", dto.ret_kwh);
    set("E31", dto.ret_kw);

    setDual(32, dto.noCaratulas, dto.ret_noCaratulas);
    setDual(33, dto.multiplicador, dto.ret_multiplicador);
    setDual(34, dto.kwTipo, dto.ret_kwTipo);

    // ================= DEMANDA (Row 35) =================
    const demInst = `${chk(dto.inst_indicacion === "INDICATIVA", "INDIC.")}  ${chk(dto.inst_indicacion === "DIRECTA", "DIR.")}`;
    set("B35", demInst);

    const demRet = `${chk(dto.ret_indicacion === "INDICATIVA", "INDIC.")}  ${chk(dto.ret_indicacion === "DIRECTA", "DIR.")}`;
    set("D35", demRet); // Merged D-E probably

    set("B36", dto.kwPeriodo);
    set("B37", dto.escala);

    // ================= SELLOS =================
    set("B38", dto.selloEncontrado);
    set("B39", dto.selloDejado);

    // ================= SAVE =================
    const outputDir = join(process.cwd(), "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const outputPath = join(
      outputDir,
      `M9MEX_${dto.folio || "SIN_FOLIO"}.xlsx`
    );

    await workbook.xlsx.writeFile(outputPath);
    return outputPath;
  }
}
