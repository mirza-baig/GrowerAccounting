import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixSettlementsComponent } from './fix-settlements.component';

describe('FixSettlementsComponent', () => {
  let component: FixSettlementsComponent;
  let fixture: ComponentFixture<FixSettlementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixSettlementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixSettlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
