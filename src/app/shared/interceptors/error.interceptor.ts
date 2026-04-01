import { catchError, throwError } from 'rxjs';
import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../../auth/jwt/token.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      let errorMessage = 'Ocurrió un error inesperado!';

      if (error.status === 400) {
        const errorBody = error.error;

        // Caso A: Es el mapa de errores de validación de campos (BindingResult)
        if (typeof errorBody === 'object' && !errorBody.message) {
          errorMessage= Object.entries(errorBody).map(([key,value])=>{
            return `[${key} : ${value}]`
          }).join(',')
        }
        // Caso B: Es tu excepción personalizada (DuplicateEntityException)
        else {
          errorMessage = errorBody?.message || errorMessage;
        }
      }

      else if (error.status == 401 || error.status == 403) {
        errorMessage = 'Acceso denegado: comprueba tus permisos o inicia sesión nuevamente.';
        tokenService.clean();
        router.navigate([''])
      }
      
    
      else {
        errorMessage = error.error.message;
      }

      Swal.fire("Error", String(errorMessage), "error");

      return throwError(() => errorMessage);
    }));
};
