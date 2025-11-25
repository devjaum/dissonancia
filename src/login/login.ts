import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <--- OBRIGATÓRIO
import { AuthService } from './login.service';
import { CommonModule } from '@angular/common'; // Bom ter para diretivas básicas


@Component({
  selector: 'app-login',
  standalone: true, // Garanta que isso está aqui ou é o padrão
  imports: [FormsModule, CommonModule,],
  providers: [AuthService],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  // Signals são Writable (escrita), o readonly é só para a variável não ser reatribuída
  protected email = signal(''); 
  protected password = signal('');
  protected isLogin = signal(true);

  constructor(private authService: AuthService) {}

  login() {
    // Para ler o valor do signal, usamos parenteses ()
    const emailVal = this.email();
    const passVal = this.password();

    if (!emailVal || !passVal) {
      console.error('Preencha os campos!');
      return;
    }

    this.authService.login(emailVal, passVal)
      .then(response => {
        console.log('Login successful:', response);
      })
      .catch(error => {
        console.error('Login failed:', error);
      });
  }
}