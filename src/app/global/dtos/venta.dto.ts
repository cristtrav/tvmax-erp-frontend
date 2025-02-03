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
    fechahorafactura: string | null = null;
    idcliente: number | null = null;
    prefijofactura: string | null = null;
    nrofactura: number | null = null;
    idtalonario: number | null = null;
    timbrado: number | null = null;
    vencimientotimbrado: Date | null = null;
    iniciovigenciatimbrado: Date | null = null;
    facturaelectronica: boolean | null = null;
    fechacobro: Date | null = null;
    idcobradorcomision: number | null = null;
    cobrador: string | null = null;
    idusuarioregistrofactura: number | null = null;
    usuarioregistrofactura: string | null = null;
    idusuarioregistrocobro: number | null = null;
    usuarioregistrocobro: string | null = null;
    detalles: DetalleVenta [] = [];
    idestadodte: number | null = null;
    fechacambioestadodte: string | null = null;
    iddte: number | null = null;
}