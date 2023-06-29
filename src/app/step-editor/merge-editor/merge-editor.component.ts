import { Component, Input } from '@angular/core';
import { CurrentStateService } from 'src/app/services/current-state.service';
import { MergeArgs, OperationObject } from 'src/app/types/model-file';

@Component({
  selector: 'app-merge-editor',
  templateUrl: './merge-editor.component.html',
  styleUrls: ['./merge-editor.component.scss']
})
export class MergeEditorComponent {

  constructor(
    private currentStateService:CurrentStateService
  ) { }
  
  private _step:OperationObject;
  @Input() get step():OperationObject {
    return this._step;
  };
  set step(value:OperationObject) {
    this._step = value;
    
    if (!this.mergeArgs) return;

    while (this.currentStateService.currentDocument.pipelines.length > this.mergeArgs.pipelineNames.length) {
      this.mergeArgs.pipelineNames.push('');
    }
  }

  get pipelineNames():string[] {
    return this.currentStateService.currentDocument.pipelines.map(p => p.name);
  }
  
  get mergeArgs():MergeArgs {
    return this.step.arguments as MergeArgs;
  }
}
