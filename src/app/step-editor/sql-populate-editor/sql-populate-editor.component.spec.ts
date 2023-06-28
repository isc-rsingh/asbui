import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlPopulateEditorComponent } from './sql-populate-editor.component';

describe('SqlPopulateEditorComponent', () => {
  let component: SqlPopulateEditorComponent;
  let fixture: ComponentFixture<SqlPopulateEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SqlPopulateEditorComponent]
    });
    fixture = TestBed.createComponent(SqlPopulateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
