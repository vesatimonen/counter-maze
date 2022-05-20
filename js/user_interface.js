/*****************************************************************************
 * Game board variables
 *****************************************************************************/
const gameScreen     = document.getElementById("game-screen");
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
var frameStartX = undefined;
var frameStartY = undefined;
var frameX      = undefined;
var frameY      = undefined;

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
        return;
    }

    /* Save move start situation */
    frame       = event.target;
    frameStartX = pxToNumber(frame.style.left);
    frameStartY = pxToNumber(frame.style.top);
    frameX      = frameStartX;
    frameY      = frameStartY;
    moveStartX  = move.X;
    moveStartY  = move.Y;
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

        /* Find closest direction */
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            frameX = frameStartX + deltaX;
            frameY = frameStartY;
        } else {
            frameX = frameStartX;
            frameY = frameStartY + deltaY;
        }

        /* Move frame */
        frame.style.left = frameX + "px";
        frame.style.top  = frameY + "px";
    }
}

function moveEnd(event) {
    if (frame != undefined) {
        /* Snap to center of the grid (0.3 -> 0.5) */
        frameX = (Math.round(frameX / gameBoardCellSize - 0.5) + 0.5) * gameBoardCellSize;
        frameY = (Math.round(frameY / gameBoardCellSize - 0.5) + 0.5) * gameBoardCellSize;

        /* Move frame */
        frame.style.left = frameX + "px";
        frame.style.top  = frameY + "px";
    }

    frame       = undefined;
    frameStartX = undefined;
    frameStartY = undefined;
    frameX      = undefined;
    frameY      = undefined;
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


/*****************************************************************************
 * Register keyboard event handlers
 *****************************************************************************/
function drawGrid(width, height) {

    /* Get board current size */
    gameBoardWidth = gameBoard.clientWidth;

    /* Clear grid */
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }

    /* Calculate cell size */

    gameBoardCellSize = gameBoardWidth / width;

    /* Create grid and add number images */
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

/*****************************************************************************
 * Game visibility handling
 *****************************************************************************/
function hideGame() {
    gameScreen.style.visibility = "hidden";
}

function drawGame() {
    drawGrid(7, 7);
}

function showGame() {
    gameScreen.style.visibility = "visible";
}

function resizeGame() {
    if (gameBoardWidth != gameBoard.clientWidth) {
        gameBoardWidth = gameBoard.clientWidth;
        drawGame();
    }
}

/*****************************************************************************
 * Window event handlers
 *****************************************************************************/
window.addEventListener("load",   showGame);
window.addEventListener("resize", resizeGame);

/*****************************************************************************
 * Window event handlers
 *****************************************************************************/
hideGame();
drawGame();


//document.getElementById("debug_text").innerHTML = window.innerWidth;

