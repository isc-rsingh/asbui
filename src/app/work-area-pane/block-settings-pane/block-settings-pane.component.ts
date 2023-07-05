import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EditorContextService } from 'src/app/services/editor-context.service';
import { StepService } from 'src/app/services/step.service';
import { GroupObject, OperationObject, StepType } from 'src/app/types/model-file';

@Component({
  selector: 'app-block-settings-pane',
  templateUrl: './block-settings-pane.component.html',
  styleUrls: ['./block-settings-pane.component.scss']
})
export class BlockSettingsPaneComponent {
  constructor(
    private editorContextService:EditorContextService,
    private stepService:StepService,
  ) { }

  private destroy$: Subject<void> = new Subject<void>();
  currentBlock:GroupObject | null = null;
  public steps:OperationObject[]=[];
  
  ngOnInit(): void {
    this.editorContextService.currentFocusedBlockId$.pipe(takeUntil(this.destroy$)).subscribe((blockId) => {
      if (blockId){
        this.currentBlock = this.stepService.GetStep(null, blockId || 0) as GroupObject;
        this.steps = this.currentBlock?.arguments?.steps || [];
      } else {
        this.currentBlock = null;
        this.steps=[];
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  get StepType() {
    return StepType;
  }

}
