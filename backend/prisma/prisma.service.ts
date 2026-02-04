import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(config: ConfigService) {
    const user = config.get("DB_USERNAME");
    const password = config.get("DB_PASSWORD");
    const host = config.get("DB_HOST");
    const port = config.get("DB_PORT");
    const dbName = config.get("DB_NAME");

    super({
      datasources: {
        db: {
          url: `mysql://${user}:${password}@${host}:${port}/${dbName}`,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
