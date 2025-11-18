import { CommonModule } from '@angular/common';
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-create',
  imports: [CommonModule],
  templateUrl: './create.html',
  styleUrl: './create.css',
  standalone: true
})

export class CreatePerso {
  //Iniciar os atributos em 2
    talent = [
      {name: "Vontade de Ferro", description: "+2 em testes de resistência contra efeitos mentais(medo, charme, ilusão...)", peso: 2},
      {name: "Ataque focado", description: "Gasta 1 PE para receber +2 no acerto do próximo ataque", peso: 1},
      {name: "Acrobata Nato", description: "+2 em testes de Destreza", peso: 2},
      {name: "Mente afiada", description: "+2 em testes de Inteligência", peso: 2},
      {name: "Percepção aguçada", description: "+2 em testes de Sabedoria", peso: 2},
      {name: "Persuasão", description: "+2 em testes de Carisma", peso: 2},
      {name: "Resistencia a dor", description: "+2 em testes de Constituição", peso: 2},
      {name: "Ataque Poderoso", description: "Gasta 1 PE para receber +2 de dano no próximo ataque", peso: 1},
      {name: "Tolerancia a dor", description: "Recebe 2 de dano a menos de ataques físicos", peso: 3},
      {name: "Mente blindada", description: "Recebe 2 de dano a menos de ataques mentais", peso: 3},
      {name: "Corpo blindado", description: "Recebe 2 de dano a menos de ataques de shinsu", peso: 3},
      {name: "Sorte", description: "Uma vez por combate, pode rolar novamente um teste de atributo ou ataque", peso: 2},
      {name: "Ambidestria", description: "Pode usar duas armas leves ao mesmo tempo sem penalidade", peso: 2},
      {name: "Especialista em armas", description: "Escolha um tipo de arma. Você recebe +1 em ataques com esse tipo de arma", peso: 2},
      {name: "Especialista em combate desarmado", description: "Seus ataques desarmados causam 1d4 de dano e você recebe +1 para acertar ataques desarmados", peso: 2},
      {name: "Lider nato", description: "Você e seus aliados em alcance curto recebem +1 em testes de resistência contra medo", peso: 2},
      {name: "Pele de pedra", description: "Sua pele é mais resistente, você recebe +1 de defesa", peso: 3},
      {name: "Reflexos apurados", description: "Você recebe +1 de iniciativa", peso: 2},
      {name: "Sentidos aguçados", description: "Você recebe +2 em testes de Percepção", peso: 2},
      {name: "Treinamento em combate", description: "Você recebe +1 em testes de ataque", peso: 2},
      {name: "Vigoroso", description: "Você recebe +10 pontos de vida", peso: 2},
      {name: "Conhecimento de Batalha", description: "Uma vez por combate, você pode gastar 1 PE para identificar as resistências e vulnerabilidades de um inimigo", peso: 2},
      
    ]
    listaTalent = signal([""]);
    forca = signal(2);
    destreza = signal(2);
    constituicao = signal(2);
    inteligencia = signal(2);
    sabedoria = signal(2);
    carisma = signal(2);
    pointsAtt = signal(10);
    pointsT = signal(10);
    vida = computed(() => 5 + this.constituicao() * 10 + this.forca() * 5);
    shinsu = computed(() => 4 + this.inteligencia() * 12 + this.sabedoria() * 6);
    energia = computed(() => 1 + this.destreza() * 3 + this.carisma() * 2);

    showDescription(talent: any) {
      let description = document.getElementById(talent.name+talent.peso);
      if(description){
        description.innerText = talent.description;
        description.classList.add("showDescription");
      }
      
    }

    hideDescription(talent: any) {
      if(!document.getElementById(talent.name+talent.peso)) return;
      let doc = document.getElementById(talent.name+talent.peso);
      if(doc){
        doc.innerText = "";
        doc.classList.remove("showDescription");
      }
      
    }

    addTalent(talent: any){
      if(this.pointsT() < talent.peso){
        if(this.listaTalent().includes(talent.name)){
          this.removePointTalent(talent);
          return;
        }
      }
      if(this.pointsT() < 1 || talent.peso > this.pointsT()) return;
      if(this.listaTalent().includes(talent.name)){
        this.removePointTalent(talent);
        return;
      }
      
      this.pointsT.set( this.pointsT() - talent.peso);
      this.listaTalent.set([...this.listaTalent(), talent.name]);
      //Mudar a cor do talento selecionado
      this.mudarCorTalent(talent);
      
      return;

    }

    removePointTalent(talent: any){
      this.pointsT.set( this.pointsT() + talent.peso);
      this.listaTalent.set(this.listaTalent().filter(t => t !== talent.name));
      
      //Remover a cor do talento
      this.removerCorTalent(talent);
      return;
    }

    mudarCorTalent(talent: any){
      let docTalent = document.getElementById(talent.name);
      let docPeso = document.getElementById("cost-"+talent.name);

      if (!docPeso) return;
      if(!docTalent) return;

      docTalent.style.backgroundColor = "#2e352cff";
      docTalent.style.color = "#FFF";
      docPeso.style.color = "#53eed4ff";
 
      return;
    }

    removerCorTalent(talent: any){
      let docTalent = document.getElementById(talent.name);
      let docPeso = document.getElementById("cost-"+talent.name);
      
      if(!docPeso) return;
      if(!docTalent) return;
      
      docTalent.style.backgroundColor = "#2c2c35";
      docTalent.style.color = "#FFF";
      docPeso.style.color = "#80cbc4";
      
      return;
    }

    addPoint(attribute: string) {
      if (this.pointsAtt() > 0) {
        switch (attribute) {
          case 'forca':
            if(this.forca() < 5){
                this.forca.set(this.forca() + 1);
                this.pointsAtt.set(this.pointsAtt() - 1);
            }
            break;
          case 'destreza':
            if(this.destreza() < 5){
                this.destreza.set(this.destreza() + 1);
                this.pointsAtt.set(this.pointsAtt() - 1);
            }
            break;
          case 'constituicao':
            if(this.constituicao() < 5){
                this.constituicao.set(this.constituicao() + 1);
                this.pointsAtt.set(this.pointsAtt() - 1);
            }
            break
          case 'inteligencia':
            if(this.inteligencia() < 5){
                this.inteligencia.set(this.inteligencia() + 1);
                this.pointsAtt.set(this.pointsAtt() - 1);
            }
            break;
          case 'sabedoria':
            if(this.sabedoria() < 5) {
                this.sabedoria.set(this.sabedoria() + 1);
                this.pointsAtt.set(this.pointsAtt() - 1);
            }
            break;
          case 'carisma':
            if(this.carisma() < 5) {
                this.carisma.set(this.carisma() + 1);
                this.pointsAtt.set(this.pointsAtt() - 1);
            }
            break;
        }
      }
    }

    removePoint(attribute: string) {
      switch (attribute) {
        case 'forca':
          if (this.forca() > 2) {
            this.forca.set(this.forca() - 1);
            this.pointsAtt.set(this.pointsAtt() + 1);
          }
          break;
        case 'destreza':
          if (this.destreza() > 2) {
            this.destreza.set(this.destreza() - 1);
            this.pointsAtt.set(this.pointsAtt() + 1);
          }
          break;
        case 'constituicao':
          if (this.constituicao() > 2) {
            this.constituicao.set(this.constituicao() - 1);
            this.pointsAtt.set(this.pointsAtt() + 1);
          }
          break;
        case 'inteligencia':
          if (this.inteligencia() > 2) {
            this.inteligencia.set(this.inteligencia() - 1);
            this.pointsAtt.set(this.pointsAtt() + 1);
          }
          break;
        case 'sabedoria':
          if (this.sabedoria() > 2) {
            this.sabedoria.set(this.sabedoria() - 1);
            this.pointsAtt.set(this.pointsAtt() + 1);
          }
          break;
        case 'carisma':
          if (this.carisma() > 2) {
            this.carisma.set(this.carisma() - 1);
            this.pointsAtt.set(this.pointsAtt() + 1);
          }
          break;
      }
    }

    getTalent(talentName: string){
      return this.talent.find(t => t.name === talentName);
    }

    reset(){
        this.forca.set(2);
        this.destreza.set(2);
        this.constituicao.set(2);
        this.inteligencia.set(2);
        this.sabedoria.set(2);
        this.carisma.set(2);
        this.pointsAtt.set(10);
    }
    constructor() {}
}
