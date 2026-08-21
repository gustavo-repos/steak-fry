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
exports.Item = void 0;
const Game_1 = require("Game");
let Item = class Item extends APJS.BasicScriptComponent {
    constructor() {
        super(...arguments);
        this.drop = false;
        this.frameCounter = 0;
        this.accumulator = 0;
        this.velocityY = 0;
        this.time = 0.8;
        this.hitTheGround = false;
    }
    // scale: any
    onStart() {
        this.playerObj = this.getSceneObject().scene.findSceneObject('player');
        this.crackSound = this.getSceneObject().scene.findSceneObject('crackSoundOff');
        this.screen = this.getSceneObject().getComponent('ScreenTransform');
        // this.scale = this.screen.localScale 
        // this.image = this.getComponents('Image')
        // console.log(this.image.getChildren[0].name)
    }
    onUpdate(deltaTime) {
        deltaTime = Math.min(deltaTime, 0.25);
        this.accumulator += deltaTime;
        while (this.accumulator >= Game_1.fixedTime) {
            if ((0, Game_1.checkRectOverlap)((0, Game_1.getElementRect)(this.getSceneObject(), 0), (0, Game_1.getElementRect)(this.playerObj, 0))) {
                // this.getSceneObject().getChildren()[0].enabled = false
                // this.getSceneObject().getChildren()[1].enabled = true
                // this.mat.setVector('_Custom_Vec2', new APJS.Vector2f(0.875, 1.0))
                // console.log(this.mat)
                // var scale = this.getSceneObject().getComponent('ScreenTransform')?.localScale
                // scale.y = 0.4
                // this.getSceneObject().getComponent('ScreenTransform').localScale = scale
                this.drop = true;
            }
            if (this.drop == true) {
                this.velocityY += Game_1.gravity * Game_1.fixedTime;
                for (let i = 0; i < Game_1.grounds.length; i++) {
                    if ((0, Game_1.checkRectOverlap)((0, Game_1.getElementRect)(this.getSceneObject(), 0), (0, Game_1.getElementRect)(Game_1.grounds[i], 0))) {
                        this.crackSound.name = 'crackSoundOn';
                        this.velocityY = 0;
                        // this.getSceneObject().getChildren()[1].enabled = false
                        // this.getSceneObject().getChildren()[2].enabled = true
                        var newScale = this.screen.localScale;
                        var newPivot = this.screen.pivot;
                        newScale.y = 0.4;
                        newPivot.y = 1.2;
                        this.screen.localScale = newScale;
                        this.screen.pivot = newPivot;
                        this.hitTheGround = true;
                        this.drop = false;
                        break;
                    }
                }
                (0, Game_1.move)(this.getSceneObject(), 0, this.velocityY * Game_1.fixedTime);
            }
            if (this.hitTheGround) {
                this.time -= deltaTime;
                if (this.time <= 0) {
                    this.getSceneObject().scene.removeSceneObject(this.getSceneObject());
                    this.crackSound.name = 'crackSoundOff';
                }
            }
            this.accumulator -= Game_1.fixedTime;
        }
    }
};
Item = __decorate([
    component()
], Item);
exports.Item = Item;
