import { Component, Input } from '@angular/core';
import { GroupObject, ObjectFile, OperationObject, StepType } from '../types/model-file';

@Component({
  selector: 'app-model-editor',
  templateUrl: './model-editor.component.html',
  styleUrls: ['./model-editor.component.scss']
})
export class ModelEditorComponent {
  _currentDocument:ObjectFile;

  public groups:GroupObject[]=[];
  public lastGroupStepId:number;

  get currentDocument():ObjectFile {
    return this._currentDocument;
  }

  @Input() set currentDocument(val: ObjectFile) {
    this._currentDocument = val;
    this.filterGroupsForContext();
  }

  private filterGroupsForContext() {
    const operationObjects = this._currentDocument.pipelines[0].steps;
    this.groups = operationObjects.filter(x=>x.stepType === StepType.Group).map(x=>x as GroupObject);
    if (this.groups.length) {
      this.lastGroupStepId = this.groups[this.groups.length-1].stepId;
    }
  }
}
