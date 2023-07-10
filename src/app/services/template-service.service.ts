import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { TemplateFile } from '../types/template';
import { AppDaoService } from './app-dao.service';
import { EnvValue, EnvSQLValueSet, EnvListValueSet, OperationObject, EEnvDataType, StepType } from '../types/model-file';

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

  public GetModel(modelFile:TemplateFile) {
    return this.appDaoService.getModel(modelFile.name);
  }
}
