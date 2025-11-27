import { Component, inject, OnInit } from "@angular/core";
import { DatabaseService } from "../app/database.service";
import { CommonModule } from "@angular/common";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import talentData from '../../public/talent.json'

@Component({
    selector: "app-admin",
    templateUrl: "./admin.html",
    styleUrls: ["./admin.css"],
    standalone: true,
    imports: [CommonModule]
})
export class Admin implements OnInit {
    private dbService = inject(DatabaseService);
    
    players$: Observable<any[]> = this.dbService.adminViewPlayers().pipe(
        map(players => players.map(player => {
            const status = player.status || [0, 0, 0, 0, 0, 0];
            const talents = player.talent || [];
            const talentList = Array.isArray(talents) ? talents : [talents];

            let bonusValues = [0, 0, 0, 0, 0, 0]; 

            if (talentList.includes("Prodígio")) {
                bonusValues = bonusValues.map(v => v + 1);
            }
            
            if (talentList.includes("Acrobata Nato")) bonusValues[1] += 2;
            if (talentList.includes("Resistencia a dor")) bonusValues[2] += 2;
            if (talentList.includes("Mente afiada")) bonusValues[3] += 2;
            if (talentList.includes("Conhecimento arcano")) bonusValues[3] += 2;
            if (talentList.includes("Percepção aguçada")) bonusValues[4] += 2;
            if (talentList.includes("Persuasão")) bonusValues[5] += 2;
            if (talentList.includes("Sentidos aguçados")) bonusValues[5] += 2;
            

            const bonusStrings = bonusValues.map(val => val > 0 ? `+${val}` : "");

            // --- FIM DO CÁLCULO ---

            const forca = Number(status[0]) || 0;
            const constituicao = Number(status[2]) || 0;
            const temVigoroso = talentList.includes("Vigoroso");

            const vidaCalculada = 5 + (constituicao * 10) + (forca * 5) + (temVigoroso ? 10 : 0);
            
            // Tratamento de Skills Únicas para exibição
            let treatedSkills = player.uniqueSkills;
            if (!Array.isArray(treatedSkills)) {
                treatedSkills = typeof treatedSkills === 'string' 
                    ? [{ name: 'Skill', description: treatedSkills }] 
                    : [];
            }

            return {
                ...player,
                vida: vidaCalculada,
                uniqueSkills: treatedSkills,
                attrBonuses: bonusStrings // Array de strings prontos para o HTML
            };
        }))
    );
    talent = talentData;
    flippedCards = new Set<string>();

    ngOnInit(): void {}

    isFlipped(id: string): boolean {
        return this.flippedCards.has(id);
    }

    toggleFlip(id: string): void {
        if (this.flippedCards.has(id)) {
            this.flippedCards.delete(id);
        } else {
            this.flippedCards.add(id);
        }
    }
    talentoDescricao(id: string){

        let aux: string | undefined;
        this.talent.forEach((talento: { name: string; description: string; peso: number; }) => {
            if(talento.name === id){
                aux = talento.description;
            }
        });
        return aux;
    }
}