import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PadronService {
  constructor(private readonly prisma: PrismaService) {}

  async findByRpu(rpu: string) {
    const clean = (rpu || "").trim();
    if (!clean) return null;

    return this.prisma.servicioMatamoros.findUnique({
      where: { rpu: clean },
    });
  }
}
