import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true, // ✅ deja pasar localhost:8081, 19006, etc
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  });

  // ✅ importante: escuchar en la red, no solo localhost
  await app.listen(3006, "0.0.0.0");
}
bootstrap();
