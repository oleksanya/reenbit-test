import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesContainerItemComponent } from './messages-container-item.component';

describe('MessagesContainerItemComponent', () => {
  let component: MessagesContainerItemComponent;
  let fixture: ComponentFixture<MessagesContainerItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesContainerItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesContainerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
