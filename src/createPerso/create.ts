import { CommonModule } from '@angular/common';
import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { DatabaseService } from '../app/database.service';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
//public/talent.json
import talentData from '../../public/talent.json';

@Component({
  selector: 'app-create',
  imports: [CommonModule],
  templateUrl: './create.html',
  styleUrls: ['./create.css', './create2.css'],
  standalone: true
})

export class CreatePerso implements OnInit {
    constructor(
      private router: Router
    ){}

    private dbService = inject(DatabaseService);
    private docId: string | null = null;
    private auth = inject(Auth);

    userEmail = signal<string>("");

    talent = talentData;
    listaTalent = signal<string[]>([]);
    forca = signal(2);
    destreza = signal(2);
    constituicao = signal(2);
    inteligencia = signal(2);
    sabedoria = signal(2);
    carisma = signal(2);
    pointsAtt = signal(8);
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

      this.dbService.getCharacterByEmail().subscribe(character => {
        const user = this.auth.currentUser;
        if (user && user.email) {
             this.userEmail.set(user.email);
        }

        if (character) {          
          this.docId = (character as any).docId; 

          if (character.status && character.status.length >= 6) {
              this.forca.set(character.status[0]);
              this.destreza.set(character.status[1]);
              this.constituicao.set(character.status[2]);
              this.inteligencia.set(character.status[3]);
              this.sabedoria.set(character.status[4]);
              this.carisma.set(character.status[5]);
              this.pointsAtt.set(8 - (this.forca() + this.destreza() + this.constituicao() + this.inteligencia() + this.sabedoria() + this.carisma() - 12));
          }

          if (character.talent) {
              this.listaTalent.set(character.talent);
              setTimeout(() => this.atualizarVisuaisTalentos(), 100);
              this.pointsT.set(10 - character.talent.reduce((sum: number, talentName: string) => {
                  const talent = this.talent.find(t => t.name === talentName);
                  return sum + (talent ? talent.peso : 0);
              }, 0));
          }
          
          // Preencher outros dados se necessário (nome, lore, etc.)
        } else {
          console.log('Nenhum personagem encontrado para este e-mail.');
        }
      });
      this.talent.sort((a, b) => a.peso - b.peso);
    }

    atualizarVisuaisTalentos() {
    this.listaTalent().forEach(talentName => {
        const talent = this.getTalent(talentName);
        if (talent) this.mudarCorTalent(talent);
    });
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
            this.pointsAtt.set(8);
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
        this.pointsAtt.set(8);
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
      if (!this.docId) {
        
        const newCharacter = {
          email: this.userEmail(),
          password: this.userEmail().split('@')[0] + '@rpg',
          status: [
            this.forca(),
            this.destreza(),
            this.constituicao(),
            this.inteligencia(),
            this.sabedoria(),
            this.carisma()
          ],
          talent: this.listaTalent(),
        };
        this.dbService.saveUserData(newCharacter)
          .then(() => {
            alert('Salvo no Firebase com sucesso!')
            this.router.navigate(['/lore']);
          })
          .catch(err => console.error('Erro ao salvar:', err, newCharacter));
          return;
      }

      const dadosAtualizados = {
          status: [
              this.forca(),
              this.destreza(),
              this.constituicao(),
              this.inteligencia(),
              this.sabedoria(),
              this.carisma()
          ],
          talent: this.listaTalent(),
      };

      this.dbService.updateCharacter(this.docId, dadosAtualizados)
          .then(() => {
            alert('Salvo no Firebase com sucesso!');
            this.router.navigate(['/lore']);
          })
          .catch(err => console.error('Erro ao salvar:', err));
      }
}
