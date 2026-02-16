import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true, // ✅ refleja el origin (dev: expo/web)
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: false,
  });

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3006, "0.0.0.0"); // ✅ importante
}
bootstrap();
