/*****************************************************************************
 * Level initialization
 *****************************************************************************/
function levelStart(level) {
    if (level < gameLevels.length) {
        /* Use predefined levels */
        game.init(level,
                  gameLevels[level].width, gameLevels[level].height,
                  gameLevels[level].moves);
    } else {
        game.init(level,
                  gameLevels[gameLevels.length - 1].width,
                  gameLevels[gameLevels.length - 1].height,
                  gameLevels[gameLevels.length - 1].moves + ((level - gameLevels.length) + 1) * 3);
    }
    uiBoardDraw(game.board);
}

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
 * Start game from save point
 *****************************************************************************/
level = JSON.parse(localStorage.getItem("game-level"));
if (level == undefined) {
    levelStart(0);
} else {
    levelStart(level);
}


