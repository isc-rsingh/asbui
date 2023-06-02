import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { GroupObject, ObjectFile, OperationObject, PipelineObject, StepType } from '../types/model-file';
import { EditorContextService } from '../services/editor-context.service';
import { Subject, takeUntil } from 'rxjs';
import { StepService } from '../services/step.service';

@Component({
  selector: 'app-model-editor',
  templateUrl: './model-editor.component.html',
  styleUrls: ['./model-editor.component.scss']
})
export class ModelEditorComponent implements OnInit, OnDestroy {
  _currentDocument:ObjectFile;

  public groups:GroupObject[]=[];
  public lastGroupStepId:number;
  public currentStepId: number | null;

  get currentDocument():ObjectFile {
    return this._currentDocument;
  }

  @Input() set currentDocument(val: ObjectFile) {
    this._currentDocument = val;
    this.filterGroupsForContext();
  }

  constructor(private editorContextService:EditorContextService, private stepService:StepService) {}

  ngOnInit(): void {
    this.editorContextService.currentFocusedStepId$.pipe(takeUntil(this.destroy$)).subscribe((step) => {
      this.currentStepId = step;
      this.filterGroupsForContext();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private destroy$: Subject<void> = new Subject<void>();

  private filterGroupsForContext() {
    let operationObjects = this._currentDocument.pipelines[0].steps;
    if (this.currentStepId) {
      const step = this.stepService.GetStep(this.currentDocument, this.currentStepId);
      if (step) {
        operationObjects = [step];
      }
      if (step?.stepType === StepType.Pipeline) {
        const pipeline = step as PipelineObject;
        operationObjects = pipeline.steps;
      }
    }

    this.groups = operationObjects.filter(x=>x.stepType === StepType.Group).map(x=>x as GroupObject);

    if (this.groups.length) {
      this.lastGroupStepId = this.groups[this.groups.length-1].stepId;
    }
  }
}
