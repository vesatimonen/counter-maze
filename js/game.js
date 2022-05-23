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


class Game {
    /* Properties */
    width  = undefined;
    height = undefined;

    /* Contructor */
    constructor() {
//        document.getElementById("debug_text").innerHTML = "Game created";
    }

    /* Initialize game */
    init(width, height) {
        this.width  = width;
        this.height = height;

        this.board  = array2D(width, height, 0);

//    document.getElementById("debug_text").innerHTML = "Board: " + this.board[4][0];
    }

    /* Randomize board (for testing) */
    randomize() {
        for (let i = 0; i < this.width; i++) {
            for(let j = 0; j < this.height; j++) {
                this.board[i][j] = Math.floor(Math.random() * 10);;
            }
        }
    }

}




