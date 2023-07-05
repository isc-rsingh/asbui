import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockSettingsPaneComponent } from './block-settings-pane.component';

describe('BlockSettingsPaneComponent', () => {
  let component: BlockSettingsPaneComponent;
  let fixture: ComponentFixture<BlockSettingsPaneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockSettingsPaneComponent]
    });
    fixture = TestBed.createComponent(BlockSettingsPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
