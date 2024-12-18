import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternatePayeeListComponent } from './alternate-payee-list.component';

describe('AlternatePayeeListComponent', () => {
  let component: AlternatePayeeListComponent;
  let fixture: ComponentFixture<AlternatePayeeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlternatePayeeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternatePayeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
