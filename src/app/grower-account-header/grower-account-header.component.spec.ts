import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowerAccountHeaderComponent } from './grower-account-header.component';

describe('GrowerAccountHeaderComponent', () => {
  let component: GrowerAccountHeaderComponent;
  let fixture: ComponentFixture<GrowerAccountHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowerAccountHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowerAccountHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
