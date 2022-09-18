import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMapitComponent } from './ngx-mapit.component';

describe('NgxMapitComponent', () => {
  let component: NgxMapitComponent;
  let fixture: ComponentFixture<NgxMapitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxMapitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxMapitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
