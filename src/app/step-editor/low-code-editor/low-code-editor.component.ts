import { Component, Input } from '@angular/core';
import { OperationObject } from 'src/app/types/model-file';

@Component({
  selector: 'app-low-code-editor',
  templateUrl: './low-code-editor.component.html',
  styleUrls: ['./low-code-editor.component.scss']
})
export class LowCodeEditorComponent {
  
  json:string;
  private _step:OperationObject;
  @Input() set step(step:OperationObject) {
    this._step = step;
    this.json = JSON.stringify(step.arguments, null, 2);
  }
  
  get step():OperationObject {
    return this._step;
  }

  updateFromJson() {
    try {
      const args = JSON.parse(this.json);
      this.step.arguments = args;
    } catch (e) {
      //Swallow bad syntax
    }
  }
}
