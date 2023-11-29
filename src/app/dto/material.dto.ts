export interface MaterialDTO{
    id: number;
    descripcion: string;
    unidadmedida: string;
    idtipomaterial: number;
    tipomaterial?: string;
    cantidad: number;
    sololectura: boolean;
    eliminado: boolean;
}