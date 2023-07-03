import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPreviewRowComponent } from './data-preview-row.component';

describe('DataPreviewRowComponent', () => {
  let component: DataPreviewRowComponent;
  let fixture: ComponentFixture<DataPreviewRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataPreviewRowComponent]
    });
    fixture = TestBed.createComponent(DataPreviewRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
