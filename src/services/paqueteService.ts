import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { ResultadoProcesamiento } from "../types/proveedor.js";

const OUT_DIR = path.resolve("fixtures/reto-01/out");

export async function generarPaquete(
  resultado: ResultadoProcesamiento,
): Promise<string> {
  await mkdir(OUT_DIR, { recursive: true });

  const nombreArchivo = `${resultado.solicitudId}-resultado.json`;
  const archivo = path.join(OUT_DIR, nombreArchivo);

  await writeFile(
    archivo,
    JSON.stringify(resultado, null, 2),
    "utf-8",
  );

  return archivo;
}