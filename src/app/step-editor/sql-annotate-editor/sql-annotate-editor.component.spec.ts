import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlAnnotateEditorComponent } from './sql-annotate-editor.component';

describe('SqlAnnotateEditorComponent', () => {
  let component: SqlAnnotateEditorComponent;
  let fixture: ComponentFixture<SqlAnnotateEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SqlAnnotateEditorComponent]
    });
    fixture = TestBed.createComponent(SqlAnnotateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
