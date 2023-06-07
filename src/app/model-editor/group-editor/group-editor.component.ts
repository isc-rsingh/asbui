import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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
  @ViewChild('groupNameInput') groupNameInput:ElementRef;

  newStepType:StepType;
  expanded:boolean[]=[];
  editing:boolean=false;

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

  drop(event:CdkDragDrop<OperationObject>) {
    console.log(event);
    const steps = this.group.arguments?.steps || [];
    moveItemInArray(steps, event.previousIndex, event.currentIndex);
  }

  showDescriptionInput() {
    this.editing = true;
    
    setTimeout(()=>{
      this.groupNameInput.nativeElement.focus();
    },0);
  }


  get StepType() {
    return StepType;
  }
}
