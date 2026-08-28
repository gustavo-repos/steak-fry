/* 
gameState
0 running
1 gameover
2 win
*/

export var gameState = 0
export const gravity = -65
export const PPU = 32
export var jumpPressed = false  
export var leftPressed = false
export var rightPressed = false
// export var resetPressed = false
export var platforms: any
export var solids: any
export var grounds: any
export const fixedTime = 0.02
export var conect: any
var isTimeRunning = false
export var time = 35
export var substate = 3

export function setGameState (x: number) {
  gameState = x
}

export function setSubstate (x: number) {
  substate = x
}

export function startTimer() {
  if (!isTimeRunning) isTimeRunning = true
}

export function addTime(x: number) {
  time += x
}

export function move (el: any, dx: number, dy: number) {
  var pos = el.getTransform().localPosition
  pos.x += dx
  pos.y += dy
  el.getTransform().localPosition = pos
}

export function teleport (el: any, x: number, y: number) {
  var pos = el.getTransform().localPosition
  pos.x = x
  pos.y = y
  el.getTransform().localPosition = pos
}

export function getElementRect (el: any, dx: number) {
  var centerX = el.getTransform().getWorldPosition().x + dx
  var centerY = el.getTransform().getWorldPosition().y
  var width = el.getComponent('ScreenTransform').sizeDelta.x / PPU
  var height = el.getComponent('ScreenTransform').sizeDelta.y / PPU
  return [centerX, centerY, width, height]
}

export function checkRectOverlap (rect1: any, rect2: any) {
  var mxA = rect1[2] / 2 
  var myA = rect1[3] / 2
  var mxB = rect2[2] / 2
  var myB = rect2[3] / 2
  return (Math.abs(rect1[0] - rect2[0]) < (mxA + mxB) && Math.abs(rect1[1] - rect2[1]) < (myA + myB))
}

export function snapY (mode: string, character: any, obstacle: any) {
  const char = character.getTransform()
  const charPos = char.localPosition
  const obsY = obstacle.getTransform().localPosition.y
  const obsH = obstacle.getComponent('ScreenTransform').sizeDelta.y / PPU
  const charH = character.getComponent('ScreenTransform').sizeDelta.y / PPU
  if (mode == 'top') {
    charPos.y = (obsY + (obsH * 0.5) + (charH * 0.5)) - (2 / 32)
    char.localPosition = charPos
  }
  if (mode == 'bottom') {
    charPos.y = (obsY - (obsH * 0.5) - (charH * 0.5))
    char.localPosition = charPos
  }
}

export function snapX (character: any, obstacle: any, world: any) {
  const level = world.getTransform()
  const levelPos = level.localPosition
  const charPosX = character.getTransform().localPosition.x
  const obsWorldPosX = obstacle.getTransform().getWorldPosition().x
  const obsLocalPosX = obstacle.getTransform().localPosition.x
  const obsW = obstacle.getComponent('ScreenTransform').sizeDelta.x / PPU
  const charW = character.getComponent('ScreenTransform').sizeDelta.x / PPU
  if (charPosX > obsWorldPosX) {
    levelPos.x = -(obsLocalPosX + (obsW * 0.5) + (charW * 0.3))
    level.localPosition = levelPos
  } else {
    levelPos.x = -obsLocalPosX + (obsW * 0.5) + (charW * 0.3)
    level.localPosition = levelPos
  }
}

@component()
export class Game extends APJS.BasicScriptComponent {

  gameRunning: any
  accumulator = 0
  lastTouchPos?: { x: number, y: number }
  buttonActionRect: any  
  buttonLeftRect: any
  buttonRightRect: any
  // buttonResetRect: any
  ground1: any
  // tabletop: any
  rightWall: any
  leftWall: any
  jumpTouchId: any
  leftTouchId: any
  rightTouchId: any
  // resetButtonId: any
  // sofaSeat: any
  platform1: any
  platform2: any
  pan: any

  onRecordStart = (_event: APJS.IEvent) => {
      gameState = 0
      substate = 3
      this.accumulator = 0
      conect.name = 'conect'
      this.gameRunning.name = 'gameRunning'
      console.log('reset game')
  }

  screenTouchToUnits (touchPoint: any) {
    var x = (touchPoint.x - 0.5) * 22.5
    var y = (touchPoint.y - 0.5) * -40
    return [x, y]
  }

  checkPointInRect (point: any, rect: any) {
    var hx = rect[2] / 2
    var hy = rect[3] / 2
    return ((Math.abs(point[0] - rect[0]) <= hx) && (Math.abs(point[1] - rect[1]) <= hy))
  }

  touchCallback = (event:APJS.IEvent) => {
    const touchInfo = event.args[0] as APJS.TouchData
    const outputTouchPhase = touchInfo.phase
    const outputTouchId = touchInfo.touchId
    this.lastTouchPos = touchInfo.position

    const isInsideAction = this.checkPointInRect(this.screenTouchToUnits(this.lastTouchPos), this.buttonActionRect)
    if (isInsideAction && 
    outputTouchPhase == 0) {
      jumpPressed = true
      this.jumpTouchId = outputTouchId
    }
    if (isInsideAction && 
    outputTouchPhase == 1) {
      jumpPressed = true
      this.jumpTouchId = outputTouchId
    }
    if (!isInsideAction && 
    jumpPressed && outputTouchPhase == 1 && 
    outputTouchId == this.jumpTouchId) {
      jumpPressed = false
    }
    if (jumpPressed && 
      outputTouchPhase == 2 && 
      outputTouchId == this.jumpTouchId) {
      jumpPressed = false
      this.jumpTouchId = -1
    }
    if (
    outputTouchPhase == 3 && 
    jumpPressed && 
    outputTouchId == this.jumpTouchId) {
      jumpPressed = false
      this.jumpTouchId = -1
    }

    const isInsideLeft = this.checkPointInRect(this.screenTouchToUnits(this.lastTouchPos), this.buttonLeftRect)
    if (isInsideLeft && 
    outputTouchPhase == 0) {
      leftPressed = true
      this.leftTouchId = outputTouchId
    }
    if (isInsideLeft && 
    outputTouchPhase == 1) {
      leftPressed = true
      this.leftTouchId = outputTouchId
    }
    if (!isInsideLeft && 
    leftPressed && 
    outputTouchPhase == 1 && 
    outputTouchId == this.leftTouchId) {
      leftPressed = false
    }
    if (leftPressed && 
      outputTouchPhase == 2 && 
      outputTouchId == this.leftTouchId) {
      leftPressed = false
      this.leftTouchId = -1
    }
    if (
    outputTouchPhase == 3 && 
    leftPressed && 
    outputTouchId == this.leftTouchId) {
      leftPressed = false
      this.leftTouchId = -1
    }

    const isInsideRight = this.checkPointInRect(this.screenTouchToUnits(this.lastTouchPos), this.buttonRightRect)
    if (isInsideRight && 
    outputTouchPhase == 0) {
      rightPressed = true
      this.rightTouchId = outputTouchId
    }
    if (isInsideRight && 
    outputTouchPhase == 1) {
      rightPressed = true
      this.rightTouchId = outputTouchId
    }
    if (!isInsideRight && 
    rightPressed && 
    outputTouchPhase == 1 && 
    outputTouchId == this.rightTouchId) {
      rightPressed = false
    }
    if (rightPressed && outputTouchPhase == 2 && 
      outputTouchId == this.rightTouchId) {
      rightPressed = false
      this.rightTouchId = -1
    }
    if (
    outputTouchPhase == 3 && 
    rightPressed && 
    outputTouchId == this.rightTouchId) {
      rightPressed = false
      this.rightTouchId = -1
    }
  }

  onStart() {
    this.gameRunning = this.getSceneObject().scene.findSceneObject('gameRunning')
    this.buttonActionRect = getElementRect(this.getSceneObject().scene.findSceneObject('buttonAction'), 0)
    this.buttonLeftRect = getElementRect(this.getSceneObject().scene.findSceneObject('buttonLeft'), 0)
    this.buttonRightRect = getElementRect(this.getSceneObject().scene.findSceneObject('buttonRight'), 0)
    // this.buttonResetRect = getElementRect(this.getSceneObject().scene.findSceneObject('buttonReset'), 0)
    this.ground1 = this.getSceneObject().scene.findSceneObject('ground1')
    this.rightWall = this.getSceneObject().scene.findSceneObject('rightWall')
    this.leftWall = this.getSceneObject().scene.findSceneObject('leftWall')
    this.platform1 = this.getSceneObject().scene.findSceneObject('platform1')
    this.platform2 = this.getSceneObject().scene.findSceneObject('platform2')
    this.pan = this.getSceneObject().scene.findSceneObject('pan')
    platforms = [this.ground1, this.platform1, this.platform2, this.pan]
    solids = [this.ground1, this.platform1, this.platform2, this.rightWall, this.leftWall, this.pan]
    // platforms = [this.ground1]
    // solids = [this.ground1, this.rightWall, this.leftWall]
    grounds = [this.ground1]
    APJS.EventManager.getGlobalEmitter().on(APJS.EventType.Touch, this.touchCallback)
    conect = this.getSceneObject().scene.findSceneObject('conect')

    APJS.EventManager.getGlobalEmitter().on(
        APJS.EventType.RecordStart,
        this.onRecordStart
    )

  }
  
  onDisable() {
    APJS.EventManager.getGlobalEmitter().off(APJS.EventType.Touch, this.touchCallback)
  }

  onUpdate(deltaTime: number) {

    deltaTime = Math.min(deltaTime, 0.25)
    this.accumulator += deltaTime

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
      leftPressed = false
      rightPressed = false
    }

    // while (this.accumulator >= fixedTime) {

    //   this.accumulator -= fixedTime
    // }

  }
}
