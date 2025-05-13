import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBodyHeaderComponent } from './chat-body-header.component';

describe('ChatBodyHeaderComponent', () => {
  let component: ChatBodyHeaderComponent;
  let fixture: ComponentFixture<ChatBodyHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBodyHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatBodyHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
