import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPaneComponent } from './editor-pane.component';

describe('EditorPaneComponent', () => {
  let component: EditorPaneComponent;
  let fixture: ComponentFixture<EditorPaneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorPaneComponent]
    });
    fixture = TestBed.createComponent(EditorPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
