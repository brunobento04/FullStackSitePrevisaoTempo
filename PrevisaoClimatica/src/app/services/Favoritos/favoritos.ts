import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, forkJoin } from 'rxjs'; 
import { delay, switchMap, tap } from 'rxjs/operators';
import { Weather, PrevisaoAtual } from '../Weather/weather'; 

export interface FavoritoComPrevisao extends PrevisaoAtual {
}

export type CidadeFavorita = string;

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private weatherService = inject(Weather);
  
  private mockFavoritos: CidadeFavorita[] = ['Rio de Janeiro', 'São Paulo', 'Londres'];
  private favoritosSubject = new BehaviorSubject<CidadeFavorita[]>(this.mockFavoritos);
  
  favoritos$: Observable<CidadeFavorita[]> = this.favoritosSubject.asObservable();

  getFavoritosComPrevisao(): Observable<FavoritoComPrevisao[]> {
    return this.favoritosSubject.asObservable().pipe(
      switchMap(cidades => {
        if (cidades.length === 0) {
          return of([]); 
        }
        
        const previsoes$: Observable<PrevisaoAtual>[] = cidades.map(cidade => 
          this.weatherService.getPrevisaoAtual(cidade)
        );
        
        return forkJoin(previsoes$);
      }),
      delay(500)
    );
  }

  adicionarFavorito(cidade: CidadeFavorita): Observable<boolean> {
    const cidadeFormatada = cidade.trim();
    const listaAtual = this.favoritosSubject.value;

    if (!listaAtual.includes(cidadeFormatada)) {
      console.log(`MOCK: Inserindo ${cidadeFormatada} no banco de dados SQL...`);
      const novaLista = [...listaAtual, cidadeFormatada];
      this.favoritosSubject.next(novaLista); 
      return of(true).pipe(delay(500)); 
    } else {
      console.log(`${cidadeFormatada} já está nos favoritos.`);
      return of(false).pipe(delay(100)); 
    }
  }

  removerFavorito(cidade: CidadeFavorita): Observable<boolean> {
    const cidadeFormatada = cidade.trim();
    const listaAtual = this.favoritosSubject.value;
    
    console.log(`MOCK: Removendo ${cidadeFormatada} do banco de dados SQL...`);
    
    const novaLista = listaAtual.filter(fav => fav !== cidadeFormatada);
    this.favoritosSubject.next(novaLista);
    
    return of(true).pipe(delay(500)); 
  }
}