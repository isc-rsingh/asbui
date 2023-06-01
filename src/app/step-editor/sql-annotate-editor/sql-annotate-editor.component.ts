import { Component, Input } from '@angular/core';
import { OperationObject, SqlAnnotateArgs } from 'src/app/types/model-file';

@Component({
  selector: 'app-sql-annotate-editor',
  templateUrl: './sql-annotate-editor.component.html',
  styleUrls: ['./sql-annotate-editor.component.scss']
})
export class SqlAnnotateEditorComponent {
  @Input() step:OperationObject;
  get sqlAnnotateArgs():SqlAnnotateArgs {
    return this.step.arguments as SqlAnnotateArgs;
  }
}
