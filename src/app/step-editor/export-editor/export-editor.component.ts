import { Component, Input } from '@angular/core';
import { ColumnSpec, ESqlDataType, ExportArgs, OperationObject } from 'src/app/types/model-file';

@Component({
  selector: 'app-export-editor',
  templateUrl: './export-editor.component.html',
  styleUrls: ['./export-editor.component.scss']
})
export class ExportEditorComponent {
  @Input() step:OperationObject;

  get export(): ExportArgs {
    return this.step.arguments as ExportArgs;
  }

  removeSpec(spec:ColumnSpec) {
    const index = this.export.columnSpecs.indexOf(spec);
    if (index >= 0) {
      this.export.columnSpecs.splice(index, 1);
    }
  }

  addSpec() {
    this.export.columnSpecs.push({
      columnName: '',
      pathExpression: '',
      sqlType: ESqlDataType.string,
    });
  }
}
