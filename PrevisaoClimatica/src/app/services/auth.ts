import { Injectable } from '@angular/core';

// Define um tipo para o objeto que pode ser indexado por strings
interface Credentials {
    [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private loggedIn = false; 
  private readonly USER_KEY = 'isAuthenticated';
  
  // Aplicamos a interface Credentials. O erro tsc(7053) será resolvido.
  private validCredentials: Credentials = {
      'usuario_teste': 'senha123',
      'bruno': 'devangular'
  };

  constructor() {
    this.loggedIn = localStorage.getItem(this.USER_KEY) === 'true';
  }

  /**
   * Simula o login.
   */
  login(usuario: string, senha: string): boolean {
    // Agora o acesso é permitido pelo TypeScript
    const senhaCorreta = this.validCredentials[usuario];

    if (senhaCorreta && senha === senhaCorreta) {
      this.loggedIn = true;
      localStorage.setItem(this.USER_KEY, 'true'); 
      return true;
    }

    this.loggedIn = false;
    localStorage.setItem(this.USER_KEY, 'false');
    return false;
  }
  
  /**
   * Simula a criação de um novo usuário.
   */
  register(usuario: string, senha: string): boolean {
      // Verifica se o usuário já existe
      if (this.validCredentials[usuario]) {
          console.log(`Usuário ${usuario} já existe.`);
          return false;
      }
      
      // Simula o salvamento do novo usuário
      this.validCredentials[usuario] = senha;
      console.log(`Usuário ${usuario} registrado com sucesso!`);
      
      return true;
  }

   // Realiza o logout, limpando o estado e o cache.
  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem(this.USER_KEY);
  }

  
  // Retorna o estado atual de login.
  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}