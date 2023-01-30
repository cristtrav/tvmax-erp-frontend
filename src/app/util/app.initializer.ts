import { SesionService } from '../servicios/sesion.service';

export function appInitializer(sessionSrv: SesionService){
    return () => new Promise<void | null>(resolve => {
        const rtoken = localStorage.getItem('refreshToken');
        if(rtoken){
            //sessionSrv.refresh(rtoken).subscribe().add(resolve);
            sessionSrv.refresh(rtoken).subscribe({
                next: () => {
                    console.log('Sesion refrescada');
                },
                error: (e) => {
                    console.error('Error al refrescar sesion', e);
                }
            });
        }/*else{
            resolve(null);
        }*/
        resolve();
    });
}