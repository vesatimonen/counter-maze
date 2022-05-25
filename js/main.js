
/*****************************************************************************
 * Game visibility handling
 *****************************************************************************/
function hideGame() {
    gameScreen.style.visibility = "hidden";
}

function drawGame() {
    uiBoardDraw(game.board);
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
window.addEventListener("resize", resizeGame);


/*****************************************************************************
 * Create game
 *****************************************************************************/
var game = new Game();
game.init(6, 6, 7, 48);


/*****************************************************************************
 * Start game
 *****************************************************************************/
// hideGame();
drawGame();
//window.addEventListener("load",   showGame);


/*
    STORAGE -> GAME continue
    //localStorage.setItem("gamestate", JSON.stringify(game));
    //game = JSON.parse(localStorage.getItem("gamestate"));
    //document.getElementById("debug_text").innerHTML = ": " + test;

    game.init(savepoint);
*/


