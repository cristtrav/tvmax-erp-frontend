export interface NotaCreditoDetalleDTO {
    id: number;
    idnotacredito: number;
    idservicio: number;
    idsuscripcion: number;
    idcuota: number;
    monto: number;
    cantidad: number;
    subtotal: number;
    porcentajeiva: number;
    montoiva: number;
    descripcion: string;
    eliminado: boolean;
}