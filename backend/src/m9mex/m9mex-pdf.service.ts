import { Injectable } from "@nestjs/common";
import { M9Mex } from "@prisma/client";
import * as puppeteer from "puppeteer";
import * as fs from "fs";
import { join } from "path";
import { generateM9MexHtml } from "./templates/m9mex-html";

@Injectable()
export class M9mexPdfService {
    async generar(data: M9Mex): Promise<string> {
        const html = generateM9MexHtml(data);

        // Launch puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for Docker/Linux often
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const outputDir = join(process.cwd(), "output");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        const filename = `M9MEX_${data.folio || "SIN_FOLIO"}.pdf`;
        const outputPath = join(outputDir, filename);

        await page.pdf({
            path: outputPath,
            format: "Letter",
            printBackground: true,
            margin: {
                top: "10mm",
                bottom: "10mm",
                left: "10mm",
                right: "10mm",
            },
        });

        await browser.close();

        return outputPath;
    }
}
