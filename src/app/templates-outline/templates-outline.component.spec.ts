import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesOutlineComponent } from './templates-outline.component';

describe('TemplatesOutlineComponent', () => {
  let component: TemplatesOutlineComponent;
  let fixture: ComponentFixture<TemplatesOutlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplatesOutlineComponent]
    });
    fixture = TestBed.createComponent(TemplatesOutlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
