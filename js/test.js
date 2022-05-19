/*****************************************************************************
 * Gameboard element
 *****************************************************************************/
const gameBoard  = document.getElementById("game-board");

/*****************************************************************************
 * Helpers
 *****************************************************************************/
function pxToNumber(value_px) {
    const value = parseInt(value_px, 10);
    if (isNaN(value)) {
        return 0;
    }
    return value;
}


/*****************************************************************************
 * Global variables for piece move
 *****************************************************************************/
var element     = undefined;
var elementLeft = undefined;
var elementTop  = undefined;

var moveStartX  = undefined;
var moveStartY  = undefined;


/*****************************************************************************
 * Piece moving events
 *****************************************************************************/
function moveStart(event) {
    var X, Y;

    switch (event.type) {
        case "mousedown":
            X = event.clientX;
            Y = event.clientY;
            break;
        case "touchstart":
            /* Ignore if touched multiple fingers */
            if (event.targetTouches > 1) {
                return;
            }

            X = event.touches[0].clientX;
            Y = event.touches[0].clientY;
            break;
        default:
            return;
    }

    /* Check that target is frame */
    if (event.target.className != "frame") {
        return;
    }

    /* Save move start situation */
    element     = event.target;
    elementLeft = pxToNumber(element.style.left);
    elementTop  = pxToNumber(element.style.top);
    moveStartX  = X;
    moveStartY  = Y;

    document.getElementById("debug_text").innerHTML = "move start: " + X + " " + Y;
}

var counter = 0;

function moveExecute(event) {
    if (element != undefined) {
        var X, Y;

        switch (event.type) {
            case "mousemove":
                X = event.clientX;
                Y = event.clientY;
                break;
            case "touchmove":
                /* Ignore if touched multiple fingers */
                if (event.targetTouches > 1) {
                    return;
                }

                X = event.touches[0].clientX;
                Y = event.touches[0].clientY;
                break;
            default:
                return;
        }

        element.style.left = (parseInt(elementLeft, 10) + X - moveStartX) + "px";

        document.getElementById("debug_text").innerHTML = "move execute: " + X + " " + Y + "/" + counter++ ;
    } else {
        document.getElementById("debug_text").innerHTML = "move execute: element undefined";
    }
}

function moveEnd(event) {
    document.getElementById("debug_text").innerHTML = "move end";

    element     = undefined;
    moveStartX  = undefined;
    moveStartY  = undefined;
    elementLeft = undefined;
    elementTop  = undefined;
}


/*****************************************************************************
 * Register piece moving events to game board
 *****************************************************************************/
gameBoard.addEventListener("mousedown",  moveStart);
gameBoard.addEventListener("mousemove",  moveExecute);
gameBoard.addEventListener("mouseup",    moveEnd);
gameBoard.addEventListener("mouseleave", moveEnd);

gameBoard.addEventListener("touchstart", moveStart);
gameBoard.addEventListener("touchmove",  moveExecute);
gameBoard.addEventListener("touchend",   moveEnd);



var gameBoardWidth = gameBoard.clientWidth;
var gameBoardCellSize;

function makeGrid(width, height) {
    gameBoardCellSize = gameBoardWidth / width;

    /* Add numbers */
    for (i = 0; i < height; i++) {
        /* Create row */
        let newRow = document.createElement("div");
        newRow.className = "grid-row";
        gameBoard.appendChild(newRow);

        for (j = 0; j < width; j++) {
            /* Create cell */
            let newCell = document.createElement("div");
            newCell.className    = "grid-cell";
            newCell.style.width  = gameBoardCellSize + "px";
            newCell.style.height = gameBoardCellSize + "px";
            newRow.appendChild(newCell);

            /* Create image */
            let newImage = document.createElement("img");
            newImage.className = "grid-image";
            newImage.id        = "image-" + i + "-" + j;
//            newImage.src       = "images/" + Math.floor(Math.random() * 10) + "_shadow.svg";
            newImage.src       = "images/" + Math.floor(Math.random() * 10) + "_shadow.png";
            newCell.appendChild(newImage);
        }
    }

    /* Add frame */
    let newImage = document.createElement("img");
    newImage.className    = "frame";
    newImage.src          = "images/Frame148.png";
    newImage.style.left   = gameBoardCellSize / 2 + "px";
    newImage.style.top    = gameBoardCellSize / 2 + "px";
    newImage.style.height = gameBoardCellSize * 1.2 + "px";


    gameBoard.appendChild(newImage);

}


//document.getElementById("debug_text").innerHTML = gameBoardWidth;
//document.getElementById("debug_text").innerHTML = document.documentElement.clientWidth;


makeGrid(5, 5);
