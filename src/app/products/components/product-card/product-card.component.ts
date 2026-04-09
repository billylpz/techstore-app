import { CartItem, CartService } from './../../../cart/services/cart.service';
import { Component, inject, input, signal } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { RouterLink } from "@angular/router";
import { DecimalPipe } from '@angular/common';
import { CartToastComponent } from "../../../cart/components/cart-toast/cart-toast.component";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  imports: [RouterLink, DecimalPipe, CartToastComponent]
})
export class ProductCardComponent {
  product = input<Product>();
  cartService = inject(CartService);
  addToCartToast = signal<boolean>(false);
  private timeoutId: any;

  onAddToCart(product: Product) {
    if(!product) return;

    const item = {
      product,
      quantity: 1
    } as CartItem;
    this.cartService.addItem(item);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.addToCartToast.set(true);

    this.timeoutId = setTimeout(() => {
      this.addToCartToast.set(false);
    }, 2000);
  }

}
