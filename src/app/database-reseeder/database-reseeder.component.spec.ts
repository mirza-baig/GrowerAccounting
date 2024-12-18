import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseReseederComponent } from './database-reseeder.component';

describe('DatabaseReseederComponent', () => {
  let component: DatabaseReseederComponent;
  let fixture: ComponentFixture<DatabaseReseederComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseReseederComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseReseederComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
