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
/*
gameState
0 running
1 gameover
2 win
*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.snapX = exports.snapY = exports.checkRectOverlap = exports.getElementRect = exports.teleport = exports.move = exports.addTime = exports.startTimer = exports.setSubstate = exports.setGameState = exports.substate = exports.time = exports.conect = exports.fixedTime = exports.grounds = exports.solids = exports.platforms = exports.rightPressed = exports.leftPressed = exports.jumpPressed = exports.PPU = exports.gravity = exports.gameState = void 0;
exports.gameState = 0;
exports.gravity = -65;
exports.PPU = 32;
exports.jumpPressed = false;
exports.leftPressed = false;
exports.rightPressed = false;
exports.fixedTime = 0.02;
var isTimeRunning = false;
exports.time = 35;
exports.substate = 3;
function setGameState(x) {
    exports.gameState = x;
}
exports.setGameState = setGameState;
function setSubstate(x) {
    exports.substate = x;
}
exports.setSubstate = setSubstate;
function startTimer() {
    if (!isTimeRunning)
        isTimeRunning = true;
}
exports.startTimer = startTimer;
function addTime(x) {
    exports.time += x;
}
exports.addTime = addTime;
function move(el, dx, dy) {
    var pos = el.getTransform().localPosition;
    pos.x += dx;
    pos.y += dy;
    el.getTransform().localPosition = pos;
}
exports.move = move;
function teleport(el, x, y) {
    var pos = el.getTransform().localPosition;
    pos.x = x;
    pos.y = y;
    el.getTransform().localPosition = pos;
}
exports.teleport = teleport;
function getElementRect(el, dx) {
    var centerX = el.getTransform().getWorldPosition().x + dx;
    var centerY = el.getTransform().getWorldPosition().y;
    var width = el.getComponent('ScreenTransform').sizeDelta.x / exports.PPU;
    var height = el.getComponent('ScreenTransform').sizeDelta.y / exports.PPU;
    return [centerX, centerY, width, height];
}
exports.getElementRect = getElementRect;
function checkRectOverlap(rect1, rect2) {
    var mxA = rect1[2] / 2;
    var myA = rect1[3] / 2;
    var mxB = rect2[2] / 2;
    var myB = rect2[3] / 2;
    return (Math.abs(rect1[0] - rect2[0]) < (mxA + mxB) && Math.abs(rect1[1] - rect2[1]) < (myA + myB));
}
exports.checkRectOverlap = checkRectOverlap;
function snapY(mode, character, obstacle) {
    const char = character.getTransform();
    const charPos = char.localPosition;
    const obsY = obstacle.getTransform().localPosition.y;
    const obsH = obstacle.getComponent('ScreenTransform').sizeDelta.y / exports.PPU;
    const charH = character.getComponent('ScreenTransform').sizeDelta.y / exports.PPU;
    if (mode == 'top') {
        charPos.y = (obsY + (obsH * 0.5) + (charH * 0.5)) - (2 / 32);
        char.localPosition = charPos;
    }
    if (mode == 'bottom') {
        charPos.y = (obsY - (obsH * 0.5) - (charH * 0.5));
        char.localPosition = charPos;
    }
}
exports.snapY = snapY;
function snapX(character, obstacle, world) {
    const level = world.getTransform();
    const levelPos = level.localPosition;
    const charPosX = character.getTransform().localPosition.x;
    const obsWorldPosX = obstacle.getTransform().getWorldPosition().x;
    const obsLocalPosX = obstacle.getTransform().localPosition.x;
    const obsW = obstacle.getComponent('ScreenTransform').sizeDelta.x / exports.PPU;
    const charW = character.getComponent('ScreenTransform').sizeDelta.x / exports.PPU;
    if (charPosX > obsWorldPosX) {
        levelPos.x = -(obsLocalPosX + (obsW * 0.5) + (charW * 0.3));
        level.localPosition = levelPos;
    }
    else {
        levelPos.x = -obsLocalPosX + (obsW * 0.5) + (charW * 0.3);
        level.localPosition = levelPos;
    }
}
exports.snapX = snapX;
let Game = class Game extends APJS.BasicScriptComponent {
    constructor() {
        super(...arguments);
        this.accumulator = 0;
        this.touchCallback = (event) => {
            const touchInfo = event.args[0];
            const outputTouchPhase = touchInfo.phase;
            const outputTouchId = touchInfo.touchId;
            this.lastTouchPos = touchInfo.position;
            // const isInsideReset = this.checkPointInRect(this.screenTouchToUnits(this.lastTouchPos), this.buttonResetRect)
            // if (isInsideReset && 
            // outputTouchPhase == 0) {
            //   resetPressed = true
            //   this.resetButtonId = outputTouchId
            // }
            // if (isInsideReset && 
            // outputTouchPhase == 1) {
            //   resetPressed = true
            //   this.resetButtonId = outputTouchId
            // }
            // if (!isInsideReset && 
            // resetPressed && 
            // outputTouchPhase == 1 && 
            // outputTouchId == this.resetButtonId) {
            //   resetPressed = false
            // }
            // if (resetPressed && 
            //   outputTouchPhase == 2 && 
            //   outputTouchId == this.resetButtonId) {
            //   resetPressed = false
            //   this.resetButtonId = -1
            // }
            // if (
            // outputTouchPhase == 3 && 
            // resetPressed && 
            // outputTouchId == this.resetButtonId) {
            //   resetPressed = false
            //   this.resetButtonId = -1
            // }
            const isInsideAction = this.checkPointInRect(this.screenTouchToUnits(this.lastTouchPos), this.buttonActionRect);
            if (isInsideAction &&
                outputTouchPhase == 0) {
                exports.jumpPressed = true;
                this.jumpTouchId = outputTouchId;
            }
            if (isInsideAction &&
                outputTouchPhase == 1) {
                exports.jumpPressed = true;
                this.jumpTouchId = outputTouchId;
            }
            if (!isInsideAction &&
                exports.jumpPressed && outputTouchPhase == 1 &&
                outputTouchId == this.jumpTouchId) {
                exports.jumpPressed = false;
            }
            if (exports.jumpPressed &&
                outputTouchPhase == 2 &&
                outputTouchId == this.jumpTouchId) {
                exports.jumpPressed = false;
                this.jumpTouchId = -1;
            }
            if (outputTouchPhase == 3 &&
                exports.jumpPressed &&
                outputTouchId == this.jumpTouchId) {
                exports.jumpPressed = false;
                this.jumpTouchId = -1;
            }
            const isInsideLeft = this.checkPointInRect(this.screenTouchToUnits(this.lastTouchPos), this.buttonLeftRect);
            if (isInsideLeft &&
                outputTouchPhase == 0) {
                exports.leftPressed = true;
                this.leftTouchId = outputTouchId;
            }
            if (isInsideLeft &&
                outputTouchPhase == 1) {
                exports.leftPressed = true;
                this.leftTouchId = outputTouchId;
            }
            if (!isInsideLeft &&
                exports.leftPressed &&
                outputTouchPhase == 1 &&
                outputTouchId == this.leftTouchId) {
                exports.leftPressed = false;
            }
            if (exports.leftPressed &&
                outputTouchPhase == 2 &&
                outputTouchId == this.leftTouchId) {
                exports.leftPressed = false;
                this.leftTouchId = -1;
            }
            if (outputTouchPhase == 3 &&
                exports.leftPressed &&
                outputTouchId == this.leftTouchId) {
                exports.leftPressed = false;
                this.leftTouchId = -1;
            }
            const isInsideRight = this.checkPointInRect(this.screenTouchToUnits(this.lastTouchPos), this.buttonRightRect);
            if (isInsideRight &&
                outputTouchPhase == 0) {
                exports.rightPressed = true;
                this.rightTouchId = outputTouchId;
            }
            if (isInsideRight &&
                outputTouchPhase == 1) {
                exports.rightPressed = true;
                this.rightTouchId = outputTouchId;
            }
            if (!isInsideRight &&
                exports.rightPressed &&
                outputTouchPhase == 1 &&
                outputTouchId == this.rightTouchId) {
                exports.rightPressed = false;
            }
            if (exports.rightPressed && outputTouchPhase == 2 &&
                outputTouchId == this.rightTouchId) {
                exports.rightPressed = false;
                this.rightTouchId = -1;
            }
            if (outputTouchPhase == 3 &&
                exports.rightPressed &&
                outputTouchId == this.rightTouchId) {
                exports.rightPressed = false;
                this.rightTouchId = -1;
            }
        };
    }
    screenTouchToUnits(touchPoint) {
        var x = (touchPoint.x - 0.5) * 22.5;
        var y = (touchPoint.y - 0.5) * -40;
        return [x, y];
    }
    checkPointInRect(point, rect) {
        var hx = rect[2] / 2;
        var hy = rect[3] / 2;
        return ((Math.abs(point[0] - rect[0]) <= hx) && (Math.abs(point[1] - rect[1]) <= hy));
    }
    onStart() {
        this.gameRunning = this.getSceneObject().scene.findSceneObject('gameRunning');
        this.buttonActionRect = getElementRect(this.getSceneObject().scene.findSceneObject('buttonAction'), 0);
        this.buttonLeftRect = getElementRect(this.getSceneObject().scene.findSceneObject('buttonLeft'), 0);
        this.buttonRightRect = getElementRect(this.getSceneObject().scene.findSceneObject('buttonRight'), 0);
        // this.buttonResetRect = getElementRect(this.getSceneObject().scene.findSceneObject('buttonReset'), 0)
        this.ground1 = this.getSceneObject().scene.findSceneObject('ground1');
        this.rightWall = this.getSceneObject().scene.findSceneObject('rightWall');
        this.leftWall = this.getSceneObject().scene.findSceneObject('leftWall');
        this.platform1 = this.getSceneObject().scene.findSceneObject('platform1');
        this.platform2 = this.getSceneObject().scene.findSceneObject('platform2');
        this.pan = this.getSceneObject().scene.findSceneObject('pan');
        exports.platforms = [this.ground1, this.platform1, this.platform2, this.pan];
        exports.solids = [this.ground1, this.platform1, this.platform2, this.rightWall, this.leftWall, this.pan];
        // platforms = [this.ground1]
        // solids = [this.ground1, this.rightWall, this.leftWall]
        exports.grounds = [this.ground1];
        APJS.EventManager.getGlobalEmitter().on(APJS.EventType.Touch, this.touchCallback);
        exports.conect = this.getSceneObject().scene.findSceneObject('conect');
    }
    onDisable() {
        APJS.EventManager.getGlobalEmitter().off(APJS.EventType.Touch, this.touchCallback);
    }
    onUpdate(deltaTime) {
        deltaTime = Math.min(deltaTime, 0.25);
        this.accumulator += deltaTime;
        // if (resetPressed) {
        //   gameState = 0
        //   time = 35
        //   substate = 3
        //   this.accumulator = 0
        //   isTimeRunning = false
        //   conect.name = 'conect'
        //   this.gameRunning.name = 'gameRunning'
        //   //this.onStart()
        // }
        if (deltaTime > 0.2) {
            exports.leftPressed = false;
            exports.rightPressed = false;
        }
        while (this.accumulator >= exports.fixedTime) {
            if (isTimeRunning && exports.gameState == 0) {
                exports.time -= exports.fixedTime;
                if (exports.time <= 0) {
                    setGameState(1);
                    this.gameRunning.name = 'gameover';
                }
                if (exports.time >= 27) {
                    exports.conect.name = 'time0';
                }
                else if (exports.time >= 19) {
                    exports.conect.name = 'time1';
                }
                else if (exports.time >= 11) {
                    exports.conect.name = 'time2';
                }
                else if (exports.time >= 1) {
                    exports.conect.name = 'time3';
                }
                else {
                    exports.conect.name = 'time4';
                }
            }
            this.accumulator -= exports.fixedTime;
        }
    }
};
Game = __decorate([
    component()
], Game);
exports.Game = Game;
