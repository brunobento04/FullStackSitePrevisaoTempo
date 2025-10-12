import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/Auth/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const token = authService.getToken();
  
  // Lista de rotas que NÃO PRECISAM do token
  const excludedRoutes = ['/api/Auth/login', '/api/Auth/register', '/api/previsao/'];

  // Verifica se a rota atual está na lista de exclusão
  const isExcluded = excludedRoutes.some(route => req.url.includes(route));

  // Apenas anexa o token se ele existir e a rota não for excluída
  if (token && !isExcluded) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }

  // Para requisições de Login, Registro e Previsão (não protegidas), segue sem token
  return next(req);
};