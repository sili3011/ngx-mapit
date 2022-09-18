import { TestBed } from '@angular/core/testing';

import { NgxMapitService } from './ngx-mapit.service';

describe('NgxMapitService', () => {
  let service: NgxMapitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxMapitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
