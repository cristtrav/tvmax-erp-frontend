import { DetalleReclamoDTO } from "./detalle-reclamo.dto";

export interface ReclamoDTO {
    id?: number;
    fecha: Date;
    estado: string;
    fechahoracambioestado?: Date;
    observacionestado?: string;
    idusuarioregistro?: number;
    usuarioregistro?: string;
    idusuarioresponsable?: number;
    usuarioresponsable?: string;
    idsuscripcion: number;
    iddomicilio?: number;
    direccion?: string;
    latitud?: number;
    longitud?: number;
    idbarrio?: number;
    barrio?: string;
    obsdomicilio?: string;
    idservicio?: number;
    servicio?: string;
    monto?: number;
    obssuscripcion?: string;
    idcliente?: number;
    cliente?: string;
    eliminado: boolean;
    detalles: DetalleReclamoDTO[];
    observacion?: string;
}