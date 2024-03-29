/* -------------------------------------------------------------------------- */
/*                                MINI FRAMEWORK.                             */
/* -------------------------------------------------------------------------- */

// boiler plate setup the canvas for the game
export const canvas = <HTMLCanvasElement>document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
canvas.setAttribute('tabindex', '1');
canvas.style.outline = 'none';
canvas.focus();
const COLOR_BACKGROUND: string = '#000';

// utility functions to use everywhere
export class Util {
  static getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

// Input Controller to use everywhere
export class InputController {
  public x: number;
  public y: number;

  constructor() {}

  update(gameObject: GameObject) {}
}

export class GameObject {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public command: string;

  private inputController: InputController;

  constructor(inputController?) {
    this.inputController = inputController;
  }

  update() {
    this.inputController?.update(this);
  }

  render() {}
}

export class Group {
  public x: number;
  public y: number;
  public children: Array<GameObject>;

  constructor() {
    this.children = [];
  }

  update() {
    for (let gameObject of this.children) {
      if (gameObject) gameObject.update();
    }
  }

  render() {
    for (let gameObject of this.children) {
      if (gameObject) gameObject.render();
    }
  }
}

export class Physics {
  private gameObjectCollisionRegister: Array<any> = [];
  private wallCollisionRegister: Array<any> = [];
  private objectA: GameObject;
  private objectB: GameObject;

  constructor() {}

  onCollide(
    objectA: GameObject,
    objectB: Group,
    callback: Function,
    scope: any
  ): void;
  onCollide(
    objectA: GameObject,
    objectB: GameObject,
    callback: Function,
    scope: any
  ): void;
  onCollide(
    objectA: GameObject,
    objectB: GameObject | Group,
    callback: Function,
    scope: any
  ): void {
    if (objectA && objectB) {
      if ('children' in objectB) {
        for (let gameObject of objectB.children) {
          this.gameObjectCollisionRegister.push({
            objectA: objectA,
            objectB: gameObject,
            callback: callback,
            scope: scope,
          });
        }
      } else {
        this.gameObjectCollisionRegister.push({
          objectA: objectA,
          objectB: objectB,
          callback: callback,
          scope: scope,
        });
      }
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
      console.log(collisionEntry.objectB);
      ctx.strokeStyle = '#0F0';
      ctx.lineWidth = 3;
      ctx.strokeRect(
        collisionEntry.objectB.x,
        collisionEntry.objectB.y,
        collisionEntry.objectB.width,
        collisionEntry.objectB.height
      );
      if (
        collisionEntry.objectA.x > 0 &&
        collisionEntry.objectA.x < canvas.width &&
        collisionEntry.objectA.y > 0 &&
        collisionEntry.objectA.y < canvas.height &&
        collisionEntry.objectB.x > 0 &&
        collisionEntry.objectB.x < canvas.width &&
        collisionEntry.objectB.y > 0 &&
        collisionEntry.objectA.y < canvas.height &&
        collisionEntry.objectB.x > collisionEntry.objectA.x &&
        collisionEntry.objectB.x + collisionEntry.objectB.width <
          collisionEntry.objectA.x + collisionEntry.objectA.width &&
        collisionEntry.objectB.y > collisionEntry.objectA.y &&
        collisionEntry.objectB.y + collisionEntry.objectB.height <
          collisionEntry.objectA.y + collisionEntry.objectA.height
      ) {
        collisionEntry.callback.apply(collisionEntry.scope, [
          collisionEntry.objectA,
          collisionEntry.objectB,
        ]);
      }
    }
    for (let wallCollisionEntry of this.wallCollisionRegister) {
      if (
        wallCollisionEntry.objectA.y < 0 ||
        wallCollisionEntry.objectA.y + wallCollisionEntry.objectA.height >
          canvas.height ||
        wallCollisionEntry.objectA.x < 0 ||
        wallCollisionEntry.objectA.x + wallCollisionEntry.objectA.width >=
          canvas.width
      ) {
        wallCollisionEntry.callback.bind(wallCollisionEntry.scope).apply();
      }
    }
  }
}

export class Scene {
  public children: Array<GameObject>;
  public groups: Array<Group>;
  public physics: Physics;

  constructor() {
    this.children = [];
    this.groups = [];
    this.physics = new Physics();
  }

  add(object: Group): void;
  add(object: GameObject): void;
  add(object: GameObject | Group): void {
    if ('children' in object) {
      for (let gameObject of object.children) {
        this.children.push(gameObject);
      }
      this.groups.push(object);
    } else {
      this.children.push(object);
    }
  }

  create() {}

  update() {
    for (let gameObject of this.children) {
      if (gameObject) gameObject.update();
    }
    for (let group of this.groups) {
      if (group) group.update();
    }
    this.physics.update();
  }

  render() {
    // update the game background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = canvas.width;
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let gameObject of this.children) {
      if (gameObject) gameObject.render();
    }
    for (let group of this.groups) {
      if (group) group.render();
    }
  }
}

export class Game {
  private scene: Scene;
  private id: number;

  constructor(scene: Scene) {
    this.scene = scene;
    this.scene.create();
    //Setup Components
    this.id = requestAnimationFrame(() => {
      this.gameLoop();
    });
  }

  gameLoop() {
    // WARNING: This pattern is not using Times Step and as such
    // Entities must be kept low, when needing multiple entities, scenes,
    // or other components it's recommended to move to a Game Framework

    // game lifecycle events
    this.scene.update();
    this.scene.render();

    // call next frame
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.gameLoop();
    });
  }
}
