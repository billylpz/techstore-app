import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../../products/interfaces/product.interface';
import { TokenService } from '../../auth/jwt/token.service';

export interface CartItem {
  product: Product,
  quantity: number,
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  items = this.cartItems.asReadonly();
  tokenService = inject(TokenService);

  constructor() {
    let shoppingCart = JSON.parse(sessionStorage.getItem("shopping-cart") ?? '[]') as CartItem[];

    if (shoppingCart.length > 0) {
      this.cartItems.update(() => shoppingCart);
    }
  }

  saveCartToSession(items: CartItem[]): void {
    sessionStorage.setItem("shopping-cart", JSON.stringify(items));
  }

  deleteCartSession(): void {
    sessionStorage.removeItem("shopping-cart");
  }

  addItem(item: CartItem): void {

    if (this.tokenService.isAuthenticated() && this.tokenService.isExpired()) {
      this.tokenService.sessionExpiredAlert();
    } else {

      this.cartItems.update(items => {
        const existingItem = items.find(i => i.product.id == item.product.id);

        if (existingItem) {
          return items.map(i => i.product.id == item.product.id ? { ...i, quantity: i.quantity + item.quantity } : i);
        }

        return [...items, item];
      });

      this.saveCartToSession(this.cartItems());
    }

  }


  deleteItem(item: CartItem): void {
    if (this.tokenService.isAuthenticated() && this.tokenService.isExpired()) {
      this.tokenService.sessionExpiredAlert();
    } else {
      this.cartItems.update(items => {
        return items.filter(i => i.product.id != item.product.id);
      });
      this.saveCartToSession(this.cartItems());
    }
  }

  increment(item: CartItem): void {
    if (item.quantity == 50) {
      return;
    }
    item.quantity += 1
    this.saveCartToSession(this.cartItems());
  }

  decrement(item: CartItem): void {
    if (item.quantity == 1) {
      this.deleteItem(item);
      return;
    }
    item.quantity -= 1
    this.saveCartToSession(this.cartItems());
  }


  getTotal(): number {
    return this.cartItems().reduce((acum, i) => acum + (i.product.price * i.quantity), 0)
  }


}
