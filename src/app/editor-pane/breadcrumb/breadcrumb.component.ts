import { Component, Input } from '@angular/core';

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
  @Input() context:string;
  @Input() rightMostCrumb:boolean;
  @Input() iconType:BreadcrumbIconType;

  get BreadcrumbIconType() {
    return BreadcrumbIconType;
  }
}
