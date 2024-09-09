import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCellRendererComponent } from './status-cell-renderer.component';

describe('StatusCellRendererComponent', () => {
  let component: StatusCellRendererComponent;
  let fixture: ComponentFixture<StatusCellRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusCellRendererComponent],
    });
    fixture = TestBed.createComponent(StatusCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
