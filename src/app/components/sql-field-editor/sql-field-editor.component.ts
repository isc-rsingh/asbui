import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SQLField } from 'src/app/types/model-file';

@Component({
  selector: 'app-sql-field-editor',
  templateUrl: './sql-field-editor.component.html',
  styleUrls: ['./sql-field-editor.component.scss']
})
export class SqlFieldEditorComponent {
  @Input() sqlField:SQLField;
 
  @Output() removeSpec = new EventEmitter<SQLField>();

  remove() {
    this.removeSpec.emit(this.sqlField);
  }
  
}
