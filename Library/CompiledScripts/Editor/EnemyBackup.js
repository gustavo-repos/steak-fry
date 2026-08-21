const APJS = globalThis.orion['@orion/orion-sdk/EditorFramework'].APJS;

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
exports.EnemyBackup = exports.time = void 0;
const Game_1 = require("Game");
exports.time = 35;
let EnemyBackup = class EnemyBackup extends APJS.BasicScriptComponent {
    constructor() {
        super(...arguments);
        this.accumulator = 0;
        this.spawnTimer = 0;
        this.spawnInterval = 3;
        // time = 35
        this.startTimer = false;
        // spawnSpots = [[117 / PPU, 104 / PPU], [396 / PPU, 104 / PPU], [-396 / PPU, 104 / PPU], [-117 / PPU, 104 / PPU], [-256 / PPU, 333 / PPU], [256 / PPU, 333 / PPU]]
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
        while (this.accumulator >= Game_1.fixedTime) {
            this.spawnTimer += Game_1.fixedTime;
            if (this.startTimer && exports.time >= 0) {
                exports.time -= Game_1.fixedTime;
                Game_1.conect.name = Math.round(exports.time).toString();
            }
            if (!this.enemyWasHit && (0, Game_1.checkRectOverlap)(this.getPlayerRect(), (0, Game_1.getElementRect)(this.getSceneObject(), 0))) {
                console.log('hit');
                if (!this.startTimer)
                    this.startTimer = true;
                this.points++;
                // conect.name = this.points.toString()
                this.scenePoints.name = this.points.toString();
                this.enemyScene.name = 'hit';
                this.enemyWasHit = true;
                this.spawnTimer = 1;
                if (this.points == 4) {
                    this.spawnInterval = 2.5;
                }
                else if (this.points == 8) {
                    this.spawnInterval = 2.3;
                    exports.time += 15;
                    // adicionar visual tempo aumentando!
                }
                else if (this.points == 12) {
                    this.spawnInterval = 2;
                    exports.time += 10;
                    // adicionar visual tempo aumentando!
                }
                else if (this.points == 18) {
                    // adiocionar o KO!
                }
            }
            if (this.spawnTimer >= this.spawnInterval) {
                // this.currentSpot = this.getRandomItem(this.spawnSpots)
                this.setCurrentSpot(this.spawnSpots);
                (0, Game_1.teleport)(this.getSceneObject(), this.currentSpot[0], this.currentSpot[1]);
                this.spawnTimer = 0;
                this.enemyScene.name = 'enemy';
                this.enemyWasHit = false;
            }
            this.accumulator -= Game_1.fixedTime;
        }
    }
};
EnemyBackup = __decorate([
    component()
], EnemyBackup);
exports.EnemyBackup = EnemyBackup;
