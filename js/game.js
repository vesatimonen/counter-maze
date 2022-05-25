function array2D(width, height, value) {
    let arr = [];

    // creating two dimensional array
    for (let i = 0; i < width; i++) {
        arr[i] = [];
    }

    // inserting elements to array
    for (let i = 0; i < width; i++) {
        for(let j = 0; j < height; j++) {
            arr[i][j] = value;
        }
    }

    return arr;
}


class Board {
    constructor() {
        /* Properties */
        this.width  = undefined;
        this.height = undefined;
        this.items  = [[undefined]];
        this.total  = undefined;
        this.frame  = {X: undefined,
                       Y: undefined};
    }

    /* Randomize board (for testing) */
    randomize(moves) {
        /* Start position */
        let startX = Math.floor(Math.random() * this.width);
        let startY = Math.floor(Math.random() * this.height);

        /* Randomize moves */
        let oldX = -1;
        let oldY = -1;
        let currX = startX;
        let currY = startY;
        let newX = 0;
        let newY = 0;
        while (moves > 0) {
            /* Random legal move */
            while (true) {
                let direction = Math.floor(Math.random() * 4);
                switch (direction) {
                    case 0: /* Up */
                        newX = currX;
                        newY = currY - 1;
                        break;
                    case 1: /* Right */
                        newX = currX + 1;
                        newY = currY;
                        break;
                    case 2: /* Down */
                        newX = currX;
                        newY = currY + 1;
                        break;
                    case 3: /* Left */
                        newX = currX - 1;
                        newY = currY;
                        break;
                }

                /* Check board limits */
                if (newX < 0 || newX >= this.width ||
                    newY < 0 || newY >= this.height) {
                    continue;
                }

                /* Check if backward move */
                if (oldX == newX && oldY == newY) {
                    continue;
                }

                /* Check that counter is not too high */
                if (this.items[newX][newY] >= 9) {
                    continue;
                }

                /* Found legal move */
                break;
            }

            /* Make move */
            this.items[newX][newY]++;
            this.total++;
            oldX = currX;
            oldY = currY;
            currX = newX;
            currY = newY;

            moves--;
        }

        this.frame.X = startX;
        this.frame.Y = startY;

//        document.getElementById("debug_text").innerHTML = "Board created: " + this.frame.X;
    }

    /* Initialize game */
    init(width, height, moves) {

        this.width   = width;
        this.height  = height;
        this.items   = array2D(width, height, 0);
        this.total   = 0;
        this.frame.X = 0;
        this.frame.Y = 0;

        this.randomize(moves);
    }

}

class Game {
    constructor() {
        /* Game board */
        this.board = new Board();

        /* Game move history */
        this.moveHistory = [];
        this.moveOptions = ["up", "right", "down", "left"];

        /* Game level */
        this.level = 0;

//        document.getElementById("debug_text").innerHTML = "Board created: " + this.moveOptions;
    }

    init(level, width, height, moves) {
        /* Clear move history */
        this.moveHistory = [];

        /* Initialize board */
        this.board.init(width, height, moves);

        /* Set level */
        this.level = level;
    }

    /* Convert move string to XY-place */
    moveToPlace(move) {
        switch (move) {
            case "up":
                return {X: this.board.frame.X,
                        Y: this.board.frame.Y - 1};
                break;
            case "right":
                return {X: this.board.frame.X + 1,
                        Y: this.board.frame.Y};
                break;
            case "down":
                return {X: this.board.frame.X,
                        Y: this.board.frame.Y + 1};
                break;
            case "left":
                return {X: this.board.frame.X - 1,
                        Y: this.board.frame.Y};
                break;
        }

        return undefined;
    }

    /* Check if move is legal */
    moveIsLegal(move) {
        let place = this.moveToPlace(move);
        if (place == undefined) {
            return false;
        }

        /* Check board limits */
        if (place.X < 0 || place.X >= this.board.width ||
            place.Y < 0 || place.Y >= this.board.height) {
            return false;
        }

        /* Check if backward move */
        if (this.moveHistory.length > 0) {
            switch (this.moveHistory[this.moveHistory.length - 1]) {
                case "up":
                    if (move == "down") {
                        return false;
                    }
                    break;
                case "right":
                    if (move == "left") {
                        return false;
                    }
                    break;
                case "down":
                    if (move == "up") {
                        return false;
                    }
                    break;
                case "left":
                    if (move == "right") {
                        return false;
                    }
                    break;
            }
        }

        /* Check that counter is not zero */
        if (this.board.items[place.X][place.Y] == 0) {
            return false;
        }

        return true;
    }

    moveExecute(move) {
        /* Check that move is legal */
        if (this.moveIsLegal(move) == false) {
            return false;
        }

        let place = this.moveToPlace(move);

        /* Move frame */
        this.board.frame.X = place.X;
        this.board.frame.Y = place.Y;

        /* Decrement counter */
        this.board.items[place.X][place.Y]--;
        this.board.total--;

        /* Save move */
        this.moveHistory.push(move);

        return true;
    }

    moveUndo() {
        /* Check if something to undo */
        if (this.moveHistory.length == 0) {
            return false;
        }

        /* Pop latest move */
        let move = this.moveHistory.pop();

        /* Increment counter under frame */
        this.board.items[this.board.frame.X][this.board.frame.Y]++;
        this.board.total++;

        /* Move frame backwards */
        switch (move) {
            case "up":
                this.board.frame.Y++;
                break;
            case "right":
                this.board.frame.X--;
                break;
            case "down":
                this.board.frame.Y--;
                break;
            case "left":
                this.board.frame.X++;
                break;
        }

        return true;
    }

}



