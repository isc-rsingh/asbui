import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockEditorComponent } from './block-editor.component';

describe('BlockEditorComponent', () => {
  let component: BlockEditorComponent;
  let fixture: ComponentFixture<BlockEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockEditorComponent]
    });
    fixture = TestBed.createComponent(BlockEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
