import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import * as puppeteer from "puppeteer";
import * as fs from "fs";
import { join } from "path";
import { generateM9MexHtml } from "./templates/m9mex-html";

@Injectable()
export class M9mexPdfService {
  constructor(private readonly prisma: PrismaService) {}

  async buildPdfBuffer(id: number): Promise<Buffer> {
    const data = await this.prisma.m9Mex.findUnique({ where: { id } });
    if (!data) throw new NotFoundException("Registro M9MEX no encontrado");

    const html = generateM9MexHtml(data as any);

    const browser = await puppeteer.launch({
      headless: "new" as any, // ✅ mejor que true en puppeteer moderno
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      // ✅ render estable (importante para layout tipo “formulario”)
      await page.setViewport({ width: 1200, height: 900 });

      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfUint8 = await page.pdf({
        format: "Letter",
        printBackground: true,
        margin: {
          top: "10mm",
          bottom: "10mm",
          left: "10mm",
          right: "10mm",
        },
      });

      const buffer = Buffer.from(pdfUint8);

      // ✅ opcional: guardar copia física
      const SAVE_COPY = false;
      if (SAVE_COPY) {
        const outputDir = join(process.cwd(), "output");
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        const filename = `M9MEX_${(data as any).folio || "SIN_FOLIO"}.pdf`;
        const outputPath = join(outputDir, filename);
        fs.writeFileSync(outputPath, buffer);
      }

      return buffer;
    } finally {
      await browser.close();
    }
  }
}
