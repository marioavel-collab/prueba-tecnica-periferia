export interface SolicitudProveedor {
  id: string;
  de: string;
  para: string;
  asunto: string;
  fecha: string;
  pais: string;
  cliente: string;
  formato: "xlsx" | "pdf" | "portal";
  cuerpo: string;
  adjuntos: string[];
}

export interface IngresosUltimoAno {
  valor: number;
  moneda: string;
  ano: number;
}

export interface RepresentanteLegal {
  nombre: string;
  tipo_identificacion: string;
  identificacion: string;
  cargo: string;
  email: string;
}

export interface Contacto {
  nombre: string;
  cargo: string;
  email: string;
  telefono: string;
}

export interface Banco {
  nombre: string;
  tipo_cuenta: string;
  numero_cuenta: string;
  titular: string;
  swift: string;
  moneda: string;
}

export interface MaestroProveedor {
  razon_social: string;
  tipo_sociedad: string;
  nit: string;
  digito_verificacion: string;
  pais: string;
  ciudad: string;
  departamento: string;
  direccion: string;
  codigo_postal: string;
  telefono: string;
  sitio_web: string;
  fecha_constitucion: string;
  matricula_mercantil: string;
  ciiu_principal: string;
  ciiu_secundario: string;
  actividad_economica: string;
  regimen_tributario: string;
  gran_contribuyente: boolean;
  autorretenedor: boolean;
  numero_empleados: number;
  ingresos_ultimo_ano: IngresosUltimoAno;
  certificaciones: string[];
  representante_legal: RepresentanteLegal;
  contacto_comercial: Contacto;
  contacto_financiero: Contacto;
  banco: Banco;
}

export type TipoSoporte =
  | "camara_comercio"
  | "rut"
  | "certificacion_bancaria"
  | "estados_financieros"
  | "iso_9001";

export interface ResultadoValidacion {
  valido: boolean;
  requiereConfirmacion: boolean;
  errores: string[];
  advertencias: string[];
  camposFaltantes: string[];
}

export interface ResultadoProcesamiento {
  solicitudId: string;
  proveedor: MaestroProveedor;
  soportesRequeridos: TipoSoporte[];
  validacion: ResultadoValidacion;
  documentosGenerados: string[];
  paqueteGenerado?: string;
  estado:
    | "COMPLETADO"
    | "REQUIERE_CONFIRMACION"
    | "RECHAZADO";
}