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
    randomize() {
        for (let i = 0; i < this.width; i++) {
            for(let j = 0; j < this.height; j++) {
                this.items[i][j] = Math.floor(Math.random() * 10);;
            }
        }

        this.frame.X = Math.floor(Math.random() * this.width);
        this.frame.Y = Math.floor(Math.random() * this.height);

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



