import { fixedTime, teleport, PPU, checkRectOverlap, getElementRect, conect, 
startTimer, addTime, setSubstate, substate, resetPressed, time, setGameState, gameState } from "Game"

@component()
export class Enemy extends APJS.BasicScriptComponent {

  gameRunning: any
  accumulator = 0
  spawnTimer = 0
  spawnInterval = 3
  playerAttackingTimer = 0
  playerAttackingInterval = 0.4
  spawnSpots = [[117 / PPU, 114 / PPU], [396 / PPU, 114 / PPU], [-396 / PPU, 114 / PPU], [-117 / PPU, 114 / PPU], [-256 / PPU, 343 / PPU], [256 / PPU, 343 / PPU]]
  //spawnSpots = [[117 / PPU, 114 / PPU], [396 / PPU, 114 / PPU]]

  currentSpot: any
  transform: any
  playerObj: any
  playerWidth: any
  playerHeight: any
  enemyWasHit = false
  points = 0
  enemyScene: any
  scenePoints: any

  getPlayerRect() {
    var center = this.playerObj.getTransform().getWorldPosition()
    if (center) {
      return [center.x, center.y, this.playerWidth * 0.75, this.playerHeight]
    }
  }

  getRandomItem(el: any) {
    return el[Math.floor(Math.random() * el.length)]
  }

  setCurrentSpot(el: any) {
    var newSpot = this.getRandomItem(el)
    if (newSpot != this.currentSpot) {
      this.currentSpot = newSpot
    } else {
      this.setCurrentSpot(el)
    }
  }

  onStart() {
    this.gameRunning = this.getSceneObject().scene.findSceneObject('gameRunning')
    this.playerObj = this.getSceneObject().scene.findSceneObject('player')
    this.transform = this.playerObj.getComponent('ScreenTransform') as APJS.ScreenTransform
    this.playerWidth = this.transform.sizeDelta.x / PPU
    this.playerHeight = this.transform.sizeDelta.y / PPU
    this.enemyScene = this.getSceneObject().scene.findSceneObject('enemy')
    this.scenePoints = this.getSceneObject().scene.findSceneObject('points')
  }

  onUpdate(deltaTime: number) {

    deltaTime = Math.min(deltaTime, 0.25)
    this.accumulator += deltaTime

    if (resetPressed) {
      this.accumulator = 0
      this.spawnTimer = 0
      this.spawnInterval = 3
      this.playerAttackingTimer = 0
      this.playerAttackingInterval = 0.4
      this.enemyWasHit = false
      this.points = 0
      this.scenePoints.name = 'points'
      this.gameRunning.name = 'gameRunning'
      this.enemyScene.name = 'enemy'
    }
    

    while (this.accumulator >= fixedTime) {

      this.spawnTimer += fixedTime

      if (substate == 4)  this.playerAttackingTimer += fixedTime

      if (this.playerAttackingTimer >= this.playerAttackingInterval) {
        setSubstate(3)
        this.playerAttackingTimer = 0
      }

      if (!this.enemyWasHit) {
        this.enemyScene.name = 'enemy'
      }

      if (!this.enemyWasHit && checkRectOverlap(this.getPlayerRect(), getElementRect(this.getSceneObject(), 0))) {
        startTimer()
        setSubstate(4)
        this.points++ 
        if (this.points == 3) {
          this.scenePoints.name = 'energybar1'
          // setGameState(2)
          // this.gameRunning.name = 'win'
          // this.enemyScene.name = 'enemy'
        } else if (this.points == 6) {
          this.scenePoints.name = 'energybar2'
        } else if (this.points == 9) {
          this.scenePoints.name = 'energybar3'
          addTime(15)
        } else if (this.points == 12) {
          this.scenePoints.name = 'energybar4'
          addTime(10)
        } else if (this.points == 15) {
          this.scenePoints.name = 'energybar5'
        } else if (this.points == 18) {
          this.scenePoints.name = 'energybar6'
          setGameState(2)
          this.enemyScene.name = 'enemy'
          this.gameRunning.name = 'win'
          // KO!
        }
        this.enemyScene.name = 'hit'
        this.enemyWasHit = true
        this.spawnTimer = 1
        this.spawnInterval = 3
      } 

      if (this.spawnTimer >= this.spawnInterval && gameState == 0) {
        this.setCurrentSpot(this.spawnSpots)
        teleport(this.getSceneObject(), this.currentSpot[0], this.currentSpot[1])
        this.spawnTimer = 0
        this.enemyScene.name = 'respawn'
        this.enemyWasHit = false

        if (this.points == 4) {
          this.spawnInterval = 2.5
        } else if (this.points == 8) {
          this.spawnInterval = 2.0
        } else if (this.points == 12) {
          this.spawnInterval = 1.6
        } else if (this.points == 25) {
        }
      }
  
      this.accumulator -= fixedTime
    }

  }
}
