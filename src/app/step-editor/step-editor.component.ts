import { Component, Input } from '@angular/core';
import { StepObject, StepType } from '../types/model-file';
import { DragHelperService, DragObjectType, DragSource } from '../services/drag-helper.service';
import { StepService } from '../services/step.service';

@Component({
  selector: 'app-step-editor',
  templateUrl: './step-editor.component.html',
  styleUrls: ['./step-editor.component.scss']
})
export class StepEditorComponent {
  @Input() step:StepObject;
  @Input() groupId:number | undefined;

  constructor(private dragHelperService:DragHelperService, private stepService: StepService) {}

  public expanded:boolean=false;

  dragStart(evt:DragEvent) {
    this.dragHelperService.dragContext = {
      dragSource: this.groupId === null ? DragSource.ModelEditor : DragSource.GroupEditor,
      dragObjectType: DragObjectType.Step,
      id: this.step.stepId,
      parentId: this.groupId,
    }
  }

  dragOver(evt:DragEvent):boolean | void { 
    if (this.dragHelperService.isStep()) {
      const dataTransfer = evt.dataTransfer;
      if (dataTransfer==null) {
        return true;
      }

      if (this.dragHelperService.dragContext?.dragSource === DragSource.ModelOutline) {
        dataTransfer.dropEffect = 'copy';
      } else {
        dataTransfer.dropEffect = 'move';
      }

      evt.preventDefault();
      return false;
    }
  }

  drop(evt:DragEvent) {
    const ctx = this.dragHelperService.dragContext;
    if (!ctx) {
      console.log('Why no context');
      return;
    }

    if (ctx.id === this.step.stepId) {
      return;
    }

    if (ctx.dragSource === DragSource.GroupEditor && ctx.parentId === this.groupId && this.groupId) {
      this.stepService.moveStepWithinGroup(ctx.id, this.step.stepId, this.groupId);
    }

    if (ctx.dragSource === DragSource.GroupEditor && ctx.parentId !== this.groupId && this.groupId && ctx.parentId) {
      this.stepService.moveStepToADifferentGroup(ctx.id, this.step.stepId, this.groupId, ctx.parentId);
    }

    if (ctx.dragSource === DragSource.ModelOutline && this.groupId) {
      this.stepService.copyStepToGroup(ctx.id,this.groupId,this.step.stepId);
    }
  }


  get StepType() {
    return StepType;
  }
}
