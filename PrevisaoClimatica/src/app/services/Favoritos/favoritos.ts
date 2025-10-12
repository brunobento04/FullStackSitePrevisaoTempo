import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap, map, catchError } from 'rxjs/operators';
import { Weather, PrevisaoAtual } from '../Weather/weather'; 
import { Auth } from '../Auth/auth'; // Importa o AuthService para checar o login

// Interfaces DTO (Correspondem aos DTOs do .NET)
interface FavoritoDTO {
    cidadeNome: string;
}

// O tipo de retorno para o Front-end (lista de favoritos com os dados do clima)
export type FavoritoComPrevisao = PrevisaoAtual; 

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private http = inject(HttpClient);
  private weatherService = inject(Weather);
  private authService = inject(Auth); // Injeta o AuthService
  
  // URL base do Back-end .NET (AJUSTE A PORTA SE NECESSÁRIO)
  private readonly BASE_URL = 'http://localhost:5168/api/favoritos'; 
  
  // BehaviorSubject que armazena APENAS os nomes das cidades (strings)
  private favoritosSubject = new BehaviorSubject<string[]>([]);
  favoritos$: Observable<string[]> = this.favoritosSubject.asObservable();

  constructor() {
     // Tenta carregar os favoritos no startup se o usuário parecer logado
     if (this.authService.isLoggedIn()) {
         this.getFavoritos().pipe(catchError(() => of([]))).subscribe();
     }
  }
  
  // Método auxiliar para expor o status de login do AuthService
  isLoggedIn(): boolean {
      return this.authService.isLoggedIn();
  }


  /**
   * 1. Chama a API protegida para LISTAR favoritos do usuário.
   * 2. Atualiza o BehaviorSubject com os nomes das cidades.
   */
  getFavoritos(): Observable<string[]> {
    if (!this.isLoggedIn()) {
        this.favoritosSubject.next([]);
        return of([]);
    }

    // O Interceptor anexa o JWT automaticamente.
    return this.http.get<FavoritoDTO[]>(this.BASE_URL)
      .pipe(
        // Mapeia o array de DTOs para um array de strings (nomes das cidades)
        map(dtos => dtos.map(dto => dto.cidadeNome)), 
        tap(cidades => this.favoritosSubject.next(cidades)), // Atualiza o Subject
        catchError(error => {
            // Se o token for inválido (401 Unauthorized), limpa o estado
            console.warn('Erro ao carregar favoritos (Token inválido/expirado?):', error);
            this.favoritosSubject.next([]);
            return of([]);
        })
      );
  }

  /**
   * Adiciona uma cidade aos favoritos via API (protegida).
   */
  adicionarFavorito(cidade: string): Observable<boolean> {
    if (!this.isLoggedIn()) return of(false);

    const body: FavoritoDTO = { cidadeNome: cidade };
    
    return this.http.post(this.BASE_URL, body)
      .pipe(
        tap(() => this.getFavoritos().subscribe()), // Força a atualização do Subject
        map(() => true),
        catchError(error => {
            console.error('Erro ao adicionar favorito:', error);
            return of(false);
        })
      );
  }

  /**
   * Remove uma cidade dos favoritos via API (protegida).
   */
  removerFavorito(cidade: string): Observable<boolean> {
    if (!this.isLoggedIn()) return of(false);
    
    // Usa o endpoint DELETE /api/favoritos/{cidade}
    return this.http.delete(`${this.BASE_URL}/${cidade}`)
      .pipe(
        tap(() => this.getFavoritos().subscribe()), // Força a atualização do Subject
        map(() => true),
        catchError(error => {
            console.error('Erro ao remover favorito:', error);
            return of(false);
        })
      );
  }

  /**
   * Combina a lista de nomes de favoritos (via Subject) com a previsão atual.
   * Este é o método que o componente Favoritos.ts usa.
   */
  getFavoritosComPrevisao(): Observable<FavoritoComPrevisao[]> {
    // Primeiro, recarrega a lista de nomes da API (protegida) para ter os dados mais recentes
    this.getFavoritos().subscribe(); 

    // Em seguida, usa o BehaviorSubject interno para fazer o mapeamento
    return this.favoritos$ 
      .pipe(
        switchMap(cidades => {
          if (cidades.length === 0) {
            return of([]);
          }
          
          // Cria um array de Observables, um para cada chamada de previsão
          const previsoes$: Observable<PrevisaoAtual>[] = cidades.map(cidade => 
            this.weatherService.getPrevisaoAtual(cidade)
          );
          
          // forkJoin espera que todas as chamadas de previsão retornem
          return forkJoin(previsoes$);
        }),
        // Filtra possíveis erros nas chamadas de previsão (se uma cidade falhar)
        map(previsoes => previsoes.filter((p): p is PrevisaoAtual => p !== null)),
        catchError(error => {
            console.error('Erro ao carregar previsões dos favoritos:', error);
            return of([]);
        })
      );
  }
}