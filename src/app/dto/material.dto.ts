export interface MaterialDTO{
    id: number;
    descripcion: string;
    unidadmedida: string;
    idtipomaterial: number;
    tipomaterial?: string;
    sololectura: boolean;
    eliminado: boolean;
}