// Import stylesheets
import './style.css';

var canvas = <HTMLCanvasElement>document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.setAttribute('tabindex', '1');
canvas.style.outline = 'none';
canvas.focus();

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

class Util {
  static getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

class Asteroid {
  public x: number = 0;
  public y: number = 0;
  public direction: string;

  constructor(x: number, y: number, direction: string) {
    this.direction = direction;
    this.draw(x, y);
  }

  draw(x: any, y: any) {
    this.x = x;
    this.y = y;
    ctx.fillStyle = COLOR_ASTEROID;
    ctx.fillRect(x, y, ASTEROID_SIZE, ASTEROID_SIZE);
  }

  move() {
    if (this.direction == 'RIGHT') {
      this.draw(this.x + STAR_VELOCITY, this.y);
    } else {
      this.draw(this.x - STAR_VELOCITY, this.y);
    }
  }
}

class AsteroidField {
  public storage: Array<Asteroid> = [];

  constructor() {
    this.draw();
  }

  draw() {
    this.storage = [];
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      let randomY = Util.getRandomInt(canvas.height + CENTER_LINE_HEIGHT, 0);
      let randomX = Util.getRandomInt(canvas.width, 0);
      let direction = Util.getRandomInt(0, 1) ? 'LEFT' : 'RIGHT';
      let asteroid = new Asteroid(randomX, randomY, direction);
      this.storage.push(asteroid);
    }
  }

  update() {
    if (this.storage.length > 0 && this.storage.length < ASTEROID_COUNT) {
      let randomY = Util.getRandomInt(canvas.height + CENTER_LINE_HEIGHT, 0);
      let direction = Util.getRandomInt(0, 1) ? 'LEFT' : 'RIGHT';
      let x = direction == 'RIGHT' ? 0 : canvas.width;
      let asteroid = new Asteroid(x, randomY, direction);
      this.storage.push(asteroid);
    }
  }

  move() {
    for (let i = 0; i < this.storage.length; i++) {
      let asteroid: Asteroid = this.storage[i];
      asteroid.move();
      if (this.isAsteroidOutOfBounds(asteroid)) {
        this.storage.splice(i, 1);
      }
    }
  }

  isAsteroidOutOfBounds(asteroid: Asteroid) {
    return asteroid.x > canvas.width || asteroid.x < 0;
  }
}

class Ship {
  public x: number;
  public y: number;
  public spaceshipSize: number = 32;
  private spaceship =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAHFJREFUOE/FklEKgDAMQ839D91RIdJ1aUEq6JeY5nVxwdU8ZmYuA0A1VgpupjG+Z5AEKEMFOQDdNqVtAGZWuSvt+wi+ffQP/geMb6FrnYr33EK3Obcvzt6AN2bC6EEsCAuUv9Hk8Y75eDxSux5kbVzlBafciA35C1jZAAAAAElFTkSuQmCC';

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.create();
  }

  create() {
    this.y -= this.spaceshipSize;
    this.draw();
  }

  draw() {
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

  move(direction: string) {
    if (direction == 'UP') {
      this.y -= SHIP_VELOCITY;
      this.draw();
    } else {
      if (this.y + this.spaceshipSize < canvas.height) {
        this.y += SHIP_VELOCITY;
        this.draw();
      }
    }
  }
}

class Score {
  private leftScore: number = 0;
  private rightScore: number = 0;

  constructor() {
    this.display();
  }

  display() {
    let leftPosition = canvas.width / 8;
    let rightPosition = canvas.width - canvas.width / 8;
    ctx.fillStyle = COLOR_SCORE;
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

class InputController {
  private leftShip: Ship;
  private rightShip: Ship;
  private keys: Array<boolean> = [];
  constructor(leftShip: Ship, rightShip: Ship) {
    this.leftShip = leftShip;
    this.rightShip = rightShip;

    document.addEventListener(
      'keydown',
      (evt) => {
        this.keys[evt.key] = true;

        if (this.keys['ArrowUp']) {
          this.rightShip.move('UP');
        }

        if (this.keys['ArrowDown']) {
          this.rightShip.move('DOWN');
        }
        if (this.keys['w']) {
          this.leftShip.move('UP');
        }

        if (this.keys['s']) {
          this.leftShip.move('DOWN');
        }

        evt.preventDefault();
      },
      false
    );

    document.addEventListener(
      'keydown',
      (evt) => {
        this.keys[evt.key] = false;
      },
      false
    );
  }
}

class Game {
  private leftShip: Ship = new Ship(-32, -32);
  private rightShip: Ship = new Ship(-32, -32);
  private score: Score = new Score();
  private asteroidField: AsteroidField;

  constructor() {
    //Place Ships Down
    this.setupLeftShip();
    this.setupRightShip();

    //Setup Components
    let inputController = new InputController(this.leftShip, this.rightShip);

    this.asteroidField = new AsteroidField();
    requestAnimationFrame(this.gameLoop);
  }
  // Setup Ship
  setupLeftShip() {
    let leftX = canvas.width / 4;
    let leftY = canvas.height;
    this.leftShip = new Ship(leftX, leftY);
  }

  setupRightShip() {
    let rightX = canvas.width - canvas.width / 4;
    let rightY = canvas.height;
    this.rightShip = new Ship(rightX, rightY);
  }
  // Setup Game Area
  setup() {
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //dividing line
    ctx.fillStyle = COLOR_CENTER_LINE;
    ctx.fillRect(
      canvas.width / 2,
      canvas.height,
      CENTER_LINE_WIDTH,
      CENTER_LINE_HEIGHT
    );

    ctx.font = '48px Verdana';
  }

  gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // use game object because of requewstAnimationFrame
    // calling function with this scope
    game.setup();

    game.checkCollision();

    game.leftShip.draw();
    game.rightShip.draw();
    game.asteroidField.move();
    game.asteroidField.update();
    game.score.display();
    requestAnimationFrame(game.gameLoop);
  }

  checkCollision() {
    game.shipHitCeiling();
    game.asteroidHitShip();
  }

  shipHitCeiling() {
    if (game.leftShip.y < game.leftShip.spaceshipSize) {
      game.score.incrementLeft();
      game.leftShip.x = canvas.width / 4;
      game.leftShip.y = canvas.height;
      game.leftShip.create();
    }
    if (game.rightShip.y < game.rightShip.spaceshipSize) {
      game.score.incrementRight();
      game.rightShip.x = canvas.width - canvas.width / 4;
      game.rightShip.y = canvas.height;
      game.rightShip.create();
    }
  }

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
}

let game = new Game();
