export interface FacturaElectronicaDTO{
    id: number;
    firmado: boolean;
    version: number;
    idestadodocumento: number;
    estadodocumento: string;
    fechacambioestado: string;
    observaciondocumento: string;
    idestadoemail: number;
    estadoemail: string;
    fechacambioestadoemail: string;
    intentoemail: string;
    observacionemail: string;
}