import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { storeGuardGuard } from './store.guard';

describe('storeGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => storeGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
