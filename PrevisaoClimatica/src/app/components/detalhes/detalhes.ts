import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; 
import { Weather, PrevisaoAtual, PrevisaoDia } from '../../services/Weather/weather';
import { Observable, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-detalhes',
  standalone: true,
  // Adicionar o Pipe 'DecimalPipe' para formatação se necessário
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
  carregando: boolean = true;
  erro: string | null = null;


  ngOnInit(): void {
    // Usa switchMap para se inscrever no parâmetro da rota e, em seguida, fazer as chamadas
    this.route.paramMap.pipe(
        // Extrai o parâmetro cidade
        switchMap(params => {
            const cidadeParam = params.get('cidade');
            this.cidade = cidadeParam || '';
            this.carregando = true;
            this.erro = null;

            if (!cidadeParam) {
                this.erro = 'Cidade não especificada na URL.';
                this.carregando = false;
                return of(null);
            }
            
            // Retorna um array de Observables (para carregar ambas as previsões)
            return [
                this.weatherService.getPrevisaoAtual(cidadeParam).pipe(
                    catchError(err => {
                        this.erro = 'Falha ao carregar previsão atual.';
                        console.error(err);
                        return of(null);
                    })
                ),
                this.weatherService.getPrevisaoDetalhada(cidadeParam).pipe(
                    catchError(err => {
                        this.erro = 'Falha ao carregar previsão de 5 dias.';
                        console.error(err);
                        return of(null);
                    })
                )
            ];
        })
    ).subscribe({
        next: (results) => {
            // Este subscribe será chamado duas vezes (uma para cada Observable retornado)
            // No cenário de forkJoin (opcional), seria chamado uma vez com o array completo.
        },
        complete: () => {
            this.carregando = false;
        }
    });

    // Reestrutura a carga dos observables (simplesmente chamando eles separadamente)
    const cidadeUrl = this.route.snapshot.paramMap.get('cidade') || '';
    if (cidadeUrl) {
        this.previsaoAtual$ = this.weatherService.getPrevisaoAtual(cidadeUrl).pipe(
            tap(() => this.carregando = false),
            catchError(err => { this.erro = 'Falha ao carregar dados.'; return of(null); })
        );
        this.previsao5Dias$ = this.weatherService.getPrevisaoDetalhada(cidadeUrl);
    }
  }
}