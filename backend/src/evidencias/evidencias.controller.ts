import { BadRequestException, Body, Controller, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import { EvidenciasService } from "./evidencias.service";

function safeName(original: string) {
  const ext = path.extname(original);
  const base = path
    .basename(original, ext)
    .replace(/[^a-zA-Z0-9-_]/g, "_");
  return `${base}-${Date.now()}${ext}`;
}

@Controller("m9mex/:id/evidencias")
export class EvidenciasController {
  constructor(private readonly service: EvidenciasService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (_req, file, cb) => cb(null, safeName(file.originalname)),
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async upload(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body("tipo") tipo: string,
  ) {
    if (!file) throw new BadRequestException("Archivo requerido");
    if (!tipo) throw new BadRequestException('Campo "tipo" requerido');

    return this.service.create(Number(id), {
      tipo,
      filename: file.filename,
      mimeType: file.mimetype,
      url: `/uploads/${file.filename}`,
    });
  }
}
