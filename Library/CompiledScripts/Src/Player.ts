import { gravity, move, jumpPressed, checkRectOverlap, getElementRect, snapY, PPU, platforms, 
leftPressed, rightPressed, fixedTime, conect, time, substate, setSubstate, 
resetPressed,
gameState} from "Game"

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

@component()
export class Player extends APJS.BasicScriptComponent {
  state = 1
  //substate = 3
  lastSubstate = 3
  previousState = 1
  jumpCycle = false
  jumpPower = 30
  velocityY = 0
  transform : APJS.ScreenTransform | undefined
  width!: number
  height!: number
  nextY!: number
  frameCounter = 0
  landedIn: any = null
  leftLimit!: number
  rightLimit!: number
  playerX: any
  playerSprite: any
  accumulator = 0
  jumpSound: any
  playerPosY: any
  platPosY: any
  halfPlayerSize: any
  halfPlatSize: any
  horizontalArea: any

  getPlayerRect() {
    var center = this.playerObj.getTransform().getWorldPosition()
    if (center) {
      return [center.x, center.y, this.playerWidth * 0.75, this.playerHeight]
    }
  }

  getPlayerCoreRect (nextValue: number) {
    var centerX = this.getSceneObject().getTransform().getWorldPosition().x
    var centerY = nextValue
    return [centerX, centerY, this.width * 0.55, this.height * 0.9]
  }

  substateHandle () {
    
    if (substate != 4) {
      if (this.state == 0) {
        if (leftPressed || rightPressed) {
          if (gameState == 0) setSubstate(1)
        } else {
          setSubstate(0)
        }
      } else {
        if (this.velocityY >= 0) { setSubstate(2) } else { setSubstate(3) }
      }
    }

    if (gameState == 0) {
      if (leftPressed) {
        this.playerSprite.getComponent('Image').flipX = true
      } else if (rightPressed) {
        this.playerSprite.getComponent('Image').flipX = false
      }
    }
  }

  setPlayerSprite () {
    if (substate == this.lastSubstate) return

    switch (substate) {
      case 0:
        this.playerSprite.name = 'idle'
        break
      case 1:
        this.playerSprite.name = 'walk'
        break
      case 2:
        this.playerSprite.name = 'jump'
        break
      case 3:
        this.playerSprite.name = 'fall'
        break
      case 4:
        this.playerSprite.name = 'attacking'
        break
    }

    this.lastSubstate = substate
}

  onStart() {
    this.playerSprite = this.getSceneObject().scene.findSceneObject('playerSprite')
    this.transform = this.getSceneObject().getComponent('ScreenTransform') as APJS.ScreenTransform
    this.width = this.transform.sizeDelta.x / PPU
    this.height = this.transform.sizeDelta.y / PPU
    this.playerX = this.getSceneObject().getTransform().getWorldPosition().x
    this.jumpSound = this.getSceneObject().scene.findSceneObject('jumpSoundOff')
    this.horizontalArea = this.getSceneObject().scene.findSceneObject('horizontalArea')
  }

  onUpdate(deltaTime: number) {
    if (this.frameCounter < 30) { this.frameCounter++; return }

    deltaTime = Math.min(deltaTime, 0.25)
    this.accumulator += deltaTime

    if (resetPressed) {
      this.state = 1
      this.lastSubstate = 3
      this.previousState = 1
      this.jumpCycle = false
      this.jumpPower = 30
      this.velocityY = 0
      this.frameCounter = 0
      this.accumulator = 0
    }

    while (this.accumulator >= fixedTime) {
      this.substateHandle()

      this.setPlayerSprite()

      if (this.state == 1) this.velocityY += gravity * fixedTime

      if (this.velocityY < -30) this.velocityY = -30

      if (jumpPressed && this.state == 0 && !this.jumpCycle && gameState == 0) {
        this.velocityY = this.jumpPower
        this.jumpCycle = true
        this.state = 1 
        this.jumpSound.name = 'jumpSoundOn'
      }

      if (!jumpPressed && this.jumpCycle) {
        if (this.velocityY > 0) this.velocityY = 0
        if (this.state == 0) this.jumpCycle = false
        this.jumpSound.name = 'jumpSoundOff'
      }

      if (this.state == 0) {
        this.leftLimit = getElementRect(this.landedIn, 0)[0] - (getElementRect(this.landedIn, 0)[2] / 2) - (this.width * 0.3)
        this.rightLimit = getElementRect(this.landedIn, 0)[0] + (getElementRect(this.landedIn, 0)[2] / 2) + (this.width * 0.3)
        if (this.playerX < this.leftLimit || this.playerX > this.rightLimit) {
          this.state = 1
        }
      }

      this.nextY = this.getSceneObject().getTransform().localPosition.y + (this.velocityY * fixedTime)
      if (this.state == 1) {
        for (let i = 0; i < platforms.length; i++) {
          if (checkRectOverlap(this.getPlayerCoreRect(this.nextY), getElementRect(platforms[i], 0))) {
            if (this.velocityY < 0) {
              this.state = 0
              this.velocityY = 0
              snapY('top', this.getSceneObject(), platforms[i])
              this.landedIn = platforms[i]
              break
            }
            if (this.velocityY > 0) {
              console.log(this.playerPosY, this.halfPlayerSize, this.halfPlatSize)
              this.state = 1
              this.velocityY = 0
              snapY('bottom', this.getSceneObject(), platforms[i])
              break
            }
          }
        }
        move(this.getSceneObject(), 0, this.velocityY * fixedTime)
      } 

      if (checkRectOverlap(this.getPlayerCoreRect(this.getSceneObject().getTransform().localPosition.y), getElementRect(this.horizontalArea, 0))) {


        this.horizontalArea.name = 'horizontal'

      } else {
        this.horizontalArea.name = 'fora'
      }

      this.accumulator -= fixedTime
    }
  }
}
