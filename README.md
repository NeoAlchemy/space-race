# Space Race Game

This is a simple implementation of the classic Space Race game using TypeScript and HTML5 canvas.

## How to play

To play, open [https://space-race.stackblitz.io](https://space-race.stackblitz.io) in your browser. Use the up and down arrow keys to control the spaceship. The spaceship will move up or down depending on the key pressed. Second Player use the `w` and `s` keys to control the other spaceship. The spaceship will ove up or down depending on the key pressed. The spaceship resets when collides with an asteroid. Game ends when one agrees who the winner is.

## Code structure

The code consists of several classes:

- `Util`: A utility class that provides a function for generating a random integer within a given range
- `Asteroid`: A class representing an asteroid that appears on the screen
- `AsteroidField`: A class representing the field of asteroids that appear on the screen
- `Ship`: A class representing the player's spaceship
- `Score`: A class representing the player's score
- `InputController`: Handles keyboard input to control the spaceship's movement.

The `index.html` file imports the `style.css` file and creates a canvas element to render the game. The TypeScript code is compiled to JavaScript and included in the HTML file as a script.

# Game settings

The game has several settings that can be modified:

- `ASTEROID_SIZE`: The size of each asteroid in pixels
- `ASTEROID_COUNT`: The number of asteroids that appear on the screen at any given time
- `SHIP_VELOCITY`: The speed at which the spaceship moves
- `STAR_VELOCITY`: The speed at which the asteroids move
- `CENTER_LINE_HEIGHT`: The height of the center line in pixels
- `CENTER_LINE_WIDTH`: The width of the center line in pixels
- `COLOR_CENTER_LINE`: The color of the center line
- `COLOR_BACKGROUND`: The color of the background
- `COLOR_SCORE`: The color of the score
- `COLOR_ASTEROID`: The color of the asteroids

## Game Overview

In Space Race, the player(s) must guide a spaceship through an asteroid field and avoid colliding with the asteroids. The player's score increases as they avoid the asteroids and stay alive for as long as possible.

### Objective

The player's objective is to avoid colliding with the asteroids for as long as possible and earn as high a score as they can.

#### Controls

- Up Arrow Key: Move the right spaceship up
- Down Arrow Key: Move the right spaceship down
- W Key: Move the left spaceship up
- S Key: Move the left spaceship down

### Game Mechanics

- Spaceship: The player's spaceship, which can move up and down to avoid the asteroids.
- Asteroids: The primary obstacle in the game. Asteroids move across the screen from right to left, and the player must avoid colliding with them.
- Center Line: A line in the center of the screen that separates the player's spaceship from the asteroid field.
- Win Condition: There is no win condition in Asteroid Dodge. The player's goal is to earn as high a score as possible by avoiding the asteroids for as long as possible.
- Lose Condition: The player loses if their spaceship collides with an asteroid.

### Game Entities

#### Asteroids

- Asteroid Size: 5 pixels
- Asteroid Count: 25
- Asteroid Speed: 1 pixel per frame
- Asteroid Direction: Moves from right to left
- Asteroid Spawning: Asteroids are randomly spawned along the top of the screen and move downwards.

#### Spaceship

- Spaceship Size: 32 pixels
- Spaceship Velocity: 8 pixels per frame
- Spaceship Position: Located on the left-hand side of the screen.
- Spaceship Movement: The player can move the spaceship up and down to avoid the asteroids.
- Spaceship Image: A spaceship image is used to represent the player's spaceship.

#### Score

- Score Location: The score is displayed at the top of the screen.
- Score Increment: The player's score increases by one point for every frame that they avoid colliding with an asteroid.

#### Technical Details

- The game is programmed in TypeScript.
- The canvas is selected using the ID "canvas".
