import { Component, Input } from '@angular/core';
import { StepObject, StepType } from '../types/model-file';

@Component({
  selector: 'app-step-editor',
  templateUrl: './step-editor.component.html',
  styleUrls: ['./step-editor.component.scss']
})
export class StepEditorComponent {
  @Input() step:StepObject;

  public expanded:boolean=false;

  get StepType() {
    return StepType;
  }
}
