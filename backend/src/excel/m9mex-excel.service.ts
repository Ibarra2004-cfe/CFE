import { Injectable } from "@nestjs/common";
import * as ExcelJS from "exceljs";
import { join } from "path";
import { M9MEX_EXCEL_MAP } from "./m9mex-excel.map";
import * as fs from "fs";

@Injectable()
export class M9mexExcelService {
  async generar(dto: any): Promise<string> {
    const workbook = new ExcelJS.Workbook();

    const templatePath = join(
      process.cwd(),
      "src/excel/templates/M9MEX.xlsx"
    );

    await workbook.xlsx.readFile(templatePath);

    const sheet = workbook.getWorksheet(1);
    if (!sheet) {
      throw new Error("La hoja 1 no existe en el template");
    }

    /* =======================
       HELPERS
    ======================= */
    const set = (cell: string | undefined, value: any) => {
      if (cell && value !== undefined && value !== null) {
        sheet.getCell(cell).value = value;
      }
    };

    const markX = (cell?: string) => {
      if (cell) {
        sheet.getCell(cell).value = "X";
      }
    };

    /* =======================
       ENCABEZADO
    ======================= */
    set(M9MEX_EXCEL_MAP.fecha, dto.fecha);
    markX(M9MEX_EXCEL_MAP.tipoOrden?.[dto.tipoOrden]);

    set(M9MEX_EXCEL_MAP.usuario, dto.usuario);
    set(M9MEX_EXCEL_MAP.domicilio, dto.domicilio);
    set(M9MEX_EXCEL_MAP.observaciones, dto.observaciones);

    /* =======================
       SERVICIO
    ======================= */
    set(M9MEX_EXCEL_MAP.seConsumidor, dto.seConsumidor);
    set(M9MEX_EXCEL_MAP.voltajePrimario, dto.voltajePrimario);
    set(M9MEX_EXCEL_MAP.voltajeSecundario, dto.voltajeSecundario);
    set(M9MEX_EXCEL_MAP.subestacionAgencia, dto.subestacionAgencia);
    set(M9MEX_EXCEL_MAP.kws, dto.kws);
    set(M9MEX_EXCEL_MAP.tarifa, dto.tarifa);

    markX(M9MEX_EXCEL_MAP.medicionEn?.[dto.medicionEn]);
    markX(M9MEX_EXCEL_MAP.cobrar2Porc?.[dto.cobrar2Porc]);

    /* =======================
       MEDIDOR (PLANO)
    ======================= */
    Object.entries(M9MEX_EXCEL_MAP.medidor).forEach(([key, cell]) => {
      set(cell, dto[key]);
    });

    /* =======================
       KWH / KW
    ======================= */
    set(M9MEX_EXCEL_MAP.instalado.kwh, dto.inst_kwh);
    set(M9MEX_EXCEL_MAP.instalado.kw, dto.inst_kw);
    set(M9MEX_EXCEL_MAP.retirado.kwh, dto.ret_kwh);
    set(M9MEX_EXCEL_MAP.retirado.kw, dto.ret_kw);

    /* =======================
       DATOS SUELTOS
    ======================= */
    set(M9MEX_EXCEL_MAP.kwPeriodo, dto.kwPeriodo);
    set(M9MEX_EXCEL_MAP.escala, dto.escala);
    set(M9MEX_EXCEL_MAP.recibidoPor, dto.recibidoPor);

    /* =======================
       GUARDAR
    ======================= */
    const outputDir = join(process.cwd(), "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const outputPath = join(
      outputDir,
      `M9MEX_${dto.folio}.xlsx`
    );

    await workbook.xlsx.writeFile(outputPath);
    return outputPath;
  }
}
