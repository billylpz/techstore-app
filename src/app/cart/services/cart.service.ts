import { Injectable, signal } from '@angular/core';
import { Product } from '../../products/interfaces/product.interface';

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

  constructor() {
    let shoppingCart = JSON.parse(sessionStorage.getItem("shopping-cart") ?? '[]') as CartItem[];

    if (shoppingCart.length > 0) {
      this.cartItems.update(() => shoppingCart);
    }
  }

  saveCartToSession(items: CartItem[]) {
    sessionStorage.setItem("shopping-cart", JSON.stringify(items));
  }

  addItem(item: CartItem): void {
    this.cartItems.update(items => {
      const existingItem = items.find(i => i.product.id == item.product.id);

      if (existingItem) {
        return items.map(i => i.product.id == item.product.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }

      return [...items, item];
    });

    this.saveCartToSession(this.cartItems());

  }


  deleteItem(item: CartItem): void {
    this.cartItems.update(items => {
      return items.filter(i => i.product.id != item.product.id);
    });
    this.saveCartToSession(this.cartItems());
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
      this.cartItems.update(items => {
        return items.filter(i => i.product.id != item.product.id);
      });
      this.saveCartToSession(this.cartItems());
      return;
    }
    item.quantity -= 1
    this.saveCartToSession(this.cartItems());
  }


  getTotal(): number {
    return this.cartItems().reduce((acum, i) => acum + (i.product.price * i.quantity), 0)
  }


}
