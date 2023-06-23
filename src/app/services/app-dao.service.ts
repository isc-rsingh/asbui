import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,map } from 'rxjs';
import { ObjectFile } from '../types/model-file';

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

}
