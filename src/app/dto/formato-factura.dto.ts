import { FormatoFacturaA } from "../modulos/impresion/factura-preimpresa-venta/formato-factura-a";

export interface FormatoFacturaDTO{
    id?: number;
    descripcion: string;
    tipoFactura: 'PRE' | 'AUT' | 'ELEC';
    plantilla: 'PRE-A';
    parametros: FormatoFacturaA
    eliminado: boolean;
}