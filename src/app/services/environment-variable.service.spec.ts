import { TestBed } from '@angular/core/testing';

import { EnvironmentVariableService } from './environment-variable.service';

describe('EnvironmentVariableService', () => {
  let service: EnvironmentVariableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentVariableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
