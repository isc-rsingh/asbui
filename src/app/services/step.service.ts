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

   public GetPathToStepId(file:ObjectFile, stepId:number):number[]|null {
    
    const recurseSteps = (operation:OperationObject, path:number[]):void => {
      if (this.stepHasChildStep(operation,stepId)) {
        path.push(operation.stepId);
        if (operation.stepType === StepType.Pipeline) {
          const pipeline = operation as PipelineObject;
          pipeline.steps.forEach((s:OperationObject)=>recurseSteps(s,path));
        }
        if (operation.stepType === StepType.Group) {
          const grp = operation as GroupObject;
          return grp.arguments?.steps.forEach((s:OperationObject)=>recurseSteps(s,path));
        }
      }
    }

    const rslt:number[]=[];
    file.pipelines.forEach((p:PipelineObject)=>recurseSteps(p,rslt));
    return rslt;
  }


  public AddNewGroup(groupName: string) {
    let currentStepGroup = this.currentState.currentDocument.pipelines[0].steps;
    const newGroup:GroupObject = {
      stepId:this.highestStepId(currentStepGroup,0),
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

  public GetStep(file: ObjectFile, stepId:number): OperationObject | null{
    const recurseSteps = (operation:OperationObject):OperationObject | null => {
      if (operation.stepId === stepId) {
        return operation;
      }
      if (this.stepHasChildStep(operation,stepId)) {
        let operations:OperationObject[] = [];
        if (operation.stepType === StepType.Pipeline) {
           operations = (operation as PipelineObject).steps;
        }
        if (operation.stepType === StepType.Group) {
          operations = (operation as GroupObject).arguments?.steps || [];
        }
        for (let i=0;i<operations.length;i++) {
          const r = recurseSteps(operations[i])  ;
          if (r) {return r;}
        }
      }
      return null;
    }

    for (let i=0;i<file.pipelines.length;i++) {
      const rslt = recurseSteps(file.pipelines[i]);
      if (rslt) {return rslt;}
    }

    return null;
  }

  private highestStepId(steps:OperationObject[], currentMax:number): number {
    steps.forEach(s=> {

      if (s.stepId > currentMax) {currentMax = s.stepId;}

      if (s.stepType === StepType.Pipeline) {
        const pipelineStep = s as PipelineObject;
        currentMax = this.highestStepId(pipelineStep.steps, currentMax);
      }
      if (s.stepType === StepType.Group) {
        const groupStep = s as GroupObject;
        currentMax = this.highestStepId(groupStep.arguments?.steps || [], currentMax);
      }

    });

    return currentMax;
  }

  private stepHasChildStep(step: OperationObject, childStepId:number):boolean {
    if (step.stepId === childStepId) {return true;}
    if (step.stepType === StepType.Pipeline) {
      const pipeline = step as PipelineObject;
      return pipeline.steps.some((x:OperationObject) => this.stepHasChildStep(x,childStepId));
    }
    if (step.stepType === StepType.Group) {
      const grp = step as GroupObject;
      return grp.arguments?.steps.some((x:OperationObject) => this.stepHasChildStep(x,childStepId)) || false;
    }
    return false;
  }
}
