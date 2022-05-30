const buttonRestart  = document.getElementById("button-restart");
const buttonUndo     = document.getElementById("button-undo");


/*****************************************************************************
 * Button handlers
 *****************************************************************************/
function uiUndo() {
    /* Make undo if possible */
    if (game.moveUndo() == false) {
        return false;
    }

    /* Refresh board */
    uiGameRefresh(game);

    return false;
}

function uiRestart() {
    /* Undo all moves back */
    while (true) {
        if (game.moveUndo() == false) {
            break;
        }
    }

    /* Setup board and refresh UI */
    uiBoardSetup(game.board);

    return false;
}

function uiMouseUp() {
    clearTimeout(restartTimer);
    return false;
}

function uiMouseDown() {
    restartTimer = setTimeout(
                        function() {
                            levelStart(game.level - 1);
                        },
                        1000);
    return false;
}

/*****************************************************************************
 * Register button event handlers
 *****************************************************************************/
buttonUndo.addEventListener("click", uiUndo);

buttonRestart.addEventListener("click", uiRestart);

buttonRestart.addEventListener("mouseup",    uiMouseUp);
buttonRestart.addEventListener("mouseleave", uiMouseUp);
buttonRestart.addEventListener("mousedown",  uiMouseDown);

buttonRestart.addEventListener("touchend",    uiMouseUp);
buttonRestart.addEventListener("touchstart",  uiMouseDown);

