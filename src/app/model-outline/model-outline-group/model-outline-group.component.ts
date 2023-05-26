import { Component, Input } from '@angular/core';
import { GroupArgs, OperationObject, PipelineObject, StepType } from 'src/app/types/model-file';

@Component({
  selector: 'app-model-outline-group',
  templateUrl: './model-outline-group.component.html',
  styleUrls: ['./model-outline-group.component.scss']
})
export class DatasetsOutlineGroupComponent {
  @Input() steps:OperationObject[]=[];
  @Input() filter:string;
  @Input() expand:boolean;

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

  toggleExpand() {
    this.expand = !this.expand;
  }
}
