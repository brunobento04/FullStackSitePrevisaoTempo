import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FavoritosService, FavoritoComPrevisao } from '../../services/Favoritos/favoritos'; 

@Component({
  selector: 'app-favoritos',
  standalone: true,
  // CommonModule é necessário para diretivas como ngIf e ngFor
  imports: [CommonModule], 
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css'
})
export class Favoritos implements OnInit {
  
  // Injeção de dependências usando 'inject'
  private favoritosService = inject(FavoritosService);
  private router = inject(Router);
  
  // Observable que armazena a lista de favoritos JÁ com as previsões (dados reais)
  favoritosComPrevisao$: Observable<FavoritoComPrevisao[]> | null = null;
  carregando: boolean = true;
  
  ngOnInit(): void {
    this.carregarFavoritos();
  }

  /**
   * Inicializa o carregamento da lista de favoritos do usuário.
  */
  carregarFavoritos(): void {
    this.carregando = true;
    
    // O service já faz o trabalho de chamar a API, obter os nomes
    // e depois fazer N chamadas ao WeatherService (forkJoin)
    this.favoritosComPrevisao$ = this.favoritosService.getFavoritosComPrevisao().pipe(
      // Usa o 'tap' para controlar o estado de carregamento ao final da operação
      tap(() => this.carregando = false),
      tap(data => {
          if (data.length === 0) {
              console.log('Lista de favoritos vazia ou falha no carregamento. Verifique seu login.');
          }
      }) 
    );
  }

  /**
   * Navega para a tela de detalhes da previsão.
   */
  verDetalhes(cidade: string): void {
    this.router.navigate(['/detalhes', cidade]);
  }

  /**
   * Remove uma cidade dos favoritos via API e atualiza a lista automaticamente.
   */
  removerFavorito(cidade: string): void {
    this.favoritosService.removerFavorito(cidade).subscribe({
        next: () => {
          // O BehaviorSubject no service já faz o trigger para atualizar a lista
          alert(`${cidade} removida com sucesso!`);
        },
        error: (err) => alert(`FALHA ao remover ${cidade}. Verifique a conexão ou tente novamente.`)
    });
  }
}