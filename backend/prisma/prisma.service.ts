import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

function must(value: string | undefined, name: string) {
  const v = (value ?? "").trim();
  if (!v) throw new Error(`Falta variable de entorno: ${name}`);
  return v;
}

function parsePort(value: string | undefined, name: string) {
  const raw = must(value, name);

  // Quita comillas por si las ponen: "3307"
  const cleaned = raw.replace(/^"+|"+$/g, "").trim();

  const n = Number(cleaned);
  if (!Number.isInteger(n) || n <= 0 || n > 65535) {
    throw new Error(`Puerto inválido en ${name}: "${raw}"`);
  }
  return n;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly config: ConfigService) {
    // ✅ Prioridad 1: DATABASE_URL (más simple y estable)
    const directUrl = (config.get<string>("DATABASE_URL") ?? "").trim();
    if (directUrl) {
      super({
        datasources: {
          db: { url: directUrl.replace(/^"+|"+$/g, "").trim() },
        },
      });
      return;
    }
    const user = must(config.get<string>("DB_USERNAME"), "DB_USERNAME");
    const password = must(config.get<string>("DB_PASSWORD"), "DB_PASSWORD");
    const host = must(config.get<string>("DB_HOST"), "DB_HOST");
    const port = parsePort(config.get<string>("DB_PORT"), "DB_PORT");
    const dbName = must(config.get<string>("DB_NAME"), "DB_NAME");

    const url = `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${dbName}`;

    super({
      datasources: {
        db: { url },
      },
    });
  }

  async onModuleInit() {
    // Debug útil si vuelve a fallar:
    // console.log("Prisma DB URL:", (this as any)._engineConfig?.datasourceUrl);
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
