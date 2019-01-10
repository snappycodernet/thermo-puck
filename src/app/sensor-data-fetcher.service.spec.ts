import { TestBed } from '@angular/core/testing';

import { SensorDataFetcherService } from './sensor-data-fetcher.service';

describe('SensorDataFetcherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SensorDataFetcherService = TestBed.get(SensorDataFetcherService);
    expect(service).toBeTruthy();
  });
});
