import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../products/services/product.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { CartItem, CartService } from '../../../cart/services/cart.service';
import { Product } from '../../../products/interfaces/product.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CartToastComponent } from "../../../cart/components/cart-toast/cart-toast.component";

@Component({
  selector: 'app-product-details-page',
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.css'],
  imports: [DecimalPipe, ReactiveFormsModule, CartToastComponent]
})
export class ProductDetailsPageComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  quantity = signal(1);
  cartService = inject(CartService);
  quantityInput = new FormControl(1)
  addToCartToast = signal<boolean>(false);
  private timeoutId: any;

  ngOnInit(): void {
    this.quantityInput.valueChanges.subscribe(value => {
      value = Number(value ?? 1);
      value = (isNaN(value) || value > 50) ? 1 : value;

      this.quantityInput.setValue(value, { emitEvent: false })
      this.quantity.set(value);
    })
  }

  productId = toSignal(this.route.paramMap.pipe(map(params => {
    let id = params.get('id') ?? '1';
    let numericId = Number.parseInt(id);
    numericId = (isNaN(numericId) || numericId <= 0) ? 1 : numericId;
    return numericId;
  })));

  productResource = rxResource({
    params: () => ({ id: this.productId() }),
    stream: ({ params }) => {
      let id = params.id;
      return this.productService.findById(id ?? 1);
    }
  });

  onAddToCart(product: Product) {
    if (this.quantity() == 0) {
      alert("Ingresa una cantidad")
      return;
    }

    const item = {
      product,
      quantity: this.quantity()
    } as CartItem;

    this.cartService.addItem(item);
    this.quantity.set(1);
    this.quantityInput.setValue(this.quantity(), { emitEvent: false });

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.addToCartToast.set(true);

    this.timeoutId = setTimeout(() => {
      this.addToCartToast.set(false);
    }, 2000);
  }

  onDecrement() {
    this.quantity.update(q => Math.max(1, q - 1));
    this.quantityInput.setValue(this.quantity(), { emitEvent: false })
  }

  onIncrement() {
    this.quantity.update(q => q == 50 ? q : q + 1);
    this.quantityInput.setValue(this.quantity(), { emitEvent: false })
  }

}
