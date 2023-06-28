import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnSpecEditorComponent } from './column-spec-editor.component';

describe('ColumnSpecEditorComponent', () => {
  let component: ColumnSpecEditorComponent;
  let fixture: ComponentFixture<ColumnSpecEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColumnSpecEditorComponent]
    });
    fixture = TestBed.createComponent(ColumnSpecEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
