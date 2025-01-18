import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageexpenceComponent } from './manageexpence.component';

describe('ManageexpenceComponent', () => {
  let component: ManageexpenceComponent;
  let fixture: ComponentFixture<ManageexpenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageexpenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageexpenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
