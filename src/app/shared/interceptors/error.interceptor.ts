import { catchError, throwError } from 'rxjs';
import { HttpInterceptorFn } from '@angular/common/http';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(
    catchError(error => {
      let errorMessage = 'Ocurrió un error inesperado!';

      if (error.status === 400) {
        const errorBody = error.error;

        // Caso A: Es el mapa de errores de validación de campos (BindingResult)
        if (typeof errorBody === 'object' && !errorBody.message) {
          // Extraemos los valores del objeto y los unimos con saltos de línea
          errorMessage = JSON.stringify(errorBody);
        }
        // Caso B: Es tu excepción personalizada (DuplicateEntityException)
        else {
          errorMessage = errorBody?.message || errorMessage;
        }
      }

      else if (error.status == 403) {
        errorMessage = 'Acceso denegado: comprueba tus permisos o inicia sesión nuevamente.';
      }
      
      else {
        errorMessage = error.error.message;
      }

      return throwError(() => errorMessage);
    }));
};
