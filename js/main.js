
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
/*
    {width: 3, height: 3, moves: 4},
    {width: 3, height: 3, moves: 8},

    {width: 4, height: 4, moves: 12},
    {width: 3, height: 3, moves: 12},

    {width: 4, height: 4, moves: 16},
    {width: 3, height: 3, moves: 16},

    {width: 4, height: 4, moves: 20},
    {width: 3, height: 3, moves: 20},

    {width: 4, height: 4, moves: 24},
    {width: 3, height: 3, moves: 24},
*/

//    {width: 4, height: 4, moves: 28},
    {width: 3, height: 3, moves: 28},

];



/*****************************************************************************
 * Create game
 *****************************************************************************/
var game = new Game();
uiStartLevel(0);


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


