import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlFieldEditorComponent } from './sql-field-editor.component';

describe('SqlFieldEditorComponent', () => {
  let component: SqlFieldEditorComponent;
  let fixture: ComponentFixture<SqlFieldEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SqlFieldEditorComponent]
    });
    fixture = TestBed.createComponent(SqlFieldEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
