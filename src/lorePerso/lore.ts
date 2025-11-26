import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../app/database.service';

import { Router } from "@angular/router";

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

    constructor(
        private router: Router
    ){}

    // Campos do formulário
    name: string = "";
    characterClass: string = "";
    lore: string = "";
    uniqueSkills: string = "";
    pressureSign: string = "";

    ngOnInit() {
        // Carregar dados do banco ao iniciar
        this.dbService.getCharacterByEmail().subscribe(character => {
            if (character) {
                // Guarda o ID para salvar depois
                this.docId = (character as any).docId;
                
                // Preenche os campos se existirem no banco
                // Usamos (character as any) para acessar campos novos que talvez não estejam na interface Character ainda
                const data = character as any;
                
                if (data.name) this.name = data.name;
                if (data.class) this.characterClass = data.class; // Mapeia 'class' do banco para 'characterClass'
                if (data.lore) this.lore = data.lore;
                if (data.uniqueSkills) this.uniqueSkills = data.uniqueSkills;
                if (data.pressureSign) this.pressureSign = data.pressureSign;
            }
        });
    }

    save() {
        if (!this.docId) {
            alert('Erro: Personagem não encontrado. Crie a ficha base na tela anterior primeiro.');
            return;
        }

        const dataToSave = {
            name: this.name,
            class: this.characterClass, // Salva como 'class' para manter padrão
            lore: this.lore,
            uniqueSkills: this.uniqueSkills,
            pressureSign: this.pressureSign
        };

        this.dbService.updateCharacter(this.docId, dataToSave)
            .then(() => {
                alert('História e detalhes salvos com sucesso!');
                this.router.navigate(['/lore']);

            })
            .catch(err => {
                console.error('Erro ao salvar história:', err);
                alert('Erro ao salvar. Verifique o console.');
            });
    }
}