import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { TemplateFile } from '../types/template';
import { AppDaoService } from './app-dao.service';
import { EnvValue, EnvSQLValueSet, EnvListValueSet, OperationObject, EEnvDataType, StepType } from '../types/model-file';

export interface BlockTemplate {
  blockName: string;
  environment: {[key:string] : EnvValue | EnvSQLValueSet | EnvListValueSet};
  steps: OperationObject[];
}

@Injectable({
  providedIn: 'root'
})
export class TemplateServiceService {

  constructor(private appDaoService:AppDaoService) { }

  public GetSystemTemplates(): Observable<TemplateFile[]> {
    return of([{name:"HB1aC TestModel"}]);
  }

  public GetUserTemplates(): Observable<TemplateFile[]> {

    return this.appDaoService.getModels().pipe(map((models:any) => {
      const rslt = models.models.map((model:any) => {return {name: model.name}});
      return rslt;
    }));
  }

  public GetBlockTemplate(blockName:string):Observable<BlockTemplate | undefined> {
    return this.GetBlockTemplates().pipe(map((templates:BlockTemplate[]) => {
      return templates.find(x=>x.blockName===blockName);
    }));
  }

  public GetBlockTemplates(): Observable<BlockTemplate[]> {
    return of([{
      blockName: "Demographics",
      environment: {
          "MinimumAge": {
            "value": "18",
            "dataType": EEnvDataType.number
          },
          "MaximumAge": {
            "value": "65",
            "dataType": EEnvDataType.number
          },
          "Gender": {
            value:"All",
            "dataType": EEnvDataType.string
          }
        },
        steps:[
          {
            "stepType": StepType.Filter,
            "stepId": 101,
            "description": "age range",
            "arguments": {
              "condition": "demographic.age>=MinimumAge and demographic.age<=MaximumAge",
              "localEnvironment": {
                "MinimumAge": {
                  "value": "18",
                  "dataType": EEnvDataType.number
                },
                "MaximumAge": {
                  "value": "65",
                  "dataType": EEnvDataType.number
                }
              } as any
            },
            "disabled": false
          },
          {
            "stepType": StepType.Filter,
            "stepId": 102,
            "description": "gender",
            "arguments": {
              "condition": "demographic.gender>=Gender",
              "localEnvironment": {
                "Gender": {
                  "value": "All",
                  "dataType": EEnvDataType.string
                }
              }
            },
            "disabled": false
          }
        ]
      
    } as BlockTemplate,  
    {
      blockName: "Labs",
      environment:{},
      steps:[]
    }
    ]);
  }

  public GetModel(modelFile:TemplateFile) {
    return this.appDaoService.getModel(modelFile.name);
  }
}
