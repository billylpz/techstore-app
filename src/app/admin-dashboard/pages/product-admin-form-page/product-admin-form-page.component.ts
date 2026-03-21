import { Category } from './../../../categories/interfaces/category.interface';
import { ProductService } from './../../../products/service/product.service';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../categories/service/category.service';
import { BrandService } from '../../../brands/service/brand.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { catchError, delay, map, of, timeout } from 'rxjs';
import { Product } from '../../../products/interfaces/product.interface';
import { FormErrorLabelComponent } from '../../../shared/components/form-error-label/form-error-label.component';
import { FormUtils } from '../../../shared/utils/form-utils';
import Swal from 'sweetalert2'
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Brand } from '../../../brands/interfaces/brand.interface';
import { BaseEntity } from '../../../shared/interfaces/base-entity.interface';
import { ImageUtils } from '../../../shared/utils/image-utils';
import { SavingOverlayComponent } from "../../../shared/components/saving-overlay/saving-overlay.component";
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductImage } from '../../../products/interfaces/product-image.interface';
@Component({
  selector: 'app-product-admin-form-page',
  templateUrl: './product-admin-form-page.component.html',
  styleUrls: ['./product-admin-form-page.component.css'],
  imports: [ReactiveFormsModule, FormErrorLabelComponent, SavingOverlayComponent, RouterLink, FontAwesomeModule]
})
export class ProductAdminFormPageComponent {

  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private brandService = inject(BrandService);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private selectedFiles = signal<File[]>([]);
  imageUtils = ImageUtils;
  isUploadingPhotos = signal<boolean>(false);
  iconoBorrar = faTrashCan;
  productImages=signal<ProductImage[]>([]);

  effects = effect(() => {
    const prod = this.productResource.value();
    if (prod != null) {
      this.myForm.patchValue(prod);
      this.productImages.set(prod.images);
    }

  });

  //param id para formulario y productos nuevos
  private productId = toSignal(this.route.paramMap.pipe(map(param => {
    const idString = param.get('id')
    if (!idString) { return null }

    const idNumeric = Number(idString);
    if (isNaN(idNumeric)) {
      this.router.navigate(['products']);
      return null;
    }
    return idNumeric <= 0 ? null : idNumeric;
  })), { initialValue: null })


  //producto para el formulario
  productResource = rxResource({
    params: () => this.productId(),
    stream: ({ params: id }) => {

      if (id != null && id > 0) {
        return this.productService.findById(id).pipe(
          catchError((error) => {
            this.router.navigate(['products']);
            Swal.fire("Error", `${error.error.error} \n '${error.error.message}'`, 'error')
            return of(null);
          })
        );
      }
      return of(null);
    }
  });

  //marcas desde service
  brandsResource = rxResource({
    params: () => ({}),
    stream: ({ }) => this.brandService.findAll({ page: 0, size: 100 }).pipe(map(response => response.content))
  });

  //categorias desde service
  categoriesResource = rxResource({
    params: () => ({}),
    stream: ({ }) => this.categoryService.findAll({}).pipe(map(response => response.content))
  });


  //formulario producto
  myForm = this.fb.group({
    id: this.fb.control<number | null>(null),
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1), Validators.pattern(FormUtils.pricePattern)]],
    stock: [0, [Validators.required, Validators.min(1), Validators.max(10000), Validators.pattern(FormUtils.numberPattern)]],
    category: this.fb.control<Category | null>(null, Validators.required),
    brand: this.fb.control<Brand | null>(null, Validators.required),
  });

  //evento al enviar el formulario
  onSubmit() {
    this.myForm.markAllAsTouched();

    if (this.myForm.invalid) {
      return;
    }

    const product = this.myForm.value as Product
    const request = (product.id != null && product.id > 0) ?
      this.productService.updateWithImages(product, this.selectedFiles()).pipe(delay(500))
      : this.productService.saveWithImages(product, this.selectedFiles()).pipe(delay(500))

    this.isUploadingPhotos.set(true);
    document.body.classList.add("overflow-hidden")

    request.subscribe({
      next: (response) => {
        Swal.fire({
          title: "Producto guardado!",
          text: `${response.name}`,
          icon: "success"
        });
        document.body.classList.remove("overflow-hidden");
        this.isUploadingPhotos.set(false);
        this.router.navigate(['products']);
      },
      error: (message => {
        Swal.fire("Error", message, "error");
        document.body.classList.remove("overflow-hidden");
        this.isUploadingPhotos.set(false);
      })

    });

  };

  //evento al seleccionar imagenes en el input file
  selectFiles(event: Event) {
    const files = (event.target as HTMLInputElement).files;

    if (files && files.length > 0) {
      this.selectedFiles.set(Array.from(files));

      //verifica en caso se haya ingresado archivos diferentes a formato imagen
      for (const file of this.selectedFiles()) {
        if (!file.type.includes('image')) {
          Swal.fire("Error", "Sólo se permiten archivos con formato imagen!", "error");
          this.selectedFiles.set([]);
          return; // sale del método completo
        }
      }

    }
  };

  //abre la imagen del producto en una pestaña nueva
  openImage(img: HTMLImageElement) {
    const url = img.src;
    window.open(url)
  }

  
  deleteImage(publicId: string) {
    Swal.fire({
      title: "Advertencia",
      text: `Estas seguro de eliminar esta imagen?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Sí`
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProductImage(publicId).subscribe({
          next: () => {
            Swal.fire({ title: "Aviso!",text: `Imagen eliminada!`, icon: "success"});
            this.productImages.update(products=> products.filter(img => img.publicId!=publicId));
          },
          error: (e) => console.log(e.error)
        });
      }
    });

  }




  compararEntities(e1: BaseEntity, e2: BaseEntity) {
    // Si AMBOS son nulos o undefined, son iguales (es la opción "Seleccionar")
    if (e1 === e2) return true;

    // Si uno es nulo y el otro no, no son iguales
    if (!e1 || !e2) return false;

    // Si ambos existen, comparamos por ID
    return e1.id === e2.id;
  }
}
