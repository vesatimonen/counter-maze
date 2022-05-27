/*****************************************************************************
 * Game window handling
 *****************************************************************************/
function windowResize() {
    if (gameBoardWidth != gameBoard.clientWidth) {
        gameBoardWidth = gameBoard.clientWidth;
        uiBoardSetup(game.board);
    }
}


/*****************************************************************************
 * Window event handlers
 *****************************************************************************/
window.addEventListener("resize", windowResize);

