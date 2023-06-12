import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowCodeEditorComponent } from './low-code-editor.component';

describe('LowCodeEditorComponent', () => {
  let component: LowCodeEditorComponent;
  let fixture: ComponentFixture<LowCodeEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LowCodeEditorComponent]
    });
    fixture = TestBed.createComponent(LowCodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
