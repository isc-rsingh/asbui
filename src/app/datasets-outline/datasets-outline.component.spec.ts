import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetsOutlineComponent } from './datasets-outline.component';

describe('DatasetsOutlineComponent', () => {
  let component: DatasetsOutlineComponent;
  let fixture: ComponentFixture<DatasetsOutlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetsOutlineComponent]
    });
    fixture = TestBed.createComponent(DatasetsOutlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
