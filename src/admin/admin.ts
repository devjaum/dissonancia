import { Component, OnInit, inject } from "@angular/core";
import { DatabaseService } from "../app/database.service";
import { CommonModule } from "@angular/common";
import { Observable, map } from 'rxjs';

@Component({
    selector: "app-admin",
    templateUrl: "./admin.html",
    styleUrls: ["./admin.css"],
    imports: [CommonModule]
})

export class Admin implements OnInit{
    private dbService = inject(DatabaseService);
    players$: Observable<any[]> = this.dbService.adminViewPlayers().pipe(
    map(players => players.map(player => {
        const status = player.status || [0, 0, 0, 0, 0, 0];
        
        const forca = status[0];
        const constituicao = status[2];
        const temVigoroso = player.talent?.includes("Vigoroso");

        const vidaCalculada = 5 + (constituicao * 10) + (forca * 5) + (temVigoroso ? 10 : 0);
        /*uniqueSkills é um objeto ex:
        [
    {
        "description": "Faz o que a habilidade 1",
        "name": "1 habilidade"
    },
    {
        "description": "Faz o que a habilidade 2 deve fazer so que longo Faz o que a habilidade 2 deve fazer so que longo Faz o que a habilidade 2 deve fazer so que longo Faz o que a habilidade 2 deve fazer so que longo Faz o que a habilidade 2 deve fazer so que longo Faz o que a habilidade 2 deve fazer so que longo Faz o que a habilidade 2 deve fazer so que longo Faz o que a habilidade 2 deve fazer so que longo ",
        "name": "2 habilidade"
    }
]
        */
        const uniqueSkills = player.uniqueSkills || [];
        return {
        ...player,
        vida: vidaCalculada,
        firstSkillName: uniqueSkills[0]?.name || null,
        firstSkillDescription: uniqueSkills[0]?.description || null,
        secondSkillName: uniqueSkills[1]?.name || null,
        secondSkillDescription: uniqueSkills[1]?.description || null
        }
      }))
    );

    

    flippedCards = new Set<string>();

    ngOnInit(): void {
    }

    isFlipped(id: string): boolean {
    return this.flippedCards.has(id);
  }

    // Alterna o estado da carta ao clicar
    toggleFlip(id: string): void {
        if (this.flippedCards.has(id)) {
        this.flippedCards.delete(id);
        } else {
        this.flippedCards.add(id);
        }
    }

}