import { Component, Input } from '@angular/core';
import { ConditionAnnotateArgs, OperationObject } from 'src/app/types/model-file';

@Component({
  selector: 'app-condition-annotate-editor',
  templateUrl: './condition-annotate-editor.component.html',
  styleUrls: ['./condition-annotate-editor.component.scss']
})
export class ConditionAnnotateEditorComponent {
  @Input() step:OperationObject;
  get conditionAnnotateArgs():ConditionAnnotateArgs {
    return this.step.arguments as ConditionAnnotateArgs;
  }
}
