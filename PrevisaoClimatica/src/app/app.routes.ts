import { Routes } from '@angular/router';

//componentes criados
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Detalhes } from './components/detalhes/detalhes';
import { Favoritos } from './components/favoritos/favoritos';

//array de rotas
export const routes: Routes = [
  // Rota de Login
  { path: 'login', component: Login },

  // Rota Home
  { path: 'home', component: Home },

  // Rota Detalhes (usando parâmetro 'cidade')
  { path: 'detalhes/:cidade', component: Detalhes },

  // Rota Favoritos
  { path: 'favoritos', component: Favoritos },

  // Rota Padrão: Redireciona a URL base ('') para o Login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Redireciona tudo que não for mapeado para a Home
  { path: '**', redirectTo: '/home' } 
];