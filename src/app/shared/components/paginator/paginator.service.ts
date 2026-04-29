import { PageResponse } from './../../interfaces/page-response.interface';
import { inject, Injectable, WritableResource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  route = inject(ActivatedRoute);
  router = inject(Router);

  currentPage = toSignal(this.route.queryParamMap.pipe(
    map(params => {
      const pageParam = params.get('page');
      const pageNumber = Number(pageParam);

      return (isNaN(pageNumber) || pageNumber <= 0) ? 1 : pageNumber;
    })
  ), { initialValue: 1 });


  resetCurrentPageIfGreaterThanResourcePages(resourcePages:number) {
    //si el param page es mayor a las paginas del recurso, se reincia el param page a '1'
    if (resourcePages && resourcePages < this.currentPage()) {
      this.reset()
    }
  }


  reset(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1 },
      queryParamsHandling: 'merge'
    });
  }
}
