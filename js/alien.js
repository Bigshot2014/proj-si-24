'use strict'

const ALIEN_IMG = '<img src="img/alien.png">'

const ALIEN_SPEED = 500
var gAliens = []

var gIntervalAliens

// // The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx
var gAliensBottomRowIdx

var gIsAlienFreeze = true


function createAliens(board) {
    gAliens = []
    for (var i = 0; i < ALIEN_ROW_COUNT; i++) {
        for (var j = 0; j < ALIEN_ROW_LENGTH; j++) {
            createAlien(board, i, j)
        }
    }
    updateAlienCount()
}


function createAlien(board, row, col){
const alien = { 
    location: {i: row, j: col }
 }
    gAliens.push(alien)
    board[alien.location.i][alien.location.j].gameObject = ALIEN
    gGame.alienCount++
}

function handleAlienHit(pos) { 
    updateCell(pos, null)

    gGame.alienCount--
    updateAlienCount(-1)
    updateScore(10)

    checkVictory()

    gHero.isShoot = false

}

function shiftBoardRight(board, fromI, toI) {
    for (var i = fromI; i <= toI; i++) {
        for (var j = board[i].length - 1; j > 0; j--) {
            board[i][j] = board[i][j - 1] 
        }
        board[i][0] = { gameObject: null }
    }
    return board
}

function shiftBoardLeft(board, fromI, toI) {
    for (var i = fromI; i <= toI; i++) {
        for (var j = 0; j < board[i].length - 1; j++) {
            board[i][j] = board[i][j + 1] 
        }
        board[i][board[i].length - 1] = { gameObject: null }
    }
    return board
}


function shiftBoardDown(board, fromI, toI) {
    
    if (fromI > 0) fromI--
    
    for (var j = 0; j < board[fromI].length; j++) {
        for (var i = toI; i > fromI; i--) {
            board[i][j] = board[i - 1][j] 
        }
        board[fromI][j] = { gameObject: null }
    }
    return board
}

// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops

function moveAliens() {
    if (!gIsAlienFreeze) return

    let gAliensTopRowIdx = 0
    let gAliensBottomRowIdx = gAliensTopRowIdx + ALIEN_ROW_COUNT - 1

    let rightDir = true

    const moveAliensInterval = () => {

        if (rightDir) { 
            shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
            renderBoard(gBoard)

            if (gBoard[gAliensTopRowIdx][BOARD_SIZE - 1].gameObject === ALIEN) {

                gAliensTopRowIdx++
                gAliensBottomRowIdx++
                
                
                shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
                renderBoard(gBoard)
                
                if (gAliensBottomRowIdx === BOARD_SIZE - 2) { 
                    gameOver()
                    return
                }

                rightDir = false
            }
        } else {
            shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
            renderBoard(gBoard)

            if (gBoard[gAliensTopRowIdx][0].gameObject === ALIEN) {
                gAliensTopRowIdx++
                gAliensBottomRowIdx++
                shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
                renderBoard(gBoard)

                if (gAliensBottomRowIdx === BOARD_SIZE - 2) {
                    gameOver()
                    return
                }

                rightDir = true
            }
        }
    }
    gIntervalAliens = setInterval(moveAliensInterval, ALIEN_SPEED)
}

function updateAlienCount() {
    document.querySelector('span.aliens-count').innerText = gGame.alienCount
}

function getAlienHTML() {
    return `<span class="alien">${ALIEN_IMG}</span>`
}


// // unit testing right
// var input = [
    //     [null, 'l', 'a'],
    //     ['a', null, 'l'],
    //     ['l', 'a', null]
    // ]
    // var expected = [
        //     [null, null, 'l'],
        //     ['a', null, 'a'],
        //     ['l', 'l', null]
        // ]
        
        // console.table(input)
        // console.table(expected)
        // console.log(shiftBoardRight(input, 0, 2)) // gameObject: null is same is null
        
        // // unit testing left
        // var input = [
        //     [null, 'l', 'a'],
        //     ['a', null, 'l'],
        //     ['l', 'a', null]
        // ]
        // var expected = [
        //     ['l', 'a', null],
        //     [null, 'l', null],
        //     ['a', null, null]
        // ]
        
        // console.table(input)
        // console.table(expected)
        // console.log(shiftBoardLeft(input, 0, 2)) // gameObject: null is same is null

        // unit testing down
        // var input = [
            //     [null, 'l', 'a'],
            //     ['a', null, 'l'],
            //     ['l', 'a', null]
            // ]
            // var expected = [
                //     [null, null, null],
                //     [null, 'l', 'a'],
//     ['a', null, 'l']
// ]

// console.table(input)
// console.table(expected)
// console.log(shiftBoardDown(input, 0, 2)) // gameObject: null is same is null