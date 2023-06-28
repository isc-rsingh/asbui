import { Component, Input } from '@angular/core';
import { OperationObject, SQLField, SqlAnnotateArgs } from 'src/app/types/model-file';

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

  removeSqlField(sqlField:SQLField) {
    const index = this.sqlAnnotateArgs.annotationProperties.indexOf(sqlField);
    this.sqlAnnotateArgs.annotationProperties.splice(index, 1);
  }

  addnew() {
    this.sqlAnnotateArgs.annotationProperties.push({ selectExpression: '' });
  }
}
