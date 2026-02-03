import { PartialType } from "@nestjs/mapped-types";
import { CreateM9mexDto } from "./create-m9mex.dto";
import { IsOptional } from "class-validator";

export class UpdateM9mexDto extends PartialType(CreateM9mexDto) {
  @IsOptional() fecha?: string;

  // Enums
  @IsOptional() tipoOrden?: any;
  @IsOptional() medicionEn?: any;
  @IsOptional() cobrar2Porc?: any;
  @IsOptional() inst_reactiva?: any;
  @IsOptional() ret_reactiva?: any;
  @IsOptional() inst_indicacion?: any;
  @IsOptional() ret_indicacion?: any;
}
