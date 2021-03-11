export class Suscripcion{
    id: number | null = null;
    idservicio: number | null = null;
    servicio: string | null = null;
    conectado: boolean = false;
    reconectado: boolean = false;
    fechasuscripcion: string | null = null;
    iddomicilio: number | null = null;
    direccion: string | null = null;
    idcliente: number | null = null;
    cliente: string | null = null;
    monto: number| null = null;
}