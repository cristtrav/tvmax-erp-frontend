export interface DetalleMovimientoMaterialDTO {
    id?: number;
    idmovimiento?: number;
    idmaterial: number;
    material?: string;
    unidadmedida: string;
    cantidad: number;
    cantidadanterior?: number;
    cantidadretirada?: number;
    descripcion?: string;
    iddetallemovimientoreferencia?: number;
    eliminado: boolean;
}