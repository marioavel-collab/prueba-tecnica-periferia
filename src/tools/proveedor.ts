import { z } from "zod";

import {
  leerMaestro,
  leerSolicitud,
  leerSoportesExigidos,
  procesarSolicitud,
} from "../services/proveedorService.js";

export const leerSolicitudInputSchema = z.object({
  casoId: z
    .string()
    .min(1, "El casoId es obligatorio"),
});

export async function leerSolicitudTool(
  input: z.infer<typeof leerSolicitudInputSchema>,
) {
  const datos = leerSolicitudInputSchema.parse(input);

  const solicitud = await leerSolicitud(datos.casoId);

  return {
    ok: true,
    solicitud,
  };
}

export const leerMaestroInputSchema = z.object({});

export async function leerMaestroTool() {
  const maestro = await leerMaestro();

  return {
    ok: true,
    maestro,
  };
}

export const leerSoportesExigidosInputSchema = z.object({
  casoId: z
    .string()
    .min(1, "El casoId es obligatorio"),
});

export async function leerSoportesExigidosTool(
  input: z.infer<typeof leerSoportesExigidosInputSchema>,
) {
  const datos = leerSoportesExigidosInputSchema.parse(input);

  const soportes = await leerSoportesExigidos(datos.casoId);

  return {
    ok: true,
    casoId: datos.casoId,
    soportes,
  };
}

export const validarProveedorInputSchema = z.object({
  casoId: z
    .string()
    .min(1, "El casoId es obligatorio"),
});

export async function validarProveedorTool(
  input: z.infer<typeof validarProveedorInputSchema>,
) {
  const datos = validarProveedorInputSchema.parse(input);

  const resultado = await procesarSolicitud(datos.casoId);

  return {
    ok: true,
    casoId: datos.casoId,
    validacion: resultado.validacion,
  };
}