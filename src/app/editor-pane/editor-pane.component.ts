import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ObjectFile } from '../types/model-file';
import { BreadcrumbIconType } from './breadcrumb/breadcrumb.component';
import { EditorContextService } from '../services/editor-context.service';
import { Subject, takeUntil } from 'rxjs';

export enum SelectedCodeView {
  LowCode=0,
  Diagram=1,
  Code=2
}

@Component({
  selector: 'app-editor-pane',
  templateUrl: './editor-pane.component.html',
  styleUrls: ['./editor-pane.component.scss']
})
export class EditorPaneComponent implements OnInit, OnDestroy{
  
  currentView:SelectedCodeView = SelectedCodeView.LowCode;

  filter:string="";

  _currentDocument:ObjectFile;

  currentStepId:number | null;

  get currentDocument():ObjectFile {
    return this._currentDocument;
  }

  @Input() set currentDocument(val: ObjectFile) {
    this._currentDocument = val;
  }

  constructor(public editorContextService:EditorContextService) {}
  
  private destroy$: Subject<void> = new Subject<void>();
  
  ngOnInit(): void {
    this.editorContextService.currentFocusedStepId$.pipe(takeUntil(this.destroy$)).subscribe((step) => {
      this.currentStepId = step;
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  
  public changeView(view:SelectedCodeView) {
    this.currentView = view;
  }



  
  get SelectedCodeView() {
    return SelectedCodeView;
  }

  get BreadcrumbIconType() {
    return BreadcrumbIconType;
  }
}
