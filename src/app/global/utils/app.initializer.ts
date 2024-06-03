import { SesionService } from '../services/sesion.service';

export function appInitializer(sessionSrv: SesionService){
    return () => new Promise<void | null>(resolve => {
        sessionSrv.checkServer();
        const rtoken = localStorage.getItem('refreshToken');
        if(rtoken) sessionSrv.refresh(rtoken).subscribe({
                next: () => {
                    console.log('Sesion refrescada');
                },
                error: (e) => {
                    console.log('Error al refrescar sesion', e);
                }
            }).add(resolve);
        else resolve(null);
    });
}