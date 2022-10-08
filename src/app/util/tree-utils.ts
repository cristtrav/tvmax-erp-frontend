import { Grupo } from "@dto/grupo-dto";
import { Servicio } from "@dto/servicio-dto";
import { NzTreeNodeOptions } from "ng-zorro-antd/tree";

export class TreeUtils {
    public static serviciosToNodos(servicios: Servicio[]): NzTreeNodeOptions[] {
        const grupos: Grupo[] = this.extractListaGrupos(servicios);
        const nodos: NzTreeNodeOptions[] = grupos.map(g => (
            {
                key: `${g.id}`,
                title: `${g.descripcion}`,
                children: []
            }
        ));
        servicios.forEach(srv => {
            nodos.find(n => n.key === srv.idgrupo?.toString())?.children?.push(
                {
                    key: `${srv.idgrupo}-${srv.id}`,
                    title: `${srv.descripcion}`,
                    isLeaf: true
                }
            );
        });
        return nodos;
    }

    private static extractListaGrupos(servicios: Servicio[]): Grupo[] {
        const grupos: Grupo[] = [];
        servicios.forEach(srv => {
            if (!grupos.find(g => g.id == srv.idgrupo))
                grupos.push({ id: srv.idgrupo, descripcion: srv.grupo });
        });
        return grupos;
    }
}