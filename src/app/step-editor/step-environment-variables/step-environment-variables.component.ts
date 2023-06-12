import { Component, Input } from '@angular/core';
import { StepService } from 'src/app/services/step.service';
import { EnvValue, EnvSQLValueSet, EnvListValueSet, OperationObject } from 'src/app/types/model-file';

@Component({
  selector: 'app-step-environment-variables',
  templateUrl: './step-environment-variables.component.html',
  styleUrls: ['./step-environment-variables.component.scss']
})
export class StepEnvironmentVariablesComponent {
  
  constructor(private stepService:StepService) {}

  environmentVariables: {[key:string] : EnvValue | EnvSQLValueSet | EnvListValueSet};

  private _step:OperationObject;
  get step():OperationObject {
    return this._step;
  }
  @Input() set step(val: OperationObject) {
    this._step = val;
    this.environmentVariables = this.stepService.getEnviromentVariablesForStep(this._step.stepId,{});
  }

  get noEnvironmentVariables():boolean {
    return Object.keys(this.environmentVariables).length === 0;
  }
}
