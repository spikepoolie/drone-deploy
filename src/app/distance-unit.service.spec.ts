import { TestBed } from '@angular/core/testing';

import { DistanceUnitService } from './distance-unit.service';

describe('DistanceUnitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DistanceUnitService = TestBed.get(DistanceUnitService);
    expect(service).toBeTruthy();
  });
});
