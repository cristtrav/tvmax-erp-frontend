export class CobroDetalleVenta{
    iddetalleventa: number | null = null;
    monto: number | null = null;
    idservicio: number | null = null;
    servicio: string | null = null;
    idgrupo: number | null = null;
    grupo: string | null = null;
    fechavencimiento: Date | null = null;
    idcuota: number | null = null;
    cliente: string | null = null;
    ci: number | null = null;
    dvruc: number | null = null;
    fechafactura: Date | null = null;
    pagado: boolean | null = null;
    anulado: boolean | null = null;
    fechacobro: Date | null = null;
    facturacobro: string | null = null;
    idcobrador: number | null = null;
    cobrador: string | null = null;
    idusuario: number | null = null;
    usuario: string | null = null;
}