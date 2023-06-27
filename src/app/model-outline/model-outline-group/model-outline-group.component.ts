import { Component, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DragHelperService, DragObjectType, DragSource } from 'src/app/services/drag-helper.service';
import { EditorContextService } from 'src/app/services/editor-context.service';
import { StepService } from 'src/app/services/step.service';
import { GroupArgs, OperationObject, PipelineObject, StepType } from 'src/app/types/model-file';

@Component({
  selector: 'app-model-outline-group',
  templateUrl: './model-outline-group.component.html',
  styleUrls: ['./model-outline-group.component.scss']
})
export class DatasetsOutlineGroupComponent {
  @Input() steps:OperationObject[]=[];
  @Input() filter:string;
  @Input() isFirstLevel: boolean;
  @Input() parentId: number;

  constructor(
    private editorContextService:EditorContextService,
    private dragHelperService:DragHelperService,
    private stepService:StepService,
    ) {}
  
  private destroy$: Subject<void> = new Subject<void>();
  currentStepId:number | null= null;
  expand:boolean[]=[];
  
  ngOnInit(): void {
    this.editorContextService.currentFocusedStepId$.pipe(takeUntil(this.destroy$)).subscribe((step) => {
      this.currentStepId = step;
    });
    this.steps.forEach((s:OperationObject)=>{
      this.expand[s.stepId] = this.isFirstLevel;
    })
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  getGroupSteps(step:OperationObject):OperationObject[] {
    let steps:OperationObject[] = [];
    if (step.stepType === StepType.Pipeline) {
      const pipeline = step as PipelineObject;
      steps = pipeline.steps;
    }
    if (step.stepType === StepType.Group) {
      const groupArgs = step.arguments as GroupArgs;
      steps = groupArgs.steps;
    }
    return steps.filter(s=>{
      return !this.filter || s.description?.includes(this.filter);
    });
  }

  expandableStep(step:OperationObject):boolean {
    return ['pipeline','group'].includes(step.stepType);
  }

  toggleExpand(step:OperationObject) {
    this.expand[step.stepId] = !this.expand[step.stepId];
  }

  setContextToStep(step:OperationObject) {
    this.editorContextService.setCurrentFocusedStepId$(step.stepId);
  }

  dragStart(evt:DragEvent, step:OperationObject) {
    this.dragHelperService.dragContext = {
      id:step.stepId,
      parentId: this.parentId,
      dragObjectType: DragObjectType.Step,
      dragSource:DragSource.ModelOutline
    };
  }

  dragOver(evt:DragEvent, step:OperationObject):boolean | void{
    const ctx = this.dragHelperService.dragContext;
    if (ctx?.dragSource === DragSource.ModelOutline) {
      const dataTransfer = evt.dataTransfer;
      if (dataTransfer==null) {
        return true;
      }
      dataTransfer.dropEffect = 'move';
      evt.preventDefault();
      return false;
    }

    if (this.dragHelperService.isBlockTemplate()) {
      const dataTransfer = evt.dataTransfer;
      if (dataTransfer==null) {
        return true;
      }
      dataTransfer.dropEffect = 'copy';
      evt.preventDefault();
      return false;
    }
  }

  drop(evt:DragEvent, step:OperationObject) {
      const ctx = this.dragHelperService.dragContext;
      if (!ctx) {
        return;
      }
      if (this.dragHelperService.isStep()) {  
        if (ctx.parentId === this.parentId) {
          this.stepService.moveStepWithinGroup(+ctx.id,step.stepId,this.parentId);
        }

        if (ctx.parentId !== this.parentId && this.parentId && ctx.parentId) {
          this.stepService.moveStepToADifferentGroup(+ctx.id, step.stepId, this.parentId, ctx.parentId);
        }
      }
  }
}
