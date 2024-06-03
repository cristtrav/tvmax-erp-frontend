import { CobroCuota } from "./cobro-cuota.dto";

export interface CuotaDTO {
    id?: number;
    idservicio?: number;
    servicio?: string;
    porcentajeiva?: number;
    idsuscripcion?: number;
    monto?: number;
    fechavencimiento?: string;
    nrocuota?: number;
    pagado?: boolean;
    observacion?: string;
    cobro?: CobroCuota;
}