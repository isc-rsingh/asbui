import { Injectable } from '@angular/core';
import { GroupObject, ObjectFile, OperationObject, PipelineObject, StepType } from '../types/model-file';
import { CurrentStateService } from './current-state.service';
import { EditorContextService } from './editor-context.service';
import { group } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class StepService {

  constructor(private currentState:CurrentStateService,private editorContext: EditorContextService) { }

  ///TODO: Finish recursion
  // public GetPathToStepId(file:ObjectFile, stepId:number):number|null[] {
    
  //   file.pipelines.forEach(x => {
  //     if (x.stepId === stepId) {
  //       return [null];
  //     }
  //   });

  //   return [null];
  // }

  public AddNewGroup(groupName: string) {
    let currentStepGroup = this.currentState.currentDocument.pipelines[0].steps;
    const newGroup:GroupObject = {
      stepId:this.HighestStepId(currentStepGroup,0),
      stepType:StepType.Group,
      description:groupName,
      arguments:{
        steps:[]
      }
    };
    currentStepGroup.push(newGroup);
  }

  private HighestStepId(steps:OperationObject[], currentMax:number): number {
    steps.forEach(s=> {

      if (s.stepId > currentMax) {currentMax = s.stepId;}

      if (s.stepType === StepType.Pipeline) {
        const pipelineStep = s as PipelineObject;
        currentMax = this.HighestStepId(pipelineStep.steps, currentMax);
      }
      if (s.stepType === StepType.Group) {
        const groupStep = s as GroupObject;
        currentMax = this.HighestStepId(groupStep.arguments?.steps || [], currentMax);
      }

    });

    return currentMax;
  }
}
