import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EditorContextService } from 'src/app/services/editor-context.service';
import { StepService } from 'src/app/services/step.service';
import { OperationObject } from 'src/app/types/model-file';

@Component({
  selector: 'app-block-variable-pane',
  templateUrl: './block-variable-pane.component.html',
  styleUrls: ['./block-variable-pane.component.scss']
})
export class BlockVariablePaneComponent {

  constructor(
    private editorContextService:EditorContextService,
    private stepService:StepService,
  ) { }

  private destroy$: Subject<void> = new Subject<void>();
  currentBlock:OperationObject | null = null;
  
  ngOnInit(): void {
    this.editorContextService.currentFocusedBlockId$.pipe(takeUntil(this.destroy$)).subscribe((blockId) => {
      this.currentBlock = this.stepService.GetStep(null, blockId || 0);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
