import { Directive, Input } from '@angular/core';
import { ResponsiveSizes } from 'src/app/global/utils/responsive/responsive-sizes.interface';
import { NzColDirective } from 'ng-zorro-antd/grid';

@Directive({
  selector: '[appNzColResponsiveSizes]',
  standalone: true
})
export class NzColResponsiveSizesDirective {
  
  @Input()
  set appNzColResponsiveSizes(sizes: ResponsiveSizes){
    this.setSizes(sizes);
    this._appNzColResponsiveSizes = sizes;
  };

  get appNzColResponsiveSizes(): ResponsiveSizes{
    return this._appNzColResponsiveSizes;
  }
  private _appNzColResponsiveSizes: ResponsiveSizes = {}

  constructor(
    private nzcol: NzColDirective
  ) { }

  private setSizes(sizes: ResponsiveSizes){
    this.nzcol.nzSm = sizes.sm ?? null;
    this.nzcol.nzXs = sizes.xs ?? null;
    this.nzcol.nzMd = sizes.md ?? null;
    this.nzcol.nzLg = sizes.lg ?? null;
    this.nzcol.nzXl = sizes.xl ?? null;
    this.nzcol.nzXXl = sizes.xxl ?? null;
  }

}
