import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankNoteActionButtonsComponent } from './bank-note-action-buttons.component';

describe('BankNoteActionButtonsComponent', () => {
  let component: BankNoteActionButtonsComponent;
  let fixture: ComponentFixture<BankNoteActionButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankNoteActionButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankNoteActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
