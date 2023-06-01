import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionAnnotateEditorComponent } from './condition-annotate-editor.component';

describe('ConditionAnnotateEditorComponent', () => {
  let component: ConditionAnnotateEditorComponent;
  let fixture: ComponentFixture<ConditionAnnotateEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConditionAnnotateEditorComponent]
    });
    fixture = TestBed.createComponent(ConditionAnnotateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
