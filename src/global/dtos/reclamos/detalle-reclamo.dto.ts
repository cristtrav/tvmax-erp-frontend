export interface DetalleReclamoDTO {
    id: number;
    idreclamo?: number;
    idmotivo: number;
    motivo?: string;
    observacion?: string;
    eliminado: boolean;
}