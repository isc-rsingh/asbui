import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockWorkAreaPaneComponent } from './block-work-area-pane.component';

describe('BlockWorkAreaPaneComponent', () => {
  let component: BlockWorkAreaPaneComponent;
  let fixture: ComponentFixture<BlockWorkAreaPaneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockWorkAreaPaneComponent]
    });
    fixture = TestBed.createComponent(BlockWorkAreaPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
