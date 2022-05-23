class Game {
    /* Properties */
    width  = 0;
    height = 0;

    /* Contructor */
    constructor(width, height) {
        this.width = width;
        this.height = height;

        document.getElementById("debug_text").innerHTML = "Game: " + width + "," + height;
    }

    /* Methods */
}




