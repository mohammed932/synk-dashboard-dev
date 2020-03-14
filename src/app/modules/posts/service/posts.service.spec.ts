import { TestBed } from '@angular/core/testing';

import { HttpPostsService } from './posts.service';

describe('HttpPostsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpPostsService = TestBed.get(HttpPostsService);
    expect(service).toBeTruthy();
  });
});
