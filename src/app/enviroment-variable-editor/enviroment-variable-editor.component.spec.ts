import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviromentVariableEditorComponent } from './enviroment-variable-editor.component';

describe('EnviromentVariableEditorComponent', () => {
  let component: EnviromentVariableEditorComponent;
  let fixture: ComponentFixture<EnviromentVariableEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnviromentVariableEditorComponent]
    });
    fixture = TestBed.createComponent(EnviromentVariableEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
