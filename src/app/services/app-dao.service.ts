import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,map } from 'rxjs';
import { ObjectFile } from '../types/model-file';
import { ExecuteRunResponse, RunResponse } from '../types/runResponse';
import { DataResponse } from '../types/dataResponse';

@Injectable({
  providedIn: 'root'
})
export class AppDaoService {


  readonly baseUri='api/csp/healthshare/hisol/app/api/';
  
  constructor(private httpClient:HttpClient) {


  }

  public getModels():Observable<any> {
    return this.httpClient.get(this.baseUri + '$model')
  }

  public getModel(modelName:string):Observable<ObjectFile> {
    return this.httpClient.get<ObjectFile>(this.baseUri + '$model/' + modelName).pipe(map((resp:any)=>{return resp.program as ObjectFile}));
  };

  public runModel(model:ObjectFile, pipelineToRun:string):Observable<ExecuteRunResponse> {
    return this.httpClient.post<ExecuteRunResponse>(this.baseUri + '$run', {
      JDBCConnection:"localORANGEDATA",
      modelDef:model,
      pipelineToRun
    });
  }

  public getRunHistory(modelName:string):Observable<RunResponse> {
    return this.httpClient.get<RunResponse>(this.baseUri + '$run/' + modelName);
  }

  public getData(runId:number, index:number,size:number) {
    return this.httpClient.get<DataResponse>(`${this.baseUri}$run/${runId}/result/0?index=${index}&size=${size}`)
  }

}
