import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; 
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; 
import { Weather, PrevisaoAtual, PrevisaoDia } from '../../services/Weather/weather';
import { FavoritosService } from '../../services/Favoritos/favoritos'; // <-- Importar Serviço de Favoritos

@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './detalhes.html',
  styleUrl: './detalhes.css'
})
export class Detalhes implements OnInit {
  private route = inject(ActivatedRoute);
  private weatherService = inject(Weather);
  private favoritosService = inject(FavoritosService); // <-- Injeção do Serviço
  
  cidade: string = '';
  previsaoAtual$: Observable<PrevisaoAtual | null> = of(null);
  previsao5Dias$: Observable<PrevisaoDia[] | null> = of(null);
  
  carregando: boolean = true;
  erro: string | null = null;
  
  // A variável reativa isFavorita$ e sua lógica foram removidas para simplificar,
  // pois a Home também não usa essa lógica complexa no botão.

  ngOnInit(): void {
    const cidadeUrl = this.route.snapshot.paramMap.get('cidade') || '';
    this.cidade = cidadeUrl;
    
    if (cidadeUrl) {
      this.carregarPrevisoes(cidadeUrl);
    }
  }

  carregarPrevisoes(cidade: string): void {
    this.previsaoAtual$ = this.weatherService.getPrevisaoAtual(cidade).pipe(
        tap(() => this.carregando = false),
        catchError(err => { this.erro = 'Falha ao carregar previsão atual.'; return of(null); })
    );
    this.previsao5Dias$ = this.weatherService.getPrevisaoDetalhada(cidade);
  }

  /**
   * Adiciona a cidade atual aos favoritos, usando a mesma lógica do Home.
   */
  adicionarAosFavoritos(cidade: string) {
    if (!this.favoritosService.isLoggedIn()) {
        alert("Você precisa fazer login para adicionar favoritos.");
        return;
    }
    
    this.favoritosService.adicionarFavorito(cidade).subscribe(sucesso => {
      if (sucesso) {
        alert(`SUCESSO: Cidade ${cidade} adicionada aos seus favoritos!`);
      } else {
        // Cobre o caso de Conflito (já existe) ou falha de API.
        alert(`FALHA: Não foi possível adicionar ${cidade} aos favoritos. A cidade pode já estar na sua lista.`);
      }
    });
  }
}