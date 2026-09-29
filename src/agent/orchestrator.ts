import { validarProveedorTool } from "../tools/proveedor.js";

export interface RespuestaAgente {
  ok: boolean;
  mensaje: string;
  casoId?: string;
  requiereConfirmacion?: boolean;
  validacion?: unknown;
}

const CASOS_VALIDOS = [
  "co-industrias-delta",
  "ec-corp-andina",
  "hn-agroexport-sula",
  "pa-logistica-istmo",
];

function identificarCaso(mensaje: string): string | undefined {
  const mensajeNormalizado = mensaje.toLowerCase();

  return CASOS_VALIDOS.find((caso) =>
    mensajeNormalizado.includes(caso)
  );
}

export async function procesarMensajeAgente(
  mensaje: string
): Promise<RespuestaAgente> {

  const casoId = identificarCaso(mensaje);

  if (!casoId) {
    return {
      ok: false,
      mensaje:
        "No pude identificar el caso a procesar. Indica uno de los casos disponibles: " +
        CASOS_VALIDOS.join(", "),
    };
  }

  const resultado = await validarProveedorTool({ casoId });
  const validacion = resultado.validacion;

  if (!validacion.valido) {
    return {
      ok: true,
      casoId,
      mensaje:
        "La información del proveedor presenta errores y no puede continuar.",
      requiereConfirmacion: false,
      validacion,
    };
  }

  return {
    ok: true,
    casoId,
    mensaje:
      "He validado la información del proveedor. Los datos son válidos y se requiere confirmación humana para continuar con la generación del paquete.",
    requiereConfirmacion: validacion.requiereConfirmacion,
    validacion,
  };
}
