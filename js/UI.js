/*****************************************************************************
 * UI elements
 *****************************************************************************/
const gameScreen     = document.getElementById("game-screen");
const gameBoard      = document.getElementById("game-board");
const buttonRestart  = document.getElementById("button-restart");
const buttonUndo     = document.getElementById("button-undo");


/*****************************************************************************
 * Board size variables
 *****************************************************************************/
var   gameBoardWidth = gameBoard.clientWidth;
var   gameBoardCellSize;


/*****************************************************************************
 * Register button event handlers
 *****************************************************************************/
buttonRestart.addEventListener("click", uiRestart);
buttonUndo.addEventListener("click", uiUndo);



/*****************************************************************************
 * Game progress handling
 *****************************************************************************/
function uiUndo() {
    /* Make undo if possible */
    if (game.moveUndo() == false) {
        return;
    }

    /* Redraw board */
    uiGameRedraw(game);
}

function uiRestart() {
    /* Check if already at the beginning -> previous level */
    if (game.moveHistory.length == 0) {
        if (game.level > 0) {
            /* Save game point */
            localStorage.setItem("game-level", JSON.stringify(game.level - 1));

            /* Start previous level */
            levelStart(game.level - 1);
        }
        return;
    }

    /* Undo all moves back */
    while (true) {
        if (game.moveUndo() == false) {
            break;
        }
    }

    /* Redraw board */
    uiGameRedraw(game);
}


/*****************************************************************************
 * Redraw buttons
 *****************************************************************************/
function uiButtonsRedraw(game) {
    if (game.moveHistory.length == 0) {
        buttonUndo.disabled = true;
    } else {
        buttonUndo.disabled = false;
    }

    if (game.level == 0 && game.moveHistory.length == 0) {
        buttonRestart.disabled = true;
    } else {
        buttonRestart.disabled = false;
    }
}

/*****************************************************************************
 * Redraw level elements
 *****************************************************************************/
function uiInfoRedraw(game) {
    let gameInfo = document.getElementById("game-info");
    gameInfo.innerHTML = "L" + game.level +
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
    let imageFile = "images/" + board.items[x][y] + "_shadow.png";

    if (counterImage.value != board.items[x][y]) {
        counterImage.value = board.items[x][y];

        counterImage.src = imageFile;

        counterImage.style.animation = "none";
        counterImage.offsetHeight; /* trigger reflow */
        counterImage.style.animation = "image-appear 0.5s 1";
    }
}

function uiBoardRedraw(board) {
    /* Create grid and add number images */
    for (y = 0; y < board.height; y++) {
        for (x = 0; x < board.width; x++) {
            /* Redraw item image */
            uiItemRedraw(board, x ,y);
        }
    }

    /* Redraw frame image */
    uiFrameRedraw(board);

    /* Redraw info */
    uiInfoRedraw(game);

    /* Redraw buttons */
    uiButtonsRedraw(game);
}

function uiGameRedraw(game) {
    /* Redraw game board */
    uiBoardRedraw(game.board);

    /* Check if end of level */
    if (game.board.total == 0) {
        setTimeout(function() {
            /* Save game point */
            localStorage.setItem("game-level", JSON.stringify(game.level + 1));

            /* Start new level */
            levelStart(game.level + 1);
        }, 500);
    }
}


/*****************************************************************************
 * Create board elements
 *****************************************************************************/
function uiBoardDraw(board) {
    /* Get board current size */
    gameBoardWidth    = gameBoard.clientWidth;
    gameBoardCellSize = gameBoard.clientWidth / board.width;

    /* Clear elements in board */
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }

    /* Create grid and add number images */
    for (y = 0; y < board.height; y++) {
        /* Create row */
        let newRow = document.createElement("div");
        newRow.className = "grid-row";
        gameBoard.appendChild(newRow);

        for (x = 0; x < board.width; x++) {
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



//document.getElementById("debug-text").innerHTML = window.innerWidth;

