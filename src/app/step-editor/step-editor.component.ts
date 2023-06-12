import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { StepObject, StepType } from '../types/model-file';
import { DragHelperService, DragObjectType, DragSource } from '../services/drag-helper.service';
import { StepService } from '../services/step.service';
import { EditorContextService, SelectedCodeView} from '../services/editor-context.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-step-editor',
  templateUrl: './step-editor.component.html',
  styleUrls: ['./step-editor.component.scss']
})
export class StepEditorComponent implements OnInit, OnDestroy {
  @Input() step:StepObject;
  @Input() groupId:number | undefined;

  editing:boolean=false;
  selectedCodeView: SelectedCodeView
  constructor(
    private dragHelperService:DragHelperService, 
    private stepService: StepService, 
    private editorContextService:EditorContextService) {}
  
  ngOnInit(): void {
    this.editorContextService.currentSelectedCodeView$.pipe(takeUntil(this.destroy$)).subscribe((view) => {
      this.selectedCodeView = view;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public expanded:boolean=false;

  private destroy$: Subject<void> = new Subject<void>();

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

  get SelectedCodeView() {
    return SelectedCodeView;
  }
}
