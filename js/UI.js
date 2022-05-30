/*****************************************************************************
 * UI elements
 *****************************************************************************/
const gameScreen     = document.getElementById("game-screen");
const gameGrid       = document.getElementById("game-grid");

/*****************************************************************************
 * Board size variables
 *****************************************************************************/
var   gameGridWidth = gameGrid.clientWidth;
var   gameGridCellSize;


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
    frameImage.style.left   = board.frame.X * gameGridCellSize + gameGridCellSize / 2 + "px";
    frameImage.style.top    = board.frame.Y * gameGridCellSize + gameGridCellSize / 2 + "px";
}

function uiItemRedraw(board, x, y) {
    /* Get DOM element for counter */
    let counterImage = document.getElementById("item-" + x + "-" + y);

    /* If value changes */
    if (counterImage.value != board.items[x][y]) {
        counterImage.value = board.items[x][y];

        /* Set new image */
        counterImage.src = "images/" + counterImage.value + "_shadow.png";

        /* Start animation */
        function uiImageAnimationEnd(event) {
            event.stopPropagation();
            return false;
        }
        counterImage.addEventListener("animationend", uiImageAnimationEnd);
        counterImage.style.animation = "none";
        counterImage.offsetHeight; /* trigger reflow */
        counterImage.style.animation = "image-appear 0.2s 1";
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


/*****************************************************************************
 * Setup board elements
 *****************************************************************************/
function uiBoardSetup(board) {
    /* Get board current size */
    gameGridWidth    = gameGrid.clientWidth;
    gameGridCellSize = gameGrid.clientWidth / board.width;

    /* Clear elements in board */
    while (gameGrid.firstChild) {
        gameGrid.removeChild(gameGrid.firstChild);
    }

    /* Create grid and add number images */
    for (y = 0; y < board.height; y++) {
        /* Create row */
        let newRow = document.createElement("div");
        newRow.className = "grid-row";
        gameGrid.appendChild(newRow);

        for (x = 0; x < board.width; x++) {
            /* Create cell */
            let newCell = document.createElement("div");
            newCell.className    = "grid-cell";
            newCell.style.width  = gameGridCellSize + "px";
            newCell.style.height = gameGridCellSize + "px";
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
    frameImage.style.left   = board.frame.X * gameGridCellSize + gameGridCellSize / 2 + "px";
    frameImage.style.top    = board.frame.Y * gameGridCellSize + gameGridCellSize / 2 + "px";
    frameImage.style.height = gameGridCellSize * 1.25 + "px";
    gameGrid.appendChild(frameImage);

    /* Redraw board */
    uiBoardRedraw(board);
}

/*****************************************************************************
 * Refresh board elements and check if game over
 *****************************************************************************/


function uiGameRefresh(game) {
    /* Redraw game board */
    uiBoardRedraw(game.board);

    /* Check if end of level */
    if (game.board.total == 0) {
        /* Save game point */
        localStorage.setItem("game-level", JSON.stringify(game.level + 1));

        /* Start animation */
        function uiGridAnimationEnd(event) {
            event.stopPropagation();
            levelStart(game.level + 1); /* Start new level */
            return false;
        }
        gameGrid.addEventListener("animationend", uiGridAnimationEnd);
//        gameGrid.style.animation = "none";
        gameGrid.style.animation = null;
        gameGrid.offsetHeight; /* trigger reflow */
        gameGrid.style.animation = "image-appear 0.5s ease-in 0.2s 1 reverse";
    }
}


//document.getElementById("debug-text").innerHTML = window.innerWidth;

