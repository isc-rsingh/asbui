import { Component, Input, OnInit } from '@angular/core';
import { EnvListValueSet, EnvSQLValueSet, EnvValue } from '../types/model-file';
import { EnvironmentVariableService } from '../services/environment-variable.service';

@Component({
  selector: 'app-enviroment-variable-editor',
  templateUrl: './enviroment-variable-editor.component.html',
  styleUrls: ['./enviroment-variable-editor.component.scss']
})
export class EnviromentVariableEditorComponent implements OnInit {
  
  @Input() key: string;
  enviromentValue: EnvValue | EnvSQLValueSet | EnvListValueSet
  enviromentValue_val: EnvValue;
  
  constructor(private environmentVariableService: EnvironmentVariableService) { } 

  ngOnInit(): void {
    this.enviromentValue = this.environmentVariableService.GetEnvironmentVariable(this.key);  
    this.enviromentValue_val = this.enviromentValue as EnvValue;
  }

  get isValueVariable(): boolean {
    return Object.keys(this.enviromentValue).includes('value');
  }

  get inputType(): string {
    return this.enviromentValue.dataType === 'string' ? 'text' : this.enviromentValue.dataType;
  }
  
}
