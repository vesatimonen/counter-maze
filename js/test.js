/*****************************************************************************
 * Game board variables
 *****************************************************************************/
const gameBoard      = document.getElementById("game-board");
var   gameBoardWidth = gameBoard.clientWidth;
var   gameBoardCellSize;


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
 * Move variables
 *****************************************************************************/
var frame       = undefined;
var frameLeft   = undefined;
var frameTop    = undefined;

var moveStartX  = undefined;
var moveStartY  = undefined;



/*****************************************************************************
 * Piece moving events
 *****************************************************************************/
function getEventPosition(event) {
    let X, Y;

    switch (event.type) {
        case "mousedown":
        case "mousemove":
        case "mouseup":
        case "mouseleave":
            X = event.clientX;
            Y = event.clientY;
            break;
        case "touchstart":
        case "touchmove":
        case "touchend":
        case "touchcancel":
            /* Ignore if touched multiple fingers */
            if (event.targetTouches > 1) {
                return undefined;
            }

            X = event.touches[0].clientX;
            Y = event.touches[0].clientY;
            break;
        default:
            return undefined;
    }

    return {X, Y};
}


function moveStart(event) {
    /* Get event position */
    let move = getEventPosition(event);
    if (move == undefined) {
        return;
    }

    /* Check that target is frame */
    if (event.target.className != "frame") {
        document.getElementById("debug_text").innerHTML = "not frame";
        return;
    }

    /* Save move start situation */
    frame       = event.target;
    frameLeft   = pxToNumber(frame.style.left);
    frameTop    = pxToNumber(frame.style.top);
    moveStartX  = move.X;
    moveStartY  = move.Y;

    document.getElementById("debug_text").innerHTML = "move start: " + move.X + " " + move.Y;
}

function moveExecute(event) {
    if (frame != undefined) {
        /* Get event position */
        let move = getEventPosition(event);
        if (move == undefined) {
            return;
        }

        /* Check frame movement limits */
        let deltaX = move.X - moveStartX;
        let deltaY = move.Y - moveStartY;
        if (deltaX > gameBoardCellSize) {
            deltaX = gameBoardCellSize;
        }
        if (deltaX < -gameBoardCellSize) {
            deltaX = -gameBoardCellSize;
        }
        if (deltaY > gameBoardCellSize) {
            deltaY = gameBoardCellSize;
        }
        if (deltaY < -gameBoardCellSize) {
            deltaY = -gameBoardCellSize;
        }

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            frame.style.left = (parseInt(frameLeft, 10) + deltaX) + "px";
            frame.style.top  = (parseInt(frameTop,  10) + 0)      + "px";
        } else {
            frame.style.left = (parseInt(frameLeft, 10) + 0)      + "px";
            frame.style.top  = (parseInt(frameTop,  10) + deltaY) + "px";
        }

        document.getElementById("debug_text").innerHTML = "move execute: " + move.X + " " + move.Y;
    }
}

function moveEnd(event) {
    document.getElementById("debug_text").innerHTML = "move end";

    frame       = undefined;
    frameLeft   = undefined;
    frameTop    = undefined;
    moveStartX  = undefined;
    moveStartY  = undefined;
}

/*****************************************************************************
 * Keyboard input handling
 *****************************************************************************/
function keyPressed(event) {

    let frame = document.getElementById("frame");

    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            frame.style.top = pxToNumber(frame.style.top) - gameBoardCellSize + "px";
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            frame.style.top = pxToNumber(frame.style.top) + gameBoardCellSize + "px";
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            frame.style.left = pxToNumber(frame.style.left) - gameBoardCellSize + "px";
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            frame.style.left = pxToNumber(frame.style.left) + gameBoardCellSize + "px";
            break;
    }
}

/*****************************************************************************
 * Register mouse event handlers
 *****************************************************************************/
gameBoard.addEventListener("mousedown",  moveStart);
gameBoard.addEventListener("mousemove",  moveExecute);
gameBoard.addEventListener("mouseup",    moveEnd);
gameBoard.addEventListener("mouseleave", moveEnd);

/*****************************************************************************
 * Register touch event handlers
 *****************************************************************************/
gameBoard.addEventListener("touchstart", moveStart);
gameBoard.addEventListener("touchmove",  moveExecute);
gameBoard.addEventListener("touchend",   moveEnd);

/*****************************************************************************
 * Register keyboard event handlers
 *****************************************************************************/
document.addEventListener("keydown",     keyPressed);


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
    newImage.id           = "frame";
    newImage.src          = "images/Frame148.png";
    newImage.style.left   = gameBoardCellSize / 2 + "px";
    newImage.style.top    = gameBoardCellSize / 2 + "px";
    newImage.style.height = gameBoardCellSize * 1.2 + "px";


    gameBoard.appendChild(newImage);

}


//document.getElementById("debug_text").innerHTML = document.documentElement.clientWidth;


makeGrid(7, 7);

document.getElementById("debug_text").innerHTML = gameBoardCellSize;

