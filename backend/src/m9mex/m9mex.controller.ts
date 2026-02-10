import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  BadRequestException,
} from "@nestjs/common";
import type { Response } from "express";
import { M9mexService } from "./m9mex.service";
import { CreateM9mexDto } from "./dto/create-m9mex.dto";
import { UpdateM9mexDto } from "./dto/update-m9mex.dto";

@Controller("m9mex")
export class M9mexController {
  constructor(private readonly m9mexService: M9mexService) {}

  // ================= CRUD =================

  @Post()
  create(@Body() dto: CreateM9mexDto) {
    return this.m9mexService.create(dto);
  }

  @Get()
  findAll() {
    return this.m9mexService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) throw new BadRequestException("ID inválido");
    return this.m9mexService.findOne(numericId);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateM9mexDto) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) throw new BadRequestException("ID inválido");
    return this.m9mexService.update(numericId, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) throw new BadRequestException("ID inválido");
    return this.m9mexService.remove(numericId);
  }

  // ================= EXCEL (DESCARGA BUFFER) =================

  @Get(":id/excel")
  async generarExcel(@Param("id") id: string, @Res() res: Response) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) throw new BadRequestException("ID inválido");

    const buffer = await this.m9mexService.generarExcel(numericId);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="M9MEX_${numericId}.xlsx"`,
    );

    return res.send(buffer);
  }

  // ================= PDF (DESCARGA BUFFER) =================

  @Get(":id/pdf")
  async generarPdf(@Param("id") id: string, @Res() res: Response) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) throw new BadRequestException("ID inválido");

    const buffer = await this.m9mexService.generarPdf(numericId);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="M9MEX_${numericId}.pdf"`,
    );

    return res.send(buffer);
  }
}
