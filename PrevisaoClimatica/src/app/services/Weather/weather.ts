import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // <-- Importe o HttpClient
import { Observable } from 'rxjs';

export interface PrevisaoAtual {
  cidade: string;
  temperatura: number;
  condicao: string; // Ex: 'Chuvoso', 'Ensolarado'
  icone: string; // Ex: Código de ícone para OpenWeatherMap ou seu ícone local
  tempMax: number;
  tempMin: number;
  umidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class Weather {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/previsao'; 

  constructor() { }

  getPrevisaoAtual(cidade: string): Observable<PrevisaoAtual> {
    // 1. Em uma aplicação real, a chamada seria para o seu próprio backend:
    // Exemplo: GET http://localhost:3000/api/previsao/atual?cidade=SaoPaulo

    // Se você quisesse chamar o OpenWeatherMap diretamente (não recomendado por segurança/API Key):
    // const API_KEY = 'SUA_CHAVE_AQUI'; 
    // const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${API_KEY}&units=metric&lang=pt_br`;
    
    // 2. Usando o SEU backend (Abordagem correta):
    const url = `${this.apiUrl}/atual?cidade=${cidade}`;

    // Nota: O HttpClient fará a chamada e o Angular/RxJS lidará com o parsing do JSON.
    // O backend deve retornar um objeto que se mapeie para a interface PrevisaoAtual.
    return this.http.get<PrevisaoAtual>(url);
  }
}