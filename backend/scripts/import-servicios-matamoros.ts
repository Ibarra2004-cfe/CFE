import * as path from "path";
import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const s = (v: any) => {
  if (v === null || v === undefined) return "";
  return String(v).trim();
};

async function main() {

  console.time("TOTAL");

  const filePath = path.join(process.cwd(), "assets", "DB_SERVICIOS_MATAMOROS.xlsx");

  console.time("LEER_EXCEL");
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
  console.timeEnd("LEER_EXCEL");

  console.log("Filas encontradas:", rows.length);

  let ok = 0;
  let skip = 0;
  let index = 0;

  const CONCURRENCY = 10; 

  async function worker() {
    while (true) {
      const i = index++;
      if (i >= rows.length) return;

      const r = rows[i];
      const rpu = s(r.rpu);
      if (!rpu) {
        skip++;
        continue;
      }

      const payload = {
        cuenta: s(r.cuenta),
        agencia: s(r.agencia),
        estatus: s(r.estatus),
        tarifa: s(r.tarifa),
        hilos: s(r.hilos),

        nombre: s(r.nombre),
        direccion: s(r.direccion),
        colonia: s(r.colonia),

        suministro: s(r.suministro),
        carga_contratada: s(r.carga_contratada),
        carga_instalada: s(r.carga_instalada),

        numero_de_medidor: s(r.numero_de_medidor),
        multiplicador: s(r.multiplicador),
        circuito: s(r.circuito),
      };

     await prisma.servicioMatamoros.upsert({
        where: { rpu },
        create: { rpu, ...payload },
        update: payload,
      });

      ok++;

      if (ok % 100 === 0) {
        console.log(`Progreso: ${ok}/${rows.length}`);
      }
    }
  }

  console.time("UPSERTS");

  await Promise.all(
    Array.from({ length: CONCURRENCY }, () => worker())
  );

  console.timeEnd("UPSERTS");

  console.log("IMPORT PADRON OK:", { ok, skip });

  console.timeEnd("TOTAL");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
