import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankNoteListComponent } from './bank-note-list.component';

describe('BankNoteListComponent', () => {
  let component: BankNoteListComponent;
  let fixture: ComponentFixture<BankNoteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankNoteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankNoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
