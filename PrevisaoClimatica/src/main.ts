import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
// Importe o provideHttpClient e, OBRIGATORIAMENTE, o withInterceptors
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 

import { routes } from './app/app.routes'; 
import { App } from './app/app'; 
import { authInterceptor } from './app/interceptors/auth-interceptor'; // <-- Importe o Interceptor

bootstrapApplication(App, {
  providers: [
    
    // 1. ROTEAMENTO
    provideRouter(routes),
    
    // 2. HTTP CLIENT COM INTERCEPTORS
    // Usa withInterceptors para registrar a função authInterceptor
    provideHttpClient(withInterceptors([
        authInterceptor // <-- Registra o interceptor aqui para injetar o JWT
    ])), 
    
    // O AuthService, WeatherService, e FavoritosService são injetados via providedIn: 'root'
  ]
}).catch(err => console.error(err));