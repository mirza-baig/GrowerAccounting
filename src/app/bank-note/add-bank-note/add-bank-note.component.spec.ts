import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankNoteComponent } from './add-bank-note.component';

describe('AddBankNoteComponent', () => {
  let component: AddBankNoteComponent;
  let fixture: ComponentFixture<AddBankNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBankNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
