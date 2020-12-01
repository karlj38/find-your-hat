const prompt = require("prompt-sync")({ sigint: true });
const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";
let inPlay = true;
const intro =
  "Use the WASD keys to move your character (*) to find your hat (^).\nBe careful not to fall in to the holes (O).\n \n";

class Field {
  constructor(args) {
    this.field = [];
    this.player = {};
    this.hat = {};
    this.holes = [];

    for (let y = 0; y < args[1]; y++) {
      //generate empty field rows
      this.field.push([]);
    }
    this.field.forEach((line) => {
      //generate empty field columns
      for (let x = 0; x < args[0]; x++) {
        line.push(fieldCharacter);
      }
    });

    const rand = (max) => {
      return Math.floor(Math.random() * max);
    };
    const coord = () => {
      //generate rand coordinate within field but make sure it's not already occupied
      let coord = { x: rand(args[0]), y: rand(args[1]) };
      while (this.field[coord.y][coord.x] !== fieldCharacter) {
        coord = { x: rand(args[0]), y: rand(args[1]) };
      }
      return coord;
    };

    this.player = coord();
    this.field[this.player.y][this.player.x] = pathCharacter; //assign player random location in field

    this.hat = coord();
    this.field[this.hat.y][this.hat.x] = hat; //assign hat random location in field

    const numHoles = Math.sqrt(args[0] * args[1]) * 1.5; //num of holes = sqrt of field area to maintain difficulty as field size increases
    for (let z = 0; z < numHoles; z++) {
      this.holes.push(coord());
      this.field[this.holes[z].y][this.holes[z].x] = hole; //assign holes random locations in field
    }

    console.log(intro);
    this.print();
  } //constructor

  print() {
    //print field to console
    let str = "";
    this.field.forEach((line) => (str += line.join("") + "\n"));
    str += "\n";
    console.clear();
    console.log(str);
  }

  move(key) {
    //move player within the bounds of the field
    switch (key) {
      case "a":
        if (this.player.x > 0) {
          this.player.x--;
          this.field[this.player.y][this.player.x] = pathCharacter;
          console.log("Moved left!\n");
        }
        this.print();
        break;
      case "w":
        if (this.player.y > 0) {
          this.player.y--;
          this.field[this.player.y][this.player.x] = pathCharacter;
          console.log("Moved up!\n");
        }
        this.print();
        break;
      case "d":
        if (this.player.x < this.field[this.player.y].length - 1) {
          this.player.x++;
          this.field[this.player.y][this.player.x] = pathCharacter;
          console.log("Moved right!\n");
        }
        this.print();
        break;
      case "s":
        if (this.player.y < this.field.length - 1) {
          this.player.y++;
          this.field[this.player.y][this.player.x] = pathCharacter;
          console.log("Moved down!\n");
        }
        this.print();
        break;
      default:
        break;
    }
  }

  checkWin() {
    return this.player.y === this.hat.y && this.player.x === this.hat.x
      ? true
      : false;
  }

  checkLose() {
    return this.holes.some((hole) =>
      this.player.y === hole.y && this.player.x === hole.x ? true : false
    );
  }
} // class

const myField = new Field([process.argv[2], process.argv[3]]);

while (inPlay) {
  let input = prompt("Make your move:");
  switch (input) {
    case "a":
      myField.move("a");
      break;
    case "w":
      myField.move("w");
      break;
    case "d":
      myField.move("d");
      break;
    case "s":
      myField.move("s");
      break;
    case "x":
      inPlay = false;
      break;
    default:
      console.log("Invalid key, try again.\n");
  }

  if (myField.checkWin()) {
    //check if win after every move
    console.log("You found your hat!\n");
    inPlay = false;
    break;
  }

  if (myField.checkLose()) {
    //check if lose after every move
    console.log("You fell in a hole!\n");
    inPlay = false;
  }
}
