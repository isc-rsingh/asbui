import { Component, Input } from '@angular/core';
import { StepService } from 'src/app/services/step.service';
import { GroupObject, OperationObject, StepType } from 'src/app/types/model-file';

@Component({
  selector: 'app-group-editor',
  templateUrl: './group-editor.component.html',
  styleUrls: ['./group-editor.component.scss']
})
export class GroupEditorComponent {
  @Input() step:OperationObject;
  @Input() isLastGroup: boolean;

  newStepType:StepType;

  get group():GroupObject {
    return this.step as GroupObject;
  }


  constructor(private stepService:StepService) {}

  addNewGroup() {
    this.stepService.AddNewGroup("Group Name");
  }
  addNewStep() {
    this.stepService.AddNewStepToGroup(this.group, this.newStepType)
  }
}
