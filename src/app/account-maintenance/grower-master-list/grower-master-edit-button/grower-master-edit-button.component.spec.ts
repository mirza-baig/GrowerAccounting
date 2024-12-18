import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowerMasterEditButtonComponent } from './grower-master-edit-button.component';

describe('GrowerMasterEditButtonComponent', () => {
  let component: GrowerMasterEditButtonComponent;
  let fixture: ComponentFixture<GrowerMasterEditButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowerMasterEditButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowerMasterEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
