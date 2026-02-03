import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class EvidenciasService {
  constructor(private prisma: PrismaService) {}

  async create(m9mexId: number, data: { tipo: string; filename: string; mimeType: string; url: string }) {
    const exists = await this.prisma.m9Mex.findUnique({ where: { id: m9mexId } });
    if (!exists) throw new NotFoundException("M9MEX no existe");

    return this.prisma.evidencia.create({
      data: { m9mexId, ...data },
    });
  }
}
