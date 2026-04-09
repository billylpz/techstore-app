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

  addItem(item: CartItem): void {
    this.cartItems.update(items => {
      const existingItem = items.find(i => i.product.id == item.product.id);

      if (existingItem) {
        return items.map(i => i.product.id == item.product.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }

      return [...items, item];
    });

  }


  deleteItem(item: CartItem): void {
    this.cartItems.update(items => {
      return items.filter(i => i.product.id != item.product.id);
    });
  }

  increment(item: CartItem): void {
    if (item.quantity == 50) {
      return;
    }
    item.quantity += 1
  }

  decrement(item: CartItem): void {
    if (item.quantity == 1) {
      this.cartItems.update(items => {
        return items.filter(i => i.product.id != item.product.id);
      });
      return;
    }
    item.quantity -= 1
  }


  getTotal(): number {
    return this.cartItems().reduce((acum, i) => acum + (i.product.price * i.quantity), 0)
  }


}
