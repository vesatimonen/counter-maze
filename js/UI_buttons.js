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

    /* Refresh board */
    uiGameRefresh(game);

    return false;
}

function uiMouseUp() {
    document.getElementById("debug-text").innerHTML = "mouse up";

    return false;
}

    /* Check if already at the beginning -> previous level */
//    if (game.moveHistory.length == 0) {
//        if (game.level > 0) {
            /* Start previous level */
//            levelStart(game.level - 1);
//        }
//        return;
//    }

function uiMouseDown() {
    document.getElementById("debug-text").innerHTML = "mouse down";
  // Set timeout
//  pressTimer = window.setTimeout(function() { ... Your Code ...},1000);
    return false;
}

/*****************************************************************************
 * Register button event handlers
 *****************************************************************************/
buttonUndo.addEventListener("click", uiUndo);

buttonRestart.addEventListener("mouseup", uiMouseUp);
buttonRestart.addEventListener("mousedown", uiMouseDown);
buttonRestart.addEventListener("click", uiRestart);

