import { DecimalPipe } from '@angular/common';
import { CartItem, CartService } from './../../services/cart.service';
import { Component, computed, effect, inject, input, output } from '@angular/core';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css'],
  imports: [DecimalPipe, FontAwesomeModule, RouterLink]
})
export class CartModalComponent {
  faTrash = faTrashCan;
  cartService = inject(CartService);
  isOpen = input.required<boolean>()
  close = output();

  cartItems = computed(() => {
    return this.cartService.items();
  });

  effects = effect(() => {
    if (this.isOpen()) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }
  });

  updateQuantity(item: CartItem, inputQuantity: HTMLInputElement) {
    let quantity = inputQuantity.value.trim();
    let numQuantity = Number(quantity);
    numQuantity = (isNaN(numQuantity) || numQuantity > 50) ? 1 : numQuantity;

    item.quantity = numQuantity;
    inputQuantity.value = numQuantity.toString();
  }

  onPagar() {
    let invalid = this.cartItems().find(i => i.quantity == 0);
    if (invalid) {
      alert(`El Item ${invalid.product.name} no puede tener una cantidad en 0`);
    }

  }

  closeCart() {
    this.close.emit()
  }
}
