import { Component, inject } from '@angular/core'; // 1. Adicione 'inject'
import { CommonModule } from '@angular/common';
import monstroPediaJson from "../../public/monstropedia.json";
import { Router } from '@angular/router';
import { DatabaseService } from '../app/database.service'; // 2. Importe o DatabaseService

@Component({
  selector: 'app-monstropedia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monstropedia.html',
  styleUrl: './monstropedia.css'
})
export class Monstropedia {
    monstroPedia = monstroPediaJson;
    flippedMonsters = new Set<string>();
    
    // 3. Injete o serviço de banco de dados
    private dbService = inject(DatabaseService);

    constructor(
        private router: Router
    ) {}

    isFlipped(name: string): boolean {
        return this.flippedMonsters.has(name);
    }

    toggleFlip(name: string): void {
        if (this.flippedMonsters.has(name)) {
            this.flippedMonsters.delete(name);
        } else {
            this.flippedMonsters.add(name);
        }
    }

    // 4. Atualize a função voltarHome
    voltarHome(){
        // Verifica se o usuário está logado
        this.dbService.isAuthenticated().subscribe(isAuth => {
            if (isAuth) {
                // Se for jogador logado, volta para a Home
                this.router.navigate(['/home']);
            } else {
                // Se não estiver logado (Guest), volta para a tela de convidado
                this.router.navigate(['/guest']);
            }
        });
    }
}