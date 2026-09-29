# Solución Técnica - Reto 1
## Registro de Proveedores

### 1. Objetivo

La solución automatiza el proceso de registro de proveedores a partir de una solicitud recibida, utilizando un agente de IA como orquestador y servicios determinísticos para las operaciones de negocio.

El sistema consulta la información disponible del proveedor, identifica los soportes requeridos, valida la información y prepara un resultado para la generación del paquete documental.

### 2. Arquitectura

La solución está organizada en capas:

- Agent: contiene las instrucciones del agente y define su comportamiento.
- Tools: expone operaciones tipadas mediante Zod.
- Services: contiene la lógica de negocio y acceso a las fuentes de información.
- Types: contiene los contratos TypeScript del dominio.
- Fixtures: contiene los casos de prueba y repositorio maestro.
- Demo: permite ejecutar el flujo de manera determinística sin depender de un modelo LLM.

Flujo principal:

Solicitud -> Agente -> Tools -> Servicios -> Repositorio maestro -> Validación -> Confirmación humana -> Generación del paquete

### 3. Ciclo del agente

1. Recibir la solicitud.
2. Identificar el caso de proveedor.
3. Consultar la información disponible.
4. Consultar los soportes requeridos.
5. Validar la información.
6. Informar el resultado al usuario.
7. Solicitar confirmación humana.
8. Ejecutar el procesamiento final.
9. Generar el paquete de resultado.

Las decisiones del agente están separadas de las operaciones determinísticas del sistema.

### 4. Herramientas

Las herramientas están implementadas en src/tools/proveedor.ts.

Actualmente se dispone de herramientas para:

- Leer la solicitud.
- Leer el repositorio maestro.
- Leer los soportes exigidos.
- Validar la información del proveedor.

Los inputs de las herramientas utilizan esquemas Zod para validar los parámetros de entrada.

### 5. Confirmación humana

El procesamiento final requiere confirmación humana antes de generar el paquete.

En la demo determinística esta confirmación está simulada mediante una variable de control. En una implementación productiva, la confirmación sería realizada explícitamente por el usuario desde la interfaz conversacional.

### 6. Demo determinística

La solución incluye demo.ts.

La demo no depende de un modelo LLM y procesa automáticamente los casos disponibles en fixtures/reto-01/casos.

Actualmente se procesan cuatro casos:

- co-industrias-delta
- ec-corp-andina
- hn-agroexport-sula
- pa-logistica-istmo

Cada caso genera un resultado en fixtures/reto-01/out.

### 7. Manejo de información

La información del proveedor se obtiene desde el repositorio maestro.

La solución no completa información mediante suposiciones.

Cuando existen campos obligatorios faltantes, estos se reportan mediante la estructura de validación.

Los datos maestros no son modificados durante el proceso.

### 8. Decisiones de diseño

#### TypeScript

Se utiliza TypeScript para proporcionar tipado estático y contratos claros entre las diferentes capas.

#### Zod

Zod permite validar los argumentos recibidos por las herramientas antes de ejecutar operaciones de negocio.

#### Separación Agent / Tools / Services

El agente se mantiene separado de la lógica de negocio. Esto permite cambiar el modelo de IA sin modificar las reglas determinísticas del proceso.

#### Demo determinística

La demo permite probar el comportamiento principal sin depender de disponibilidad, latencia o costo de un proveedor LLM.

### 9. Costos del modelo

Para producción se recomienda utilizar un modelo LLM únicamente para tareas donde aporte valor:

- Interpretación de solicitudes.
- Clasificación de documentos.
- Identificación de intención.
- Selección de herramientas.
- Generación de respuestas para el usuario.

Las validaciones de negocio, lectura de repositorios y generación de resultados estructurados deben permanecer en código determinístico.

Este enfoque reduce el número de llamadas al modelo y, por tanto, el costo y la latencia.

### 10. Consideraciones para producción

Para una implementación productiva se deberían incorporar:

- Autenticación y autorización.
- Gestión segura de secretos.
- Auditoría de operaciones.
- Trazabilidad de decisiones del agente.
- Persistencia de conversaciones.
- Control de versiones de prompts.
- Manejo de errores y reintentos.
- Observabilidad y métricas.
- Protección de información sensible.
- Validación y antivirus de documentos adjuntos.
- Integración con almacenamiento documental.
- Generación real de archivos Excel/PDF.
- Confirmación humana desde la interfaz.
- Control de costos y límites de uso del LLM.

### 11. Pruebas

La solución permite ejecutar la lógica principal mediante npm run demo.

La compilación se valida mediante npm exec tsc.

El procesamiento actual de los cuatro casos finaliza correctamente.

### 12. Próximas extensiones

1. Incorporar un proveedor LLM.
2. Implementar el agente conversacional.
3. Conectar las tools con el agente mediante tool calling.
4. Incorporar una interfaz web.
5. Implementar confirmación humana real.
6. Generar los formularios Excel/PDF.
7. Empaquetar los documentos finales.
8. Publicar la aplicación en un entorno cloud.
