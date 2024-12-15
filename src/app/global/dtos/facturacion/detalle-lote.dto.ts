export interface DetalleLoteDTO{
    idventa: number;
    idlote: number;
    codigoestado?: string;
    descripcion?: string;
    nrotimbrado: number;
    prefijofactura: string;
    nrofactura: number;
    fechahorafactura?: string;
    fechafactura: string;
}