import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ObjectFile, StepType } from '../types/model-file';
import { BreadcrumbIconType } from './breadcrumb/breadcrumb.component';
import { EditorContextService, SelectedCodeView } from '../services/editor-context.service';
import { Subject, takeUntil } from 'rxjs';
import { StepService } from '../services/step.service';

export interface BreadcrumbData {
  name:string,
  stepId:number,
  iconType: BreadcrumbIconType,
  isLast:boolean
}

@Component({
  selector: 'app-editor-pane',
  templateUrl: './editor-pane.component.html',
  styleUrls: ['./editor-pane.component.scss']
})
export class EditorPaneComponent implements OnInit, OnDestroy{
  
  currentView:SelectedCodeView = SelectedCodeView.Diagram;
  breadcrumbs:BreadcrumbData[]=[];

  filter:string="";

  _currentDocument:ObjectFile;

  currentStepId:number | null;

  get currentDocument():ObjectFile {
    return this._currentDocument;
  }

  @Input() set currentDocument(val: ObjectFile) {
    this._currentDocument = val;
  }

  constructor(public editorContextService:EditorContextService, private stepService:StepService) {}
  
  private destroy$: Subject<void> = new Subject<void>();
  private breadcrumbPath:number[] | null;
  
  ngOnInit(): void {
    this.editorContextService.currentFocusedStepId$.pipe(takeUntil(this.destroy$)).subscribe((step) => {
      this.currentStepId = step;
      this.breadcrumbPath = this.stepService.GetPathToStepId(this.currentDocument, this.currentStepId ?? 0);

      if (this.breadcrumbPath === null || !this.breadcrumbPath.length) {
        this.breadcrumbPath = [this.currentDocument.pipelines[0].stepId];
      }

      if (this.breadcrumbPath.length) {
        this.breadcrumbs = [];
        this.breadcrumbPath.forEach((stepId)=>{
          const step = this.stepService.GetStep(this.currentDocument, stepId);
          if (step) {
            this.breadcrumbs.push({
              name: step.description || '',
              stepId: step.stepId,
              iconType: step.stepType === StepType.Pipeline ? BreadcrumbIconType.Pipeline : step.stepType === StepType.Group ? BreadcrumbIconType.Group : BreadcrumbIconType.Step,
              isLast:false
            })
          }
        });
        this.breadcrumbs[this.breadcrumbs.length-1].isLast = true;
      }
    });

    this.editorContextService.currentSelectedCodeView$.pipe(takeUntil(this.destroy$)).subscribe((view) => { 
      this.currentView = view;
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  
  public changeView(view:SelectedCodeView) {
    this.editorContextService.setCurrentSelectedCodeView$(view);
  }


  
  get SelectedCodeView() {
    return SelectedCodeView;
  }

  get BreadcrumbIconType() {
    return BreadcrumbIconType;
  }
}
