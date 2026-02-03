import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export enum TipoOrdenDto { INSTALACION="INSTALACION", RETIRO="RETIRO", CAMBIO="CAMBIO", MODIFICACION="MODIFICACION" }
export enum MedicionEnDto { BAJA_TENSION="BAJA_TENSION", ALTA_TENSION="ALTA_TENSION" }
export enum SiNoDto { SI="SI", NO="NO" }
export enum ReactivaTipoDto { KVARH="KVARH", KQH="KQH" }
export enum IndicacionDto { INDICATIVA="INDICATIVA", DIRECTA="DIRECTA" }

export class CreateM9mexDto {
  @IsDateString() fecha: string;
  @IsEnum(TipoOrdenDto) tipoOrden: TipoOrdenDto;

  @IsOptional() @IsString() ordenAtendida?: string;
  @IsOptional() @IsString() usuario?: string;
  @IsOptional() @IsString() domicilio?: string;
  @IsOptional() @IsString() observaciones?: string;

  @IsOptional() @IsString() seConsumidor?: string;
  @IsOptional() @IsString() voltajePrimario?: string;
  @IsOptional() @IsString() voltajeSecundario?: string;
  @IsOptional() @IsString() subestacion?: string;
  @IsOptional() @IsString() agencia?: string;
  @IsOptional() @IsString() tarifa?: string;
  @IsOptional() @IsString() demCont?: string;
  @IsOptional() @IsString() kws?: string;

  @IsOptional() @IsEnum(MedicionEnDto) medicionEn?: MedicionEnDto;
  @IsOptional() @IsEnum(SiNoDto) cobrar2Porc?: SiNoDto;

  @IsOptional() @IsString() noCfe?: string;
  @IsOptional() @IsString() noFabrica?: string;
  @IsOptional() @IsString() marcaMedidor?: string;
  @IsOptional() @IsString() tipoMedidor?: string;
  @IsOptional() @IsString() codigoMedidor?: string;
  @IsOptional() @IsString() codigoLote?: string;
  @IsOptional() @IsString() faseElementos?: string;
  @IsOptional() @IsString() hilosConexion?: string;
  @IsOptional() @IsString() ampsClase?: string;
  @IsOptional() @IsString() volts?: string;
  @IsOptional() @IsString() rrRs?: string;
  @IsOptional() @IsString() khKr?: string;
  @IsOptional() @IsString() lectura?: string;
  @IsOptional() @IsString() noCaratulas?: string;
  @IsOptional() @IsString() multiplicador?: string;
  @IsOptional() @IsString() kwTipo?: string;

  @IsOptional() @IsString() inst_kwh?: string;
  @IsOptional() @IsString() inst_kw?: string;
  @IsOptional() @IsEnum(ReactivaTipoDto) inst_reactiva?: ReactivaTipoDto;

  @IsOptional() @IsString() ret_kwh?: string;
  @IsOptional() @IsString() ret_kw?: string;
  @IsOptional() @IsEnum(ReactivaTipoDto) ret_reactiva?: ReactivaTipoDto;

  @IsOptional() @IsString() demanda?: string;
  @IsOptional() @IsEnum(IndicacionDto) inst_indicacion?: IndicacionDto;
  @IsOptional() @IsEnum(IndicacionDto) ret_indicacion?: IndicacionDto;
  @IsOptional() @IsString() kwPeriodo?: string;
  @IsOptional() @IsString() dias?: string;
  @IsOptional() @IsString() escala?: string;

  @IsOptional() @IsString() selloEncontrado?: string;
  @IsOptional() @IsString() selloDejado?: string;

  @IsOptional() @IsString() transf_equipoCompactoNo?: string;
  @IsOptional() @IsString() transf_noSerie?: string;
  @IsOptional() @IsString() transf_corriente?: string;
  @IsOptional() @IsString() transf_potencial?: string;
  @IsOptional() @IsString() transf_marcaTipo?: string;
  @IsOptional() @IsString() transf_relacion?: string;
  @IsOptional() @IsString() transf_garganta?: string;
  @IsOptional() @IsString() transf_sellosEncontrados?: string;
  @IsOptional() @IsString() transf_sellosDejados?: string;

  @IsOptional() @IsString() recibidoPor?: string;

  @IsOptional() @IsString() firmaRpeCalibradorBase64?: string;
  @IsOptional() @IsString() firmaRpeTecnicoBase64?: string;
  @IsOptional() @IsString() firmaRpeJefeBase64?: string;
}
