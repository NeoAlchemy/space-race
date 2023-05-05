// Import stylesheets
import './style.css';

/* -------------------------------------------------------------------------- */
/*                                MINI FRAMEWORK.                             */
/* -------------------------------------------------------------------------- */

// boiler plate setup the canvas for the game
var canvas = <HTMLCanvasElement>document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.setAttribute('tabindex', '1');
canvas.style.outline = 'none';
canvas.focus();

// utility functions to use everywhere
class Util {
  static getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

// Input Controller to use everywhere
class InputController {
  public x: number;
  public y: number;

  constructor() {}

  update(gameObject: GameObject) {}
}

class GameObject {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  private inputController: InputController;

  constructor(inputController?) {
    this.inputController = inputController;
  }

  update() {
    this.inputController?.update(this);
  }

  render() {}
}

class Physics {
  private gameObjectCollisionRegister: Array<any> = [];
  private wallCollisionRegister: Array<any> = [];
  private objectA: GameObject;
  private objectB: GameObject;

  constructor() {}

  onCollide(
    objectA: GameObject,
    objectB: GameObject,
    callback: Function,
    scope: any
  ) {
    if (objectA && objectB) {
      this.gameObjectCollisionRegister.push({
        objectA: objectA,
        objectB: objectB,
        callback: callback,
        scope: scope,
      });
    }
  }

  onCollideWalls(objectA: GameObject, callback: Function, scope: any) {
    if (objectA) {
      this.wallCollisionRegister.push({
        objectA: objectA,
        callback: callback,
        scope: scope,
      });
    }
  }

  update() {
    for (let collisionEntry of this.gameObjectCollisionRegister) {
      if (
        collisionEntry.objectA.x > 0 &&
        collisionEntry.objectA.x < canvas.width &&
        collisionEntry.objectA.y > 0 &&
        collisionEntry.objectA.y < canvas.height &&
        collisionEntry.objectB.x > 0 &&
        collisionEntry.objectB.x < canvas.width &&
        collisionEntry.objectB.y > 0 &&
        collisionEntry.objectB.y < canvas.height &&
        collisionEntry.objectA.x >= collisionEntry.objectB.x &&
        collisionEntry.objectA.x <=
          collisionEntry.objectB.x + collisionEntry.objectB.width &&
        collisionEntry.objectA.y >= collisionEntry.objectB.y &&
        collisionEntry.objectA.y <=
          collisionEntry.objectB.y + collisionEntry.objectB.height
      ) {
        collisionEntry.callback.bind(collisionEntry.scope).apply();
      }
    }
    for (let wallCollisionEntry of this.wallCollisionRegister) {
      if (
        wallCollisionEntry.objectA.y < 0 ||
        wallCollisionEntry.objectA.y > canvas.height ||
        wallCollisionEntry.objectA.x < 0 ||
        wallCollisionEntry.objectA.x > canvas.width
      ) {
        wallCollisionEntry.callback.bind(wallCollisionEntry.scope).apply();
      }
    }
  }
}

class Scene {
  public children: Array<any>;
  public physics: Physics;

  constructor() {
    this.children = [];
    this.physics = new Physics();
  }

  add(gameObject: GameObject) {
    this.children.push(gameObject);
  }

  create() {}

  update() {
    for (let gameObject of this.children) {
      gameObject.update();
    }
    this.physics.update();
  }

  render() {
    // update the game background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let gameObject of this.children) {
      gameObject.render();
    }
  }
}

class Game {
  private scene: Scene;
  private id: number;

  constructor(scene: Scene) {
    this.scene = scene;
    this.scene.create();
    //Setup Components
    this.id = requestAnimationFrame(this.gameLoop);
  }

  gameLoop(timestamp) {
    // WARNING: This pattern is not using Times Step and as such
    // Entities must be kept low, when needing multiple entities, scenes,
    // or other components it's recommended to move to a Game Framework

    // game lifecycle events
    game.scene.update();
    game.scene.render();

    // call next frame
    cancelAnimationFrame(game.id);
    game.id = requestAnimationFrame(game.gameLoop);
  }
}

/* -------------------------------------------------------------------------- */
/*                               GAME SPECIFIC CODE                           */
/* -------------------------------------------------------------------------- */

/* ------------------------------ GAME MECHANICS ---------------------------- */

const ASTEROID_SIZE = 5;
const ASTEROID_COUNT = 25;
const SHIP_VELOCITY = 8;
const STAR_VELOCITY = 1;
const CENTER_LINE_HEIGHT = -150;
const CENTER_LINE_WIDTH = 10;
const COLOR_CENTER_LINE = '#FFF';
const COLOR_BACKGROUND = '#000';
const COLOR_SCORE = '#FFF';
const COLOR_ASTEROID = '#FFF';

/* --------------------------------- ENTITIES ------------------------------- */

class Asteroid extends GameObject {
  public direction: string;

  constructor(direction: string) {
    super();
    this.width = ASTEROID_SIZE;
    this.height = ASTEROID_SIZE;
    this.direction = direction;
    if (this.direction == 'RIGHT') {
      this.x = canvas.width - this.width;
    } else {
      this.x = 0;
    }
  }

  update() {
    super.update();

    if (this.direction == 'RIGHT') {
      this.x = this.x - STAR_VELOCITY;
    } else {
      this.x = this.x + STAR_VELOCITY;
    }
  }

  render() {
    super.render();
    ctx.fillStyle = COLOR_ASTEROID;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class AsteroidField extends GameObject {
  public storage: Array<Asteroid> = [];

  constructor() {
    super();
    while (this.storage.length < ASTEROID_COUNT) {
      let randomY = Util.getRandomInt(canvas.height + CENTER_LINE_HEIGHT, 0);
      let randomX = Util.getRandomInt(0, canvas.width);
      let direction = Util.getRandomInt(0, 1) ? 'LEFT' : 'RIGHT';
      let asteroid = new Asteroid(direction);
      asteroid.y = randomY;
      asteroid.x = randomX;
      this.storage.push(asteroid);
    }
  }

  update() {
    super.update();
    if (this.storage.length < ASTEROID_COUNT) {
      let randomY = Util.getRandomInt(canvas.height + CENTER_LINE_HEIGHT, 0);
      let randomX = Util.getRandomInt(0, canvas.width);
      let direction = Util.getRandomInt(0, 1) ? 'LEFT' : 'RIGHT';
      let asteroid = new Asteroid(direction);
      asteroid.y = randomY;
      asteroid.x = direction == 'LEFT' ? 0 : canvas.width;
      this.storage.push(asteroid);
    }
    for (let i = 0; i < this.storage.length; i++) {
      let asteroid: Asteroid = this.storage[i];
      asteroid.update();
      if (this.isAsteroidOutOfBounds(asteroid)) {
        this.storage.splice(i, 1);
      }
    }
  }

  render() {
    super.render();

    for (let i = 0; i < this.storage.length; i++) {
      let asteroid: Asteroid = this.storage[i];
      asteroid.render();
    }
  }

  isAsteroidOutOfBounds(asteroid: Asteroid) {
    return asteroid.x > canvas.width || asteroid.x < 0;
  }
}

class Ship extends GameObject {
  public spaceshipSize: number = 32;
  private spaceship =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAHFJREFUOE/FklEKgDAMQ839D91RIdJ1aUEq6JeY5nVxwdU8ZmYuA0A1VgpupjG+Z5AEKEMFOQDdNqVtAGZWuSvt+wi+ffQP/geMb6FrnYr33EK3Obcvzt6AN2bC6EEsCAuUv9Hk8Y75eDxSux5kbVzlBafciA35C1jZAAAAAElFTkSuQmCC';

  constructor(_position) {
    if (_position == 'LEFT') {
      super(new LeftShipInputController());
      this.x = canvas.width / 4;
      this.y = canvas.height - this.spaceshipSize;
    } else {
      super(new RightShipInputController());
      this.x = canvas.width - canvas.width / 4;
      this.y = canvas.height - this.spaceshipSize;
    }
    this.width = this.spaceshipSize;
    this.height = this.spaceshipSize;
  }

  update() {
    super.update();
  }

  render() {
    super.render();

    let myImage = new Image();
    myImage.src = this.spaceship;
    ctx.drawImage(
      myImage,
      this.x,
      this.y,
      this.spaceshipSize,
      this.spaceshipSize
    );
  }
}

class Score extends GameObject {
  private leftScore: number = 0;
  private rightScore: number = 0;

  constructor() {
    super();
  }

  update() {
    super.update();
  }

  render() {
    super.render();

    let leftPosition = canvas.width / 8;
    let rightPosition = canvas.width - canvas.width / 8;
    ctx.fillStyle = COLOR_SCORE;
    ctx.font = '48px Verdana';
    ctx.fillText(String(this.leftScore), leftPosition, canvas.height);
    ctx.fillText(String(this.rightScore), rightPosition, canvas.height);
  }

  incrementLeft() {
    this.leftScore += 1;
  }

  incrementRight() {
    this.rightScore += 1;
  }
}

/* ------------------------------- InputController  ----------------------------- */

class RightShipInputController extends InputController {
  private direction: string;

  private keys: Array<boolean> = [];
  constructor() {
    super();

    document.addEventListener(
      'keydown',
      (evt) => {
        if (evt.key == 'ArrowUp') {
          this.direction = 'UP';
        }

        if (evt.key == 'ArrowDown') {
          this.direction = 'DOWN';
        }

        evt.preventDefault();
      },
      false
    );
  }

  update(gameObject: GameObject) {
    if (this.direction == 'UP') {
      gameObject.y -= SHIP_VELOCITY;
    } else if (this.direction == 'DOWN') {
      if (gameObject.y + gameObject.height < canvas.height) {
        gameObject.y += SHIP_VELOCITY;
      }
    }
    this.direction = null;
  }
}

class LeftShipInputController extends InputController {
  private direction: string;

  private keys: Array<boolean> = [];
  constructor() {
    super();

    document.addEventListener(
      'keydown',
      (evt) => {
        if (evt.key == 'w') {
          this.direction = 'UP';
        }

        if (evt.key == 's') {
          this.direction = 'DOWN';
        }

        evt.preventDefault();
      },
      false
    );
  }

  update(gameObject: GameObject) {
    if (this.direction == 'UP') {
      gameObject.y -= SHIP_VELOCITY;
    } else if (this.direction == 'DOWN') {
      if (gameObject.y + gameObject.height < canvas.height) {
        gameObject.y += SHIP_VELOCITY;
      }
    }
    this.direction = null;
  }
}

/* --------------------------------- SCENE ------------------------------- */
class MainLevel extends Scene {
  private leftShip: Ship;
  private rightShip: Ship;
  private score: Score;
  private asteroidField: AsteroidField;

  constructor() {
    super();
  }

  create() {
    this.leftShip = new Ship('LEFT');
    this.add(this.leftShip);

    this.rightShip = new Ship('RIGHT');
    this.add(this.rightShip);

    this.score = new Score();
    this.add(this.score);

    this.asteroidField = new AsteroidField();
    this.add(this.asteroidField);

    this.physics.onCollideWalls(this.leftShip, this.leftShipHitCeiling, this);
    this.physics.onCollideWalls(this.rightShip, this.rightShipHitCeiling, this);
  }

  update() {
    super.update();
  }

  render() {
    super.render();

    ctx.fillStyle = COLOR_CENTER_LINE;
    ctx.fillRect(
      canvas.width / 2,
      canvas.height,
      CENTER_LINE_WIDTH,
      CENTER_LINE_HEIGHT
    );
  }

  leftShipHitCeiling() {
    this.score.incrementLeft();
    this.leftShip.x = canvas.width / 4;
    this.leftShip.y = canvas.height - this.leftShip.height;
  }

  rightShipHitCeiling() {
    this.score.incrementRight();
    this.rightShip.x = canvas.width - canvas.width / 4;
    this.rightShip.y = canvas.height - this.rightShip.height;
  }
}

/*
asteroidHitShip() {
  for (let k = 0; k < game.asteroidField.storage.length; k++) {
    let asteroid = game.asteroidField.storage[k];
    if (
      game.rightShip.x != 0 &&
      game.rightShip.y != 0 &&
      asteroid.x >= game.rightShip.x &&
      asteroid.x <= game.rightShip.x + game.rightShip.spaceshipSize &&
      asteroid.y >= game.rightShip.y &&
      asteroid.y <= game.rightShip.y + game.rightShip.spaceshipSize
    ) {
      game.asteroidField.storage.splice(k, 1);
      game.rightShip.x = canvas.width - canvas.width / 4;
      game.rightShip.y = canvas.height;
      game.rightShip.create();
    }
    if (
      game.leftShip.x != 0 &&
      game.leftShip.y != 0 &&
      asteroid.x >= game.leftShip.x &&
      asteroid.x <= game.leftShip.x + game.leftShip.spaceshipSize &&
      asteroid.y >= game.leftShip.y &&
      asteroid.y <= game.leftShip.y + game.leftShip.spaceshipSize
    ) {
      game.asteroidField.storage.splice(k, 1);
      game.leftShip.x = canvas.width / 4;
      game.leftShip.y = canvas.height;
      game.leftShip.create();
    }
  }
}
*/

/* -------------------------------------------------------------------------- */
/*                                RUN GAME.                                   */
/* -------------------------------------------------------------------------- */
let mainLevel = new MainLevel();
let game = new Game(mainLevel);
