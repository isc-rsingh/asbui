import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportEditorComponent } from './export-editor.component';

describe('ExportEditorComponent', () => {
  let component: ExportEditorComponent;
  let fixture: ComponentFixture<ExportEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExportEditorComponent]
    });
    fixture = TestBed.createComponent(ExportEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
