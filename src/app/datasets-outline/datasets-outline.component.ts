import { Component,Input } from '@angular/core';
import { EnvListValueSet, EnvSQLValueSet, EnvValue, GroupArgs, GroupObject, ObjectFile, PipelineObject, SqlAnnotateArgs, StepType } from '../types/model-file';

export interface dataSet {
  name:string;
  type: string;
}

export interface environmentSummary {
  name:string;
  type:string;
  representation:string;
}

@Component({
  selector: 'app-datasets-outline',
  templateUrl: './datasets-outline.component.html',
  styleUrls: ['./datasets-outline.component.scss']
})
export class DatasetsOutlineComponent {
  
  _currentDocument:ObjectFile;
  
  fileInputs: dataSet[];
  fileOutputs: dataSet[];
  fileEnvironments: environmentSummary[];
  filteredInputs: dataSet[];
  filteredOutputs: dataSet[];
  filteredEnvironments: environmentSummary[];

  public filter: string="";

  get currentDocument() {
    return this._currentDocument;
  }
  @Input() set currentDocument(val: ObjectFile) {
    this._currentDocument = val;
    
    this.fileInputs = [];
    this.fileOutputs = [];
    this.fileEnvironments = [];
    this.filteredInputs = [];
    this.filteredOutputs = [];
    this.filteredEnvironments = [];

    if (val) {
      val.pipelines.forEach((p)=>this.parseForDatasets(p));
      this.fileEnvironments = Object.entries(val.environment).map((kv)=>{
        const kValue = kv[1] as EnvValue;
        const kValueSet = kv[1] as EnvSQLValueSet;
        const kList = kv[1] as EnvListValueSet;
        return { 
          name:kv[0],
          type:kv[1].dataType,
          representation:kValue.value || kList.values?.join(', ') || kValueSet.tableName
        };
      });
      this.filterResults();
    }
  }

  public filterResults() {
    this.filteredInputs = this.fileInputs.filter(x=>!this.filter || x.name.indexOf(this.filter) >= 0);
    this.filteredOutputs = this.fileOutputs.filter(x=>!this.filter || x.name.indexOf(this.filter) >= 0);
    this.filteredEnvironments = this.fileEnvironments.filter(x=>!this.filter || x.name.indexOf(this.filter)>= 0 || x.representation.indexOf(this.filter)>=0);
  }

  private parseForDatasets(level: PipelineObject | GroupArgs) {
    level.steps.forEach((s)=>{
      switch (s.stepType) {
        case StepType.Group:
          const groupArgs = s.arguments as GroupArgs;
          this.parseForDatasets(groupArgs);
          break;
        // case StepType.Merge:
        // case StepType.SqlPopulate:
        case StepType.SqlAnnotate:
          const annotateStep = s.arguments as SqlAnnotateArgs;
          if (!this.fileInputs.some(x=>x.name == annotateStep.tableName && x.type == "sql")) {
            this.fileInputs.push({name:annotateStep.tableName, type:"sql"});
          }
          break;
        // case StepType.ConditionAnnotate:
        // case StepType.Filter:
        case StepType.Export:
          let undefArgs = s.arguments as any;
          if (!this.fileOutputs.some(x=>x.name == undefArgs.tableName)) {
            this.fileOutputs.push({name:undefArgs.tableName, type:"sql"});
          }
          break;
      }
    });
  }

}
