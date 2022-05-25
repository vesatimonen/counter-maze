/*****************************************************************************
 * Game board variables
 *****************************************************************************/
const gameScreen     = document.getElementById("game-screen");
const gameBoard      = document.getElementById("game-board");
const buttonRestart  = document.getElementById("button-restart");
const buttonUndo     = document.getElementById("button-undo");


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
function uiMoveDirection(newX, newY, oldX, oldY) {
    if (Math.abs(newX - oldX) > Math.abs(newY - oldY)) {
        /* Horizontal movement */
        if (newX < oldX) {
            return "left";
        } else {
            return "right";
        }
    } else {
        /* Vertical movement */
        if (newY < oldY) {
            return "up";
        } else {
            return "down";
        }
    }

    return "";
}

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
    /* Check that target is frame */
    if (event.target.className != "frame") {
        return;
    }

    /* Save move start situation */
    frame       = event.target;
    frameStartX = parseInt(frame.style.left, 10);
    frameStartY = parseInt(frame.style.top, 10);
}

function uiMoveExecute(event) {
    if (frame != undefined) {
        let move = "";

        /* Get event position */
        let pos = uiMovePosition(event);
        if (pos == undefined) {
            return;
        }

        /* Check frame grid limits */
        let deltaX = pos.X - frameStartX;
        let deltaY = pos.Y - frameStartY;
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

        /* Check if deltaX, deltaY possible */
        move = uiMoveDirection(deltaX, 0, 0, 0);
        if (game.moveIsLegal(move) == false) {
            deltaX = 0;
        }
        move = uiMoveDirection(0, deltaY, 0, 0);
        if (game.moveIsLegal(move) == false) {
            deltaY = 0;
        }

        /* Select horizontal or vertical direction */
        let frameX = frameStartX + deltaX;
        let frameY = frameStartY + deltaY;
        if (deltaX != 0 && deltaY != 0) {
            /* Snap to main direction */
            if (Math.abs(pos.X - frameStartX) > Math.abs(pos.Y - frameStartY)) {
                frameY = frameStartY;
            } else {
                frameX = frameStartX;
            }
        }

        /* Move frame */
        frame.style.left = frameX + "px";
        frame.style.top  = frameY + "px";
    }
}


function uiMoveEnd(event) {
    if (frame != undefined) {
        /* Find out move direction */
        let frameX = parseInt(frame.style.left, 10);
        let frameY = parseInt(frame.style.top, 10);
        let move = uiMoveDirection(frameX, frameY, frameStartX, frameStartY);

        /* Check if moved more than half grid cell */
        if (Math.abs(frameX - frameStartX) >= gameBoardCellSize/2 ||
            Math.abs(frameY - frameStartY) >= gameBoardCellSize/2) {
            /* Execute move on game board */
            game.moveExecute(move);
        }

        /* Redraw board */
        uiBoardRedraw(game.board);
    }

    /* End move */
    frame       = undefined;
    frameStartX = undefined;
    frameStartY = undefined;
}

function uiMoveCancel(event) {
    /* Redraw board */
    uiBoardRedraw(game.board);

    /* End move */
    frame       = undefined;
    frameStartX = undefined;
    frameStartY = undefined;
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
window.addEventListener("mousedown",  uiMoveStart);
window.addEventListener("mousemove",  uiMoveExecute);
window.addEventListener("mouseup",    uiMoveEnd);
window.addEventListener("mouseleave", uiMoveCancel);

/*****************************************************************************
 * Register touch event handlers
 *****************************************************************************/
window.addEventListener("touchstart", uiMoveStart);
window.addEventListener("touchmove",  uiMoveExecute);
window.addEventListener("touchend",   uiMoveEnd);

/*****************************************************************************
 * Register keyboard event handlers
 *****************************************************************************/
window.addEventListener("keydown",     uiKeyPressed);

/*****************************************************************************
 * Register button event handlers
 *****************************************************************************/
buttonRestart.addEventListener("click", uiRestart);
buttonUndo.addEventListener("click", uiUndo);


/*****************************************************************************
 * Redraw buttons
 *****************************************************************************/
function uiButtonsRedraw(game) {
    if (game.moveHistory.length == 0) {
        buttonUndo.disabled = true;
    } else {
        buttonUndo.disabled = false;
    }
}

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

    /* Redraw buttons */
    uiButtonsRedraw(game);
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
    frameImage.style.height = gameBoardCellSize * 1.25 + "px";
    gameBoard.appendChild(frameImage);

    /* Redraw board */
    uiBoardRedraw(board);
}



//document.getElementById("debug_text").innerHTML = window.innerWidth;

