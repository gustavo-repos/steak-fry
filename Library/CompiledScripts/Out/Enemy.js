const {BasicScriptNode} = require('./BasicScriptNode');
const {
  customNode,
  component,
  input,
  output,
  serializeSceneObjectFlag,
  serializeProperty,
  label, readOnly, slider, spinBox, dropDown,
  textArea, header, showIf, tooltip, separator,
  space, groupBegin, groupEnd, disablePin,
} = require('./OrionDecorators');

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enemy = void 0;
const Game_1 = require("Game");
let Enemy = class Enemy extends APJS.BasicScriptComponent {
    constructor() {
        super(...arguments);
        this.accumulator = 0;
        this.spawnTimer = 0;
        this.spawnInterval = 3;
        this.playerAttackingTimer = 0;
        this.playerAttackingInterval = 0.4;
        this.spawnSpots = [[117 / Game_1.PPU, 114 / Game_1.PPU], [396 / Game_1.PPU, 114 / Game_1.PPU], [-396 / Game_1.PPU, 114 / Game_1.PPU], [-117 / Game_1.PPU, 114 / Game_1.PPU], [-256 / Game_1.PPU, 343 / Game_1.PPU], [256 / Game_1.PPU, 343 / Game_1.PPU]];
        this.enemyWasHit = false;
        this.points = 0;
    }
    getPlayerRect() {
        var center = this.playerObj.getTransform().getWorldPosition();
        if (center) {
            return [center.x, center.y, this.playerWidth * 0.75, this.playerHeight];
        }
    }
    getRandomItem(el) {
        return el[Math.floor(Math.random() * el.length)];
    }
    setCurrentSpot(el) {
        var newSpot = this.getRandomItem(el);
        if (newSpot != this.currentSpot) {
            this.currentSpot = newSpot;
        }
        else {
            this.setCurrentSpot(el);
        }
    }
    onStart() {
        this.gameRunning = this.getSceneObject().scene.findSceneObject('gameRunning');
        this.playerObj = this.getSceneObject().scene.findSceneObject('player');
        this.transform = this.playerObj.getComponent('ScreenTransform');
        this.playerWidth = this.transform.sizeDelta.x / Game_1.PPU;
        this.playerHeight = this.transform.sizeDelta.y / Game_1.PPU;
        this.enemyScene = this.getSceneObject().scene.findSceneObject('enemy');
        this.scenePoints = this.getSceneObject().scene.findSceneObject('points');
    }
    onUpdate(deltaTime) {
        deltaTime = Math.min(deltaTime, 0.25);
        this.accumulator += deltaTime;
        if (Game_1.resetPressed) {
            this.accumulator = 0;
            this.spawnTimer = 0;
            this.spawnInterval = 3;
            this.playerAttackingTimer = 0;
            this.playerAttackingInterval = 0.4;
            this.enemyWasHit = false;
            this.points = 0;
            this.scenePoints.name = 'points';
            this.gameRunning.name = 'gameRunning';
            this.enemyScene.name = 'enemy';
        }
        while (this.accumulator >= Game_1.fixedTime) {
            this.spawnTimer += Game_1.fixedTime;
            if (Game_1.substate == 4)
                this.playerAttackingTimer += Game_1.fixedTime;
            if (this.playerAttackingTimer >= this.playerAttackingInterval) {
                (0, Game_1.setSubstate)(3);
                this.playerAttackingTimer = 0;
            }
            if (!this.enemyWasHit) {
                this.enemyScene.name = 'enemy';
            }
            if (!this.enemyWasHit && (0, Game_1.checkRectOverlap)(this.getPlayerRect(), (0, Game_1.getElementRect)(this.getSceneObject(), 0))) {
                (0, Game_1.startTimer)();
                (0, Game_1.setSubstate)(4);
                this.points++;
                if (this.points == 3) {
                    this.scenePoints.name = 'energybar1';
                    // setGameState(2)
                    // this.gameRunning.name = 'win'
                    // this.enemyScene.name = 'enemy'
                }
                else if (this.points == 6) {
                    this.scenePoints.name = 'energybar2';
                }
                else if (this.points == 9) {
                    this.scenePoints.name = 'energybar3';
                    (0, Game_1.addTime)(15);
                }
                else if (this.points == 12) {
                    this.scenePoints.name = 'energybar4';
                    (0, Game_1.addTime)(10);
                }
                else if (this.points == 15) {
                    this.scenePoints.name = 'energybar5';
                }
                else if (this.points == 18) {
                    this.scenePoints.name = 'energybar6';
                    (0, Game_1.setGameState)(2);
                    this.enemyScene.name = 'enemy';
                    this.gameRunning.name = 'win';
                    // KO!
                }
                this.enemyScene.name = 'hit';
                this.enemyWasHit = true;
                this.spawnTimer = 1;
                this.spawnInterval = 3;
            }
            if (this.spawnTimer >= this.spawnInterval && Game_1.gameState == 0) {
                this.setCurrentSpot(this.spawnSpots);
                (0, Game_1.teleport)(this.getSceneObject(), this.currentSpot[0], this.currentSpot[1]);
                this.spawnTimer = 0;
                this.enemyScene.name = 'respawn';
                this.enemyWasHit = false;
                if (this.points == 4) {
                    this.spawnInterval = 2.5;
                }
                else if (this.points == 8) {
                    this.spawnInterval = 2.0;
                }
                else if (this.points == 12) {
                    this.spawnInterval = 1.6;
                }
                else if (this.points == 25) {
                }
            }
            this.accumulator -= Game_1.fixedTime;
        }
    }
};
Enemy = __decorate([
    component()
], Enemy);
exports.Enemy = Enemy;
