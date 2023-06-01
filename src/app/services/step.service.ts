import { Injectable } from '@angular/core';
import { GroupObject, ObjectFile, OperationObject, PipelineObject, StepType } from '../types/model-file';
import { CurrentStateService } from './current-state.service';
import { EditorContextService } from './editor-context.service';
import { Observable, of } from 'rxjs';


export interface StepMetadata {
  jsonName:string;
  displayName:string;
  description: string;
  canAddToGroup: boolean;
}

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

  public GetStepTypes$(): Observable<StepMetadata[]> {
    return of([
      {jsonName:StepType.Pipeline, displayName:"Pipeline",description:"Independent set of instructions", canAddToGroup:false},
      {jsonName:StepType.Group, displayName:"Group",description:"A group of instructions", canAddToGroup:false},
      {jsonName:StepType.Merge, displayName:"Merge",description:"Merges two groups of data together", canAddToGroup:true},
      {jsonName:StepType.SqlPopulate, displayName:"Get",description:"Retrieve data from an external source", canAddToGroup:true},
      {jsonName:StepType.SqlAnnotate, displayName:"Declare",description:"Add a variable for use throughout the model", canAddToGroup:true},
      {jsonName:StepType.ConditionAnnotate, displayName:"Conditional",description:"Add a conditional variable for use throughout the model", canAddToGroup:true},
      {jsonName:StepType.Filter, displayName:"Filter",description:"Narrow the rows available in the model", canAddToGroup:true},
      {jsonName:StepType.Export, displayName:"Export",description:"Write the model to an external source", canAddToGroup:true},
    ]);
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
