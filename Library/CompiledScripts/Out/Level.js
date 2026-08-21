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
exports.Level = void 0;
const Game_1 = require("Game");
let Level = class Level extends APJS.BasicScriptComponent {
    constructor() {
        super(...arguments);
        this.frameCounter = 0;
        this.accumulator = 0;
    }
    getPlayerBodyRect() {
        var center = this.playerObj.getTransform().getWorldPosition();
        if (center) {
            return [center.x, center.y, this.playerWidth * 0.6, this.playerHeight * 0.85];
        }
    }
    onStart() {
        this.playerObj = this.getSceneObject().scene.findSceneObject('player');
        this.transform = this.playerObj.getComponent('ScreenTransform');
        this.playerWidth = this.transform.sizeDelta.x / Game_1.PPU;
        this.playerHeight = this.transform.sizeDelta.y / Game_1.PPU;
    }
    onUpdate(deltaTime) {
        if (this.frameCounter < 30) {
            this.frameCounter++;
            return;
        }
        deltaTime = Math.min(deltaTime, 0.25);
        this.accumulator += deltaTime;
        if (Game_1.resetPressed) {
            this.frameCounter = 0;
            this.accumulator = 0;
        }
        while (this.accumulator >= Game_1.fixedTime) {
            this.velocityX = 12 * Game_1.fixedTime;
            if (Game_1.leftPressed && Game_1.gameState == 0) {
                for (let i = 0; i < Game_1.solids.length; i++) {
                    if ((0, Game_1.checkRectOverlap)(this.getPlayerBodyRect(), (0, Game_1.getElementRect)(Game_1.solids[i], this.velocityX))) {
                        (0, Game_1.snapX)(this.playerObj, Game_1.solids[i], this.getSceneObject());
                        this.velocityX = 0;
                        break;
                    }
                }
                (0, Game_1.move)(this.getSceneObject(), this.velocityX, 0);
            }
            if (Game_1.rightPressed && Game_1.gameState == 0) {
                for (let i = 0; i < Game_1.solids.length; i++) {
                    if ((0, Game_1.checkRectOverlap)(this.getPlayerBodyRect(), (0, Game_1.getElementRect)(Game_1.solids[i], -this.velocityX))) {
                        (0, Game_1.snapX)(this.playerObj, Game_1.solids[i], this.getSceneObject());
                        this.velocityX = 0;
                        break;
                    }
                }
                (0, Game_1.move)(this.getSceneObject(), -this.velocityX, 0);
            }
            this.accumulator -= Game_1.fixedTime;
        }
    }
};
Level = __decorate([
    component()
], Level);
exports.Level = Level;
