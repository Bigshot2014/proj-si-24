'use strict'

const ALIEN_IMG = '<img src="img/alien.png">'

const ALIEN_SPEED = 500
var gAliens = []

var gIntervalAliens


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

    gAliensTopRowIdx = 0
    gAliensBottomRowIdx = gAliensTopRowIdx + ALIEN_ROW_COUNT - 1
}


function createAlien(board, row, col) {
    const alien = {
        location: { i: row, j: col }
    }
    gAliens.push(alien)
    board[alien.location.i][alien.location.j].gameObject = ALIEN
    gGame.alienCount++
}

function shiftBoardRight(board, fromI, toI) {
    for (var i = fromI; i <= toI; i++) {
        for (var j = board[i].length - 1; j > 0; j--) {
            board[i][j].gameObject = board[i][j - 1].gameObject
        }
        board[i][0] = { type: 'SKY', gameObject: null }
    }
    return board
}

function shiftBoardLeft(board, fromI, toI) {
    for (var i = fromI; i <= toI; i++) {
        for (var j = 0; j < board[i].length - 1; j++) {
            board[i][j].gameObject = board[i][j + 1].gameObject
        }
        board[i][board[i].length - 1] = { type: 'SKY', gameObject: null }
    }
    return board
}

function shiftBoardDown(board, fromI, toI) {

    for (var j = 0; j < board[0].length; j++) {
        for (var i = toI; i > fromI; i--) {
            board[i][j].gameObject = board[i - 1][j].gameObject
        }
        board[fromI][j] = { type: 'SKY', gameObject: null }
    }
    return board
}

function moveAliens() {
    if (!gGame.isOn || !gIsAlienFreeze) return

     var moveRight = true
    
    gIntervalAliens = setInterval(() => {
     
        if (moveRight) {
            shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
        } else {
            if (gBoard[gAliensTopRowIdx][0].gameObject === ALIEN) {

                if (isBottomRowEmpty()) {
                    gAliensBottomRowIdx--
                }

                gAliensBottomRowIdx++

                shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    
                gAliensTopRowIdx++

                renderBoard(gBoard)

                moveRight = true

            } else shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
        }

        if (checkAliensOnHeroRow()) gameOver()

        renderBoard(gBoard)

        if (gBoard[gAliensTopRowIdx][BOARD_SIZE - 1].gameObject === ALIEN) {
            if (isBottomRowEmpty()) {
                gAliensBottomRowIdx--
            }

            gAliensBottomRowIdx++
            shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
         
            gAliensTopRowIdx++
            
            renderBoard(gBoard)

            moveRight = false
        }
    }, ALIEN_SPEED)
}


function isBottomRowEmpty() {
    for (var j = 0; j < BOARD_SIZE; j++) {
        if (gBoard[gAliensBottomRowIdx][j].gameObject === ALIEN) {
            return false
        }
    }
    return true
}

function checkAliensOnHeroRow() {
    const heroRowIdx = gHero.pos.i
    
    for (var j = 0; j < BOARD_SIZE; j++) {
        if (gBoard[heroRowIdx][j].gameObject === ALIEN) return true
    }
    return false
}

function updateAlienCount() {
    document.querySelector('span.aliens-count').innerText = gGame.alienCount
}

function getAlienHTML() {
    return `<span class="alien">${ALIEN_IMG}</span>`
}