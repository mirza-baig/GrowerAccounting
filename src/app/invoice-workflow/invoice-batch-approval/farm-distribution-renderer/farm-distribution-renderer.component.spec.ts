import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmDistributionRendererComponent } from './farm-distribution-renderer.component';

describe('FarmDistributionRendererComponent', () => {
  let component: FarmDistributionRendererComponent;
  let fixture: ComponentFixture<FarmDistributionRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmDistributionRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmDistributionRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
