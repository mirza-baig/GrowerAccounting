import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowerFarmInformationComponent } from './grower-farm-information.component';

describe('GrowerFarmInformationComponent', () => {
  let component: GrowerFarmInformationComponent;
  let fixture: ComponentFixture<GrowerFarmInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowerFarmInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowerFarmInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
