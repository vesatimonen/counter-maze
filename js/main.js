
/*****************************************************************************
 * Game visibility handling
 *****************************************************************************/
function hideGame() {
    gameScreen.style.visibility = "hidden";
}

function drawGame() {
    uiDrawBoard(game);
}

function showGame() {
    gameScreen.style.visibility = "visible";
}

function resizeGame() {
    if (gameBoardWidth != gameBoard.clientWidth) {
        gameBoardWidth = gameBoard.clientWidth;
        drawGame();
    }
}

/*****************************************************************************
 * Window event handlers
 *****************************************************************************/
window.addEventListener("load",   showGame);
window.addEventListener("resize", resizeGame);


/*****************************************************************************
 * Create game
 *****************************************************************************/
var game = new Game();
game.init(6, 4);


/*****************************************************************************
 * Start game
 *****************************************************************************/
hideGame();
drawGame();
