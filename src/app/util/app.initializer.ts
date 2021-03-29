import { SesionService } from '../servicios/sesion.service';

export function appInitializer(sessionSrv: SesionService){
    return () => new Promise(resolve => {
        const rtoken = localStorage.getItem('refreshToken');
        if(rtoken){
            sessionSrv.refresh(rtoken).subscribe().add(resolve);
        }else{
            resolve(null);
        }
        
    });
}