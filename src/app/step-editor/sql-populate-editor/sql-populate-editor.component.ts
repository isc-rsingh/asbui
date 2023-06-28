import { Component, Input } from '@angular/core';
import { OperationObject, SQLField, SqlPopulateArgs } from 'src/app/types/model-file';

@Component({
  selector: 'app-sql-populate-editor',
  templateUrl: './sql-populate-editor.component.html',
  styleUrls: ['./sql-populate-editor.component.scss']
})
export class SqlPopulateEditorComponent {
  @Input() step:OperationObject;

  get sqlPopulateArgs():SqlPopulateArgs {
    return this.step.arguments as SqlPopulateArgs;
  }

  get where():string {
    return this.sqlPopulateArgs.where ? this.sqlPopulateArgs.where.clause : '';
  }
  set where(value:string) { 
    this.sqlPopulateArgs.where = { clause: value }; 
  }

  removeSqlField(sqlField:SQLField) {
    const index = this.sqlPopulateArgs.annotationProperties.indexOf(sqlField);
    this.sqlPopulateArgs.annotationProperties.splice(index, 1);
  }

  addnew() {
    this.sqlPopulateArgs.annotationProperties.push({ selectExpression: '' });
  }
}
