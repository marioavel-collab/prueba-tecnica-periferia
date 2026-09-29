import { readdir } from "node:fs/promises";
import path from "node:path";

import {
  validarProveedorTool,
} from "./src/tools/proveedor.js";

import {
  leerMaestro,
  leerSolicitud,
  leerSoportesExigidos,
} from "./src/services/proveedorService.js";

import { generarPaquete } from "./src/services/paqueteService.js";

const CASOS_DIR = path.resolve("fixtures/reto-01/casos");

const casos = await readdir(CASOS_DIR, {
  withFileTypes: true,
});

const casosIds = casos
  .filter((item) => item.isDirectory())
  .map((item) => item.name)
  .sort();

console.log("========================================");
console.log(" RETO 1 - DEMO DETERMINÍSTICA");
console.log("========================================");
console.log(`Casos encontrados: ${casosIds.length}`);
console.log("");

for (const casoId of casosIds) {
  console.log("----------------------------------------");
  console.log(`CASO: ${casoId}`);
  console.log("----------------------------------------");

  try {
    const validacion = await validarProveedorTool({
      casoId,
    });

    console.log("Validación:");
    console.log(JSON.stringify(validacion.validacion, null, 2));

    if (!validacion.validacion.valido) {
      console.log("❌ Caso rechazado.");
      console.log("");
      continue;
    }

    if (validacion.validacion.requiereConfirmacion) {
      console.log("⚠️ Requiere confirmación humana.");

      // En demo determinística simulamos la confirmación.
      const confirmacionHumana = true;

      if (!confirmacionHumana) {
        console.log("❌ Operación cancelada.");
        console.log("");
        continue;
      }

      console.log("✅ Confirmación recibida.");
    }

    const maestro = await leerMaestro();
    const soportesRequeridos = await leerSoportesExigidos(casoId);

    const resultado = {
      solicitudId: casoId,
      proveedor: maestro,
      soportesRequeridos,
      validacion: validacion.validacion,
      documentosGenerados: [] as string[],
      estado: "COMPLETADO" as const,
    };

    const paquete = await generarPaquete(resultado);

    console.log("📦 Resultado generado:");
    console.log(paquete);
    console.log("✅ Caso procesado correctamente.");
    console.log("");
  } catch (error) {
    console.error("❌ Error procesando el caso:", casoId);
    console.error(error);
    console.log("");
  }
}

console.log("========================================");
console.log(" FIN DE LA DEMO");
console.log("========================================");