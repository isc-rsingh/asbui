import { KeyValue } from '@angular/common';
import { Injectable } from '@angular/core';
import { ConditionMap, EEnvDataType, FilterArgs, GroupObject, OperationObject, StepType } from '../types/model-file';
import { Observable, map, of } from 'rxjs';
import { StepService } from './step.service';
import { CurrentStateService } from './current-state.service';

export interface BlockDefinition {
  blockName: string;
  description:string;
  statements: (BlockText | BlockPrompt)[];
  fragments: OperationObject[]
}

export interface BlockText {
  statementid?: number,
  text: string;
  associatedPrompts?:number[];
}

export interface BlockPrompt {
  promptid: number,
  promptType:BlockPromptType;
  promptValues?: string[] | KeyValue<string,string>[];
  fragmentStepId:number;
  environmentVariable?:string;
}

export enum BlockPromptType {
  Text,
  Date,
  Number,
  Values
}

@Injectable({
  providedIn: 'root'
})
export class BlockTemplateService {

  constructor(
    private stepService:StepService,
    private currentStateService:CurrentStateService,
  ) { }

  public GetBlockTemplate(blockName:string):Observable<BlockDefinition | undefined> {
    return this.GetBlockTemplates().pipe(map((templates:BlockDefinition[]) => {
      return templates.find(x=>x.blockName===blockName);
    }));
  }
  
  public GetBlockTemplates(): Observable<BlockDefinition[]> {
    return of(this.sampleFragments);
  }

  public GetPromptValue(promptid:number, blockDefinition:BlockDefinition, blockGroup:GroupObject):any {
    const prompt = blockDefinition.statements.find(x=>(x as BlockPrompt).promptid===promptid) as BlockPrompt;
    if (prompt) {
      const fragment = blockDefinition.fragments.find(x=>x.stepId == prompt.fragmentStepId);
      if (fragment) {
        const step= blockGroup.arguments?.steps.find(x=>x.description === fragment.description);
        if (step) {
          const filterStep = step.arguments as any;
          const environmentVariableName = prompt.environmentVariable || "";
          const x = filterStep.localEnvironment;
          const environmentVariable = x[environmentVariableName];

          return environmentVariable?.value;
        }
      }
    }

    return null;
  } 

  public SetPromptValue(promptid:number, value:any, blockDefinition:BlockDefinition, blockGroup:GroupObject) {
    const prompt = blockDefinition.statements.find(x=>(x as BlockPrompt).promptid===promptid) as BlockPrompt;
    if (prompt) {
      const fragment = blockDefinition.fragments.find(x=>x.stepId == prompt.fragmentStepId);
      if (fragment) {
        const stepIdx = blockGroup.arguments?.steps.findIndex(x=>x.description === fragment.description);
        
        if (stepIdx != undefined && stepIdx >=0  && value === null) { //Remove step 
          blockGroup.arguments?.steps.splice(stepIdx,1);
          return;
        }
        
        let step= blockGroup.arguments?.steps[stepIdx || 0];
        
        if (!step) {
          step = {
            ...fragment,
            stepId:this.stepService.highestStepInPipeline(this.currentStateService.currentDocument) + 1
          }
          if (!blockGroup.arguments) {
            blockGroup.arguments = {steps:[]}
          }
          blockGroup.arguments?.steps.push(step);
        }

        const filterStep = step.arguments as any;
        const environmentVariableName = prompt.environmentVariable || "";
        const x = filterStep.localEnvironment;
        const environmentVariable = x[environmentVariableName];
        environmentVariable.value = value;  
      }
    }
  }

  readonly sampleFragments:BlockDefinition[] = [
    {
      blockName: 'Demographics',
      description: 'Patient Demographics',
      statements: [
        {text:'Patients', associatedPrompts:[1,2]},
        {text:'older than', associatedPrompts:[1]},
        {promptid: 1, promptType:BlockPromptType.Number, fragmentStepId:101, environmentVariable:'MinimumAge'},
        {text:'and younger than', associatedPrompts:[2]},
        {promptid: 2, promptType:BlockPromptType.Number, fragmentStepId:102, environmentVariable:'MaximumAge'},
      ],
      fragments: [
        {
          "stepType": StepType.Filter,
          "stepId": 101,
          "description": "minimum age range",
          "arguments": {
            "condition": "demographic.age>=MinimumAge",
            "localEnvironment": {
              "MinimumAge": {
                "value": "18",
                "dataType": EEnvDataType.number
              }
            } as any
          },
          "disabled": false
        },
        {
          "stepType": StepType.Filter,
          "stepId": 102,
          "description": "maximum age range",
          "arguments": {
            "condition": "demographic.age<=MaximumAge",
            "localEnvironment": {
              "MaximumAge": {
                "value": "65",
                "dataType": EEnvDataType.number
              }
            } as any
          },
          "disabled": false
        },
      ]
    }
  ]
}
