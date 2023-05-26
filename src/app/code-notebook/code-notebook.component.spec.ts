import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeNotebookComponent } from './code-notebook.component';

describe('CodeNotebookComponent', () => {
  let component: CodeNotebookComponent;
  let fixture: ComponentFixture<CodeNotebookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CodeNotebookComponent]
    });
    fixture = TestBed.createComponent(CodeNotebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
