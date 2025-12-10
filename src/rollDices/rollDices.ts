import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import rollDicesData from '../../public/rollDices.json'; //
import { DatabaseService } from '../app/database.service';
@Component({
  selector: 'app-roll-dices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rollDices.html',
  styleUrls: ['./rollDices.css']
})
export class RollDices {
  data = rollDicesData;

  private dbService = inject(DatabaseService);


  constructor(private router: Router) {}

  goBack() {
    this.dbService.isAuthenticated().subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate(['/home']);
      }else{
        this.router.navigate(['/guest']);
      }
  });
  }
}