import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import monstroPediaJson from "../../public/monstropedia.json";
import { Router } from '@angular/router';
import { DatabaseService } from '../app/database.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-monstropedia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monstropedia.html',
  styleUrls: ['./monstropedia.css', 'search.css']
})
export class Monstropedia {
    monstroPedia = monstroPediaJson;
    flippedMonsters = new Set<string>();
    searchTerm: string = '';
    private dbService = inject(DatabaseService);

    constructor(
        private router: Router
    ) {}

    isFlipped(name: string): boolean {
        return this.flippedMonsters.has(name);
    }

    toggleFlip(name: string): void {
        if (this.flippedMonsters.has(name)) {
            this.flippedMonsters.delete(name);
        } else {
            this.flippedMonsters.add(name);
        }
    }

    voltarHome(){
        this.dbService.isAuthenticated().subscribe(isAuth => {
            if (isAuth) {
                this.router.navigate(['/home']);
            } else {
                this.router.navigate(['/guest']);
            }
        });
    }

    filterMonsters() {
        let value:any[] = [];
        this.monstroPedia.filter(monster =>
            value.push(monster.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
        );
        this.invisibleMonster(value)
        return value;
    }

    invisibleMonster(value:any[]){
        for(let i = 0; i < this.monstroPedia.length; i++){
            const monsterElement = document.getElementById(`monster-${this.monstroPedia[i].name}`);
            if (monsterElement) {
                if(value[i]){
                    monsterElement.style.display = 'block';
                } else {
                    monsterElement.style.display = 'none';
                }
            }
        }
        
    }

}