import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateM9mexDto } from "./dto/create-m9mex.dto";
import { UpdateM9mexDto } from "./dto/update-m9mex.dto";
import { generarFolioM9MEX } from "./folio";

// ✅ AJUSTA ESTA RUTA A TU PROYECTO REAL
// Si tu excel service está en src/excel/m9mex-excel.service.ts (como antes),
// entonces desde src/m9mex/ la ruta correcta suele ser: "../excel/m9mex-excel.service"
import { M9mexExcelService } from "../excel/m9mex-excel.service";

import { M9mexPdfService } from "./m9mex-pdf.service";

@Injectable()
export class M9mexService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly excelService: M9mexExcelService,
    private readonly pdfService: M9mexPdfService,
  ) {}

  // ================= CREATE =================
  async create(dto: CreateM9mexDto) {
    // folio diario
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);

    const countToday = await this.prisma.m9Mex.count({
      where: { creadoEn: { gte: start, lte: end } },
    });

    const folio = generarFolioM9MEX(new Date(), countToday + 1);

    const fecha = dto.fecha ? new Date(dto.fecha) : new Date();
    if (isNaN(fecha.getTime())) throw new BadRequestException("Fecha inválida");

    // ✅ defaults calculados
    const instDefaults = this.applyMeterDefaults(dto.codigoMedidor);
    const retDefaults = this.applyMeterDefaultsRet(dto.ret_codigoMedidor);

    return this.prisma.m9Mex.create({
      data: {
        folio,
        ...dto,

        // ✅ defaults (si el usuario mandó algo, aquí lo SOBREESCRIBE)
        // si NO quieres sobreescribir en create, dímelo y lo cambio.
        ...instDefaults,
        ...retDefaults,

        fecha,

        // ✅ enums (Prisma)
        tipoOrden: dto.tipoOrden as any,
        medicionEn: dto.medicionEn as any,
        cobrar2Porc: dto.cobrar2Porc as any,
        inst_reactiva: dto.inst_reactiva as any,
        ret_reactiva: dto.ret_reactiva as any,
        inst_indicacion: dto.inst_indicacion as any,
        ret_indicacion: dto.ret_indicacion as any,
      },
    });
  }

  // ================= READ =================
  async findAll(q?: string) {
    const query = q?.trim();
    const where = query
      ? {
          OR: [
            { folio: { contains: query, mode: "insensitive" } },
            { usuario: { contains: query, mode: "insensitive" } },

            // 🚫 SOLO si existe "rpu" en Prisma
            // { rpu: { contains: query, mode: "insensitive" } },

            { noCfe: { contains: query, mode: "insensitive" } },
            { noFabrica: { contains: query, mode: "insensitive" } },
            { codigoMedidor: { contains: query, mode: "insensitive" } },
            { domicilio: { contains: query, mode: "insensitive" } },
            { ordenAtendida: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined;

    return this.prisma.m9Mex.findMany({
      where,
      orderBy: { creadoEn: "desc" },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.m9Mex.findUnique({
      where: { id },
      include: { evidencias: true },
    });

    if (!item) throw new NotFoundException("Registro M9MEX no encontrado");
    return item;
  }

  // ================= UPDATE =================
  async update(id: number, dto: UpdateM9mexDto) {
    const current = await this.findOne(id);

    const data: any = { ...dto };

    // ✅ fecha
    if (dto.fecha !== undefined) {
      const fecha = dto.fecha ? new Date(dto.fecha) : null;
      if (fecha && isNaN(fecha.getTime())) throw new BadRequestException("Fecha inválida");
      data.fecha = fecha;
    }

    // ✅ enums (Prisma)
    if (dto.tipoOrden !== undefined) data.tipoOrden = dto.tipoOrden as any;
    if (dto.medicionEn !== undefined) data.medicionEn = dto.medicionEn as any;
    if (dto.cobrar2Porc !== undefined) data.cobrar2Porc = dto.cobrar2Porc as any;
    if (dto.inst_reactiva !== undefined) data.inst_reactiva = dto.inst_reactiva as any;
    if (dto.ret_reactiva !== undefined) data.ret_reactiva = dto.ret_reactiva as any;
    if (dto.inst_indicacion !== undefined) data.inst_indicacion = dto.inst_indicacion as any;
    if (dto.ret_indicacion !== undefined) data.ret_indicacion = dto.ret_indicacion as any;

    // ✅ defaults si cambia código INSTALADO
    // (sin borrar lo que ya capturaron: solo llena si el campo está vacío)
    if (dto.codigoMedidor !== undefined) {
      const d = this.applyMeterDefaults(dto.codigoMedidor);
      data.faseElementos = this.keepIfHasValue(current.faseElementos, dto.faseElementos, d.faseElementos);
      data.hilosConexion = this.keepIfHasValue(current.hilosConexion, dto.hilosConexion, d.hilosConexion);
      data.ampsClase = this.keepIfHasValue(current.ampsClase, dto.ampsClase, d.ampsClase);
      data.volts = this.keepIfHasValue(current.volts, dto.volts, d.volts);
      data.khKr = this.keepIfHasValue(current.khKr, dto.khKr, d.khKr);
    }

    // ✅ defaults si cambia código RETIRADO
    if (dto.ret_codigoMedidor !== undefined) {
      const d = this.applyMeterDefaultsRet(dto.ret_codigoMedidor);
      data.ret_faseElementos = this.keepIfHasValue(current.ret_faseElementos, dto.ret_faseElementos, d.ret_faseElementos);
      data.ret_hilosConexion = this.keepIfHasValue(current.ret_hilosConexion, dto.ret_hilosConexion, d.ret_hilosConexion);
      data.ret_ampsClase = this.keepIfHasValue(current.ret_ampsClase, dto.ret_ampsClase, d.ret_ampsClase);
      data.ret_volts = this.keepIfHasValue(current.ret_volts, dto.ret_volts, d.ret_volts);
      data.ret_khKr = this.keepIfHasValue(current.ret_khKr, dto.ret_khKr, d.ret_khKr);
    }

    return this.prisma.m9Mex.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.m9Mex.delete({ where: { id } });
  }

  // ================= EXPORTS =================
  async generarExcel(id: number): Promise<Buffer> {
    await this.findOne(id);
    return this.excelService.buildExcelBuffer(id);
  }

  async generarPdf(id: number): Promise<Buffer> {
    await this.findOne(id);
    return this.pdfService.buildPdfBuffer(id);
  }

  // ================= HELPERS =================
  private applyMeterDefaults(codigoMedidor?: string) {
    const code = (codigoMedidor || "").toUpperCase().trim();
    if (!code) return {};

    if (code.startsWith("KL")) {
      return { faseElementos: "3-3", hilosConexion: "4-Y", ampsClase: "30(200)", volts: "120-480", khKr: "21.6" };
    }
    if (code.startsWith("VL")) {
      return { faseElementos: "3-3", hilosConexion: "4-Y", ampsClase: "2.5(20)", volts: "120-480", khKr: "1.8" };
    }
    if (code === "F623" || code.startsWith("F623")) {
      return { faseElementos: "2-2", hilosConexion: "2-Y", ampsClase: "15(100)", volts: "120", khKr: "1" };
    }
    return {};
  }

  private applyMeterDefaultsRet(ret_codigoMedidor?: string) {
    const code = (ret_codigoMedidor || "").toUpperCase().trim();
    if (!code) return {};

    if (code.startsWith("KL")) {
      return { ret_faseElementos: "3-3", ret_hilosConexion: "4-Y", ret_ampsClase: "30(200)", ret_volts: "120-480", ret_khKr: "21.6" };
    }
    if (code.startsWith("VL")) {
      return { ret_faseElementos: "3-3", ret_hilosConexion: "4-Y", ret_ampsClase: "2.5(20)", ret_volts: "120-480", ret_khKr: "1.8" };
    }
    if (code === "F623" || code.startsWith("F623")) {
      return { ret_faseElementos: "2-2", ret_hilosConexion: "2-Y", ret_ampsClase: "15(100)", ret_volts: "120", ret_khKr: "1" };
    }
    return {};
  }

  /**
   * Si ya había valor (en BD) o el DTO trae valor, respeta eso.
   * Si está vacío, aplica default.
   */
  private keepIfHasValue(currentVal: any, incomingVal: any, defaultVal: any) {
    const cur = (currentVal ?? "").toString().trim();
    const inc = (incomingVal ?? "").toString().trim();

    if (inc) return incomingVal;    // el usuario mandó algo
    if (cur) return currentVal;     // ya existía algo guardado
    return defaultVal ?? undefined; // aplica default si existe
  }
}
