
import { EventEmitter } from "@angular/core";
import { IParametroFiltro } from "./iparametrosfiltros.interface";

export interface IFormFiltroSkel {
    paramsFiltrosChange: EventEmitter<IParametroFiltro>;
    cantFiltrosChange: EventEmitter<number>;
    getQueryParams(): IParametroFiltro;
    getCantidadFiltros(): number;
    filtrar(): void;
}