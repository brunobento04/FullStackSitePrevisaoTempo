import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators'; 

// Interfaces para estruturar os dados que o Back-end retorna (correspondentes aos DTOs .NET)
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
  data: string; // Ex: "Seg", "Ter"
  tempMax: number;
  tempMin: number;
  condicao: string;
  icone: string;
}

// Mapeamento de condição climática (OpenWeatherMap) para o ícone do Bootstrap Icons (Front-end)
const ICON_MAP: { [key: string]: string } = {
  // O backend retorna um código de ícone, mas para seguir a lógica do seu Front-end, 
  //  mapear strings comuns que virão do backend. 
  // Se o backend retornar apenas a descrição (ex: "nuvens dispersas"), este mapeamento é útil:
  'céu limpo': 'bi-sun-fill',
  'algumas nuvens': 'bi-cloud-sun-fill',
  'nuvens dispersas': 'bi-cloud-fill',
  'nuvens quebradas': 'bi-cloud-fill',
  'nublado': 'bi-cloud-fill',
  'chuva leve': 'bi-cloud-drizzle-fill',
  'chuva moderada': 'bi-cloud-rain-heavy-fill',
  'chuva forte': 'bi-cloud-rain-heavy-fill',
  'chuva': 'bi-cloud-rain-heavy-fill',
  'trovoada': 'bi-cloud-lightning-rain-fill',
  'neve': 'bi-cloud-snow-fill',
};

@Injectable({
  providedIn: 'root'
})
export class Weather {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:5168/api/previsao'; 

  constructor() { }

  private mapIcon(condicao: string, apiIconCode: string): string {
    // Tenta mapear pela descrição
    let mappedIcon = ICON_MAP[condicao.toLowerCase().trim()];
    
    // Se o mapeamento falhar, usa o código do ícone do OpenWeatherMap 
    if (!mappedIcon) {
        if (apiIconCode.includes('01')) mappedIcon = 'bi-sun-fill';
        else if (apiIconCode.includes('09') || apiIconCode.includes('10')) mappedIcon = 'bi-cloud-rain-heavy-fill';
        else if (apiIconCode.includes('11')) mappedIcon = 'bi-cloud-lightning-rain-fill';
        else mappedIcon = 'bi-cloud-sun-fill';
    }
    return mappedIcon || 'bi-question-circle-fill';
  }

  /**
   * Busca a previsão atual da API .NET.
   */
  getPrevisaoAtual(cidade: string): Observable<PrevisaoAtual> {
    const url = `${this.BASE_URL}/atual?cidade=${cidade}`;
    return this.http.get<PrevisaoAtual>(url).pipe(
      // Mapeia o ícone recebido do backend para a classe CSS do Front-end
      map(data => ({
        ...data,
        // Chama a função de mapeamento de ícones
        icone: this.mapIcon(data.condicao, data.icone) 
      }))
    );
  }

  /**
   * Busca a previsão detalhada de 5 dias da API .NET.
   */
  getPrevisaoDetalhada(cidade: string): Observable<PrevisaoDia[]> {
    const url = `${this.BASE_URL}/5dias?cidade=${cidade}`;
    return this.http.get<PrevisaoDia[]>(url).pipe(
      // Mapeia o ícone para cada item da lista
      map(previsoes => previsoes.map(dia => ({
        ...dia,
        icone: this.mapIcon(dia.condicao, dia.icone)
      })))
    );
  }
}