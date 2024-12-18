import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountNameCellRendererComponent } from './account-name-cell-renderer.component';

describe('AccountNameCellRendererComponent', () => {
  let component: AccountNameCellRendererComponent;
  let fixture: ComponentFixture<AccountNameCellRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountNameCellRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountNameCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
