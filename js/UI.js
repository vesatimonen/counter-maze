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
 * Game progress handling
 *****************************************************************************/
function uiUndo() {
    /* Make undo if possible */
    if (game.moveUndo() == false) {
        return;
    }

    /* Redraw board */
    uiBoardRedraw(game.board);
}

function uiRestart() {
    /* Undo all moves back */
    while (true) {
        if (game.moveUndo() == false) {
            break;
        }
    }

    /* Redraw board */
    uiBoardRedraw(game.board);
}


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

    let rect = gameBoard.getBoundingClientRect()
    X -= rect.left;
    Y -= rect.top;

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

/*
        frame.style.left = move.X + "px";
        frame.style.top  = move.Y + "px";
document.getElementById("debug_text").innerHTML = ":" + move.X + "/" + move.Y;

return;
*/

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
        /* Snap to closest position on grid */
        X = Math.round(frameX / gameBoardCellSize - 0.5);
        Y = Math.round(frameY / gameBoardCellSize - 0.5);

        /* Deduce direction */
        let move = "";
        if (X - game.board.frame.X == 1 &&
            Y - game.board.frame.Y == 0) {
            move = "right";
        }
        if (X - game.board.frame.X == -1 &&
            Y - game.board.frame.Y == 0) {
            move = "left";
        }
        if (X - game.board.frame.X == 0 &&
            Y - game.board.frame.Y == 1) {
            move = "down";
        }
        if (X - game.board.frame.X == 0 &&
            Y - game.board.frame.Y == -1) {
            move = "up";
        }

        /* Execute move on game board */
        game.moveExecute(move);

        /* Redraw board */
        uiBoardRedraw(game.board);
    }

    /* Cancel move */
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
    let move = "";
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            move = "up";
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            move = "down";
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            move = "left";
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            move = "right";
            break;
        case 'Escape':
        case 'Backspace':
            uiUndo();
            return;
            break;
        default:
            return;
    }

    /* Execute move on game board */
    if (game.moveExecute(move) == false) {
        return;
    }

    /* Redraw board */
    uiBoardRedraw(game.board);
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
 * Register button event handlers
 *****************************************************************************/
document.getElementById("button-restart").addEventListener("click", uiRestart);
document.getElementById("button-undo"   ).addEventListener("click", uiUndo);



/*****************************************************************************
 * Redraw level elements
 *****************************************************************************/
function uiLevelRedraw(game) {
    let levelInfo = document.getElementById("level-info");
    levelInfo.innerHTML = "L" + game.level +
                          " (" + game.moveHistory.length + "/" + (game.moveHistory.length + game.board.total) + ")";
}

/*****************************************************************************
 * Redraw board elements
 *****************************************************************************/
function uiFrameRedraw(board) {
    /* Get DOM element for frame */
    let frameImage = document.getElementById("frame");
    frameImage.src          = "images/Frame148.png";
    frameImage.style.left   = board.frame.X * gameBoardCellSize + gameBoardCellSize / 2 + "px";
    frameImage.style.top    = board.frame.Y * gameBoardCellSize + gameBoardCellSize / 2 + "px";
}

function uiItemRedraw(board, x, y) {
    /* Get DOM element for counter */
    let counterImage = document.getElementById("item-" + x + "-" + y);
    counterImage.src = "images/" + board.items[x][y] + "_shadow.png";
//    counterImage.src = "images/" + board.items[x][y] + "_shadow.svg";
}

function uiBoardRedraw(board) {
    /* Create grid and add number images */
    for (y = 0; y < gameGridHeight; y++) {
        for (x = 0; x < gameGridWidth; x++) {
            /* Redraw item image */
            uiItemRedraw(board, x ,y);
        }
    }

    /* Redraw frame image */
    uiFrameRedraw(board);

    /* Redraw level info */
    uiLevelRedraw(game);
}


/*****************************************************************************
 * Create board elements
 *****************************************************************************/
function uiBoardDraw(board) {
    gameGridWidth  = board.width;
    gameGridHeight = board.height;

    /* Get board current size */
    gameBoardWidth    = gameBoard.clientWidth;
    gameBoardCellSize = gameBoard.clientWidth / gameGridWidth;

    /* Clear elements in board */
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }

    /* Create grid and add number images */
    for (y = 0; y < gameGridHeight; y++) {
        /* Create row */
        let newRow = document.createElement("div");
        newRow.className = "grid-row";
        gameBoard.appendChild(newRow);

        for (x = 0; x < gameGridWidth; x++) {
            /* Create cell */
            let newCell = document.createElement("div");
            newCell.className    = "grid-cell";
            newCell.style.width  = gameBoardCellSize + "px";
            newCell.style.height = gameBoardCellSize + "px";
            newRow.appendChild(newCell);

            /* Create counter image */
            let counterImage = document.createElement("img");
            counterImage.className = "grid-image";
            counterImage.id        = "item-" + x + "-" + y;
            counterImage.src       = "";
            newCell.appendChild(counterImage);
        }
    }

    /* Create frame image */
    let frameImage = document.createElement("img");
    frameImage.className    = "frame";
    frameImage.id           = "frame";
    frameImage.src          = "";
    frameImage.style.left   = board.frame.X * gameBoardCellSize + gameBoardCellSize / 2 + "px";
    frameImage.style.top    = board.frame.Y * gameBoardCellSize + gameBoardCellSize / 2 + "px";
    frameImage.style.height = gameBoardCellSize * 1.2 + "px";
    gameBoard.appendChild(frameImage);

    /* Redraw board */
    uiBoardRedraw(board);
}



//document.getElementById("debug_text").innerHTML = window.innerWidth;

