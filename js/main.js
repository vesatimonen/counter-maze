
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
 * Game levels
 *****************************************************************************/
var gameLevels = [
    {width: 5, height: 5, moves: 3},
];



/*****************************************************************************
 * Create game
 *****************************************************************************/
var game = new Game();

/*****************************************************************************
 * Read save point
 *****************************************************************************/
level = JSON.parse(localStorage.getItem("game-level"));
if (level == undefined) {
    uiStartLevel(0);
} else {
    uiStartLevel(level);
}

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


