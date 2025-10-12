import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'; // <-- Importe BehaviorSubject e Observable

// (Manter a interface Credentials se você usou para corrigir o erro)
interface Credentials {
    [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly USER_KEY = 'isAuthenticated';
  
  private loggedInSubject = new BehaviorSubject<boolean>(
    localStorage.getItem(this.USER_KEY) === 'true'
  ); 
  
  isLoggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  private validCredentials: Credentials = {
      'bruno': '123',
      'joao': '456'
  };

  constructor() {} 

  /**
   * Simula o login.
   */
  login(usuario: string, senha: string): boolean {
    const senhaCorreta = this.validCredentials[usuario];

    if (senhaCorreta && senha === senhaCorreta) {
      this.loggedInSubject.next(true); 
      localStorage.setItem(this.USER_KEY, 'true'); 
      return true;
    }

    this.loggedInSubject.next(false);
    localStorage.setItem(this.USER_KEY, 'false');
    return false;
  }
  
  /**
   * Realiza o logout, limpando o estado e o cache.
   */
  logout(): void {
    // 5. LOGOUT: Emite o novo estado 'false' e remove do cache
    this.loggedInSubject.next(false);
    localStorage.removeItem(this.USER_KEY);
  }
  
  isLoggedIn(): boolean {
      return this.loggedInSubject.value;
  }
  
  // (Manter o método register...)
  register(usuario: string, senha: string): boolean {
      if (this.validCredentials[usuario]) {
          console.log(`Usuário ${usuario} já existe.`);
          return false;
      }
      this.validCredentials[usuario] = senha;
      console.log(`Usuário ${usuario} registrado com sucesso!`);
      return true;
  }
}