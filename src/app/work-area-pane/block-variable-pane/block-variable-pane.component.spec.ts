import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockVariablePaneComponent } from './block-variable-pane.component';

describe('BlockVariablePaneComponent', () => {
  let component: BlockVariablePaneComponent;
  let fixture: ComponentFixture<BlockVariablePaneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockVariablePaneComponent]
    });
    fixture = TestBed.createComponent(BlockVariablePaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
