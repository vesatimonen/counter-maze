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
        this.frame  = {X: undefined,
                       Y: undefined};
    }

    /* Initialize game */
    init(width, height) {
        this.width   = width;
        this.height  = height;
        this.items   = array2D(width, height, 0);
        this.frame.X = 0;
        this.frame.Y = 0;
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

                /* Check if back */
                if (oldX == newX && oldY == newY) {
                    continue;
                }

                /* Check if out of board */
                if (newX < 0 || newX >= this.width ||
                    newY < 0 || newY >= this.height) {
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
}

class Game {
    constructor() {
        /* Properties */
        this.board  = new Board();

        // <move> = (x0, y0), (x1, y1)
        // <move list> = count, <move>, ...

        // <move history> = <move list>
    }

    // legalMoves()
    // moveHistory()
    // moveUndo() ???
    // makeMove()
    // isLegalMove

}



