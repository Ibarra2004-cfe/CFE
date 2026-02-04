import { Module } from "@nestjs/common";
import { M9mexService } from "./m9mex.service";
import { M9mexController } from "./m9mex.controller";
import { PrismaService } from "../../prisma/prisma.service";
import { M9mexExcelService } from "../excel/m9mex-excel.service";
import { M9mexPdfService } from "./m9mex-pdf.service";

@Module({
  controllers: [M9mexController],
  providers: [
    M9mexService,
    M9mexExcelService,
    M9mexPdfService,
    PrismaService,
  ],
})
export class M9mexModule { }
