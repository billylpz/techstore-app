/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CartToastComponent } from './cart-toast.component';

describe('CartToastComponent', () => {
  let component: CartToastComponent;
  let fixture: ComponentFixture<CartToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
