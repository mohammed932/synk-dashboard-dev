import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClipServiceComponent } from './edit-clipper-service.component';

describe('EditClipperServiceComponent', () => {
  let component: EditClipServiceComponent;
  let fixture: ComponentFixture<EditClipServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClipServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClipServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
