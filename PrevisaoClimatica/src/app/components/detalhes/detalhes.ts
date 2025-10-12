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
  previsaoAtual$: Observable<PrevisaoAtual | null> = of(null);
  previsao5Dias$: Observable<PrevisaoDia[] | null> = of(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const cidadeParam = params.get('cidade');
      if (cidadeParam) {
        this.cidade = cidadeParam;
        this.carregarPrevisoes(this.cidade);
      }
    });
  }

  carregarPrevisoes(cidade: string): void {
    this.previsaoAtual$ = this.weatherService.getPrevisaoAtual(cidade);
    this.previsao5Dias$ = this.weatherService.getPrevisaoDetalhada(cidade);
  }
}