import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelOutlineComponent } from './model-outline.component';

describe('ModelOutlineComponent', () => {
  let component: ModelOutlineComponent;
  let fixture: ComponentFixture<ModelOutlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModelOutlineComponent]
    });
    fixture = TestBed.createComponent(ModelOutlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
