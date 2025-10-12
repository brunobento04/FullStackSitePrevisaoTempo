import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; 
import { Weather, PrevisaoAtual, PrevisaoDia } from '../../services/Weather/weather';
import { Observable, of } from 'rxjs';

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
  
  cidade: string = '';
  // Observables para carregar os dados no template com o pipe 'async'
  previsaoAtual$: Observable<PrevisaoAtual | null> = of(null);
  previsao5Dias$: Observable<PrevisaoDia[] | null> = of(null);

  ngOnInit(): void {
    // Obtém o parâmetro 'cidade' da rota
    this.route.paramMap.subscribe(params => {
      const cidadeParam = params.get('cidade');
      if (cidadeParam) {
        this.cidade = cidadeParam;
        this.carregarPrevisoes(this.cidade);
      }
    });
  }

  carregarPrevisoes(cidade: string): void {
    // Busca a previsão atual e detalhada usando os mocks
    this.previsaoAtual$ = this.weatherService.getPrevisaoAtual(cidade);
    this.previsao5Dias$ = this.weatherService.getPrevisaoDetalhada(cidade);
  }
}