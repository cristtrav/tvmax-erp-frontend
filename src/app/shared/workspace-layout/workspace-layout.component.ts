import { Component, HostListener, Input } from '@angular/core';
import { ResponsiveSizes } from '@global-utils/responsive/responsive-sizes.interface';
import { ResponsiveUtils } from '@global-utils/responsive/responsive-utils';

@Component({
  selector: 'app-workspace-layout',
  templateUrl: './workspace-layout.component.html',
  styleUrls: ['./workspace-layout.component.scss']
})
export class WorkspaceLayoutComponent {

  readonly WORKSPACE_VERTICAL_GUTTER: ResponsiveSizes = { xs: 4, sm: 8, md: 8, lg: 8, xl: 8, xxl: 8};
  readonly WORKSPACE_HORIZONTAL_GUTTER: ResponsiveSizes = { xs: 4, sm: 8, md: 8, lg: 8, xl: 8, xxl: 8};

  @Input()
  isContentPadded: boolean = true;

  @Input()
  isBackgroundVisible: boolean = true;

  @Input()
  isForm: boolean = false;

  @Input()
  formSizes: ResponsiveSizes = ResponsiveUtils.DEFAUT_FORM_SIZES;

  constructor(){
  }

}
