import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TokenService } from '../../auth/jwt/token.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isAuthenticated() && tokenService.isAdmin()) {
    if (tokenService.isExpired()) {
      Swal.fire("Alerta", "Tu sesión ha caducado, vuelve a iniciar sesión.", "info")
      tokenService.clean()
      router.navigate(['/auth/login'])
      return false;
    }

    return true;
  } else {
    Swal.fire("Alerta", "No tienes permisos para acceder a este recurso!", "warning")
    router.navigate([''])
    return false;
  }
};
