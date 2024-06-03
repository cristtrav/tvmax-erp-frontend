import { MaterialDTO } from "./material.dto";

export interface TipoMaterialDTO{
    id: number;
    descripcion: string;
    sololectura: boolean;
    eliminado: boolean;
    materiales?: MaterialDTO[]
}