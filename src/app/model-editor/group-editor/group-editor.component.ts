import { Component, Input } from '@angular/core';
import { StepService } from 'src/app/services/step.service';
import { GroupObject } from 'src/app/types/model-file';

@Component({
  selector: 'app-group-editor',
  templateUrl: './group-editor.component.html',
  styleUrls: ['./group-editor.component.scss']
})
export class GroupEditorComponent {
  @Input() group:GroupObject;
  @Input() isLastGroup: boolean;

  constructor(private stepService:StepService) {}

  addNewGroup() {
    this.stepService.AddNewGroup("Group Name");
  }
}
