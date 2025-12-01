import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notPlayer.html',
  styleUrls: ['./notPlayer.css', './notPlayer2.css']
})
export class NotPlayer {
  constructor(private router: Router) {}

  isFlipped = false;

  // Dados estáticos para demonstrar a ficha
  dummyPlayer = {
    name: 'Visitante.Exemplo',
    class: 'Recrutador',
    email: 'guest@system.net',
    vida: 100,
    mana: 50,
    shinsu: 75,
    lore: 'Acesso temporário concedido para visualização dos sistemas da Dissonância. Esta ficha é uma simulação estática para fins de demonstração da interface de agentes.',
    status: [3, 4, 2, 5, 1, 0], // FOR, DES, CON, INT, SAB, CAR
    attrBonuses: ['', '+2', '', '+2', '', ''],
    uniqueSkills: [
        { name: 'Olhar do Observador', description: 'Permite analisar a estrutura do sistema sem interferir.' },
        { name: 'Acesso Root Simulado', description: 'Ignora barreiras de autenticação de nível baixo.' }
    ],
    talent: [
      {
        name: 'Mente afiada',
        description: '+2 em testes de Inteligência'
      },
      {
        name: 'Acrobata Nato',
        description: '+2 em testes de Destreza'
      }
    ]
  };

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }

  goToMonstropedia() {
    this.router.navigate(['/monsterpedia']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
  
  // Função auxiliar para tooltips simulados
  talentoDescricao(t: string): string {
      //retornar description do talento
      const talento = this.dummyPlayer.talent.find(tal => tal.name === t);
      return talento ? talento.description : '';
  }
}