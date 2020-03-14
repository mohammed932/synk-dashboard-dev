import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClipServiceComponent } from './add-clipper-service.component';

describe('AddClipperServiceComponent', () => {
  let component: AddClipServiceComponent;
  let fixture: ComponentFixture<AddClipServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClipServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClipServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
