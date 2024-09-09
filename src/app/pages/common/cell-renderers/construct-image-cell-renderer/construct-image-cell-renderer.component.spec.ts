import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructImageCellRendererComponent } from './construct-image-cell-renderer.component';

describe('ConstructImageCellRendererComponent', () => {
  let component: ConstructImageCellRendererComponent;
  let fixture: ComponentFixture<ConstructImageCellRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructImageCellRendererComponent],
    });
    fixture = TestBed.createComponent(ConstructImageCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
