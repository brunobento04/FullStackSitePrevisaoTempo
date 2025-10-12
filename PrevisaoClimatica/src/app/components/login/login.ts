import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'; // Necessário para tipagem
import { Auth } from '../../services/Auth/auth'; 

// Defina as interfaces para os dados do formulário
interface Credenciais {
  usuario: string;
  senha: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true, 
  imports: [CommonModule, FormsModule] 
})
export class Login {
  
  private authService = inject(Auth);
  private router = inject(Router);

  // Variável para alternar entre as abas Login e Cadastro (true = Login, false = Cadastro)
  isLoginMode = true;

  // Objeto para armazenar os dados do formulário
  credenciais: Credenciais = {
    usuario: '',
    senha: ''
  };

  // Mensagem de estado
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;

  constructor() {
    // Redireciona imediatamente se o usuário já estiver logado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  // Alterna o modo de formulário e previne o comportamento padrão do link
  toggleMode(event: Event) {
    event.preventDefault(); // <-- CORREÇÃO: Impede que o link vá para o topo da página
    
    this.isLoginMode = !this.isLoginMode;
    this.mensagemErro = null;
    this.mensagemSucesso = null;
    this.credenciais = { usuario: '', senha: '' }; // Limpa o formulário
  }

  onSubmit() {
    this.mensagemErro = null;
    this.mensagemSucesso = null;
    
    if (!this.credenciais.usuario || !this.credenciais.senha) {
        this.mensagemErro = "Por favor, preencha todos os campos.";
        return;
    }

    let authObservable: Observable<boolean>;

    if (this.isLoginMode) {
      // 1. TENTA FAZER LOGIN
      authObservable = this.authService.login(this.credenciais.usuario, this.credenciais.senha);
    } else {
      // 2. TENTA FAZER CADASTRO
      authObservable = this.authService.register(this.credenciais.usuario, this.credenciais.senha);
    }

    // Subscreve ao Observable
    authObservable.subscribe(sucesso => {
      if (sucesso) {
        // Se sucesso (login ou registro com login automático), navega para a Home
        this.router.navigate(['/home']);
      } else {
        // Exibe erro específico
        if (this.isLoginMode) {
            this.mensagemErro = 'Falha no Login: Usuário ou senha incorretos.';
        } else {
            this.mensagemErro = 'Falha no Cadastro. O usuário pode já existir ou a senha é inválida.';
        }
      }
    });
  }
}