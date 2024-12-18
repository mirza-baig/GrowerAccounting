import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Grower1099ManagementComponent } from './grower1099-management.component';

describe('Grower1099ManagementComponent', () => {
  let component: Grower1099ManagementComponent;
  let fixture: ComponentFixture<Grower1099ManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Grower1099ManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Grower1099ManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
