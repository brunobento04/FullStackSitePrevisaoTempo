import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { Weather, PrevisaoAtual } from '../../services/Weather/weather';
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

    this.weatherService.getPrevisaoAtual(cidadeFormatada)
      .pipe(
        catchError(err => {
          this.erro = 'Não foi possível obter a previsão para esta cidade. Tente novamente.';
          console.error('Erro no mock/API:', err);
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
    alert(`MOCK: Cidade ${cidade} adicionada aos favoritos!`);
  }
}