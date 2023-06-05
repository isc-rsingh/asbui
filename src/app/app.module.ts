import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';

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
import { GroupEditorComponent } from './model-editor/group-editor/group-editor.component';
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
    StepTypeDropdownComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    DragDropModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
