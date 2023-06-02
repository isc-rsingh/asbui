import { Component, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EditorContextService } from 'src/app/services/editor-context.service';
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

  constructor(public editorContextService:EditorContextService) {}
  
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
}
