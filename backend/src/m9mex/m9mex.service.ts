import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateM9mexDto } from "./dto/create-m9mex.dto";
import { UpdateM9mexDto } from "./dto/update-m9mex.dto";
import { generarFolioM9MEX } from "./folio";
import { M9mexExcelService } from "../excel/m9mex-excel.service";
import { M9mexPdfService } from "./m9mex-pdf.service";

@Injectable()
export class M9mexService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly excelService: M9mexExcelService,
    private readonly pdfService: M9mexPdfService,
  ) { }

  async create(dto: CreateM9mexDto) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const countToday = await this.prisma.m9Mex.count({
      where: { creadoEn: { gte: start, lte: end } },
    });

    const folio = generarFolioM9MEX(new Date(), countToday + 1);

    const fecha = dto.fecha ? new Date(dto.fecha) : new Date();
    if (isNaN(fecha.getTime())) {
      throw new Error("Fecha inválida");
    }

    return this.prisma.m9Mex.create({
      data: {
        folio,
        ...dto,
        ...this.applyMeterDefaults(dto), // Auto-fill installed
        ...this.applyMeterDefaultsRet(dto), // Auto-fill removed
        fecha,

        tipoOrden: dto.tipoOrden,
        medicionEn: dto.medicionEn,
        cobrar2Porc: dto.cobrar2Porc,

        inst_reactiva: dto.inst_reactiva,
        ret_reactiva: dto.ret_reactiva,
        inst_indicacion: dto.inst_indicacion,
        ret_indicacion: dto.ret_indicacion,
      },
    });
  }

  async findAll(q?: string) {
    const query = q?.trim();

    const where = query
      ? {
        OR: [
          { folio: { contains: query, mode: "insensitive" } },
          { usuario: { contains: query, mode: "insensitive" } },
          { noCfe: { contains: query, mode: "insensitive" } },
          { noFabrica: { contains: query, mode: "insensitive" } },
          { codigoMedidor: { contains: query, mode: "insensitive" } },
          { domicilio: { contains: query, mode: "insensitive" } },
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

    if (!item) {
      throw new NotFoundException("Registro M9MEX no encontrado");
    }

    return item;
  }

  async update(id: number, dto: UpdateM9mexDto) {
    await this.findOne(id);

    const data: any = {};

    // ===== FECHA =====
    if (dto.fecha !== undefined) {
      data.fecha = dto.fecha ? new Date(dto.fecha) : null;
    }

    // ===== TEXTOS =====
    const textFields = [
      "usuario",
      "domicilio",
      "observaciones",
      "seConsumidor",
      "voltajePrimario",
      "voltajeSecundario",
      "subestacionAgencia",
      "tarifa",
      "kws",
      "noCfe",
      "noFabrica",
      "marcaMedidor",
      "tipoMedidor",
      "codigoMedidor",
      "codigoLote",
      "rrRs",
      "khKr",
      "lectura",
      "noCaratulas",
      "multiplicador",
      "kwTipo",
      "kwPeriodo",
      "dias",
      "escala",
      "selloEncontrado",
      "selloDejado",
      "recibidoPor",
    ];

    for (const field of textFields) {
      if (field in dto) {
        data[field] = (dto as any)[field];
      }
    }


    if (dto.tipoOrden !== undefined) data.tipoOrden = dto.tipoOrden;
    if (dto.medicionEn !== undefined) data.medicionEn = dto.medicionEn;
    if (dto.cobrar2Porc !== undefined) data.cobrar2Porc = dto.cobrar2Porc;

    if (dto.inst_reactiva !== undefined) data.inst_reactiva = dto.inst_reactiva;
    if (dto.ret_reactiva !== undefined) data.ret_reactiva = dto.ret_reactiva;
    if (dto.inst_indicacion !== undefined) data.inst_indicacion = dto.inst_indicacion;
    if (dto.ret_indicacion !== undefined) data.ret_indicacion = dto.ret_indicacion;


    if (dto.inst_kwh !== undefined) data.inst_kwh = dto.inst_kwh;
    if (dto.inst_kw !== undefined) data.inst_kw = dto.inst_kw;
    if (dto.ret_kwh !== undefined) data.ret_kwh = dto.ret_kwh;
    if (dto.ret_kw !== undefined) data.ret_kw = dto.ret_kw;

    // Check if codigoMedidor changed to re-apply defaults
    if (dto.codigoMedidor) {
      const defaults = this.applyMeterDefaults({ codigoMedidor: dto.codigoMedidor } as any);
      Object.assign(data, defaults);
    }
    if (dto.ret_codigoMedidor) {
      const defaults = this.applyMeterDefaultsRet({ ret_codigoMedidor: dto.ret_codigoMedidor } as any);
      Object.assign(data, defaults);
    }

    // Check new text fields (ret_*)
    const retFields = [
      "ret_noCfe", "ret_noFabrica", "ret_marcaMedidor", "ret_tipoMedidor",
      "ret_codigoMedidor", "ret_codigoLote", "ret_faseElementos", "ret_hilosConexion",
      "ret_ampsClase", "ret_volts", "ret_rrRs", "ret_khKr",
      "ret_noCaratulas", "ret_multiplicador", "ret_kwTipo"
    ];
    for (const f of retFields) {
      if (f in dto) data[f] = (dto as any)[f];
    }

    return this.prisma.m9Mex.update({
      where: { id },
      data,
    });
  }

  private applyMeterDefaults(dto: CreateM9mexDto) {
    const code = dto.codigoMedidor;
    if (!code) return {};

    if (code.startsWith("KL")) {
      return {
        faseElementos: "3-3",
        hilosConexion: "4-Y",
        ampsClase: "30(200)",
        volts: "120-480",
        khKr: "21.6"
      };
    }
    if (code.startsWith("VL")) {
      return {
        faseElementos: "3-3",
        hilosConexion: "4-Y",
        ampsClase: "2.5(20)",
        volts: "120-480",
        khKr: "1.8"
      };
    }
    if (code.startsWith("F623")) {
      return {
        faseElementos: "2-2",
        hilosConexion: "2-Y",
        ampsClase: "15(100)",
        volts: "120",
        khKr: "1"
      };
    }
    return {};
  }

  private applyMeterDefaultsRet(dto: CreateM9mexDto) {
    const code = dto.ret_codigoMedidor;
    if (!code) return {};

    if (code.startsWith("KL")) {
      return {
        ret_faseElementos: "3-3",
        ret_hilosConexion: "4-Y",
        ret_ampsClase: "30(200)",
        ret_volts: "120-480",
        ret_khKr: "21.6"
      };
    }
    if (code.startsWith("VL")) {
      return {
        ret_faseElementos: "3-3",
        ret_hilosConexion: "4-Y",
        ret_ampsClase: "2.5(20)",
        ret_volts: "120-480",
        ret_khKr: "1.8"
      };
    }
    if (code.startsWith("F623")) {
      return {
        ret_faseElementos: "2-2",
        ret_hilosConexion: "2-Y",
        ret_ampsClase: "15(100)",
        ret_volts: "120",
        ret_khKr: "1"
      };
    }
    return {};
  }


  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.m9Mex.delete({ where: { id } });
  }

  async generarExcel(id: number) {
    const record = await this.findOne(id);

    if (!record.folio) {
      throw new Error("El registro no tiene folio");
    }

    const filePath = await this.excelService.generar(record);

    return {
      message: "Excel M9MEX generado correctamente",
      filePath,
    };
  }

  async generarPdf(id: number) {
    const record = await this.findOne(id);

    if (!record.folio) {
      throw new Error("El registro no tiene folio");
    }

    const filePath = await this.pdfService.generar(record);

    return {
      message: "PDF M9MEX generado correctamente",
      filePath,
    };
  }
}
