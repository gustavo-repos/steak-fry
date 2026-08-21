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
exports.Time2 = exports.time = void 0;
const Game_1 = require("Game");
const Enemy_1 = require("Enemy");
exports.time = 35;
let Time2 = class Time2 extends APJS.BasicScriptComponent {
    constructor() {
        super(...arguments);
        this.accumulator = 0;
    }
    onStart() {
        console.log('teste');
    }
    onUpdate(deltaTime) {
        deltaTime = Math.min(deltaTime, 0.25);
        this.accumulator += deltaTime;
        while (this.accumulator >= Game_1.fixedTime) {
            console.log(Enemy_1.startTimer);
            if (Enemy_1.startTimer && exports.time >= 0) {
                console.log('teste');
                exports.time -= Game_1.fixedTime;
                Game_1.conect.name = Math.round(exports.time).toString();
            }
            this.accumulator -= Game_1.fixedTime;
        }
    }
};
Time2 = __decorate([
    component()
], Time2);
exports.Time2 = Time2;
