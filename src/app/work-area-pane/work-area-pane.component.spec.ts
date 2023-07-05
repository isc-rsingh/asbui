import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAreaPaneComponent } from './work-area-pane.component';

describe('WorkAreaPaneComponent', () => {
  let component: WorkAreaPaneComponent;
  let fixture: ComponentFixture<WorkAreaPaneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkAreaPaneComponent]
    });
    fixture = TestBed.createComponent(WorkAreaPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
