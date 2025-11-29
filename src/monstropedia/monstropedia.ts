import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importa o JSON (certifique-se que o caminho está correto e o arquivo existe)
import monstroPediaJson from "../../public/monstropedia.json";

@Component({
  selector: 'app-monstropedia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monstropedia.html',
  styleUrl: './monstropedia.css'
})
export class Monstropedia {
    monstroPedia = monstroPediaJson;

    // Conjunto para guardar os nomes dos monstros virados
    flippedMonsters = new Set<string>();

    constructor() {}

    // Verifica se está virado
    isFlipped(name: string): boolean {
        return this.flippedMonsters.has(name);
    }

    // Alterna o estado (vira/desvira)
    toggleFlip(name: string): void {
        if (this.flippedMonsters.has(name)) {
            this.flippedMonsters.delete(name);
        } else {
            this.flippedMonsters.add(name);
        }
    }
}