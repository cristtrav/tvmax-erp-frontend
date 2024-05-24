import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-workspace-layout',
  templateUrl: './workspace-layout.component.html',
  styleUrls: ['./workspace-layout.component.scss']
})
export class WorkspaceLayoutComponent {

  @Input()
  isContentPadded: boolean = true;

  @Input()
  isBackgroundVisible: boolean = true;

  constructor(){
  }

}
