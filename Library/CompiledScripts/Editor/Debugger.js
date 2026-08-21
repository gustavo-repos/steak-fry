const APJS = globalThis.orion['@orion/orion-sdk/EditorFramework'].APJS;

const {BasicScriptNode} = require('./BasicScriptNode');
const {
  customNode,
  component,
  input,
  output,
  serializeSceneObjectFlag,
  serializeProperty
} = require('./OrionDecorators');

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debugger = void 0;
const Game_1 = require("Game");
let Debugger = class Debugger extends APJS.BasicScriptComponent {
    constructor() {
        super(...arguments);
        this.state = 1;
        this.isJumping = false;
        this.jumpPower = 38;
        this.velocityY = 0;
    }
    getPlayerRect(mode, nextValue) {
        var centerX;
        var centerY;
        if (mode == 'body') {
            centerX = nextValue;
            centerY = this.getSceneObject().getTransform().localPosition.y;
            return [centerX, centerY, this.width, this.height];
        }
        if (mode == 'core') {
            centerX = this.getSceneObject().getTransform().localPosition.x;
            //centerX = this.getSceneObject().scene.findSceneObject('level')?.getTransform().localPosition.x
            centerY = nextValue;
            return [centerX, centerY, this.width - (64 / 32), this.height - (32 / 32)];
        }
    }
    onStart() {
        this.transform = this.getSceneObject().getComponent('ScreenTransform');
        this.width = this.transform.sizeDelta.x / 32;
        this.height = this.transform.sizeDelta.y / 32;
        this.ground1 = this.getSceneObject().scene.findSceneObject('ground1');
    }
    onUpdate(deltaTime) {
        this.velocityY += Game_1.gravity * deltaTime;
        if (this.velocityY < -30)
            this.velocityY = -30;
        if (Game_1.jumpPressed && !this.isJumping && this.state == 0) {
            this.velocityY = this.jumpPower;
            this.isJumping = true;
            this.state = 1;
        }
        var currentPos = this.getSceneObject().getTransform().localPosition;
        this.nextY = currentPos.y + (this.velocityY * deltaTime);
        if (this.state == 1) {
            if (this.velocityY <= 0 && (0, Game_1.checkRectOverlap)(this.getPlayerRect('core', this.nextY), (0, Game_1.getElementRect)(this.ground1))) {
                (0, Game_1.snapY)('top', this.getSceneObject(), this.getSceneObject().scene.findSceneObject('ground1'));
                this.velocityY = 0;
                this.isJumping = false;
                this.state = 0;
                console.log('overlap!');
            }
            else {
                (0, Game_1.move)(this.getSceneObject(), 0, this.velocityY * deltaTime);
                if (!(0, Game_1.checkRectOverlap)(this.getPlayerRect('core', currentPos.y), (0, Game_1.getElementRect)(this.ground1))) {
                    this.state = 1;
                }
            }
        }
    }
};
Debugger = __decorate([
    component()
], Debugger);
exports.Debugger = Debugger;
