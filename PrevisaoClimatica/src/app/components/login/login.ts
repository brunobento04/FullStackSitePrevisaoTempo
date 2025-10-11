import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';     
import { CommonModule } from '@angular/common';  
import { Auth } from '../../services/auth'; 

// interfaces para os dados do formulário
interface Credenciais {
  usuario: string;
  senha: string;
}

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login { 
  
  // Injeção de dependências
  private authService = inject(Auth);
  private router = inject(Router);

  // Variáveis de estado
  isLoginMode = true;
  credenciais: Credenciais = {
    usuario: '',
    senha: ''
  };

  //mensagens
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;

  constructor() {
    // Redireciona imediatamente se o usuário já estiver logado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  // Alterna o modo de formulário
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.mensagemErro = null;
    this.mensagemSucesso = null;
    this.credenciais = { usuario: '', senha: '' }; // Limpa o formulário
  }

  onSubmit() {
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    if (this.isLoginMode) {
      // Lógica de Login
      const sucesso = this.authService.login(
        this.credenciais.usuario,
        this.credenciais.senha
      );

      if (sucesso) {
        this.router.navigate(['/home']);
      } else {
        this.mensagemErro = 'Usuário ou senha incorretos.';
      }

    } else {
      // Lógica de Cadastro
      const sucesso = this.authService.register(
        this.credenciais.usuario,
        this.credenciais.senha
      );

      if (sucesso) {
        this.mensagemSucesso = 'Cadastro realizado com sucesso! Faça o login.';
        this.isLoginMode = true; // Volta para o modo Login
      } else {
        this.mensagemErro = 'Falha no cadastro. O usuário pode já existir.';
      }
    }
  }
}