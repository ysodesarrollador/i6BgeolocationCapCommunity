import { TestBed } from '@angular/core/testing';

import { BGService } from './bg.service';

describe('BGService', () => {
  let service: BGService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BGService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
