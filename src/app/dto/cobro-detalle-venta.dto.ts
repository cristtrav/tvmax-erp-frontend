export class CobroDetalleVenta{
    iddetalleventa: number | null = null;
    idventa: number | null = null;
    idsuscripcion: number | null = null;
    monto: number | null = null;
    descripcion: string | null = null;
    idservicio: number | null = null;
    servicio: string | null = null;
    idgrupo: number | null = null;
    grupo: string | null = null;
    fechavencimiento: Date | null = null;
    idcuota: number | null = null;
    idcliente: number | null = null;
    cliente: string | null = null;
    ci: number | null = null;
    dvruc: number | null = null;
    fechafactura: Date | null = null;
    pagado: boolean | null = null;
    anulado: boolean | null = null;
    fechacobro: Date | null = null;
    facturacobro: string | null = null;
    idcobradorcomision: number | null = null;
    cobrador: string | null = null;
    idusuarioregistrocobro: number | null = null;
    usuarioregistrocobro: string | null = null;
    eliminado: boolean | null = null;
}