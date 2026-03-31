import { inject, Injectable } from '@angular/core';
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


  reset(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1 },
      queryParamsHandling: 'merge'
    });
  }
}
