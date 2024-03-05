import { RolDTO } from "./rol.dto";

export interface UsuarioDTO {
    id: number;
    nombres: string;
    apellidos: string;
    razonsocial?: string;
    ci: string;    
    password: string;
    accesosistema: boolean;
    email: string;
    telefono: string;
    roles?: RolDTO[];
    idroles?: number[];
    eliminado: boolean;
    sololectura?: boolean;
}