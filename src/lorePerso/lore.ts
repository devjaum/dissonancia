import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../app/database.service';
import { Router } from "@angular/router";

// Interface para tipar as habilidades
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

    constructor(
        private router: Router
    ) {}

    // Campos do formulário
    name: string = "";
    characterClass: string = "";
    lore: string = "";
    
    // Inicializa com 2 slots vazios para o usuário preencher
    uniqueSkills: Poderes[] = [
        { name: "", description: "" }, 
        { name: "", description: "" }
    ];
    
    pressureSign: string = "";

    ngOnInit() {
        // Carregar dados do banco ao iniciar
        this.dbService.getCharacterByEmail().subscribe(character => {
            if (character) {
                // Guarda o ID para salvar depois
                this.docId = (character as any).docId;
                
                // Cast para any para acessar propriedades dinâmicas
                const data = character as any;
                
                if (data.name) this.name = data.name;
                if (data.class) this.characterClass = data.class;
                if (data.lore) this.lore = data.lore;
                if (data.pressureSign) this.pressureSign = data.pressureSign;

                // Lógica especial para carregar Skills (trata compatibilidade)
                if (data.uniqueSkills) {
                    if (Array.isArray(data.uniqueSkills)) {
                        // Se já for o novo formato (Array), carrega direto
                        this.uniqueSkills = data.uniqueSkills;
                    } else if (typeof data.uniqueSkills === 'string') {
                        // Se for o formato antigo (String), coloca na descrição da primeira skill
                        this.uniqueSkills[0].description = data.uniqueSkills;
                        this.uniqueSkills[0].name = "Habilidade Antiga";
                    }
                }
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
            class: this.characterClass,
            lore: this.lore,
            uniqueSkills: this.uniqueSkills, // Salva o array de objetos
            pressureSign: this.pressureSign
        };

        this.dbService.updateCharacter(this.docId, dataToSave)
            .then(() => {
                alert('História e detalhes salvos com sucesso!');
                // Opcional: Navegar ou apenas avisar
                this.router.navigate(['/']); 
            })
            .catch(err => {
                console.error('Erro ao salvar história:', err);
                alert('Erro ao salvar. Verifique o console.');
            });
    }
}