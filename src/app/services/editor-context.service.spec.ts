import { TestBed } from '@angular/core/testing';

import { EditorContextService } from './editor-context.service';

describe('EditorContextService', () => {
  let service: EditorContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
