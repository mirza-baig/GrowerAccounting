import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowerBonusUploadComponent } from './grower-bonus-upload.component';

describe('GrowerBonusUploadComponent', () => {
  let component: GrowerBonusUploadComponent;
  let fixture: ComponentFixture<GrowerBonusUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowerBonusUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowerBonusUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
