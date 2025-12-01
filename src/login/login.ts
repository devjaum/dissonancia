import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './login.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DatabaseService } from '../app/database.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  protected email = ''; 
  protected password = '';
  protected errorMessage = '';

  constructor(
    private authService: AuthService,
    private dbService: DatabaseService,
    private router: Router // Injetar o Router
  ) {}

  ngOnInit(){
    //desautenticar qualquer usuario logado
    this.dbService.logout();
  }

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Preencha todos os campos!';
      return;
    }

    this.authService.login(this.email, this.password)
      .then(response => {
        if(response.user.email === 'admin@rpg.com'){
          //Se for admin, encaminhar para o admin
          this.router.navigate(['/admin']);

          return;
        }
        //Verificar se ja existe um personagem criado
        if(this.dbService.hasCharacter(this.email)){
          this.router.navigate(['/home'])
          return;
        }
        this.router.navigate(['/create']);
      })
      .catch(error => {
        console.error('Login failed:', error);
        this.errorMessage = 'Erro ao entrar: Verifique o email e a senha.';
      });
  }
  goToGuest() {
    this.router.navigate(['/guest']);
  }
}