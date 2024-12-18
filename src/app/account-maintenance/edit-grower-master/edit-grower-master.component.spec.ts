import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGrowerMasterComponent } from './edit-grower-master.component';

describe('EditGrowerMasterComponent', () => {
  let component: EditGrowerMasterComponent;
  let fixture: ComponentFixture<EditGrowerMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGrowerMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGrowerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
