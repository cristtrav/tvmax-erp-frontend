import { DetalleMovimientoMaterialDTO } from "./detalle-movimiento-material.dto";

export interface MovimientoMaterialDTO{
    id: number;
    fecha: string;
    fecharetiro?: string;
    idusuarioresponsable: number;
    usuarioresponsable?: string;
    idusuarioentrega: number;
    usuarioentrega?: string;
    tipomovimiento: string;
    observacion?: string;
    idmovimientoreferencia?: number;
    devuelto: boolean;
    eliminado: boolean;
    detalles: DetalleMovimientoMaterialDTO[]
}