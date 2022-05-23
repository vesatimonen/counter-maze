
/*****************************************************************************
 * Game visibility handling
 *****************************************************************************/
function hideGame() {
    gameScreen.style.visibility = "hidden";
}

function drawGame() {
    uiDrawBoard(game.board);
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
game.board.init(6, 4);
game.board.randomize(16);


/*****************************************************************************
 * Start game
 *****************************************************************************/
hideGame();
drawGame();


/*
    STORAGE -> GAME continue
    //localStorage.setItem("gamestate", JSON.stringify(game));
    //game = JSON.parse(localStorage.getItem("gamestate"));
    //document.getElementById("debug_text").innerHTML = ": " + test;

    game.init(savepoint);
*/

