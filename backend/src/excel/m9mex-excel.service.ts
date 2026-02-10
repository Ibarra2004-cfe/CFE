import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Workbook } from "exceljs";
import { join } from "path";
import * as fs from "fs";

type TipoOrden = "INSTALACION" | "CAMBIO" | "RETIRO" | "MODIFICACION";

function s(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function firstNonEmpty(...vals: any[]) {
  for (const v of vals) {
    const sv = s(v).trim();
    if (sv) return sv;
  }
  return "";
}

@Injectable()
export class M9mexExcelService {
  constructor(private prisma: PrismaService) {}

  async buildExcelBuffer(id: number): Promise<Buffer> {
    const m: any = await this.prisma.m9Mex.findUnique({ where: { id } });
    if (!m) throw new NotFoundException("Registro M9MEX no encontrado");

    const tipoOrden = m.tipoOrden as TipoOrden;

    const fillInst = tipoOrden === "INSTALACION" || tipoOrden === "CAMBIO" || tipoOrden === "MODIFICACION";
    const fillRet = tipoOrden === "RETIRO" || tipoOrden === "CAMBIO" || tipoOrden === "MODIFICACION";

    // Regla fuerte: en cada sección KWH/KW iguales
    const instLect = firstNonEmpty(m.inst_kwh, m.inst_kw);
    const retLect = firstNonEmpty(m.ret_kwh, m.ret_kw);

    const inst = {
      noCfe: s(m.noCfe),
      noFabrica: s(m.noFabrica),
      marca: s(m.marcaMedidor),
      tipo: s(m.tipoMedidor),
      codigoMedidor: s(m.codigoMedidor),
      codigoLote: s(m.codigoLote),
      faseElementos: s(m.faseElementos),
      hilosConexion: s(m.hilosConexion),
      ampsClase: s(m.ampsClase),
      volts: s(m.volts),
      rrRs: s(m.rrRs),
      khKr: s(m.khKr),
      lectura: firstNonEmpty(m.lectura, instLect),
      noCaratulas: s(m.noCaratulas),
      multiplicador: s(m.multiplicador),
      kwTipo: s(m.kwTipo),
      demanda: s(m.demanda),
      kwPeriodo: s(m.kwPeriodo),
      escala: s(m.escala),
      selloEncontrado: s(m.selloEncontrado),
      selloDejado: s(m.selloDejado),
    };

    const ret = {
      noCfe: firstNonEmpty(m.ret_noCfe, m.noCfe),
      noFabrica: firstNonEmpty(m.ret_noFabrica, m.noFabrica),
      marca: firstNonEmpty(m.ret_marcaMedidor, m.marcaMedidor),
      tipo: firstNonEmpty(m.ret_tipoMedidor, m.tipoMedidor),
      codigoMedidor: firstNonEmpty(m.ret_codigoMedidor, m.codigoMedidor),
      codigoLote: firstNonEmpty(m.ret_codigoLote, m.codigoLote),
      faseElementos: firstNonEmpty(m.ret_faseElementos, m.faseElementos),
      hilosConexion: firstNonEmpty(m.ret_hilosConexion, m.hilosConexion),
      ampsClase: firstNonEmpty(m.ret_ampsClase, m.ampsClase),
      volts: firstNonEmpty(m.ret_volts, m.volts),
      rrRs: firstNonEmpty(m.ret_rrRs, m.rrRs),
      khKr: firstNonEmpty(m.ret_khKr, m.khKr),
      lectura: firstNonEmpty(retLect, m.lectura, instLect),
      noCaratulas: firstNonEmpty(m.ret_noCaratulas, m.noCaratulas),
      multiplicador: firstNonEmpty(m.ret_multiplicador, m.multiplicador),
      kwTipo: firstNonEmpty(m.ret_kwTipo, m.kwTipo),
      demanda: firstNonEmpty(m.demanda), // ✅ NO existe ret_demanda en tu schema
      kwPeriodo: s(m.kwPeriodo),
      escala: s(m.escala),
      selloEncontrado: s(m.selloEncontrado),
      selloDejado: s(m.selloDejado),
    };

    // ✅ plantilla real
    const templatePath = join(process.cwd(), "assets", "templates", "M9MEX_TEMPLATE.xlsx");
    if (!fs.existsSync(templatePath)) {
      throw new Error(`No existe la plantilla Excel: ${templatePath}`);
    }

    const wb = new Workbook();
    await wb.xlsx.readFile(templatePath);

    const ws = wb.getWorksheet("M9MEX") ?? wb.worksheets[0];

    const putBothCols = (row: number, col1: string, col2: string, value: any) => {
      ws.getCell(`${col1}${row}`).value = s(value);
      ws.getCell(`${col2}${row}`).value = s(value);
    };

    const clearBothCols = (row: number, col1: string, col2: string) => {
      ws.getCell(`${col1}${row}`).value = "";
      ws.getCell(`${col2}${row}`).value = "";
    };

    const ROWS: Array<[number, keyof typeof inst]> = [
      [19, "noCfe"],
      [20, "noFabrica"],
      [21, "marca"],
      [22, "tipo"],
      [23, "codigoMedidor"],
      [24, "codigoLote"],
      [25, "faseElementos"],
      [26, "hilosConexion"],
      [27, "ampsClase"],
      [28, "volts"],
      [29, "rrRs"],
      [30, "khKr"],
      [31, "lectura"],

      [32, "noCaratulas"],
      [33, "multiplicador"],
      [34, "kwTipo"],
      [35, "demanda"],
      [36, "kwPeriodo"],
      [37, "escala"],

      [38, "selloEncontrado"],
      [39, "selloDejado"],
    ];

    // ✅ marcar orden atendida
    const mark = (on: boolean) => (on ? "( X )" : "(   )");
    ws.getCell("B5").value = `${mark(tipoOrden === "INSTALACION")} INSTALACIÓN`;
    ws.getCell("D5").value = `${mark(tipoOrden === "CAMBIO")} CAMBIO`;
    ws.getCell("F5").value = `${mark(tipoOrden === "RETIRO")} RETIRO`;
    ws.getCell("G5").value = `${mark(tipoOrden === "MODIFICACION")} MODIFICACIÓN`;

    // ✅ encabezado
    ws.getCell("H2").value = s(m.folio);
    ws.getCell("H3").value = m.fecha ? new Date(m.fecha).toISOString().split("T")[0] : "";

    // ✅ Orden atendida y RPU (RPU no existe en schema -> no rompe, solo vacío)
    ws.getCell("B7").value = s(m.ordenAtendida);
    ws.getCell("E7").value = s((m as any).rpu);

    // INSTALADO B/C
    if (fillInst) {
      for (const [row, key] of ROWS) {
        if (row === 38 || row === 39) {
          ws.getCell(`B${row}`).value = s(inst[key]);
          continue;
        }
        putBothCols(row, "B", "C", inst[key]);
      }
    } else {
      for (const [row] of ROWS) {
        if (row === 38 || row === 39) {
          ws.getCell(`B${row}`).value = "";
          continue;
        }
        clearBothCols(row, "B", "C");
      }
    }

    // RETIRADO D/E
    if (fillRet) {
      for (const [row, key] of ROWS) {
        if (row === 38 || row === 39) {
          if (!fillInst) ws.getCell(`B${row}`).value = s((ret as any)[key]);
          continue;
        }
        putBothCols(row, "D", "E", (ret as any)[key]);
      }
    } else {
      for (const [row] of ROWS) {
        if (row === 38 || row === 39) continue;
        clearBothCols(row, "D", "E");
      }
    }

    const out = await wb.xlsx.writeBuffer();
    return Buffer.from(out as any);
  }
}
