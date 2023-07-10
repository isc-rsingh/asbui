import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS  } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';

import { AngularSplitModule } from 'angular-split';

import {DragDropModule} from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { CodeNotebookComponent } from './code-notebook/code-notebook.component';
import { DatasetsOutlineComponent } from './datasets-outline/datasets-outline.component';
import { ModelOutlineComponent } from './model-outline/model-outline.component';
import { TemplatesOutlineComponent } from './templates-outline/templates-outline.component';
import { TemplatesInformationComponent } from './templates-information/templates-information.component';
import { ModelEditorComponent } from './model-editor/model-editor.component';
import { StepEditorComponent } from './step-editor/step-editor.component';
import { PipelineDiagramComponent } from './pipeline-diagram/pipeline-diagram.component';
import { GroupEditorComponent } from './step-editor/group-editor/group-editor.component';
import { DataPreviewComponent } from './data-preview/data-preview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { DatasetsOutlineGroupComponent } from './model-outline/model-outline-group/model-outline-group.component';
import { EditorPaneComponent } from './editor-pane/editor-pane.component';
import { BreadcrumbComponent } from './editor-pane/breadcrumb/breadcrumb.component';
import { ConditionAnnotateEditorComponent } from './step-editor/condition-annotate-editor/condition-annotate-editor.component';
import { FilterEditorComponent } from './step-editor/filter-editor/filter-editor.component';
import { SqlAnnotateEditorComponent } from './step-editor/sql-annotate-editor/sql-annotate-editor.component';
import { StepTypeDropdownComponent } from './components/step-type-dropdown/step-type-dropdown.component';
import { StepEnvironmentVariablesComponent } from './step-editor/step-environment-variables/step-environment-variables.component';
import { EnviromentVariableEditorComponent } from './enviroment-variable-editor/enviroment-variable-editor.component';
import { LowCodeEditorComponent } from './step-editor/low-code-editor/low-code-editor.component';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { ExportEditorComponent } from './step-editor/export-editor/export-editor.component';
import { ColumnSpecEditorComponent } from './step-editor/export-editor/column-spec-editor/column-spec-editor.component';
import { SqlPopulateEditorComponent } from './step-editor/sql-populate-editor/sql-populate-editor.component';
import { SqlFieldEditorComponent } from './components/sql-field-editor/sql-field-editor.component';
import { MergeEditorComponent } from './step-editor/merge-editor/merge-editor.component';
import { DataPreviewRowComponent } from './data-preview/data-preview-row/data-preview-row.component';
import { WorkAreaPaneComponent } from './work-area-pane/work-area-pane.component';
import { BlockWorkAreaPaneComponent } from './work-area-pane/block-work-area-pane/block-work-area-pane.component';
import { BlockVariablePaneComponent } from './work-area-pane/block-variable-pane/block-variable-pane.component';
import { BlockSettingsPaneComponent } from './work-area-pane/block-settings-pane/block-settings-pane.component';
import { BlockRunReportPaneComponent } from './work-area-pane/block-run-report-pane/block-run-report-pane.component';
import { RunHistoryItemComponent } from './work-area-pane/block-run-report-pane/run-history-item/run-history-item.component';
import { BlockEditorComponent } from './step-editor/block-editor/block-editor.component';
import { BlockTextComponent } from './step-editor/block-editor/block-text/block-text.component';
import { BlockNumberComponent } from './step-editor/block-editor/block-number/block-number.component';

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline'
};

@NgModule({
  declarations: [
    AppComponent,
    CodeNotebookComponent,
    DatasetsOutlineComponent,
    ModelOutlineComponent,
    TemplatesOutlineComponent,
    TemplatesInformationComponent,
    ModelEditorComponent,
    StepEditorComponent,
    PipelineDiagramComponent,
    GroupEditorComponent,
    DataPreviewComponent,
    DatasetsOutlineGroupComponent,
    EditorPaneComponent,
    BreadcrumbComponent,
    ConditionAnnotateEditorComponent,
    FilterEditorComponent,
    SqlAnnotateEditorComponent,
    StepTypeDropdownComponent,
    StepEnvironmentVariablesComponent,
    EnviromentVariableEditorComponent,
    LowCodeEditorComponent,
    ExportEditorComponent,
    ColumnSpecEditorComponent,
    SqlPopulateEditorComponent,
    SqlFieldEditorComponent,
    MergeEditorComponent,
    DataPreviewRowComponent,
    WorkAreaPaneComponent,
    BlockWorkAreaPaneComponent,
    BlockVariablePaneComponent,
    BlockSettingsPaneComponent,
    BlockRunReportPaneComponent,
    RunHistoryItemComponent,
    BlockEditorComponent,
    BlockTextComponent,
    BlockNumberComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    DragDropModule,
    AngularSplitModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance
    },
    { 
      provide: HTTP_INTERCEPTORS,
       useClass: HttpInterceptorService, 
       multi: true 
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
