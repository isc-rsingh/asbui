import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockRunReportPaneComponent } from './block-run-report-pane.component';

describe('BlockRunReportPaneComponent', () => {
  let component: BlockRunReportPaneComponent;
  let fixture: ComponentFixture<BlockRunReportPaneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockRunReportPaneComponent]
    });
    fixture = TestBed.createComponent(BlockRunReportPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
