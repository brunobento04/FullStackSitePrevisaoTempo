import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // Para rotas e diretivas
import { CommonModule } from '@angular/common'; 
import { Observable } from 'rxjs';
import { Auth } from './services/Auth/auth';

@Component({          
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'PrevisãoClimatica';
  
  private authService = inject(Auth);
  
  // Variável que armazena o Observable do estado de login
  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;

  // Método de logout para ser chamado pelo HTML
  onLogout() {
    this.authService.logout();
    // Redireciona para o login após o logout
  }
}