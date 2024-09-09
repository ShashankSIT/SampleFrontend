import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListAgComponent } from './user-list-ag.component';

describe('UserListAgComponent', () => {
  let component: UserListAgComponent;
  let fixture: ComponentFixture<UserListAgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListAgComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListAgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
