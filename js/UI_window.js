/*****************************************************************************
 * Game window handling
 *****************************************************************************/
function windowResize() {
    if (gameGridWidth != gameGrid.clientWidth) {
        gameGridWidth = gameGrid.clientWidth;
        uiBoardSetup(game.board);
    }
}


/*****************************************************************************
 * Window event handlers
 *****************************************************************************/
window.addEventListener("resize", windowResize);

