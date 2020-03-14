import { TestBed } from '@angular/core/testing';

import { HttpClipperService } from './clipper.service';

describe('HttpClipperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpClipperService = TestBed.get(HttpClipperService);
    expect(service).toBeTruthy();
  });
});
