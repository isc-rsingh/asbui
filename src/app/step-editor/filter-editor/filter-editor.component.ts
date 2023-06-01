import { Component, Input } from '@angular/core';
import { FilterArgs, OperationObject } from 'src/app/types/model-file';

@Component({
  selector: 'app-filter-editor',
  templateUrl: './filter-editor.component.html',
  styleUrls: ['./filter-editor.component.scss']
})
export class FilterEditorComponent {
  @Input() step:OperationObject;
  get filterArgs():FilterArgs {
    return this.step.arguments as FilterArgs
  }
}
