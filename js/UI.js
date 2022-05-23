/*****************************************************************************
 * Game board variables
 *****************************************************************************/
const gameScreen     = document.getElementById("game-screen");
const gameBoard      = document.getElementById("game-board");
var   gameBoardWidth = gameBoard.clientWidth;
var   gameBoardCellSize;

var   gameGridWidth;
var   gameGridHeight;



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
 * Touch and mouse move handling
 *****************************************************************************/
function uiMovePosition(event) {
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


function uiMoveStart(event) {
    /* Get event position */
    let move = uiMovePosition(event);
    if (move == undefined) {
        return;
    }

    /* Check that target is frame */
    if (event.target.className != "frame") {
        return;
    }

    /* Save move start situation */
    frame       = event.target;
    frameStartX = parseInt(frame.style.left, 10);
    frameStartY = parseInt(frame.style.top, 10);
    frameX      = frameStartX;
    frameY      = frameStartY;
    moveStartX  = move.X;
    moveStartY  = move.Y;
}

function uiMoveExecute(event) {
    if (frame != undefined) {
        /* Get event position */
        let move = uiMovePosition(event);
        if (move == undefined) {
            return;
        }

        /* Check frame grid limits */
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

        /* Select horizontal or vertical direction */
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            frameX = frameStartX + deltaX;
            frameY = frameStartY;
        } else {
            frameX = frameStartX;
            frameY = frameStartY + deltaY;
        }

        /* Check board limits */
        if (frameX / gameBoardCellSize < 0.5) {
            frameX = 0.5 * gameBoardCellSize;
        }
        if (frameX / gameBoardCellSize > gameGridWidth - 0.5) {
            frameX = (gameGridWidth - 0.5) * gameBoardCellSize;
        }
        if (frameY / gameBoardCellSize < 0.5) {
            frameY = 0.5 * gameBoardCellSize;
        }
        if (frameY / gameBoardCellSize > gameGridHeight - 0.5) {
            frameY = (gameGridHeight - 0.5) * gameBoardCellSize;
        }

        /* Move frame */
        frame.style.left = frameX + "px";
        frame.style.top  = frameY + "px";
    }
}

function uiMoveEnd(event) {
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
function uiKeyPressed(event) {

    let frame = document.getElementById("frame");

    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (game.moveExecute("up") == false) {
                return;
            }

            frame.style.top = parseInt(frame.style.top, 10) - gameBoardCellSize + "px";
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (game.moveExecute("down") == false) {
                return;
            }

            frame.style.top = parseInt(frame.style.top, 10) + gameBoardCellSize + "px";
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (game.moveExecute("left") == false) {
                return;
            }

            frame.style.left = parseInt(frame.style.left, 10) - gameBoardCellSize + "px";
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (game.moveExecute("right") == false) {
                return;
            }

            frame.style.left = parseInt(frame.style.left, 10) + gameBoardCellSize + "px";
            break;
    }
}

/*****************************************************************************
 * Register mouse event handlers
 *****************************************************************************/
gameBoard.addEventListener("mousedown",  uiMoveStart);
gameBoard.addEventListener("mousemove",  uiMoveExecute);
gameBoard.addEventListener("mouseup",    uiMoveEnd);
gameBoard.addEventListener("mouseleave", uiMoveEnd);

/*****************************************************************************
 * Register touch event handlers
 *****************************************************************************/
gameBoard.addEventListener("touchstart", uiMoveStart);
gameBoard.addEventListener("touchmove",  uiMoveExecute);
gameBoard.addEventListener("touchend",   uiMoveEnd);

/*****************************************************************************
 * Register keyboard event handlers
 *****************************************************************************/
document.addEventListener("keydown",     uiKeyPressed);


/*****************************************************************************
 * Register keyboard event handlers
 *****************************************************************************/
function uiDrawBoard(board) {

    gameGridWidth  = board.width;
    gameGridHeight = board.height;

    /* Get board current size */
    gameBoardWidth = gameBoard.clientWidth;

    /* Clear grid */
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }

    /* Calculate cell size */

    gameBoardCellSize = gameBoardWidth / gameGridWidth;

    /* Create grid and add number images */
    for (i = 0; i < gameGridHeight; i++) {
        /* Create row */
        let newRow = document.createElement("div");
        newRow.className = "grid-row";
        gameBoard.appendChild(newRow);

        for (j = 0; j < gameGridWidth; j++) {
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
//            let number = Math.floor(Math.random() * 10);
            let number = board.items[j][i];
//            newImage.src       = "images/" + number + "_shadow.svg";
            newImage.src       = "images/" + number + "_shadow.png";
            newCell.appendChild(newImage);
        }
    }

    /* Add frame */
    let newImage = document.createElement("img");
    newImage.className    = "frame";
    newImage.id           = "frame";
    newImage.src          = "images/Frame148.png";
    newImage.style.left   = board.frame.X * gameBoardCellSize + gameBoardCellSize / 2 + "px";
    newImage.style.top    = board.frame.Y * gameBoardCellSize + gameBoardCellSize / 2 + "px";
    newImage.style.height = gameBoardCellSize * 1.2 + "px";

    gameBoard.appendChild(newImage);
}



//document.getElementById("debug_text").innerHTML = window.innerWidth;
