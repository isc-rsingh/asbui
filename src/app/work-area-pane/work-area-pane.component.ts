import { Component } from '@angular/core';

export enum WorkAreaViewType {
  Block,
  Variables,
  RunReport,
  Settings
}

@Component({
  selector: 'app-work-area-pane',
  templateUrl: './work-area-pane.component.html',
  styleUrls: ['./work-area-pane.component.scss']
})
export class WorkAreaPaneComponent {

  currentView:WorkAreaViewType = WorkAreaViewType.Settings;

  setView(view:WorkAreaViewType) {  
    this.currentView = view;
  }


  get WorkAreaViewType() { return WorkAreaViewType; }
}
