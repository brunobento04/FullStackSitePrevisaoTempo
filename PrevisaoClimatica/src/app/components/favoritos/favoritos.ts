import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FavoritosService, FavoritoComPrevisao } from '../../services/Favoritos/favoritos';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css'
})
export class Favoritos implements OnInit {
  private favoritosService = inject(FavoritosService);
  private router = inject(Router);
  
  // Agora este Observable armazena a lista de favoritos COM os dados de previsão
  favoritosComPrevisao$: Observable<FavoritoComPrevisao[]> | null = null;
  carregando: boolean = true;
  
  ngOnInit(): void {
    this.carregarFavoritos();
  }

  carregarFavoritos(): void {
    this.carregando = true;
    
    // Usamos o novo método que combina Favoritos e Previsão
    this.favoritosComPrevisao$ = this.favoritosService.getFavoritosComPrevisao().pipe(
      tap(() => this.carregando = false)
    );
  }

  verDetalhes(cidade: string): void {
    this.router.navigate(['/detalhes', cidade]);
  }

  removerFavorito(cidade: string): void {
    this.favoritosService.removerFavorito(cidade).subscribe({
        next: () => console.log(`${cidade} removida com sucesso!`),
        error: (err) => console.error("Erro ao remover:", err)
    });
  }
}