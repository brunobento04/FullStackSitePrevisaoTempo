import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface PrevisaoAtual {
  cidade: string;
  temperatura: number;
  condicao: string; 
  icone: string; 
  tempMax: number;
  tempMin: number;
  umidade: number;
}

export interface PrevisaoDia {
  data: string;
  tempMax: number;
  tempMin: number;
  condicao: string;
  icone: string;
}

const ICON_MAP: { [key: string]: string } = {
  'ensolarado': 'bi-sun-fill',
  'parcialmente nublado': 'bi-cloud-sun-fill',
  'nublado': 'bi-cloud-fill',
  'chuva leve': 'bi-cloud-drizzle-fill',
  'chuva forte': 'bi-cloud-rain-heavy-fill',
  'tempestade': 'bi-cloud-lightning-rain-fill',
  'neve': 'bi-cloud-snow-fill',
  'ventos fortes': 'bi-wind',
};

@Injectable({
  providedIn: 'root'
})
export class Weather {
  
  constructor() { }
  
  private getIconByCondicao(condicao: string): string {
    const key = condicao.toLowerCase().trim();
    return ICON_MAP[key] || 'bi-question-circle-fill'; 
  }

  getPrevisaoAtual(cidade: string): Observable<PrevisaoAtual> {
    const cidadeFormatada = cidade.toLowerCase().trim();
    let dadosMock: PrevisaoAtual;

    if (cidadeFormatada.includes('são paulo') || cidadeFormatada.includes('sp')) {
      dadosMock = {
        cidade: 'São Paulo',
        temperatura: 22,
        condicao: 'Parcialmente Nublado',
        tempMax: 26,
        tempMin: 18,
        umidade: 75,
        icone: '', // Será preenchido abaixo
      };
    } else if (cidadeFormatada.includes('rio de janeiro') || cidadeFormatada.includes('rj')) {
      dadosMock = {
        cidade: 'Rio de Janeiro',
        temperatura: 30,
        condicao: 'Ensolarado',
        tempMax: 35,
        tempMin: 25,
        umidade: 55,
        icone: '', // Será preenchido abaixo
      };
    } else {
      dadosMock = {
        cidade: cidade,
        temperatura: 15,
        condicao: 'Chuva Leve',
        tempMax: 18,
        tempMin: 10,
        umidade: 90,
        icone: '', // Será preenchido abaixo
      };
    }

    // Aplica o mapeamento de ícones
    dadosMock.icone = this.getIconByCondicao(dadosMock.condicao);

    return of(dadosMock).pipe(delay(1000));
  }

  getPrevisaoDetalhada(cidade: string): Observable<PrevisaoDia[]> {
    const previsaoMock: PrevisaoDia[] = [
      { data: 'Amanhã', tempMax: 27, tempMin: 19, condicao: 'Ensolarado' },
      { data: 'Dom', tempMax: 25, tempMin: 17, condicao: 'Chuva Forte' },
      { data: 'Seg', tempMax: 28, tempMin: 20, condicao: 'Parcialmente Nublado' },
      { data: 'Ter', tempMax: 29, tempMin: 21, condicao: 'Ventos Fortes' },
      { data: 'Qua', tempMax: 24, tempMin: 16, condicao: 'Nublado' },
    ].map(dia => ({
        ...dia,
        // Mapeia o ícone para cada dia
        icone: this.getIconByCondicao(dia.condicao)
    }));
    
    return of(previsaoMock).pipe(delay(1000));
  }
}