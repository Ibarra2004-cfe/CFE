import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from "@nestjs/common";
import type { Response } from "express";
import { M9mexService } from "./m9mex.service";
import { CreateM9mexDto } from "./dto/create-m9mex.dto";
import { UpdateM9mexDto } from "./dto/update-m9mex.dto";

@Controller("m9mex")
export class M9mexController {
  constructor(
    private readonly m9mexService: M9mexService,
  ) { }

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
    return this.m9mexService.findOne(Number(id));
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateM9mexDto) {
    return this.m9mexService.update(Number(id), dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.m9mexService.remove(Number(id));
  }

  @Get(":id/excel")
  async generarExcel(@Param("id") id: string, @Res() res: Response) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new Error("ID inválido");
    }

    const { filePath } = await this.m9mexService.generarExcel(numericId);
    res.download(filePath);
  }

  @Get(":id/pdf")
  async generarPdf(@Param("id") id: string, @Res() res: Response) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new Error("ID inválido");
    }

    const { filePath } = await this.m9mexService.generarPdf(numericId);
    res.download(filePath);
  }
}
