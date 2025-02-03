export interface NotaCreditoDTO {
    id: number;
    prefijonota: string;
    fechahora: string;
    nronota: number;
    anulado: boolean;
    idtalonario: number;
    idcliente: number;
    razonsocial: string;
    ci: string;
    dvruc: number;
    idventa: number;
    total: number;
    totalgravadoiva10: number;
    totalgravadoiva5: number;
    totalexentoiva: number;
    totaliva10: number;
    totaliva5: number;
    iddte: number;
    idestadodte: number;
    nrofactura: string;
    eliminado: boolean;
}