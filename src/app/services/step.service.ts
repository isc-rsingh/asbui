import { Injectable } from '@angular/core';
import { ConditionAnnotateArgs, EnvListValueSet, EnvSQLValueSet, EnvValue, ExportArgs, FilterArgs, GroupArgs, GroupObject, MergeArgs, ObjectFile, OperationObject, PipelineObject, SQLField, SqlAnnotateArgs, SqlPopulateArgs, StepObject, StepType } from '../types/model-file';
import { CurrentStateService } from './current-state.service';
import { EditorContextService } from './editor-context.service';
import { Observable, firstValueFrom, of } from 'rxjs';
import { group } from '@angular/animations';
import { TemplateServiceService } from './template-service.service';


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

  constructor(
    private currentState:CurrentStateService,
    private editorContext: EditorContextService,
    private templateService:TemplateServiceService) { }

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

  public AddNewStepToGroup(group:GroupObject, stepType:StepType) {

    const newStep:OperationObject = {
      stepId:this.highestStepId(this.currentState.currentDocument.pipelines,0)+1,
      stepType,
      arguments:{
        ...this.defaultStepArgument(stepType)
      }
    }
    
    group.arguments = group.arguments || {steps:[]};
    group.arguments.steps.push(newStep);
  }

  public GetStepTypes$(): Observable<StepMetadata[]> {
    return of([
      {jsonName:StepType.Pipeline, displayName:"Pipeline",description:"Independent set of instructions", canAddToGroup:false},
      {jsonName:StepType.Group, displayName:"Group",description:"A group of instructions", canAddToGroup:false},
      {jsonName:StepType.Merge, displayName:"Merge",description:"Merges two groups of data together", canAddToGroup:true},
      {jsonName:StepType.SqlPopulate, displayName:"Populate",description:"Retrieve data from an external source", canAddToGroup:true},
      {jsonName:StepType.SqlAnnotate, displayName:"Get",description:"Add a field for use throughout the model", canAddToGroup:true},
      {jsonName:StepType.ConditionAnnotate, displayName:"Derive",description:"Add a conditional variable for use throughout the model", canAddToGroup:true},
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

  public GetParentStep(file: ObjectFile, childStepId: number) : OperationObject | null {

    const recurseSteps = (operation:OperationObject):OperationObject | null => {
      
      if (this.stepHasChildStep(operation,childStepId)) {
        let operations:OperationObject[] = [];
        if (operation.stepType === StepType.Pipeline) {
           operations = (operation as PipelineObject).steps;
        }
        if (operation.stepType === StepType.Group) {
          operations = (operation as GroupObject).arguments?.steps || [];
        }
        for (let i=0;i<operations.length;i++) {
          if (operations[i].stepId === childStepId) {
            return operation;
          }
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

  public moveStepWithinGroup(stepToMoveId:number, stepToPlaceBeforeId:number, withinGroupId: number) {
    const groupStep = this.GetStep(this.currentState.currentDocument,withinGroupId) as GroupObject;
    const stepToMove = this.GetStep(this.currentState.currentDocument, stepToMoveId);
    if (!groupStep || !stepToMove) {
      console.log('Asked to move a step where either the group or step didn\'t exist');
      return;
    }
    const groupSteps = groupStep.arguments?.steps || [];
    const idxToRemove = groupSteps.indexOf(stepToMove);
    groupStep.arguments?.steps.splice(idxToRemove,1);

    const idxToInsert = groupSteps.findIndex(x=>x.stepId === stepToPlaceBeforeId);
    if (idxToInsert < 0) {
      console.log('Asked to move a group before a step that doesn\'t exist');
      return;
    }
    groupStep.arguments?.steps.splice(idxToInsert,0,stepToMove);
  }

  public moveStepToADifferentGroup(stepToMoveId:number, stepToPlaceBeforeId:number, newGroupId: number, priorGroupId:number) {
    const oldGroup = this.GetStep(this.currentState.currentDocument, priorGroupId) as GroupObject;
    const stepToMove = this.GetStep(this.currentState.currentDocument, stepToMoveId);
    if (!oldGroup || !stepToMove) {
      console.log('Asked to move a step where either the group or step didn\'t exist');
      return;
    }

    const oldGroupSteps = oldGroup.arguments?.steps || [];
    const idxToRemove = oldGroupSteps.indexOf(stepToMove);
    oldGroup.arguments?.steps.splice(idxToRemove,1);

    const newGroup = this.GetStep(this.currentState.currentDocument, newGroupId) as GroupObject;
    const newGroupSteps = newGroup.arguments?.steps || [];
    const idxToInsert = newGroupSteps.findIndex(x=>x.stepId === stepToPlaceBeforeId);
    if (idxToInsert < 0) {
      console.log('Asked to move a group before a step that doesn\'t exist');
      return;
    }
    newGroup.arguments?.steps.splice(idxToInsert,0,stepToMove);
  }

  public copyStepToGroup(stepIdToCopy:number, groupId: number, stepToPlaceBeforeId:number) {
    const groupStep = this.GetStep(this.currentState.currentDocument,groupId) as GroupObject;
    const stepToCopy = JSON.parse(JSON.stringify(this.GetStep(this.currentState.currentDocument, stepIdToCopy))) as OperationObject;
    if (!groupStep || !stepToCopy) {
      console.log('Asked to copy a step where either the group or step didn\'t exist');
      return;
    }
    
    const groupSteps = groupStep.arguments?.steps || [];
    const idxToInsert = groupSteps.findIndex(x=>x.stepId === stepToPlaceBeforeId);
    if (idxToInsert < 0) {
      console.log('Asked to copy a group before a step that doesn\'t exist');
      return;
    }
    groupStep.arguments?.steps.splice(idxToInsert,0,stepToCopy);
  }

  public getEnviromentVariablesForStep(stepId:number, currentResult: {[key:string] : EnvValue | EnvSQLValueSet | EnvListValueSet}): {[key:string] : EnvValue | EnvSQLValueSet | EnvListValueSet} {

    const step = this.GetStep(this.currentState.currentDocument,stepId);
    if (!step) {return {};}

    let rslt:any = {...currentResult};

    switch (step.stepType) { 
      case StepType.SqlAnnotate: {
        const annotateArgs = step.arguments as SqlAnnotateArgs;
        if (annotateArgs.where && annotateArgs.where.parameters) {
          annotateArgs.where.parameters.forEach((p:string)=> {
            rslt[p] = rslt[p] || this.currentState.currentDocument.environment[p];
          });
        }

        if (annotateArgs.annotationProperties ) {
          annotateArgs.annotationProperties.forEach((f:SQLField)=> {
            if (f.parameters) {
              f.parameters.forEach((p:string)=> {
                rslt[p] = rslt[p] || this.currentState.currentDocument.environment[p];
              });
            }
          });
        }
        break;
      }
      case StepType.ConditionAnnotate: {
        const annotateArgs = step.arguments as ConditionAnnotateArgs;
        if (annotateArgs.localEnvironment) {
          //TODO: Make sure this is a valid cast in other model files
          const s = annotateArgs.localEnvironment as string;
          if (typeof s === 'string') {
            rslt[s] = rslt[s] || this.currentState.currentDocument.environment[s];
          }
        }
        break;
      }
      case StepType.Export: {
        break;
      }
      case StepType.Filter: {
        const filterArgs = step.arguments as FilterArgs;
        if (filterArgs.localEnvironment) {
          Object.keys(filterArgs.localEnvironment).forEach((k:string)=> {
            rslt[k] = rslt[k] || this.currentState.currentDocument.environment[k];
          });
        }
        break;
      }
      case StepType.Group: {
        const groupArgs = step.arguments as GroupArgs;
        groupArgs.steps.forEach(s=> {
          rslt = {...rslt, ...this.getEnviromentVariablesForStep(s.stepId, rslt)};
        });
        break;
      }
      case StepType.Merge: {
        //TODO: Are there any parameters?  Fold parameters for both pipelines into result?
        break;
      }
      case StepType.Pipeline: {
        //TODO: Will this ever be needed
        break;
      }
      case StepType.SqlPopulate: {
        var sqlPopulateArgs = step.arguments as SqlPopulateArgs;
        if (sqlPopulateArgs.where && sqlPopulateArgs.where.parameters) {
          sqlPopulateArgs.where.parameters.forEach((p:string)=> {
            rslt[p] = rslt[p] || this.currentState.currentDocument.environment[p];
          });
        }

        if (sqlPopulateArgs.annotationProperties ) {
          sqlPopulateArgs.annotationProperties.forEach((f:SQLField)=> {
            if (f.parameters) {
              f.parameters.forEach((p:string)=> {
                rslt[p] = rslt[p] || this.currentState.currentDocument.environment[p];
              });
            }
          });
        }
        break;
      }
    }
    return rslt;
  }

  
  public async AddBlockTemplateBeforeGroup(blockTemplateName:string, groupIdx:number) {
    const parentStep = this.GetParentStep(this.currentState.currentDocument, groupIdx) as GroupObject;
    if (parentStep){
      const template = await firstValueFrom(this.templateService.GetBlockTemplate(blockTemplateName));
      if (!template) return;
      let nextStepId = this.highestStepInPipeline(this.currentState.currentDocument) + 1;
      const newGroup = {
        name:blockTemplateName,
        description:blockTemplateName,
        stepId:nextStepId,
        stepType:StepType.Group,
        disabled:false,
        arguments: {
          steps:template.steps.map((s:OperationObject) => {
            return {
              ...s,
              stepId:(++nextStepId),
            }
          })
        }
      };
      let stepArray:OperationObject[] = [];
      switch (parentStep.stepType) {
        case StepType.Pipeline: {
          stepArray = (parentStep as PipelineObject).steps;
          break;
        }
        case StepType.Group: {
          stepArray = (parentStep as GroupObject).arguments?.steps || [];
          break;
        }
        default:
          return;
      }
      const siblingIdx = stepArray.findIndex(x=>x.stepId === groupIdx);
      if (siblingIdx < 0) return;

      stepArray.splice(siblingIdx,0,newGroup);

      Object.keys(template.environment).forEach(k=> {
        if (!this.currentState.currentDocument.environment[k]) {
          this.currentState.currentDocument.environment[k] = template.environment[k];
        }
      });
    }
  }

  private highestStepInPipeline(pipeline:ObjectFile ) {
    let maxStepId = 0;
    pipeline.pipelines.forEach(p=>{
      maxStepId = this.highestStepId(p.steps,maxStepId);
    });
    return maxStepId;
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

  private defaultStepArgument(stepType:StepType) {
    switch (stepType) {
      case StepType.ConditionAnnotate:
        return {} as ConditionAnnotateArgs;
      case StepType.Export:
        return {} as ExportArgs;
      case StepType.Filter:
        return {} as FilterArgs;
      case StepType.Group:
        return {
          steps:[]
        } as GroupArgs
      case StepType.Merge:
        return {} as MergeArgs;
      case StepType.Pipeline:
        return {}
      case StepType.SqlAnnotate: 
        return {} as SqlAnnotateArgs;
      case StepType.SqlPopulate:
        return {} as SqlPopulateArgs;
    }
  }
}
