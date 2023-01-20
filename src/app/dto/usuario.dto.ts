export class Usuario {
    id: number | null = null;
    nombres: string | null = null;
    apellidos: string | null = null;
    razonsocial: string | null = null;
    ci: string | null = null;    
    password: string | null = null;
    accesosistema: boolean = true;
    email: string | null = null;
    telefono: string | null = null;
    idrol: number | null = null;
    rol: string | null = null;
    eliminado: boolean = false;
    sololectura: boolean = false;
}