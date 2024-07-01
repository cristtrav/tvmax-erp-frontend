import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TributacionService } from '@services/facturacion/tributacion.service';
import { ResponsiveSizes } from '@util/responsive/responsive-sizes.interface';
import { ResponsiveUtils } from '@util/responsive/responsive-utils';
import { finalize } from 'rxjs';

interface FileInterface{
  name: string;
  fileNumber: number;
}

@Component({
  selector: 'app-vista-tributacion',
  templateUrl: './vista-tributacion.component.html',
  styleUrls: ['./vista-tributacion.component.scss']
})
export class VistaTributacionComponent {
  
    readonly SECTION_RESPONSIVE_SIZES: ResponsiveSizes = { xs: 24, sm: 24, md: 12, lg: 11, xl: 10, xxl: 9 } as const;
    readonly LABEL_SIZES: ResponsiveSizes = { xs: 24, sm: 11, md: 10, lg: 9, xl: 8, xxl: 7} as const;
    readonly CONTROL_SIZES: ResponsiveSizes = { xs: 24, sm: 11, md: 12, lg: 13, xl: 14, xxl: 15 } as const;
    readonly ACTIONS_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;

    disabledDate = (currentDate: Date): boolean => {
      const startingPointDate = new Date(2021, 0, 1);
      return currentDate < startingPointDate;
    }

    isConsultando: boolean = false;
    files: FileInterface[] = [];

    formConsulta = new FormGroup({
      tipo: new FormControl<'mensual' | 'anual'>('mensual', [Validators.required]),
      mesAnio: new FormControl<Date | null>(null, [Validators.required])
    });

    constructor(
      private tributacionSrv: TributacionService
    ){}

    consultar(){
      Object.keys(this.formConsulta.controls).forEach(key => {
        this.formConsulta.get(key)?.markAsDirty();
        this.formConsulta.get(key)?.updateValueAndValidity();
      });
      if(this.formConsulta.valid){
        this.isConsultando = true;
        
        const mes: number = (this.formConsulta.controls.mesAnio.value?.getMonth() ?? -1) + 1;
        const anio: number = this.formConsulta.controls.mesAnio.value?.getFullYear() ?? -1;
        const tipo: 'mensual' | 'anual' = this.formConsulta.controls.tipo.value ?? 'mensual';
        
        let params = new HttpParams().append('anio', anio);
        if(tipo == 'mensual') params = params.append('mes', mes);
          
        this.tributacionSrv
          .getTotal(params)
          .pipe(finalize(() => this.isConsultando = false))
          .subscribe((nroArchivos) => {
            this.files = [];
            for(let i = 1; i <= nroArchivos; i++){
              this.files = this.files.concat([
                {
                  name: tipo == 'mensual' ? this.getMonthFileName(i, mes, anio) : this.getYearFileName(i, anio),
                  fileNumber: i
                }
              ])
            }
        })
      }
    }

    descargar(parte: number, nombrearchivo: string){
      Object.keys(this.formConsulta.controls).forEach(key => {
        this.formConsulta.get(key)?.markAsDirty();
        this.formConsulta.get(key)?.updateValueAndValidity();
      });
      if(this.formConsulta.valid){
        
        const mes: number = (this.formConsulta.controls.mesAnio.value?.getMonth() ?? -1) + 1;
        const anio: number = this.formConsulta.controls.mesAnio.value?.getFullYear() ?? -1;
        const tipo: 'mensual' | 'anual' = this.formConsulta.controls.tipo.value ?? 'mensual';
        
        let params =
          new HttpParams()
          .append('anio', anio)
          .append('parte', parte);

        if(tipo == 'mensual') params = params.append('mes', mes);
        
        this.tributacionSrv.getFile(params).subscribe(archivo => {
          var newBlob = new Blob([archivo], { type: "application/zip" });
          const data = window.URL.createObjectURL(newBlob);
            
          var link = document.createElement('a');
          link.href = data;
          link.download = nombrearchivo;
          // this is necessary as link.click() does not work on the latest firefox
          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          
          setTimeout(function () {
              // For Firefox it is necessary to delay revoking the ObjectURL
              window.URL.revokeObjectURL(data);
              link.remove();
          }, 100);
          
        })
      }
    }

    private getMonthFileName(fileNumber: number, mes: number, anio: number): string {
      const fileNumberFilled = `${fileNumber}`.padStart(4, '0');
      const mesFilled = `${mes}`.padStart(2, '0');
      return `80029009_REG_${mesFilled}${anio}_V${fileNumberFilled}.zip`;
    }

    private getYearFileName(fileNumber: number, anio: number): string {
      const fileNumberFilled = `${fileNumber}`.padStart(4, '0');
      return `80029009_REG_${anio}_V${fileNumberFilled}.zip`;
    }

}
