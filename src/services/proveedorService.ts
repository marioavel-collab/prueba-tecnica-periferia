import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  MaestroProveedor,
  ResultadoValidacion,
  SolicitudProveedor,
  TipoSoporte,
} from "../types/proveedor.js";

const FIXTURES_DIR = path.resolve("fixtures/reto-01");

async function leerJson<T>(archivo: string): Promise<T> {
  const contenido = await readFile(archivo, "utf-8");
  return JSON.parse(contenido) as T;
}

export async function leerSolicitud(
  casoId: string,
): Promise<SolicitudProveedor> {
  const archivo = path.join(
    FIXTURES_DIR,
    "casos",
    casoId,
    "solicitud.json",
  );

  return leerJson<SolicitudProveedor>(archivo);
}

export async function leerMaestro(): Promise<MaestroProveedor> {
  const archivo = path.join(
    FIXTURES_DIR,
    "repositorio",
    "maestro.json",
  );

  return leerJson<MaestroProveedor>(archivo);
}

export async function leerSoportesExigidos(
  casoId: string,
): Promise<TipoSoporte[]> {
  const archivo = path.join(
    FIXTURES_DIR,
    "casos",
    casoId,
    "soportes-exigidos.json",
  );

  return leerJson<TipoSoporte[]>(archivo);
}

export function validarInformacionProveedor(
  maestro: MaestroProveedor,
  soportesRequeridos: TipoSoporte[],
): ResultadoValidacion {
  const errores: string[] = [];
  const advertencias: string[] = [];
  const camposFaltantes: string[] = [];

  if (!maestro.razon_social) {
    camposFaltantes.push("razon_social");
  }

  if (!maestro.nit) {
    camposFaltantes.push("nit");
  }

  if (!maestro.representante_legal?.nombre) {
    camposFaltantes.push("representante_legal.nombre");
  }

  if (!maestro.representante_legal?.identificacion) {
    camposFaltantes.push("representante_legal.identificacion");
  }

  if (!maestro.contacto_comercial?.email) {
    camposFaltantes.push("contacto_comercial.email");
  }

  if (!maestro.contacto_financiero?.email) {
    camposFaltantes.push("contacto_financiero.email");
  }

  if (!maestro.banco?.nombre) {
    camposFaltantes.push("banco.nombre");
  }

  if (!maestro.banco?.numero_cuenta) {
    camposFaltantes.push("banco.numero_cuenta");
  }

  if (soportesRequeridos.length === 0) {
    advertencias.push(
      "La solicitud no define soportes requeridos.",
    );
  }

  if (camposFaltantes.length > 0) {
    errores.push(
      `Faltan ${camposFaltantes.length} campos requeridos en el repositorio maestro.`,
    );
  }

  return {
    valido: errores.length === 0,
    requiereConfirmacion: errores.length === 0,
    errores,
    advertencias,
    camposFaltantes,
  };
}

export async function procesarSolicitud(
  casoId: string,
) {
  const solicitud = await leerSolicitud(casoId);
  const maestro = await leerMaestro();
  const soportesRequeridos = await leerSoportesExigidos(casoId);

  const validacion = validarInformacionProveedor(
    maestro,
    soportesRequeridos,
  );

  return {
    solicitud,
    maestro,
    soportesRequeridos,
    validacion,
  };
}