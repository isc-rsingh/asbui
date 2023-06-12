import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepEnvironmentVariablesComponent } from './step-environment-variables.component';

describe('StepEnvironmentVariablesComponent', () => {
  let component: StepEnvironmentVariablesComponent;
  let fixture: ComponentFixture<StepEnvironmentVariablesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepEnvironmentVariablesComponent]
    });
    fixture = TestBed.createComponent(StepEnvironmentVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
