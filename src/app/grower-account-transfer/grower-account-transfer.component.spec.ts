import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowerAccountTransferComponent } from './grower-account-transfer.component';

describe('GrowerAccountTransferComponent', () => {
  let component: GrowerAccountTransferComponent;
  let fixture: ComponentFixture<GrowerAccountTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowerAccountTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowerAccountTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
