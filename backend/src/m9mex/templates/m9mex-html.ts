import { M9Mex } from "@prisma/client";

export function generateM9MexHtml(data: any): string {
  const val = (v: any) =>
    v === null || v === undefined || String(v).trim() === "" ? "" : String(v);

  const check = (condition: boolean) => (condition ? "( X )" : "(   )");

  const formatDate = (dateLike: any) => {
    if (!dateLike) return "";
    const d = dateLike instanceof Date ? dateLike : new Date(dateLike);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  // Para LECTURA: si existe lectura úsala; si no, usa inst_kwh/inst_kw como fallback
  const lecturaInst = val(data.lectura) || val(data.inst_kwh) || val(data.inst_kw);
  const lecturaRet = val(data.ret_lectura) || val(data.ret_kwh) || val(data.ret_kw);

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: Arial, sans-serif; font-size: 10px; margin: 0; padding: 20px; }
      .container { width: 100%; border: 2px solid black; padding: 5px; box-sizing: border-box; }
      .header { overflow: hidden; margin-bottom: 10px; }
      .logo { float: left; width: 150px; font-weight: bold; font-size: 20px; }
      .title { text-align: center; float: left; width: 400px; font-weight: bold; }
      .folio { float: right; text-align: right; color: red; font-size: 14px; font-weight: bold; }

      .section { margin-bottom: 5px; }
      .row { overflow: hidden; margin-bottom: 2px; }
      .label { font-weight: bold; display: inline-block; }
      .input { border-bottom: 1px solid black; display: inline-block; padding: 0 5px; vertical-align: bottom; }

      table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9px; }
      th, td { border: 1px solid black; padding: 2px; text-align: center; height: 15px; }
      th { background-color: #eee; }

      .left { text-align: left; }
      .w-100 { width: 100%; }

      .signature-area { margin-top: 20px; overflow: hidden; }
      .sig-box { float: left; width: 30%; text-align: center; margin-right: 3%; }
      .sig-line { border-top: 1px solid black; margin-top: 40px; }

      /* ✅ nueva franja (No. Orden + RPU) */
      .order-meta { margin: 6px 0 8px 0; }
      .order-meta .label { width: 110px; }
      .order-meta .input { width: 230px; }
      .order-meta .label.rpu { width: 40px; margin-left: 14px; }
      .order-meta .input.rpu { width: 220px; }

      /* ✅ franja de checks del tipo de orden */
      .order-type { text-align: center; margin: 6px 0; }
    </style>
  </head>
  <body>

  <div class="container">
    <!-- HEADER -->
    <div class="header">
      <div class="logo">CFE <span style="font-size:10px; display:block;">Distribución<br>Centro Oriente</span></div>
      <div class="title">
        COMISIÓN FEDERAL DE ELECTRICIDAD<br>
        DIVISIÓN CENTRO ORIENTE
      </div>
      <div class="folio">
        FORMA M9MEX<br>
        <span style="font-size: 18px;">${val(data.folio)}</span><br>
        <span style="color: black; font-size: 10px;">Fecha: ${formatDate(data.fecha)}</span>
      </div>
    </div>

    <div class="section">
      <strong>DEPTO. DE MEDICIÓN</strong><br>
      EQUIPOS DE MEDICIÓN<br>
      INSTALACIÓN - CAMBIOS - RETIROS
    </div>

    <!-- ✅ NO. ORDEN / RPU (esto era lo que faltaba) -->
    <div class="section order-meta">
      <div class="row">
        <span class="label">ORDEN ATENDIDA:</span>
        <span class="input">${val(data.ordenAtendida)}</span>

        <span class="label rpu">RPU:</span>
        <span class="input rpu">${val(data.rpu)}</span>
      </div>
    </div>

    <!-- ORDER TYPE (checks) -->
    <div class="section order-type">
      ${check(data.tipoOrden === "INSTALACION")} INSTALACIÓN &nbsp;&nbsp;
      ${check(data.tipoOrden === "CAMBIO")} CAMBIO &nbsp;&nbsp;
      ${check(data.tipoOrden === "RETIRO")} RETIRO &nbsp;&nbsp;
      ${check(data.tipoOrden === "MODIFICACION")} MODIFICACIÓN
    </div>

    <!-- USER INFO -->
    <div class="section">
      <div class="row"><span class="label" style="width: 80px;">USUARIO:</span>
        <span class="input" style="width: 600px;">${val(data.usuario)}</span>
      </div>

      <div class="row"><span class="label" style="width: 80px;">DOMICILIO:</span>
        <span class="input" style="width: 600px;">${val(data.domicilio)}</span>
      </div>

      <div class="row"><span class="label" style="width: 80px;">OBSERVACIONES:</span>
        <span class="input" style="width: 600px;">${val(data.observaciones)}</span>
      </div>
    </div>

    <!-- SERVICE INFO -->
    <div class="section">
      <div class="row">
        <span class="label">S.E. CONSUMIDOR:</span> <span class="input" style="width: 100px;">${val(data.seConsumidor)}</span>
        <span class="label" style="margin-left: 10px;">MARCA:</span> <span class="input" style="width: 100px;">${val(data.marcaMedidor)}</span> 
        <span class="label" style="margin-left: 10px;">DEM. CONT.:</span> <span class="input" style="width: 50px;">${val(data.demCont)}</span>
        <span class="label" style="margin-left: 10px;">KW'S:</span> <span class="input" style="width: 60px;">${val(data.kws)}</span>
      </div>

      <div class="row">
        <span class="label">VOLTAJE PRIMARIO:</span> <span class="input" style="width: 80px;">${val(data.voltajePrimario)}</span>
        <span class="label" style="margin-left: 10px;">VOLTAJE SECUNDARIO:</span> <span class="input" style="width: 80px;">${val(data.voltajeSecundario)}</span>
        <span class="label" style="margin-left: 10px;">TARIFA:</span> <span class="input" style="width: 80px;">${val(data.tarifa)}</span>
      </div>

      <div class="row">
        <span class="label">SUCURSAL O AGENCIA:</span> <span class="input" style="width: 200px;">${val(data.agencia)}</span>
      </div>
    </div>

    <!-- MEDICION EN -->
    <div class="section" style="margin-top: 5px;">
      MEDICIÓN EN:&nbsp;&nbsp; 
      ${check(data.medicionEn === "BAJA_TENSION")} BAJA TENSIÓN &nbsp;&nbsp;
      ${check(data.medicionEn === "ALTA_TENSION")} ALTA TENSIÓN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      COBRAR 2%: 
      ${check(data.cobrar2Porc === "SI")} SI &nbsp;&nbsp;
      ${check(data.cobrar2Porc === "NO")} NO
    </div>

    <!-- MAIN TABLE -->
    <table>
      <thead>
        <tr>
          <th rowspan="2" style="width: 120px;">DATOS DE<br>REGISTRO</th>
          <th colspan="2">INSTALADO</th>
          <th colspan="2">RETIRADO</th>
          <th rowspan="2"></th>
        </tr>
        <tr>
          <th>KWH</th>
          <th>KW</th>
          <th>KWH</th>
          <th>KW</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="left">No. C.F.E.</td>
          <td>${val(data.noCfe)}</td><td>${val(data.noCfe)}</td>
          <td>${val(data.ret_noCfe)}</td><td>${val(data.ret_noCfe)}</td>
          <td></td>
        </tr>
        <tr>
          <td class="left">No. DE FABRICA</td>
          <td>${val(data.noFabrica)}</td><td>${val(data.noFabrica)}</td>
          <td>${val(data.ret_noFabrica)}</td><td>${val(data.ret_noFabrica)}</td>
          <td></td>
        </tr>
        <tr>
          <td class="left">MARCA</td>
          <td>${val(data.marcaMedidor)}</td><td>${val(data.marcaMedidor)}</td>
          <td>${val(data.ret_marcaMedidor)}</td><td>${val(data.ret_marcaMedidor)}</td>
          <td></td>
        </tr>
        <tr>
          <td class="left">TIPO</td>
          <td>${val(data.tipoMedidor)}</td><td>${val(data.tipoMedidor)}</td>
          <td>${val(data.ret_tipoMedidor)}</td><td>${val(data.ret_tipoMedidor)}</td>
          <td></td>
        </tr>
        <tr>
          <td class="left">CÓDIGO DE MEDIDOR</td>
          <td>${val(data.codigoMedidor)}</td><td>${val(data.codigoMedidor)}</td>
          <td>${val(data.ret_codigoMedidor)}</td><td>${val(data.ret_codigoMedidor)}</td>
          <td></td>
        </tr>
        <tr>
          <td class="left">CÓDIGO DE LOTE</td>
          <td>${val(data.codigoLote)}</td><td>${val(data.codigoLote)}</td>
          <td>${val(data.ret_codigoLote)}</td><td>${val(data.ret_codigoLote)}</td>
          <td></td>
        </tr>
        <tr>
          <td class="left">FASE - ELEMENTOS</td>
          <td>${val(data.faseElementos)}</td><td>${val(data.faseElementos)}</td>
          <td>${val(data.ret_faseElementos)}</td><td>${val(data.ret_faseElementos)}</td>
          <td></td>
        </tr>
        <tr>
          <td class="left">HILOS - CONEXIÓN</td>
          <td>${val(data.hilosConexion)}</td><td>${val(data.hilosConexion)}</td>
          <td>${val(data.ret_hilosConexion)}</td><td>${val(data.ret_hilosConexion)}</td>
          <td></td>
        </tr>
        <tr>
          <td class="left">AMPS (CLASE)</td>
          <td>${val(data.ampsClase)}</td><td>${val(data.ampsClase)}</td>
          <td>${val(data.ret_ampsClase)}</td><td>${val(data.ret_ampsClase)}</td>
          <td></td>
        </tr>
        <tr>
          <td class="left">VOLTS</td>
          <td>${val(data.volts)}</td><td>${val(data.volts)}</td>
          <td>${val(data.ret_volts)}</td><td>${val(data.ret_volts)}</td>
          <td></td>
        </tr>
        <tr>
          <td class="left">Rr - Rs</td>
          <td>${val(data.rrRs)}</td><td>${val(data.rrRs)}</td>
          <td>${val(data.ret_rrRs)}</td><td>${val(data.ret_rrRs)}</td>
          <td></td>
        </tr>
        <tr>
          <td class="left">Kh - Kr</td>
          <td>${val(data.khKr)}</td><td>${val(data.khKr)}</td>
          <td>${val(data.ret_khKr)}</td><td>${val(data.ret_khKr)}</td>
          <td></td>
        </tr>

        <!-- ✅ LECTURA: ahora usa lectura real si existe -->
        <tr>
          <td class="left">LECTURA</td>
          <td>${lecturaInst}</td><td>${lecturaInst}</td>
          <td>${lecturaRet}</td><td>${lecturaRet}</td>
          <td></td>
        </tr>

        <tr>
          <td class="left">No. DE CARÁTULAS</td>
          <td>${val(data.noCaratulas)}</td><td>${val(data.noCaratulas)}</td>
          <td>${val(data.ret_noCaratulas)}</td><td>${val(data.ret_noCaratulas)}</td>
          <td></td>
        </tr>
        <tr>
          <td class="left">MULTIPLICADOR</td>
          <td>${val(data.multiplicador)}</td><td>${val(data.multiplicador)}</td>
          <td>${val(data.ret_multiplicador)}</td><td>${val(data.ret_multiplicador)}</td>
          <td></td>
        </tr>
        <tr>
          <td class="left">KW TIPO</td>
          <td>${val(data.kwTipo)}</td><td>${val(data.kwTipo)}</td>
          <td>${val(data.ret_kwTipo)}</td><td>${val(data.ret_kwTipo)}</td>
          <td></td>
        </tr>

        <!-- DEMANDA -->
        <tr>
          <td class="left">DEMANDA</td>
          <td colspan="2">
            ${check(data.inst_indicacion === "INDICATIVA")} INDICATIVA<br>
            ${check(data.inst_indicacion === "DIRECTA")} DIRECTA
          </td>
          <td colspan="2">
            ${check(data.ret_indicacion === "INDICATIVA")} INDICATIVA<br>
            ${check(data.ret_indicacion === "DIRECTA")} DIRECTA
          </td>
          <td></td>
        </tr>
        <tr><td class="left">KW PERIODO</td><td colspan="2">${val(data.kwPeriodo)}</td><td colspan="2"></td><td></td></tr>
        <tr><td class="left">ESCALA</td><td colspan="2">${val(data.escala)}</td><td colspan="2"></td><td></td></tr>

        <!-- SELLOS -->
        <tr>
          <td class="left">SELLOS</td>
          <td>KWH</td><td>KW</td><td>KVARH</td><td>MEC KWH</td><td></td>
        </tr>
        <tr>
          <td class="left">ENCONTRADO</td>
          <td colspan="5" class="left">${val(data.selloEncontrado)}</td>
        </tr>
        <tr>
          <td class="left">DEJADO</td>
          <td colspan="5" class="left">${val(data.selloDejado)}</td>
        </tr>
      </tbody>
    </table>

    <!-- SIGNATURES -->
    <div class="signature-area">
      <div class="sig-box">
        <div class="sig-line"></div>
        NOMBRE Y FIRMA R.P.E.<br>CALIBRADOR
      </div>
      <div class="sig-box">
        <div class="sig-line"></div>
        NOMBRE Y FIRMA R.P.E.<br>TÉCNICO
      </div>
      <div class="sig-box">
        <div class="sig-line"></div>
        NOMBRE Y FIRMA R.P.E.<br>JEFE DE OFICINA
      </div>
    </div>

  </div>

  </body>
  </html>
  `;
}
