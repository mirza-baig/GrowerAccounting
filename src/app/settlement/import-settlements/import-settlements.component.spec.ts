import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSettlementsComponent } from './import-settlements.component';

describe('ImportSettlementsComponent', () => {
  let component: ImportSettlementsComponent;
  let fixture: ComponentFixture<ImportSettlementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportSettlementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSettlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
