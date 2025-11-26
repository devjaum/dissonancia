import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './login.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  protected email = ''; 
  protected password = '';
  protected errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router // Injetar o Router
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Preencha todos os campos!';
      return;
    }

    this.authService.login(this.email, this.password)
      .then(response => {
        if(response.user.email === 'admin@rpg.com'){
          this.router.navigate(['/admin']);
          return;
        }
        this.router.navigate(['/create']);
      })
      .catch(error => {
        console.error('Login failed:', error);
        this.errorMessage = 'Erro ao entrar: Verifique o email e a senha.';
      });
  }
}