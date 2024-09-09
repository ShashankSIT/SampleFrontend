import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultivalueCellRendererComponent } from './multivalue-cell-renderer.component';

describe('MultivalueCellRendererComponent', () => {
  let component: MultivalueCellRendererComponent;
  let fixture: ComponentFixture<MultivalueCellRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultivalueCellRendererComponent],
    });
    fixture = TestBed.createComponent(MultivalueCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
