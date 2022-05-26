/*****************************************************************************
 * Move variables
 *****************************************************************************/
var frame       = undefined;
var frameStartX = undefined;
var frameStartY = undefined;


/*****************************************************************************
 * Move helpers
 *****************************************************************************/
function uiMoveDirection(newX, newY, oldX, oldY) {
    if (Math.abs(newX - oldX) > Math.abs(newY - oldY)) {
        /* Horizontal movement */
        if (newX < oldX) {
            return "left";
        } else {
            return "right";
        }
    } else {
        /* Vertical movement */
        if (newY < oldY) {
            return "up";
        } else {
            return "down";
        }
    }

    return "";
}

function uiMovePosition(event) {
    let X, Y;

    switch (event.type) {
        case "mousedown":
        case "mousemove":
        case "mouseup":
        case "mouseleave":
            X = event.clientX;
            Y = event.clientY;
            break;
        case "touchstart":
        case "touchmove":
        case "touchend":
        case "touchcancel":
            /* Ignore if touched multiple fingers */
            if (event.targetTouches > 1) {
                return undefined;
            }

            X = event.touches[0].clientX;
            Y = event.touches[0].clientY;
            break;
        default:
            return undefined;
    }

    let rect = gameBoard.getBoundingClientRect()
    X -= rect.left;
    Y -= rect.top;

    return {X, Y};
}


/*****************************************************************************
 * Move event handlers
 *****************************************************************************/
function uiMoveStart(event) {
    /* Check that target is frame */
    if (event.target.className != "frame") {
        return;
    }

    /* Save move start situation */
    frame        = event.target;
    frameStartX = parseInt(frame.style.left, 10);
    frameStartY = parseInt(frame.style.top, 10);
}

function uiMoveExecute(event) {
    if (frame != undefined) {
        let move = "";

        /* Get event position */
        let pos = uiMovePosition(event);
        if (pos == undefined) {
            return;
        }

        /* Check frame grid limits */
        let deltaX = pos.X - frameStartX;
        let deltaY = pos.Y - frameStartY;
        if (deltaX > gameBoardCellSize) {
            deltaX = gameBoardCellSize;
        }
        if (deltaX < -gameBoardCellSize) {
            deltaX = -gameBoardCellSize;
        }
        if (deltaY > gameBoardCellSize) {
            deltaY = gameBoardCellSize;
        }
        if (deltaY < -gameBoardCellSize) {
            deltaY = -gameBoardCellSize;
        }

        /* Check if deltaX, deltaY possible */
        move = uiMoveDirection(deltaX, 0, 0, 0);
        if (game.moveIsLegal(move) == false) {
            deltaX = 0;
        }
        move = uiMoveDirection(0, deltaY, 0, 0);
        if (game.moveIsLegal(move) == false) {
            deltaY = 0;
        }

        /* Select horizontal or vertical direction */
        let frameX = frameStartX + deltaX;
        let frameY = frameStartY + deltaY;
        if (deltaX != 0 && deltaY != 0) {
            /* Snap to main direction */
            if (Math.abs(pos.X - frameStartX) > Math.abs(pos.Y - frameStartY)) {
                frameY = frameStartY;
            } else {
                frameX = frameStartX;
            }
        }

        /* Move frame */
        frame.style.left = frameX + "px";
        frame.style.top  = frameY + "px";
    }
}

function uiMoveEnd(event) {
    if (frame != undefined) {
        /* Find out move direction */
        let frameX = parseInt(frame.style.left, 10);
        let frameY = parseInt(frame.style.top, 10);
        let move = uiMoveDirection(frameX, frameY, frameStartX, frameStartY);

        /* Check if moved more than half grid cell */
        if (Math.abs(frameX - frameStartX) >= gameBoardCellSize/2 ||
            Math.abs(frameY - frameStartY) >= gameBoardCellSize/2) {
            /* Execute move on game board */
            game.moveExecute(move);
        }

        /* Redraw board */
        uiGameRedraw(game);
    }

    /* End move */
    frame       = undefined;
    frameStartX = undefined;
    frameStartY = undefined;
}

function uiMoveCancel(event) {
    /* Redraw board */
    uiGameRedraw(game);

    /* End move */
    frame       = undefined;
    frameStartX = undefined;
    frameStartY = undefined;
}


/*****************************************************************************
 * Register mouse event handlers
 *****************************************************************************/
window.addEventListener("mousedown",  uiMoveStart);
window.addEventListener("mousemove",  uiMoveExecute);
window.addEventListener("mouseup",    uiMoveEnd);
window.addEventListener("mouseleave", uiMoveCancel);


/*****************************************************************************
 * Register touch event handlers
 *****************************************************************************/
window.addEventListener("touchstart", uiMoveStart);
window.addEventListener("touchmove",  uiMoveExecute);
window.addEventListener("touchend",   uiMoveEnd);

