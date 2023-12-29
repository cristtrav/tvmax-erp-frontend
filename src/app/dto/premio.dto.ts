export interface PremioDTO {
    id: number;
    descripcion: string;
    nropremio: number;
    idsorteo: number;
    sorteo?: string;
    idclienteganador?: number;
    clienteganador?: string;
    ciclienteganador?: string;
    eliminado: boolean;
}