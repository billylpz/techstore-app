import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../orders/services/order.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginatorComponent } from "../../../shared/components/paginator/paginator.component";
import { PaginatorService } from '../../../shared/components/paginator/paginator.service';

@Component({
  selector: 'my-orders-page',
  templateUrl: './my-orders-page.component.html',
  styleUrls: ['./my-orders-page.component.css'],
  imports: [DecimalPipe, DatePipe, RouterLink, PaginatorComponent]
})
export class MyOrdersPageComponent {
  private orderService = inject(OrderService);
  private paginatorService = inject(PaginatorService)

  ordersResource = rxResource({
    params: () => ({ page: this.paginatorService.currentPage() - 1 }),
    stream: ({ params }) => {
      let page = params.page
      return this.orderService.findAllMyOrders({page});
    }
  });

  downloadPdf(orderId: number) {
    this.orderService.downloadOrderPdf(orderId).subscribe({
      next: (blob) => {
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      }
    });
  }

}
