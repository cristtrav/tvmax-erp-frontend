export interface Servicio{
    id?: number;
    descripcion?: string;
    idgrupo?: number;
    grupo?: string;
    precio?: number;
    suscribible?: boolean;
    porcentajeiva?: number;
    facturarsinsuscripcion?: boolean;
}