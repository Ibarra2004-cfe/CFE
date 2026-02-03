import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";
import { M9mexModule } from "./m9mex/m9mex.module";
import { EvidenciasModule } from "./evidencias/evidencias.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    M9mexModule,
    EvidenciasModule,
  ],
})
export class AppModule {}
