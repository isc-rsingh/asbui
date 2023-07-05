import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunHistoryItemComponent } from './run-history-item.component';

describe('RunHistoryItemComponent', () => {
  let component: RunHistoryItemComponent;
  let fixture: ComponentFixture<RunHistoryItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RunHistoryItemComponent]
    });
    fixture = TestBed.createComponent(RunHistoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
