import { DecimalPipe } from '@angular/common';
import { CartItem, CartService } from './../../services/cart.service';
import { Component, computed, effect, inject, input, output } from '@angular/core';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Router, RouterLink } from "@angular/router";
import Swal from 'sweetalert2';
import { TokenService } from '../../../auth/jwt/token.service';

@Component({
  selector: 'cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css'],
  imports: [DecimalPipe, FontAwesomeModule, RouterLink]
})
export class CartModalComponent {
  private router = inject(Router);
  private tokenService = inject(TokenService);
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
    if (!this.tokenService.isAuthenticated()) {
      Swal.fire({
        title: 'Atención',
        text: 'Debes iniciar sesión para procesar tu pedido.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ir al Login',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#2563eb', 
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/auth/login']);
        }
      });
      return;
    }

    let invalid = this.cartItems().find(i => i.quantity == 0);
    if (invalid) {
      Swal.fire('', `El Item ${invalid.product.name} no puede tener una cantidad en 0.`, 'warning');
      return;
    }

    if (this.cartItems().length == 0) {
      Swal.fire('', `El Carrito no puede estar vacío`, 'warning');
      return;
    }

    this.router.navigate(['checkout']);
    this.closeCart();

  }

  closeCart() {
    this.close.emit()
  }
}
