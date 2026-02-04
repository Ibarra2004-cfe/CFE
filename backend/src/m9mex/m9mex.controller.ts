import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
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
  generarExcel(@Param("id") id: string) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new Error("ID inválido");
    }

    return this.m9mexService.generarExcel(numericId);
  }

  @Get(":id/pdf")
  generarPdf(@Param("id") id: string) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new Error("ID inválido");
    }

    return this.m9mexService.generarPdf(numericId);
  }
}
