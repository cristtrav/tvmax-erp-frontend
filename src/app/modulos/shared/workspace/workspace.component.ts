import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent {

  @Input()
  isContentPadded: boolean = true;

  @Input()
  isBackgroundVisible: boolean = true;

  constructor(){
  }

}
