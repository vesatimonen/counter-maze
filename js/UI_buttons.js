const buttonRestart  = document.getElementById("button-restart");
const buttonUndo     = document.getElementById("button-undo");


/*****************************************************************************
 * Button handlers
 *****************************************************************************/
function uiUndo() {
    /* Make undo if possible */
    if (game.moveUndo() == false) {
        return;
    }

    /* Refresh board */
    uiGameRefresh(game);
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

    /* Refresh board */
    uiGameRefresh(game);
}

/*****************************************************************************
 * Register button event handlers
 *****************************************************************************/
buttonRestart.addEventListener("click", uiRestart);
buttonUndo.addEventListener("click", uiUndo);
