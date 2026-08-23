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
exports.Player = void 0;
const Game_1 = require("Game");
/*
state:
---
0 grounded
1 airborne

substate:
---
0 idle
1 walking
2 jumping
3 falling
4 attacking
*/
let Player = class Player extends APJS.BasicScriptComponent {
    constructor() {
        super(...arguments);
        this.state = 1;
        //substate = 3
        this.lastSubstate = 3;
        this.previousState = 1;
        this.jumpCycle = false;
        this.jumpPower = 30;
        this.velocityY = 0;
        this.frameCounter = 0;
        this.landedIn = null;
        this.accumulator = 0;
    }
    getPlayerRect() {
        var center = this.playerObj.getTransform().getWorldPosition();
        if (center) {
            return [center.x, center.y, this.playerWidth * 0.75, this.playerHeight];
        }
    }
    getPlayerCoreRect(nextValue) {
        var centerX = this.getSceneObject().getTransform().getWorldPosition().x;
        var centerY = nextValue;
        return [centerX, centerY, this.width * 0.55, this.height * 0.9];
    }
    substateHandle() {
        if (Game_1.substate != 4) {
            if (this.state == 0) {
                if (Game_1.leftPressed || Game_1.rightPressed) {
                    if (Game_1.gameState == 0)
                        (0, Game_1.setSubstate)(1);
                }
                else {
                    (0, Game_1.setSubstate)(0);
                }
            }
            else {
                if (this.velocityY >= 0) {
                    (0, Game_1.setSubstate)(2);
                }
                else {
                    (0, Game_1.setSubstate)(3);
                }
            }
        }
        if (Game_1.gameState == 0) {
            if (Game_1.leftPressed) {
                this.playerSprite.getComponent('Image').flipX = true;
            }
            else if (Game_1.rightPressed) {
                this.playerSprite.getComponent('Image').flipX = false;
            }
        }
    }
    setPlayerSprite() {
        if (Game_1.substate == this.lastSubstate)
            return;
        switch (Game_1.substate) {
            case 0:
                this.playerSprite.name = 'idle';
                break;
            case 1:
                this.playerSprite.name = 'walk';
                break;
            case 2:
                this.playerSprite.name = 'jump';
                break;
            case 3:
                this.playerSprite.name = 'fall';
                break;
            case 4:
                this.playerSprite.name = 'attacking';
                break;
        }
        this.lastSubstate = Game_1.substate;
    }
    onStart() {
        this.playerSprite = this.getSceneObject().scene.findSceneObject('playerSprite');
        this.transform = this.getSceneObject().getComponent('ScreenTransform');
        this.width = this.transform.sizeDelta.x / Game_1.PPU;
        this.height = this.transform.sizeDelta.y / Game_1.PPU;
        this.playerX = this.getSceneObject().getTransform().getWorldPosition().x;
        this.jumpSound = this.getSceneObject().scene.findSceneObject('jumpSoundOff');
        this.horizontalArea = this.getSceneObject().scene.findSceneObject('horizontalArea');
    }
    onUpdate(deltaTime) {
        if (this.frameCounter < 30) {
            this.frameCounter++;
            return;
        }
        deltaTime = Math.min(deltaTime, 0.25);
        this.accumulator += deltaTime;
        if (Game_1.resetPressed) {
            this.state = 1;
            this.lastSubstate = 3;
            this.previousState = 1;
            this.jumpCycle = false;
            this.jumpPower = 30;
            this.velocityY = 0;
            this.frameCounter = 0;
            this.accumulator = 0;
        }
        while (this.accumulator >= Game_1.fixedTime) {
            this.substateHandle();
            this.setPlayerSprite();
            if (this.state == 1)
                this.velocityY += Game_1.gravity * Game_1.fixedTime;
            if (this.velocityY < -30)
                this.velocityY = -30;
            if (Game_1.jumpPressed && this.state == 0 && !this.jumpCycle && Game_1.gameState == 0) {
                this.velocityY = this.jumpPower;
                this.jumpCycle = true;
                this.state = 1;
                this.jumpSound.name = 'jumpSoundOn';
            }
            if (!Game_1.jumpPressed && this.jumpCycle) {
                // cancelador de pulo durante o salto
                // if (this.velocityY > 0) this.velocityY = 0
                if (this.state == 0)
                    this.jumpCycle = false;
                this.jumpSound.name = 'jumpSoundOff';
            }
            if (this.state == 0) {
                this.leftLimit = (0, Game_1.getElementRect)(this.landedIn, 0)[0] - ((0, Game_1.getElementRect)(this.landedIn, 0)[2] / 2) - (this.width * 0.3);
                this.rightLimit = (0, Game_1.getElementRect)(this.landedIn, 0)[0] + ((0, Game_1.getElementRect)(this.landedIn, 0)[2] / 2) + (this.width * 0.3);
                if (this.playerX < this.leftLimit || this.playerX > this.rightLimit) {
                    this.state = 1;
                }
            }
            this.nextY = this.getSceneObject().getTransform().localPosition.y + (this.velocityY * Game_1.fixedTime);
            if (this.state == 1) {
                for (let i = 0; i < Game_1.platforms.length; i++) {
                    if ((0, Game_1.checkRectOverlap)(this.getPlayerCoreRect(this.nextY), (0, Game_1.getElementRect)(Game_1.platforms[i], 0))) {
                        if (this.velocityY < 0) {
                            this.state = 0;
                            this.velocityY = 0;
                            (0, Game_1.snapY)('top', this.getSceneObject(), Game_1.platforms[i]);
                            this.landedIn = Game_1.platforms[i];
                            break;
                        }
                        if (this.velocityY > 0) {
                            console.log(this.playerPosY, this.halfPlayerSize, this.halfPlatSize);
                            this.state = 1;
                            this.velocityY = 0;
                            (0, Game_1.snapY)('bottom', this.getSceneObject(), Game_1.platforms[i]);
                            break;
                        }
                    }
                }
                (0, Game_1.move)(this.getSceneObject(), 0, this.velocityY * Game_1.fixedTime);
            }
            if ((0, Game_1.checkRectOverlap)(this.getPlayerCoreRect(this.getSceneObject().getTransform().localPosition.y), (0, Game_1.getElementRect)(this.horizontalArea, 0))) {
                this.horizontalArea.name = 'horizontal';
            }
            else {
                this.horizontalArea.name = 'fora';
            }
            this.accumulator -= Game_1.fixedTime;
        }
    }
};
Player = __decorate([
    component()
], Player);
exports.Player = Player;
