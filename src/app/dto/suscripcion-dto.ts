export class Suscripcion{
    id: number | null = null;
    idservicio: number | null = null;
    servicio: string | null = null;
    estado: string | null = null
    fechacambioestado: string | null = null;
    fechasuscripcion: string | null = null;
    iddomicilio: number | null = null;
    direccion: string | null = null;
    idcliente: number | null = null;
    cliente: string | null = null;
    monto: number| null = null;
    cuotaspendientes: number = 0;
    deuda: number = 0;
}