import { TestBed } from '@angular/core/testing';

import { BlockTemplateService } from './block-template.service';

describe('BlockTemplateService', () => {
  let service: BlockTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
