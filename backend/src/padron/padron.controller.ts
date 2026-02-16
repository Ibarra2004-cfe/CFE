import { Controller, Get, Param } from "@nestjs/common";
import { PadronService } from "./padron.service";

@Controller("padron")
export class PadronController {
  constructor(private readonly padron: PadronService) {}

  @Get("rpu/:rpu")
  async byRpu(@Param("rpu") rpu: string) {
    const data = await this.padron.findByRpu(rpu);
    return { ok: true, data };
  }
}
