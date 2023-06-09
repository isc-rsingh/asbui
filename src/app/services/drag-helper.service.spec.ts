import { TestBed } from '@angular/core/testing';

import { DragHelperService } from './drag-helper.service';

describe('DragHelperService', () => {
  let service: DragHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DragHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
