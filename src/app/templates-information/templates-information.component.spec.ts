import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesInformationComponent } from './templates-information.component';

describe('TemplatesInformationComponent', () => {
  let component: TemplatesInformationComponent;
  let fixture: ComponentFixture<TemplatesInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplatesInformationComponent]
    });
    fixture = TestBed.createComponent(TemplatesInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
