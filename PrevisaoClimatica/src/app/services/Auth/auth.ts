import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators'; // Certifique-se de importar 'map'

// Interfaces simplificadas para DTOs
interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  
  // URL base do seu Backend .NET (AJUSTE A PORTA SE NECESSÁRIO)
  // Certifique-se de que a porta aqui corresponde à porta que o seu Back-end está rodando (ex: 5000 ou 7000)
  private readonly BASE_URL = 'http://localhost:5168/api/Auth'; 
  
  private readonly TOKEN_KEY = 'authToken';

  // Inicializa o estado de login verificando se existe um token no LocalStorage
  private loggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem(this.TOKEN_KEY));
  isLoggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  constructor() {} 

  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.loggedInSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Conecta ao endpoint /api/Auth/login e armazena o JWT.
   * Retorna Observable<boolean> para indicar sucesso ou falha no login.
   */
  login(usuario: string, senha: string): Observable<boolean> {
    const credenciais = { username: usuario, password: senha }; // DTO para o Backend

    return this.http.post<AuthResponse>(`${this.BASE_URL}/login`, credenciais)
      .pipe(
        // Em caso de sucesso HTTP, salva o token e atualiza o estado
        tap(response => {
          this.saveToken(response.token);
        }),
        // Mapeia o resultado de sucesso (AuthResponse) para TRUE
        map(() => true), 
        
        // Captura erros HTTP (ex: 401 Unauthorized, 400 Bad Request)
        catchError(error => {
          console.error('Falha no login:', error);
          this.loggedInSubject.next(false);
          // Retorna um Observable de FALSE em caso de erro
          return of(false); 
        })
      );
  }
  
  /**
   * Conecta ao endpoint /api/Auth/register e armazena o JWT (login automático).
   * Retorna Observable<boolean> para indicar sucesso ou falha.
   */
  register(usuario: string, senha: string): Observable<boolean> {
    const credenciais = { username: usuario, password: senha };

    return this.http.post<AuthResponse>(`${this.BASE_URL}/register`, credenciais)
      .pipe(
        // Em caso de sucesso, o Backend retorna o token para login automático
        tap(response => {
          this.saveToken(response.token);
        }),
        // Mapeia o resultado de sucesso para TRUE
        map(() => true), 
        
        // Captura erros
        catchError(error => {
          console.error('Falha no registro:', error);
          this.loggedInSubject.next(false);
          return of(false); 
        })
      );
  }

  /**
   * Realiza o logout, limpando o token e atualizando o estado.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.loggedInSubject.next(false);
  }

  /**
   * Retorna o estado de login de forma síncrona.
   */
  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }
}