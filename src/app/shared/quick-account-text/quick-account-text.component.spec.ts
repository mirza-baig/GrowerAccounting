import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAccountTextComponent } from './quick-account-text.component';

describe('QuickAccountTextComponent', () => {
  let component: QuickAccountTextComponent;
  let fixture: ComponentFixture<QuickAccountTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickAccountTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickAccountTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
