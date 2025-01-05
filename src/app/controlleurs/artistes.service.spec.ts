import { TestBed } from '@angular/core/testing';

import { ArtistesService } from './artistes.service';

describe('ArtistesService', () => {
  let service: ArtistesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtistesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
