import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { validarProveedorTool } from './tools/proveedor.js';
import { leerMaestro, leerSoportesExigidos } from './services/proveedorService.js';
import { generarPaquete } from './services/paqueteService.js';
import { procesarMensajeAgente } from './agent/orchestrator.js';

const PORT = Number(process.env.PORT ?? 3000);

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://' + req.headers.host);

  if (url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(readFileSync('./public/index.html', 'utf8'));
    return;
  }

  if (url.pathname === '/api/chat' && req.method === 'POST') {
    let body = '';

    for await (const chunk of req) {
      body += chunk;
    }

    try {
      const data = JSON.parse(body);
      const mensaje = typeof data.mensaje === 'string' ? data.mensaje.trim() : '';

      if (!mensaje) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          ok: false,
          error: 'El campo mensaje es obligatorio.'
        }));
        return;
      }

      const resultado = await procesarMensajeAgente(mensaje);

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8'
      });

      res.end(JSON.stringify(resultado));
    } catch (error) {
      res.writeHead(500, {
        'Content-Type': 'application/json; charset=utf-8'
      });

      res.end(JSON.stringify({
        ok: false,
        error: String(error)
      }));
    }

    return;
  }
  if (url.pathname === '/api/validar') {
    const casoId = url.searchParams.get('casoId');

    if (!casoId) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: 'El parametro casoId es obligatorio.' }));
      return;
    }

    try {
      const resultado = await validarProveedorTool({ casoId });
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(resultado));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: String(error) }));
    }
    return;
  }

  if (url.pathname === '/api/confirmar') {
    const casoId = url.searchParams.get('casoId');
    if (!casoId) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: 'El parametro casoId es obligatorio.' }));
      return;
    }
    try {
      const validacion = await validarProveedorTool({ casoId });
      if (!validacion.validacion.valido) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'El caso no es valido para procesamiento.', validacion: validacion.validacion }));
        return;
      }
      const maestro = await leerMaestro();
      const soportesRequeridos = await leerSoportesExigidos(casoId);
      const resultado = {
        solicitudId: casoId,
        proveedor: maestro,
        soportesRequeridos,
        validacion: validacion.validacion,
        documentosGenerados: [] as string[],
        estado: 'COMPLETADO' as const
      };
      const paquete = await generarPaquete(resultado);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, casoId, paquete, estado: 'COMPLETADO' }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: String(error) }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log('Servidor iniciado en http://localhost:' + PORT);
});





