import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../app/database.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

type AttributeKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
type LogType = 'player' | 'enemy' | 'system' | 'critical' | 'fail';

interface LogEntry {
  message: string;
  type: LogType;
}

export interface Fighter {
  name: string;
  isPlayer: boolean;

  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;

  maxHp: number;
  currentHp: number;

  passiveDef: number;
  magicDef: number;
  initiative: number;
}


@Component({
  selector: 'app-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simulator.html',
  styleUrls: ['./simulator.css']
})
export class Simulator implements OnInit  {
    private dbService = inject(DatabaseService);

    character$: Observable<Fighter | null> = this.dbService.getCharacterByEmail().pipe(
     map(player => {
        if (!player) return null;

        const status = player.status || [0, 0, 0, 0, 0, 0];
        const talents = Array.isArray(player.talent) ? player.talent : [];
        const name = player.name || "Herói";

        const str = Number(status[0]) || 0;
        const dex = Number(status[1]) || 0;
        const con = Number(status[2]) || 0;
        const int = Number(status[3]) || 0;
        const wis = Number(status[4]) || 0;
        const cha = Number(status[5]) || 0;

        const temVigoroso = talents.includes("Vigoroso");
        const vidaExtra = (player as any).vidaExtra || 0;
        const maxHp = 5 + (con * 10) + (str * 5) + (temVigoroso ? 10 : 0) + vidaExtra;

        const passiveDef = 1 + Math.max(Math.floor(dex / 2), Math.floor(con / 2));
        const magicDef = 1 + Math.max(Math.floor(wis / 2), Math.floor(int / 2));
        const initiative = dex + Math.floor(Math.random() * 6) + 1;        

        return {
        name,
        isPlayer: true,
        str,
        dex,
        con,
        int,
        wis,
        cha,
        maxHp,
        currentHp: maxHp,
        passiveDef,
        magicDef,
        initiative
        } as Fighter;
    })
    );


    battleLog: LogEntry[] = [];
    turnTotal: Number = 0;


    battleStarted = false;
    turnOrder: Fighter[] = [];
    currentTurnIndex = 0;

    attackOptions = [
        { label: '🗡️ Arma Leve (DES)', attr: 'dex' as AttributeKey },
        { label: '🔨 Arma Pesada (FOR)', attr: 'str' as AttributeKey },
        { label: '🔮 Magia Arcana (INT)', attr: 'int' as AttributeKey },
        { label: '✨ Magia Espiritual (SAB)', attr: 'wis' as AttributeKey },
        { label: '🗣️ Encantamento (CAR)', attr: 'cha' as AttributeKey }
    ];

    selectedAttack = this.attackOptions[0];
    player: Fighter = {
        name: "Herói", isPlayer: true,
        str: 3, dex: 4, con: 3, int: 2, wis: 2, cha: 2,
        maxHp: 0, currentHp: 0, passiveDef: 0, magicDef: 0, initiative: 0
    };

    ngOnInit(){
        this.character$.subscribe(p => this.player = p!);
    }

    enemy: Fighter = {
        name: "Sombra", isPlayer: false,
        str: 4, dex: 2, con: 3, int: 1, wis: 2, cha: 1,
        maxHp: 0, currentHp: 0, passiveDef: 0, magicDef: 0, initiative: 0
    };

    constructor(
        private router: Router
    ) {
        this.calculateStats(this.player);
        this.calculateStats(this.enemy);
        
    }

    calculateStats(fighter: Fighter) {
        fighter.maxHp = 5 + (fighter.con * 10) + (fighter.str * 5);
        fighter.currentHp = fighter.maxHp;
        
        const dexPart = Math.floor(fighter.dex / 2);
        const conPart = Math.floor(fighter.con / 2);
        fighter.passiveDef = 1 + Math.max(dexPart, conPart);
    }

    rollPool(attributeValue: number, bonusDice: number = 0): { successes: number, rolls: number[] } {
        const totalDice = attributeValue + bonusDice;
        const rolls: number[] = [];
        let successes = 0;

        if (totalDice <= 0) {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        rolls.push(d1, d2);
        if (Math.min(d1, d2) >= 4) successes = 1;
        return { successes, rolls };
        }

        for (let i = 0; i < totalDice; i++) {
        const res = Math.floor(Math.random() * 6) + 1;
        rolls.push(res);
        if (res >= 4) successes++;
        }
        return { successes, rolls };
    }

    startBattle() {
        this.calculateStats(this.player);
        this.calculateStats(this.enemy);
        this.battleLog = [];
        this.log("=== INÍCIO DO COMBATE ===", 'system');
        
        const pInit = Math.floor(Math.random() * 6) + 1;
        this.player.initiative = this.player.dex + pInit;
        this.log(`${this.player.name} Iniciativa: ${this.player.dex} + ${pInit} = ${this.player.initiative}`, 'player');

        const eInit = Math.floor(Math.random() * 6) + 1;
        this.enemy.initiative = this.enemy.dex + eInit;
        this.log(`${this.enemy.name} Iniciativa: ${this.enemy.dex} + ${eInit} = ${this.enemy.initiative}`, 'enemy');

        if (this.player.initiative >= this.enemy.initiative) {
        this.turnOrder = [this.player, this.enemy];
        this.log(`>> ${this.player.name} age primeiro!`, 'system');
        } else {
        this.turnOrder = [this.enemy, this.player];
        this.log(`>> ${this.enemy.name} age primeiro!`, 'system');
        }

        this.battleStarted = true;
        this.currentTurnIndex = 0;
        this.checkTurn();
    }

    checkTurn() {
        const active = this.turnOrder[this.currentTurnIndex];
        if (!active.isPlayer) {
            setTimeout(() => this.performAttack(active, this.player), 1000);
        }
        if(active.isPlayer) this.turnTotal = Number(this.turnTotal) + 1;
    }

    nextTurn() {
        if (this.player.currentHp <= 0 || this.enemy.currentHp <= 0) return;
        this.currentTurnIndex = (this.currentTurnIndex + 1) % 2;
        this.checkTurn();
    }

    performAttack(attacker: Fighter, defender: Fighter, weaponBonus: number = 0, baseDamage: number = 4) {
        let attrVal: number;
        let attrName: string;

        const logType: LogType = attacker.isPlayer ? 'player' : 'enemy';

        if (attacker.isPlayer) {
        attrVal = attacker[this.selectedAttack.attr];
        attrName = this.selectedAttack.label;
        } else {
        attrVal = attacker.str > attacker.dex ? attacker.str : attacker.dex;
        attrName = attacker.str > attacker.dex ? 'Força Bruta' : 'Agilidade';
        }

        this.log(`${attacker.name} usa ${attrName}!`, logType);

        const { successes, rolls } = this.rollPool(attrVal, weaponBonus);
        
        const formattedRolls = rolls.join(', ');
        this.log(`🎲 Dados: [${formattedRolls}] -> ${successes} Sucessos (DT ${defender.passiveDef})`, 'system');

        if (successes >= defender.passiveDef) {
        const extra = successes - defender.passiveDef;
        const dmgBonus = extra * 2;
        const total = baseDamage + dmgBonus;

        defender.currentHp -= total;
        if (defender.currentHp < 0) defender.currentHp = 0;

        const critMsg = dmgBonus > 0 ? ` (CRÍTICO +${dmgBonus})` : '';
        this.log(`💥 ACERTOU! Dano: ${baseDamage}${critMsg} = ${total}`, 'critical');
        } else {
        this.log(`💨 ERROU! Defesa prevaleceu.`, 'fail');
        }

        this.checkWinCondition();
        if (this.battleStarted) this.nextTurn();
    }

    checkWinCondition() {
        if (this.player.currentHp <= 0) {
            this.log(`Total de turnos: ${this.turnTotal}`, 'system');
            this.log(`💀 ${this.player.name} foi derrotado.`, 'fail');
            this.battleStarted = false;
        } else if (this.enemy.currentHp <= 0) {
            this.log(`Total de turnos: ${this.turnTotal}`, 'system');
            this.log(`🏆 ${this.enemy.name} foi eliminado!`, 'critical');
            this.battleStarted = false;
        }
    }

    log(message: string, type: LogType) {
        this.battleLog.push({ message, type });
        setTimeout(() => {
            const logContainer = document.getElementsByClassName('logs')[0];
            if (logContainer) logContainer.scrollTop = -logContainer.scrollHeight;
        }, 100);
    }

    reset() {
        this.battleStarted = false;
        this.battleLog = [];
        this.calculateStats(this.player);
        this.calculateStats(this.enemy);
    }

    home(){
        this.router.navigate(['/home']);
    }
}