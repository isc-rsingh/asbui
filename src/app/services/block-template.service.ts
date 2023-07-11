import { KeyValue } from '@angular/common';
import { Injectable, assertPlatform } from '@angular/core';
import { ConditionMap, EEnvDataType, FilterArgs, GroupArgs, GroupObject, OperationObject, PipelineObject, StepType } from '../types/model-file';
import { Observable, firstValueFrom, map, of } from 'rxjs';
import { StepService } from './step.service';
import { CurrentStateService } from './current-state.service';

export interface BlockDefinition {
  blockName: string;
  description:string;
  statements: (BlockText | BlockPrompt)[];
  fragments: OperationObject[],
  initialGroupArgs?: GroupArgs,
}

export interface BlockText {
  statementid?: number,
  text: string;
  associatedPrompts?:number[];
  alwaysInUse?:boolean;
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

  public async AddBlockTemplateBeforeGroup(blockTemplateName:string, groupIdx:number):Promise<number | null> {
    const parentStep = this.stepService.GetParentStep(this.currentStateService.currentDocument, groupIdx) as GroupObject;
    const blockTemplate = await firstValueFrom(this.GetBlockTemplate(blockTemplateName));
    if (!blockTemplate) {return null;}

    let nextStepId = this.stepService.highestStepInPipeline(this.currentStateService.currentDocument) + 1;
    if (parentStep){
      const newGroup = {
        name:blockTemplateName,
        description:blockTemplateName,
        stepId:nextStepId,
        stepType:StepType.Group,
        disabled:false,
        arguments: {
          steps:blockTemplate.initialGroupArgs ? this.cloneGroupArgsWithNewSteps(nextStepId, blockTemplate.initialGroupArgs)?.groupArgs?.steps : [],
          blockName:blockTemplateName
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
          return null;
      }
      const siblingIdx = stepArray.findIndex(x=>x.stepId === groupIdx);
      if (siblingIdx < 0) return null;

      stepArray.splice(siblingIdx,0,newGroup);

      return newGroup.stepId;
    }

    return null;
  }

  public async AddBlockTemplateAfterStep(blockTemplateName:string, stepId:number):Promise<number | null> {
    const parentStep = this.stepService.GetParentStep(this.currentStateService.currentDocument, stepId) as GroupObject;
    const blockTemplate = await firstValueFrom(this.GetBlockTemplate(blockTemplateName));
    if (!blockTemplate) {return null;}

    let nextStepId = this.stepService.highestStepInPipeline(this.currentStateService.currentDocument) + 1;
    if (parentStep){
      const newGroup = {
        name:blockTemplateName,
        description:blockTemplateName,
        stepId:nextStepId,
        stepType:StepType.Group,
        disabled:false,
        arguments: {
          steps:blockTemplate.initialGroupArgs ? this.cloneGroupArgsWithNewSteps(nextStepId, blockTemplate.initialGroupArgs)?.groupArgs?.steps : [],
          blockName:blockTemplateName
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
          return null;
      }
      const siblingIdx = stepArray.findIndex(x=>x.stepId === stepId);
      if (siblingIdx < 0) return null;

      stepArray.splice(siblingIdx + 1,0,newGroup);

      return newGroup.stepId;
    }

    return null;
  }

  private cloneGroupArgsWithNewSteps(highestStepId:number, groupArgs:GroupArgs): {highestStepId:number, groupArgs:GroupArgs} {
    const clone = JSON.parse(JSON.stringify(groupArgs));
    
    groupArgs.steps.forEach(s=>{
      s.stepId=++highestStepId;
      const g = s as GroupObject
      if (g.stepType == StepType.Group && g.arguments) {
        const recurseRslts = this.cloneGroupArgsWithNewSteps(highestStepId, g.arguments);
        g.arguments.steps = recurseRslts.groupArgs.steps;
        highestStepId = recurseRslts.highestStepId;
      }
    })

    return { groupArgs:clone,highestStepId} ;
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
        {text: 'And patients whose gender is', associatedPrompts:[3]},
        {promptid: 3, promptType:BlockPromptType.Values, fragmentStepId:103, environmentVariable: 'Gender', promptValues:['M','F']},
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
        },{
          "stepType": StepType.Filter,
          "stepId": 103,
          "description": "gender",
          "arguments": {
            "condition": "demographic.gender_code=GenderCode",
            "localEnvironment": {
              "GenderCode": {
                "value": "M",
                "dataType": EEnvDataType.string
              }
            } as any
          },
          "disabled": false
        },
      ]
    },
    {
      blockName: 'Blood Pressure',
      description: 'Add latest blood pressure readings',
      statements: [
        {text:'Retrieve the latest blood pressure reading.', alwaysInUse:true},
        {text:'Filter patients who have a systolic reading', associatedPrompts:[1,2]},
        {text:'from', associatedPrompts:[1]},
        {promptid: 1, promptType:BlockPromptType.Number, fragmentStepId:101, environmentVariable:'MinimumSystolic'},
        {text:'and no more than', associatedPrompts:[2]},
        {promptid: 2, promptType:BlockPromptType.Number, fragmentStepId:102, environmentVariable:'MaximumSystolic'},
        {text:'And who have a diastolic reading', associatedPrompts:[3,4]},
        {text:'from', associatedPrompts:[3]},
        {promptid: 3, promptType:BlockPromptType.Number, fragmentStepId:103, environmentVariable:'MinimumDiastolic'},
        {text:'and no more than', associatedPrompts:[4]},
        {promptid: 4, promptType:BlockPromptType.Number, fragmentStepId:104, environmentVariable:'diastolic'},
      ],
      initialGroupArgs: {
        "steps": [
          {
            "stepId": 200,
            "stepType": StepType.SqlAnnotate,
            "arguments": {
              "annotationName": "systolic",
              "tableName": "HSAA.observation",
              "groupingField": "Patient->MPIID",
              "where": {
                "clause": "observationcode_code =       ?     and observationTime > ?",
                "parameters": [
                  "SystolicCode",
                  "measurePeriodStart"
                ]
              },
              "annotationProperties": [
                {
                  "annotationPropertyName": "observationDate",
                  "selectExpression": "date(ObservationTime)",
                  "dataType": "string",
                  "parameters": []
                },
                {
                  "annotationPropertyName": "value",
                  "selectExpression": "ObservationRawValue",
                  "dataType": "string",
                  "parameters": []
                }
              ]
            },
            "disabled": false,
            "description": "Systolic BP"
          },
          {
            "stepId": 201,
            "stepType": StepType.SqlAnnotate,
            "arguments": {
              "annotationName": "diastolic",
              "tableName": "HSAA.observation",
              "groupingField": "Patient ->MPIID",
              "where": {
                "clause": "observationcode_code =    ?    and observationTime > ?",
                "parameters": [
                  "DiastolicCode",
                  "measurePeriodStart"
                ]
              },
              "annotationProperties": [
                {
                  "annotationPropertyName": "observationDate",
                  "selectExpression": "date(ObservationTime)",
                  "dataType": "string",
                  "parameters": []
                },
                {
                  "annotationPropertyName": "value",
                  "selectExpression": "ObservationRawValue",
                  "dataType": "string",
                  "parameters": []
                }
              ]
            },
            "disabled": false,
            "description": "Diastolic BP"
          },
          {
            "stepId": 202,
            "stepType": StepType.ConditionAnnotate,
            "arguments": {
              "condition": "iif(systolic.count()>0, systolic.sort('observationDate',false)[0].observationDate)",
              "localEnvironment": {},
              "annotationName": "recentSystolicDate"
            },
            "disabled": false,
            "description": "mostRecentSystolicBPdate"
          },
          {
            "stepId": 203,
            "stepType": StepType.ConditionAnnotate,
            "arguments": {
              "condition": "iif(BloodPressureReadings.where(resultTime==%%mostRecentBPdate).diastolicBP.count()>0,BloodPressureReadings.where(resultTime==%%mostRecentBPdate).sort('diastolicBP')[0].diastolicBP)",
              "localEnvironment": {
                "%mostRecentBPdate": {
                  "pathExpression": "mostRecentBPdate",
                  "dataType": EEnvDataType.string
                }
              },
              "annotationName": ""
            },
            "disabled": true,
            "description": "mostRecentDiastolicBP"
          },
          {
            "stepId": 204,
            "stepType": StepType.ConditionAnnotate,
            "arguments": {
              "condition": "iif(BloodPressureReadings.where(resultTime==%%mostRecentBPdate).systolicBP.count()>0,BloodPressureReadings.where(resultTime==%%mostRecentBPdate).sort('systolicBP')[0].systolicBP)",
              "localEnvironment": {
                "%mostRecentBPdate": {
                  "pathExpression": "mostRecentBPdate",
                  "dataType": EEnvDataType.string
                }
              },
              "annotationName": ""
            },
            "disabled": true,
            "description": "mostRecentSystolicBP"
          },
          {
            "stepId": 205,
            "stepType": StepType.ConditionAnnotate,
            "arguments": {
              "annotationName": "BloodPressureGTE140OrGTE90",
              "condition": "mostRecentSystolicBP>=140 and mostRecentDiastolicBP>=90",
              "localEnvironment": {}
            },
            "disabled": true,
            "description": "BloodPressureGTE140OrGTE90"
          }
        ]
      },
      fragments: [
        {
          "stepType": StepType.Filter,
          "stepId": 101,
          "description": "minimum systolic",
          "arguments": {
            "condition": "diastolic>=MinimumSystolic",
            "localEnvironment": {
              "MinimumSystolic": {
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
          "description": "maximum systolic",
          "arguments": {
            "condition": "diastolic<=MaximumSystolic",
            "localEnvironment": {
              "MaximumSystolic": {
                "value": "18",
                "dataType": EEnvDataType.number
              }
            } as any
          },
          "disabled": false
        },
        {
          "stepType": StepType.Filter,
          "stepId": 103,
          "description": "minimum diastolic",
          "arguments": {
            "condition": "diastolic>=MinimumDiastolic",
            "localEnvironment": {
              "MinimumDiastolic": {
                "value": "18",
                "dataType": EEnvDataType.number
              }
            } as any
          },
          "disabled": false
        },
        {
          "stepType": StepType.Filter,
          "stepId": 104,
          "description": "maximum diastolic",
          "arguments": {
            "condition": "diastolic<=MaximumDiastolic",
            "localEnvironment": {
              "MaximumDiastolic": {
                "value": "18",
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
