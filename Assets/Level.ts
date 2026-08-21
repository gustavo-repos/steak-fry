import { leftPressed, rightPressed, move, PPU, checkRectOverlap, solids, getElementRect, snapX, fixedTime, time, resetPressed, gameState } from "Game"

@component()
export class Level extends APJS.BasicScriptComponent {
  velocityX!: number
  transform : APJS.ScreenTransform | undefined
  playerWidth!: number
  playerHeight!: number
  frameCounter = 0
  nextX!: number
  accumulator = 0
  playerObj: any

  getPlayerBodyRect () {
    var center = this.playerObj.getTransform().getWorldPosition()
    if (center) {
      return [center.x, center.y, this.playerWidth * 0.6, this.playerHeight * 0.85]
    }
  }

  onStart() {
    this.playerObj = this.getSceneObject().scene.findSceneObject('player')
    this.transform = this.playerObj.getComponent('ScreenTransform') as APJS.ScreenTransform
    this.playerWidth = this.transform.sizeDelta.x / PPU
    this.playerHeight = this.transform.sizeDelta.y / PPU
  }

  onUpdate(deltaTime: number) {
  
    if (this.frameCounter < 30) { this.frameCounter++; return }

    deltaTime = Math.min(deltaTime, 0.25)
    this.accumulator += deltaTime

    if (resetPressed) {
      this.frameCounter = 0
      this.accumulator = 0
    }
    

    while (this.accumulator >= fixedTime) {
      this.velocityX = 12 * fixedTime
      if (leftPressed && gameState == 0) {
      for (let i = 0; i < solids.length; i++) {
        if (checkRectOverlap(this.getPlayerBodyRect(), getElementRect(solids[i], this.velocityX))) {
          snapX(this.playerObj, solids[i], this.getSceneObject())
          this.velocityX = 0
          break
        }
      }
        move(this.getSceneObject(), this.velocityX, 0)
      }

      if (rightPressed && gameState == 0) {
        for (let i = 0; i < solids.length; i++) {
          if (checkRectOverlap(this.getPlayerBodyRect(), getElementRect(solids[i], -this.velocityX))) {
            snapX(this.playerObj, solids[i], this.getSceneObject())
            this.velocityX = 0
            break
          }
        }
        move(this.getSceneObject(), -this.velocityX, 0)
      }
      this.accumulator -= fixedTime
    }
  }
}