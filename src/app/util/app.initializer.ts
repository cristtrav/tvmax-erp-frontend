import { SessionService } from './../servicios/session.service';

export function appInitializer(sessionSrv: SessionService){
    return () => new Promise(resolve => {
        const rtoken = localStorage.getItem('refreshToken');
        if(rtoken){
            sessionSrv.refresh(rtoken).subscribe().add(resolve);
        }else{
            resolve(null);
        }
        
    });
}