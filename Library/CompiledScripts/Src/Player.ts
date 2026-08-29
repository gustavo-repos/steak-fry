import { gravity, move, jumpPressed, checkRectOverlap, getElementRect, snapY, PPU, platforms, 
leftPressed, rightPressed, fixedTime, conect, time, substate, setSubstate,  gameState, setGameState} from "Game"

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
  saltArea: any
  fryTimer = 0
  // fryInterval = 2
  smokeScene: any
  isFrying = false
  flagText: any
  gameRunning: any
  ponto: string = '0'
  pepper: string = '0'
  tiposPonto = ['1', '2', '3']
  tiposPimenta = ['0', '1']
  comanda: any
  pontoPedido = ''
  pimentaPedido = ''
  finalMessage = ''
  flagPole: any

  onRecordStart = (_event: APJS.IEvent) => {
    this.state = 1  
    this.lastSubstate = 3
    this.previousState = 1
    this.jumpCycle = false
    this.jumpPower = 30
    this.velocityY = 0
    this.frameCounter = 0
    this.accumulator = 0
    this.smokeScene.name = 'smoke'
    this.fryTimer = 0
    this.pepper = '0'
    this.ponto = '0'
    this.flagText.name = 'flagText'
    this.saltArea.name = 'saltArea'
    this.pontoPedido = this.getRandomItem(this.tiposPonto)
    this.pimentaPedido = this.getRandomItem(this.tiposPimenta)
    this.comanda.name = this.getRandomIntInclusive(100, 400) + this.pontoPedido + this.pimentaPedido
    this.finalMessage = ''
  }

  getRandomIntInclusive(min: number, max: number) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled;
  }

  getRandomItem(el: any) {
    return el[Math.floor(Math.random() * el.length)]
  }

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

    APJS.EventManager.getGlobalEmitter().on(
      APJS.EventType.RecordStart,
      this.onRecordStart
    )

    this.playerSprite = this.getSceneObject().scene.findSceneObject('playerSprite')
    this.transform = this.getSceneObject().getComponent('ScreenTransform') as APJS.ScreenTransform
    this.width = this.transform.sizeDelta.x / PPU
    this.height = this.transform.sizeDelta.y / PPU
    this.playerX = this.getSceneObject().getTransform().getWorldPosition().x
    this.jumpSound = this.getSceneObject().scene.findSceneObject('jumpSoundOff')
    this.horizontalArea = this.getSceneObject().scene.findSceneObject('horizontalArea')
    this.saltArea = this.getSceneObject().scene.findSceneObject('saltArea')
    this.smokeScene = this.getSceneObject().scene.findSceneObject('smoke')
    this.flagText = this.getSceneObject().scene.findSceneObject('flagText')
    this.gameRunning = this.getSceneObject().scene.findSceneObject('gameRunning')
    this.comanda = this.getSceneObject().scene.findSceneObject('comanda')
    this.pontoPedido = this.getRandomItem(this.tiposPonto)
    this.pimentaPedido = this.getRandomItem(this.tiposPimenta)
    this.comanda.name = this.getRandomIntInclusive(100, 400) + this.pontoPedido + this.pimentaPedido
    this.flagPole = this.getSceneObject().scene.findSceneObject('flagPole')

  }

  onUpdate(deltaTime: number) {
    if (this.frameCounter < 30) { this.frameCounter++; return }

    deltaTime = Math.min(deltaTime, 0.25)
    this.accumulator += deltaTime

    // if (resetPressed) {
    //   this.state = 1
    //   this.lastSubstate = 3
    //   this.previousState = 1
    //   this.jumpCycle = false
    //   this.jumpPower = 30
    //   this.velocityY = 0
    //   this.frameCounter = 0
    //   this.accumulator = 0
    // }

    while (this.accumulator >= fixedTime) {
      this.substateHandle()

      this.setPlayerSprite()

      if (this.isFrying) this.fryTimer += fixedTime

      if (this.state == 1) this.velocityY += gravity * fixedTime

      if (this.velocityY < -30) this.velocityY = -30

      if (jumpPressed && this.state == 0 && !this.jumpCycle && gameState == 0) {
        this.velocityY = this.jumpPower
        this.jumpCycle = true
        this.state = 1 
        this.jumpSound.name = 'jumpSoundOn'
      }

      if (!jumpPressed && this.jumpCycle) {
        // cancelador de pulo durante o salto
        // if (this.velocityY > 0) this.velocityY = 0
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
              // console.log(this.playerPosY, this.halfPlayerSize, this.halfPlatSize)
              this.state = 1
              this.velocityY = 0
              snapY('bottom', this.getSceneObject(), platforms[i])
              break
            }
          }
        }
        move(this.getSceneObject(), 0, this.velocityY * fixedTime)
      } 

      if (gameState == 0 && this.isFrying) {
        if (this.fryTimer >= 11) {
          this.smokeScene.name = 'burnt'
          this.ponto = '4'
        } else if (this.fryTimer >= 8) {
          this.smokeScene.name = 'welldone'
          this.ponto = '3'
        } else if (this.fryTimer >= 5) {
          this.smokeScene.name = 'medium'
          this.ponto = '2'
        } else if (this.fryTimer >= 2) {
          this.smokeScene.name = 'rare'
          this.ponto = '1'
        }
      }
      
      if (checkRectOverlap(this.getPlayerCoreRect(this.getSceneObject().getTransform().localPosition.y), getElementRect(this.horizontalArea, 0))) {
        this.horizontalArea.name = 'horizontal'
        if (this.state == 0) this.isFrying = true
      } else {
        this.horizontalArea.name = 'fora'
        this.isFrying = false
        this.smokeScene.name = 'smoke'
      }

      if (checkRectOverlap(this.getPlayerCoreRect(this.getSceneObject().getTransform().localPosition.y), getElementRect(this.saltArea, 0))) {
        this.saltArea.name = 'salted'
        this.pepper = '1'
      }

      if (checkRectOverlap(this.getPlayerCoreRect(this.getSceneObject().getTransform().localPosition.y), getElementRect(this.flagPole, 0))
      && gameState == 0) {
        console.log("=== FINAL DO JOGO ===")
        setGameState(1)
        this.gameRunning.name = 'gameover'
        // console.log('Ponto entregue: ' + this.ponto)
        // console.log('Pimenta entregue: ' + this.pepper)
        // console.log('Ponto pedido: ' + this.pontoPedido)
        // console.log('Pimenta pedido: ' + this.pimentaPedido)
        // this.flagPole.name = this.ponto + "," +this.pepper

        if (this.ponto == this.pontoPedido && this.pepper == this.pimentaPedido) {
          this.finalMessage = 'Perfeito!!!'
        } else {
          if (this.ponto == '0') {
            this.finalMessage += 'Ficou cru!'
          } else if (this.ponto == '4') {
            this.finalMessage += 'Queimou!'
          } else if (this.ponto != this.pontoPedido) {
            this.finalMessage += 'Errou o tempo!'
          }
          if (this.pepper != this.pimentaPedido) {
            if (this.finalMessage != '') {
              this.finalMessage += '\n'
            }
            if (this.pepper == '0') {
              this.finalMessage += 'Era com pimenta!'
            } else {
              this.finalMessage += 'Era sem pimenta!'
            }
          }
        }

        console.log(this.finalMessage)
        this.flagText.name = this.finalMessage

      }


      this.accumulator -= fixedTime
    }
  }
}
