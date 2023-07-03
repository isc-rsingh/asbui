import { Component, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CurrentStateService } from 'src/app/services/current-state.service';
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

  constructor(
    private currentStateService:CurrentStateService,
  ) { }

  haveRunResults:boolean = false;
  showData:boolean = false;
  
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.currentStateService.currentRunHistory$.pipe(takeUntil(this.destroy$)).subscribe((runHistory) => {
      this.haveRunResults = !!runHistory?.runs.find(run=>!run.status);
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  toggleData() {
    this.showData = !this.showData;
  }
}
