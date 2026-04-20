import { Component, DestroyRef, inject } from '@angular/core';
import { CartService } from '../../../cart/services/cart.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderItem } from '../../../orders/interfaces/order-item.interface';
import { Order } from '../../../orders/interfaces/order.interface';
import { TokenService } from '../../../auth/jwt/token.service';
import { FormErrorLabelComponent } from "../../../shared/components/form-error-label/form-error-label.component";
import { OrderService } from '../../../orders/services/order.service';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css'],
  imports: [ReactiveFormsModule, FormErrorLabelComponent, RouterLink, DecimalPipe]
})
export class CheckoutPageComponent {
  private tokenService = inject(TokenService);
  private destroyRef = inject(DestroyRef);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  cartService = inject(CartService);
  acceptTermsControl = new FormControl(false);

  myForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    lastname: ['', [Validators.required, Validators.minLength(2)]],
    document: ['', [Validators.required, Validators.minLength(8)]],
    phoneNumber: ['', [Validators.required, Validators.minLength(9)]],
    email: ['', [Validators.required, Validators.email]],
    shippingAddress: ['', [Validators.required, Validators.minLength(10)]],
    shippingDistrict: ['', [Validators.required]],
    shippingCity: ['', [Validators.required]],
    shippingAditionalInfo: [''],
  });

  onPagar() {
    this.myForm.markAllAsTouched();

    if (this.myForm.invalid || this.acceptTermsControl.value == false) {
      Swal.fire("Alerta", "Por favor completa todos los campos requeridos", "warning");
      return;
    }

  

    const cartItems = this.cartService.items();
    const orderItems: OrderItem[] = cartItems.map(ci => {
      const orderItem = {
        product: ci.product,
        price: ci.product.price,
        quantity: ci.quantity,
        subTotalAmount: ci.product.price * ci.quantity
      } as OrderItem

      return orderItem
    });

    const order: Order = this.myForm.getRawValue()
    order.userId = this.tokenService.getId();
    order.orderItems = orderItems;
    order.totalAmount = orderItems.reduce((acum, i) => acum + i.subTotalAmount, 0);

    this.orderService.save(order).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.cartService.deleteCartSession();
      Swal.fire("Éxito", "Compra realizada correctamente!", "success");
      this.router.navigate(['my-orders'])
    });


  }
}
