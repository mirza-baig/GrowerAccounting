import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowerMasterListComponent } from './grower-master-list.component';

describe('GrowerMasterListComponent', () => {
  let component: GrowerMasterListComponent;
  let fixture: ComponentFixture<GrowerMasterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowerMasterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowerMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
