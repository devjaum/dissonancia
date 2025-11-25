import { CommonModule } from '@angular/common';
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-create',
  imports: [CommonModule],
  templateUrl: './create.html',
  styleUrls: ['./create.css', './create2.css'],
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
      {name: "Furtividade", description: "Você é especialmente bom em nao ser percebido pelos inimigos, +2 em testes de Furtividade", peso: 2},
      {name: "Regenerar", description: "Regenera pontos de vida no meio do combate (+1 PV cada vez que chega seu turno)", peso: 8},
      {name: "Conhecimento arcano", description: "Você possui vasto conhecimento sobre magias e rituais, podendo reconhece-los +2 em testes de inteligência", peso: 2},
      {name: "Polivalente", description: "Escolha um atributo. Você recebe +1 em todos os testes relacionados a esse atributo e pode escolher uma perícia associada para receber +2 nela", peso: 7},
      {name: "Prodígio", description: "Você recebe +1 em todos os atributos", peso: 7},
      {name: "Dualidade", description: "Você pode ocultar sua verdadeira especialidade em combate. Escolha dois atributos. Você pode trocar os valores desses atributos uma vez por combate como ação bônus", peso: 5},
      {name: "Fortaleza Viva", description: "Você não pode se mover por 2 turnos, mas recebe +5 de defesa e regenera 2 PV por turno", peso: 8},
      {name: "Execução Rápida", description: "Se derrotar um inimigo com um ataque corpo a corpo, pode usar sua ação bônus para realizar outro ataque corpo a corpo contra outro inimigo adjacente", peso: 4},
      {name: "Guardião Protetor", description: "Quando um aliado em alcance curto for atacado, você pode usar sua reação para interpor-se e receber o ataque no lugar dele", peso: 4},
      {name: "Oportunista", description: "Quando um aliado próximo ataca um alvo que você possa ver, você pode usar sua ação bônus para realizar um ataque corpo a corpo contra esse alvo", peso: 4},
      {name: "Recarga Interna", description: "Recupera +1 de shinsu a cada 2 turnos", peso: 6},
      {name: "Forma Final", description: "Ao cair abaixo de 15% de vida, você pode ativar sua forma final como ação. Durante 3 turnos, você recebe +5 em todos os atributos e regenera 5 PV por turno. Só pode ser usado uma vez por combate.", peso: 10},
      {name: "Vínculo Vital", description: "Escolha um aliado no início do combate. Enquanto estiver consciente, você recebe todo o dano que ele receberia", peso: 8},
      {name: "Inevitável", description: "Escolha um inimigo no início do combate. Você recebe +2 em todos os testes contra ele até que um de vocês caia", peso: 6},
      {name: "Última Chance", description: "Ao cair a 0 PV, você pode realizar uma última ação com sucesso garantido. Se eliminar o alvo dessa ação em até 2 turnos, você revive com 1d6 PV. Só pode ser usado uma vez por combate.", peso: 10},  
      {name: "Cronometro", description: "O som de um relógio está constantemente em sua mente, permitindo se adaptar ao tempo de forma única. Você pode gastar 3 PE para agir novamente no final do turno atual (Ação bônus).", peso: 8},
      {name: "Olhar da Morte", description: "Uma vez por combate, você pode marcar um inimigo com sua sentença. Durante 3 turnos, seus ataques contra ele ignoram defesa, causam +1d6 de dano e não podem ser curados. Se o inimigo morrer nesse período, você recupera todo seu Shinsu.", peso: 10},
      {name: "Marca da Redenção", description: "Uma vez por combate, você pode marcar até 2 inimigos em alcance médio. Durante 2 turnos, qualquer dano causado a ele recupera toda a vida perdida do atacante. A marca desaparece se o inimigo morrer.", peso: 10},
      {name: "null", description: "Você não existe, mas age. Durante o combate, você ignora presença, tempo e espaço. Pode agir contra qualquer alvo, em qualquer lugar, sem ser percebido ou impedido. Tudo que você faz é inevitável.", peso: 11}
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
    vidaExtra = 0;
    vida = computed(() => 5 + this.constituicao() * 10 + this.forca() * 5 + this.vidaExtra);
    shinsu = computed(() => 4 + this.inteligencia() * 12 + this.sabedoria() * 6);
    energia = computed(() => 1 + this.destreza() * 3 + this.carisma() * 2);
    // Criar stts com valor any
    stts = signal<any[]>([]);
    ngStts(){
      if(this.stts().length > 0){
        this.forca.set(this.stts()[0]);
        this.destreza.set(this.stts()[1]);  
        this.constituicao.set(this.stts()[2]);
        this.inteligencia.set(this.stts()[3]);
        this.sabedoria.set(this.stts()[4]);
        this.carisma.set(this.stts()[5]);
        this.pointsAtt.set(this.stts()[6]);
        this.pointsT.set(this.stts()[7]);
        this.listaTalent.set(this.stts()[8]);
        this.vidaExtra = this.stts()[9];
      }
    }

    ngAfterViewInit() {
      //Mudar a cor dos talentos que já estão selecionados
      this.listaTalent().forEach(talentName => {
        let talent = this.getTalent(talentName);
        if(talent){
          this.mudarCorTalent(talent);
        }
      });
      this.ngStts();
    }

    ngOnInit(){
      this.talent.sort((a, b) => a.peso - b.peso);

      let stts = localStorage.getItem("stts");
      if(stts){
        this.stts.set(JSON.parse(stts));
      }
      this.talent.sort((a, b) => a.peso - b.peso);
    }

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
      if (this.listaTalent().includes(talent.name)) {
        // Se já tem, remove.
        this.removePointTalent(talent);
        return;
      }

      if (talent.peso > this.pointsT()) {
          // Se não tem e não pode pagar, retorna.
          return;
      }
      
      this.pointsT.set( this.pointsT() - talent.peso);
      this.listaTalent.set([...this.listaTalent(), talent.name]);
      //Mudar a cor do talento selecionado
      this.mudarCorTalent(talent);
      
      //Verificar quais talentos adiciona pontos aos atributos (força...)
      if(talent.name === "Prodígio"){
        this.forca.set(this.forca() + 1);
        this.destreza.set(this.destreza() + 1);
        this.constituicao.set(this.constituicao() + 1);
        this.inteligencia.set(this.inteligencia() + 1);
        this.sabedoria.set(this.sabedoria() + 1);
        this.carisma.set(this.carisma() + 1);
      }
      if(talent.name === "Vigoroso"){
        //Aumentar a vida em 10
        this.vidaExtra = 10;
      }

      return;

    }

    removePointTalent(talent: any){
      this.pointsT.set( this.pointsT() + talent.peso);
      this.listaTalent.set(this.listaTalent().filter(t => t !== talent.name));
      
      //Remover a cor do talento
      this.removerCorTalent(talent);

      //Verificar se o talento tirado altera os pontos dos atributos
      if(talent.name === "Prodígio"){
        this.forca.set(this.forca() - 1);
        this.destreza.set(this.destreza() - 1);
        this.constituicao.set(this.constituicao() - 1);
        this.inteligencia.set(this.inteligencia() - 1);
        this.sabedoria.set(this.sabedoria() - 1);
        this.carisma.set(this.carisma() - 1);
      }
      if(talent.name === "Vigoroso"){
        this.vidaExtra = 0;
      }
      
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
          if (this.forca() > 0) {
            this.forca.set(this.forca() - 1);
            this.pointsAtt.set(this.pointsAtt() + 1);
          }
          break;
        case 'destreza':
          if (this.destreza() > 0) {
            this.destreza.set(this.destreza() - 1);
            this.pointsAtt.set(this.pointsAtt() + 1);
          }
          break;
        case 'constituicao':
          if (this.constituicao() > 0) {
            this.constituicao.set(this.constituicao() - 1);
            this.pointsAtt.set(this.pointsAtt() + 1);
          }
          break;
        case 'inteligencia':
          if (this.inteligencia() > 0) {
            this.inteligencia.set(this.inteligencia() - 1);
            this.pointsAtt.set(this.pointsAtt() + 1);
          }
          break;
        case 'sabedoria':
          if (this.sabedoria() > 0) {
            this.sabedoria.set(this.sabedoria() - 1);
            this.pointsAtt.set(this.pointsAtt() + 1);
          }
          break;
        case 'carisma':
          if (this.carisma() > 0) {
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
      let aux = 0;
      //Verificar se possui talento que altera o atributo
      this.listaTalent().forEach(talentName => {
        let talent = this.getTalent(talentName);
        if(talent){
          if(talent.name === "Prodígio"){
            this.forca.set(3);
            this.destreza.set(3);
            this.constituicao.set(3);
            this.inteligencia.set(3);
            this.sabedoria.set(3);
            this.carisma.set(3);
            this.pointsAtt.set(10);
            aux = 1;
          }
        }
      });
      
      if(aux === 0){
        this.forca.set(2);
        this.destreza.set(2);
        this.constituicao.set(2);
        this.inteligencia.set(2);
        this.sabedoria.set(2);
        this.carisma.set(2);
        this.pointsAtt.set(10);
      }
      return;
    }

    //Salvar no localstorage
    save(){
      this.stts.set([
        this.forca(),
        this.destreza(),
        this.constituicao(),
        this.inteligencia(),
        this.sabedoria(),
        this.carisma(),
        this.pointsAtt(),
        this.pointsT(),
        this.listaTalent(),
        this.vidaExtra     
      ]);
      localStorage.setItem("stts", JSON.stringify(this.stts()));
    }

    constructor() {}
}
