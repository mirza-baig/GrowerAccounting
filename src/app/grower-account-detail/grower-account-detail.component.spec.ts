import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowerAccountDetailComponent } from './grower-account-detail.component';

describe('GrowerAccountDetailComponent', () => {
  let component: GrowerAccountDetailComponent;
  let fixture: ComponentFixture<GrowerAccountDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowerAccountDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowerAccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
