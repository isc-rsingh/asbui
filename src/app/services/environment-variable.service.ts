import { Injectable } from '@angular/core';
import { CurrentStateService } from './current-state.service';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentVariableService {

  constructor(private currentStateService:CurrentStateService) { }

  GetEnvironmentVariable(variableName:string) {
    return this.currentStateService.currentDocument.environment[variableName];
  }
}
