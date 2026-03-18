import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaserComponent } from './databaser.component';

describe('DatabaserComponent', () => {
  let component: DatabaserComponent;
  let fixture: ComponentFixture<DatabaserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
