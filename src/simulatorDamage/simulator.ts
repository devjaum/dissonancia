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

  isDodging: boolean;
  fatigue: boolean;
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
        if (!player){
            let dex = 4;
            let con = 2;
            let int = 5;
            let wis = 1;
            return{
                name: "Herói", isPlayer: true,
                str: 3, dex: dex, con: con, int: 5, wis: 1, cha: 5,
                maxHp: 0, currentHp: 0, passiveDef: (1+(Math.max(dex, con)/2)), magicDef: (1+(Math.max(int, wis)/2)), initiative: 0,
                isDodging: false, fatigue: false
            }
        }

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
        maxHp: 0, currentHp: 0, passiveDef: 0, magicDef: 0, initiative: 0,
        isDodging: false, fatigue: false
    };
    ngOnInit(){
        this.character$.subscribe(p => this.player = p!);
    }

    enemy: Fighter = {
        name: "Sombra", isPlayer: false,
        str: 4, dex: 2, con: 3, int: 1, wis: 2, cha: 1,
        maxHp: 0, currentHp: 0, passiveDef: 0, magicDef: 0, initiative: 0,
        isDodging: false, fatigue: false
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
            setTimeout(() => this.performAttack(active, this.player), 500);
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
            // 0 = Atacar, 1 = Esquivar
            let action = Math.floor(Math.random() * 2); 
            
            if (action === 0) {
                attrVal = attacker.str > attacker.dex ? attacker.str : attacker.dex;
                attrName = attacker.str > attacker.dex ? '🔨 Arma Pesada (FOR)' : '🗡️ Arma Leve (DES)';
            } else {
                this.dodge(attacker);
                return;
            }
        }

        this.log(`${attacker.name} usa ${attrName}!`, logType);


        const attackResult = this.rollPool(attrVal, weaponBonus);
        const formattedRolls = attackResult.rolls.join(', ');

        let defenseThreshold = 0;
        let isDodgeAttempt = false;

        if (defender.isDodging) {
            isDodgeAttempt = true;
            this.log(`🤸 ${defender.name} tenta esquivar do ataque!`, defender.isPlayer ? 'player' : 'enemy');

            const dodgeResult = this.rollPool(defender.dex);

            this.log(`🎲 Ataque [${formattedRolls}] (${attackResult.successes}) VS Esquiva [${dodgeResult.rolls.join(', ')}] (${dodgeResult.successes})`, 'system');

            if (dodgeResult.successes > attackResult.successes) {
                this.log(`💨 ${defender.name} esquivou completamente!`, 'critical');
                defender.isDodging = false;
                this.checkWinCondition();
                if (this.battleStarted) this.nextTurn();
                return;
            } else {
                this.log(`💥 A esquiva falhou!`, 'fail');
                defenseThreshold = 0; 
            }
            defender.isDodging = false;

        } else {
            defenseThreshold = defender.passiveDef;
            this.log(`🎲 Dados: [${formattedRolls}] -> ${attackResult.successes} Sucessos (DT ${defenseThreshold})`, 'system');
        }

       
        if (isDodgeAttempt || attackResult.successes >= defenseThreshold) {

            let extra = 0;
            let mitigationMsg = "";

            if (isDodgeAttempt) {
                let d6 = Math.floor(Math.random() * 6) + 1;
                
                if (d6 > 4) {
                    extra = Math.max(0, attackResult.successes - defender.passiveDef);
                    mitigationMsg = " (Defesa parcial)";
                    this.log(`🎲 Sorte na defesa [${d6}]. Armadura absorveu parte do impacto!`, 'system');
                } else {

                    extra = attackResult.successes;
                    mitigationMsg = " (Guarda Aberta!)";
                    this.log(`🎲 Azar na defesa [${d6}]. Dano direto sem armadura!`, 'fail');
                }
            } else {
                extra = attackResult.successes - defender.passiveDef;
            }

            const dmgBonus = extra * 2;
            const total = baseDamage + dmgBonus;

            defender.currentHp -= total;
            if (defender.currentHp < 0) defender.currentHp = 0;

            const critMsg = dmgBonus > 0 ? ` (CRÍTICO +${dmgBonus}${mitigationMsg})` : mitigationMsg;
            this.log(`🩸 ACERTOU! Dano: ${baseDamage}${critMsg} = ${total}`, 'critical');
        } else {
            this.log(`🛡️ Bloqueado pela Defesa Passiva.`, 'fail');
        }

        this.checkWinCondition();
        if (this.battleStarted) this.nextTurn();
    }

    dodge(actor: Fighter){
        actor.fatigue = true;
        actor.isDodging = true;

        this.log(`${actor.name} assume postura de esquiva!`,actor.isPlayer ? 'player' : 'enemy');
        this.log(`>> ${actor.name} tentará superar os sucessos do próximo ataque.`, 'system');

        this.nextTurn();
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