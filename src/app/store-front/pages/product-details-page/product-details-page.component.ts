import { Component, DestroyRef, effect, ElementRef, inject, OnInit, signal, viewChild, ViewChild } from '@angular/core';
import { ProductService } from '../../../products/services/product.service';
import { rxResource, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { CartItem, CartService } from '../../../cart/services/cart.service';
import { Product } from '../../../products/interfaces/product.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CartToastComponent } from "../../../cart/components/cart-toast/cart-toast.component";
import { Title } from '@angular/platform-browser';
import { ProductImage } from '../../../products/interfaces/product-image.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-details-page',
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.css'],
  imports: [DecimalPipe, ReactiveFormsModule, CartToastComponent]
})
export class ProductDetailsPageComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private timeoutId: any;
  private destroyRef = inject(DestroyRef);
  quantity = signal(1);
  cartService = inject(CartService);
  quantityInput = new FormControl(1)
  addToCartToast = signal<boolean>(false);
  selectedImage = signal<ProductImage | undefined>(undefined);
  zoomImage = viewChild<ElementRef<HTMLImageElement>>('zoomImage');

  ngOnInit(): void {
    this.quantityInput.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      value = Number(value ?? 1);
      value = (isNaN(value) || value > 50) ? 1 : value;

      this.quantityInput.setValue(value, { emitEvent: false })
      this.quantity.set(value);
    })
  }

  //Setea la imagen principal del producto
  mainProductImageEffect = effect(() => {
    this.selectedImage.set(this.productResource.value()?.images[0])
  });

  //Cambia el título de la pagina por el nombre del producto
  titleEffect = effect(() => {
    if (this.productResource.isLoading()) {
      this.titleService.setTitle(`Cargando producto... | TechStore`)
    } else {
      this.titleService.setTitle(`${this.productResource.value()?.name} | TechStore`)
    }
  });

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
      Swal.fire('Info', 'Ingresa una cantidad válida para continuar.', 'warning');
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

  onSelectImage(image: ProductImage) {
    this.selectedImage.set(image);
  }

  /*## Metodos para el zoom de la foto principal del producto ##*/
  onMouseMove(e: MouseEvent) {
    const container = e.currentTarget as HTMLElement;
    const img = this.zoomImage()!.nativeElement;

    // Obtenemos las dimensiones y posición del contenedor
    const { left, top, width, height } = container.getBoundingClientRect();

    // Calculamos la posición del mouse relativa al contenedor en porcentaje
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    // Aplicamos el origen de la transformación y el escalado
    img.style.transformOrigin = `${x}% ${y}%`;
    img.style.transform = 'scale(2.5)';
  }

  onMouseLeave() {
    const img = this.zoomImage()!.nativeElement;
    img.style.transformOrigin = 'center';
    img.style.transform = 'scale(1)';
  }
  /** #### */

}
