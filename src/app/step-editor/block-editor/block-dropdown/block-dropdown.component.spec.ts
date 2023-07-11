import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockDropdownComponent } from './block-dropdown.component';

describe('BlockDropdownComponent', () => {
  let component: BlockDropdownComponent;
  let fixture: ComponentFixture<BlockDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockDropdownComponent]
    });
    fixture = TestBed.createComponent(BlockDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
