import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../jwt/token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  if (tokenService.isAuthenticated() && !tokenService.isExpired()) {
      const newReq = req.clone({ headers: req.headers.append('Authorization', 'Bearer ' + token) })
      return next(newReq);
  } 
  
  return next(req);
};
