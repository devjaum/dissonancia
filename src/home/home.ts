import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DatabaseService } from "../app/database.service";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import talentData from '../../public/talent.json'
import { Router } from "@angular/router";


@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home.html',
    styleUrls: ['./home.css', './home2.css']
})
export class Home implements OnInit {
    constructor(
        private router: Router
    ){}
    private dbService = inject(DatabaseService);

    talent = talentData;
    // Observable que busca e processa o personagem do usuário logado
    character$: Observable<any> = this.dbService.getCharacterByEmail().pipe(
        map(player => {
            if (!player) return null;

            // --- LÓGICA DE PROCESSAMENTO (Igual ao Admin) ---
            
            const status = (player as any).status || [0, 0, 0, 0, 0, 0];
            const talents = (player as any).talent || [];
            const talentList = Array.isArray(talents) ? talents : [talents];

            // Cálculo dos Bônus (+2)
            let bonusValues = [0, 0, 0, 0, 0, 0]; 
            
            if (talentList.includes("Prodígio")) bonusValues = bonusValues.map(v => v + 1);
            if (talentList.includes("Acrobata Nato")) bonusValues[1] += 2;
            if (talentList.includes("Resistencia a dor")) bonusValues[2] += 2;
            if (talentList.includes("Mente afiada")) bonusValues[3] += 2;
            if (talentList.includes("Conhecimento arcano")) bonusValues[3] += 2;
            if (talentList.includes("Percepção aguçada")) bonusValues[4] += 2;
            if (talentList.includes("Persuasão")) bonusValues[5] += 2;

            const bonusStrings = bonusValues.map(val => val > 0 ? `+${val}` : "");

            // Cálculo da Vida
            const forca = Number(status[0]) || 0;
            const constituicao = Number(status[2]) || 0;
            const inteligencia = Number(status[3]) || 0;
            const sabedoria = Number(status[4]);
            const destreza = Number(status[1]);
            const carisma = Number(status[5]);
            const temVigoroso = talentList.includes("Vigoroso");
            
            // Verifica se tem vida extra salva (caso tenha comprado vigoroso depois)
            const vidaExtra = (player as any).vidaExtra || 0; 
            const vidaCalculada = 5 + (constituicao * 10) + (forca * 5) + (temVigoroso ? 10 : 0) + vidaExtra;
            const shinsu = 4 + inteligencia * 12 + sabedoria * 6;
            const mana = 1 + destreza * 3 + carisma * 2;

            // Tratamento de Skills
            let treatedSkills = (player as any).uniqueSkills;
            if (!Array.isArray(treatedSkills)) {
                treatedSkills = typeof treatedSkills === 'string' 
                    ? [{ name: 'Skill', description: treatedSkills }] 
                    : [];
            }

            return {
                ...player,
                vida: vidaCalculada,
                uniqueSkills: treatedSkills,
                attrBonuses: bonusStrings,
                shinsu: shinsu,
                mana: mana
            };
        })
    );

    // Controle do giro do card
    isFlipped = false;

    ngOnInit() {
        this.dbService.isAuthenticated().subscribe(isAuth => {
            if (!isAuth) {
                this.router.navigate(['/']);
            }
        });
    }

    logout(){
        this.dbService.logout();
        this.router.navigate(['/']);
    }

    toggleFlip() {
        this.isFlipped = !this.isFlipped;
        
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

    monsterPedia(){
        this.router.navigate(['/monsterpedia']);
    }

    editInfo(){
        this.router.navigate(['/create']);
    }

}