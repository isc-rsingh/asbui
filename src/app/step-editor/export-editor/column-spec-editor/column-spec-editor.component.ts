import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnSpec, ESqlDataType } from 'src/app/types/model-file';

@Component({
  selector: 'app-column-spec-editor',
  templateUrl: './column-spec-editor.component.html',
  styleUrls: ['./column-spec-editor.component.scss']
})
export class ColumnSpecEditorComponent {
  @Input() columnSpec: ColumnSpec;
  @Output() removeSpec = new EventEmitter<ColumnSpec>();

  remove() {
    this.removeSpec.emit(this.columnSpec);
  }


  get ESqlDataType() {
    return ESqlDataType;
  }
}
