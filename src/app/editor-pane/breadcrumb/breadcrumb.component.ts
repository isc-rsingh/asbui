import { Component, Input } from '@angular/core';
import { EditorContextService } from 'src/app/services/editor-context.service';

export enum BreadcrumbIconType {
  Org,
  Pipeline,
  Group,
  Step
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  @Input() text:string;
  @Input() context:number | null;
  @Input() rightMostCrumb:boolean;
  @Input() iconType:BreadcrumbIconType;
  
  constructor(private editorContextService:EditorContextService) {}

  get BreadcrumbIconType() {
    return BreadcrumbIconType;
  }
  setContextToBreadcrumb() {
    if (this.context) {
      this.editorContextService.setCurrentFocusedStepId$(this.context);
    }
  }
}
