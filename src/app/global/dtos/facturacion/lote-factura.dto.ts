export interface LoteFacturaDTO{
    id: number;
    fechahoracreacion: string;
    fechahoraenvio: string;
    fechahoraconsulta: string;
    enviado: boolean;
    aceptado: boolean;
    consultado: boolean;
    nrolotesifen: string;
    observacion: string;
    cantidadfacturas: number;
}