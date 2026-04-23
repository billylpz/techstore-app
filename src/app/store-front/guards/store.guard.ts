import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TokenService } from '../../auth/jwt/token.service';

export const storeGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isAuthenticated()) {
    if (tokenService.isExpired()) {
      Swal.fire("Alerta", "Tu sesión ha caducado, vuelve a iniciar sesión.", "info")
      tokenService.clean()
      router.navigate(['/auth/login'])
      return false;
    }

    return true;
  } else {
    Swal.fire({
      title: 'Atención',
      text: 'Inicia sesión para continuar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ir al Login',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
    }).then((result) => {
      if (result.isConfirmed) {
        router.navigate(['/auth/login']);
      }
    });

    router.navigate([''])
    return false;
  }
};
