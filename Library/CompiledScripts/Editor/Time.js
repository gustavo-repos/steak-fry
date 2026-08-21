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
exports.Time = exports.startTimer = void 0;
const Game_1 = require("Game");
var isTimerRunning = false;
function startTimer() {
    console.log('startTimer running');
    //if (isTimerRunning) isTimerRunning = true
}
exports.startTimer = startTimer;
let Time = class Time extends APJS.BasicScriptComponent {
    constructor() {
        super(...arguments);
        this.time = 35;
        this.isTimerRunning = false;
        this.accumulator = 0;
    }
    onStart() {
    }
    onUpdate(deltaTime) {
        deltaTime = Math.min(deltaTime, 0.25);
        this.accumulator += deltaTime;
        while (this.accumulator >= Game_1.fixedTime) {
            //console.log(fixedTime)
            if (this.isTimerRunning && this.time >= 0) {
                this.time -= Game_1.fixedTime;
                //console.log('teste')
                Game_1.conect.name = Math.round(this.time).toString();
            }
            this.accumulator -= Game_1.fixedTime;
        }
    }
};
Time = __decorate([
    component()
], Time);
exports.Time = Time;
