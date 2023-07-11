import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { GroupObject, ObjectFile, OperationObject, PipelineObject, StepType } from '../types/model-file';
import { EditorContextService, SelectedCodeView } from '../services/editor-context.service';
import { Subject, takeUntil } from 'rxjs';
import { StepService } from '../services/step.service';
import { DragHelperService, DragSource } from '../services/drag-helper.service';
import { BlockTemplateService } from '../services/block-template.service';

@Component({
  selector: 'app-model-editor',
  templateUrl: './model-editor.component.html',
  styleUrls: ['./model-editor.component.scss']
})
export class ModelEditorComponent implements OnInit, OnDestroy {
  _currentDocument:ObjectFile;

  public steps:OperationObject[]=[];
  public lastStepId:number;
  public currentStepId: number | null;
  public selectedCodeView:SelectedCodeView = SelectedCodeView.Step;

  get currentDocument():ObjectFile {
    return this._currentDocument;
  }

  @Input() set currentDocument(val: ObjectFile) {
    this._currentDocument = val;
    this.filterGroupsForContext();
  }

  constructor(
    private editorContextService:EditorContextService, 
    private stepService:StepService,
    private dragHelperService: DragHelperService,
    private blockService: BlockTemplateService,
  ) {}

  ngOnInit(): void {
    this.editorContextService.currentFocusedStepId$.pipe(takeUntil(this.destroy$)).subscribe((step) => {
      this.currentStepId = step;
      this.filterGroupsForContext();
    });

    this.editorContextService.currentSelectedCodeView$.pipe(takeUntil(this.destroy$)).subscribe((view) => {
      this.selectedCodeView = view;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private destroy$: Subject<void> = new Subject<void>();

  private filterGroupsForContext() {
    if (!this._currentDocument?.pipelines?.length) {
      return;
    }
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

    this.steps = operationObjects;

    if (this.steps.length) {
      this.lastStepId = this.steps[this.steps.length-1].stepId;
    }
  }

  addNew() {
    
  }

  dragOverArrow(evt:DragEvent, step: OperationObject):boolean | void { 
    if (this.dragHelperService.isBlockTemplate()) {
      const dataTransfer = evt.dataTransfer;
      if (dataTransfer==null) {
        return true;
      }

      evt.preventDefault();
      return false;
    }
  }

  async dropOnArrow(evt:DragEvent, step:OperationObject) {
    const ctx = this.dragHelperService.dragContext;
    if (ctx && this.dragHelperService.isBlockTemplate()) {
      const newStepId = await this.blockService.AddBlockTemplateAfterStep(ctx.id+'', step.stepId);
      if (newStepId) {
        this.editorContextService.setCurrentFocusedBlockId$(newStepId);
      }
    }
  }
  
  
  
  get StepType() {
    return StepType;
  }

  get SelectedCodeView() {
    return SelectedCodeView;
  }
}
