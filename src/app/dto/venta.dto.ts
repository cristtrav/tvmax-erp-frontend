import { DetalleVenta } from "./detalle-venta-dto";

export class Venta {
    id: number | null = null;
    cliente: string | null = null;
    ci: number | null = null;
    dvruc: number | null = null;
    pagado: boolean = false;
    anulado: boolean = false;
    totalgravadoiva10: number = 0;
    totalgravadoiva5: number = 0;
    totalexentoiva: number = 0;
    totaliva10: number = 0;
    totaliva5: number = 0;
    total: number = 0;
    fechafactura: string | null = null;
    idcliente: number | null = null;
    prefijofactura: string | null = null;
    nrofactura: number | null = null;
    idtimbrado: number | null = null;
    timbrado: number | null = null;
    vencimientotimbrado: string | null = null;
    iniciovigenciatimbrado: string | null = null;
    fechacobro: string | null = null;
    idcobradorcomision: number | null = null;
    cobrador: string | null = null;
    idfuncionarioregistrofactura: number | null = null;
    funcionarioregistrofactura: string | null = null;
    idfuncionarioregistrocobro: number | null = null;
    funcionarioregistrocobro: string | null = null;
    detalles: DetalleVenta [] = [];
}