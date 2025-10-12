import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { Weather, PrevisaoAtual } from '../../services/Weather/weather';
import { FavoritosService } from '../../services/Favoritos/favoritos'; 
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private weatherService = inject(Weather);
  private favoritosService = inject(FavoritosService);
  private router = inject(Router);
  
  cidadePesquisa: string = '';
  previsao: PrevisaoAtual | null = null;
  carregando: boolean = false;
  erro: string | null = null;

  constructor() { }

  pesquisarPrevisao() {
    if (!this.cidadePesquisa.trim()) {
      this.erro = 'Por favor, digite o nome de uma cidade.';
      return;
    }

    this.carregando = true;
    this.erro = null;
    this.previsao = null;
    
    const cidadeFormatada = this.cidadePesquisa.trim();

    // Chamada real ao WeatherService
    this.weatherService.getPrevisaoAtual(cidadeFormatada)
      .pipe(
        catchError(err => {
          // Captura erro 404 (Cidade não encontrada) ou erro de servidor
          this.erro = 'Não foi possível obter a previsão para esta cidade. Verifique o nome.';
          console.error('Erro na API:', err);
          this.carregando = false;
          return of(null); 
        })
      )
      .subscribe(data => {
        if (data) {
          this.previsao = data;
        }
        this.carregando = false;
      });
  }
  
  verDetalhes(cidade: string) {
    this.router.navigate(['/detalhes', cidade]);
  }
  
 adicionarAosFavoritos(cidade: string) {
    this.favoritosService.adicionarFavorito(cidade).subscribe(sucesso => {
      if (sucesso) {
        alert(`SUCESSO: Cidade ${cidade} adicionada aos seus favoritos!`);
      } else {
        // Esta mensagem de erro cobre o erro de conflito (já existe) e outros erros de API/Auth.
        alert(`FALHA: Não foi possível adicionar ${cidade} aos favoritos. Verifique seu login e se a cidade já existe.`);
      }
    });
  }
}