import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTypeDropdownComponent } from './step-type-dropdown.component';

describe('StepTypeDropdownComponent', () => {
  let component: StepTypeDropdownComponent;
  let fixture: ComponentFixture<StepTypeDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepTypeDropdownComponent]
    });
    fixture = TestBed.createComponent(StepTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
