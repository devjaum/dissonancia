import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../app/database.service';
import { Router } from "@angular/router";

export interface Poderes {
    name: string;
    description: string;
}

@Component({
    selector: 'app-lore',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './lore.html',
    styleUrls: ['./lore.css']
})
export class Lore implements OnInit {
    private dbService = inject(DatabaseService);
    private docId: string | null = null;

    constructor(private router: Router) {}

    // Controle de visibilidade do prólogo
    showPrologue: boolean = false;

    // Campos do formulário
    name: string = "";
    characterClass: string = "";
    lore: string = "";
    
    uniqueSkills: Poderes[] = [
        { name: "", description: "" }, 
        { name: "", description: "" }
    ];
    
    pressureSign: string = "";

    ngOnInit() {
        this.dbService.getCharacterByEmail().subscribe(character => {
            if (character) {
                this.docId = (character as any).docId;
                const data = character as any;
                
                if (data.name) this.name = data.name;
                if (data.class) this.characterClass = data.class;
                if (data.lore) this.lore = data.lore;
                if (data.pressureSign) this.pressureSign = data.pressureSign;

                if (data.uniqueSkills) {
                    if (Array.isArray(data.uniqueSkills)) {
                        this.uniqueSkills = data.uniqueSkills;
                    } else if (typeof data.uniqueSkills === 'string') {
                        this.uniqueSkills[0].description = data.uniqueSkills;
                        this.uniqueSkills[0].name = "Habilidade Antiga";
                    }
                }
            }
        });
    }

    togglePrologue() {
        this.showPrologue = !this.showPrologue;
    }

    save() {
        if (!this.docId) {
            alert('Erro: Personagem não encontrado. Crie a ficha base na tela anterior primeiro.');
            return;
        }

        const dataToSave = {
            name: this.name,
            class: this.characterClass,
            lore: this.lore,
            uniqueSkills: this.uniqueSkills,
            pressureSign: this.pressureSign
        };

        this.dbService.updateCharacter(this.docId, dataToSave)
            .then(() => {
                alert('História e detalhes salvos com sucesso!');
            })
            .catch(err => {
                console.error('Erro ao salvar história:', err);
                alert('Erro ao salvar. Verifique o console.');
            });
    }
}