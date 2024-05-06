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
    updateAlienCount()
    updateScore(10)

    checkVictory()

    gHero.isShoot = false

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
    
    if (fromI > 0) fromI--
    
    for (var j = 0; j < board[fromI].length; j++) {
        for (var i = toI; i > fromI; i--) {
            board[i][j] = board[i - 1][j] 
        }
        board[fromI][j] = { type: 'SKY', gameObject: null }
    }
    return board
}


function moveAliens() {
    if (!gGame.isOn || !gIsAlienFreeze) return

    var gAliensTopRowIdx = 0
    var gAliensBottomRowIdx = gAliensTopRowIdx + ALIEN_ROW_COUNT - 1

    const heroRowIdx = gHero.pos.i

    var rightDir = true


    const moveAliensInterval = () => {
 
        if (rightDir) { 
            shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
            renderBoard(gBoard)

            if (gBoard[gAliensTopRowIdx][BOARD_SIZE - 1].gameObject === ALIEN) {
                gAliensTopRowIdx++
                gAliensBottomRowIdx++
                
                shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
                renderBoard(gBoard)
            
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

        
                rightDir = true
            }
 
        }
            
    if (isAlienAtHeroRow(gBoard, heroRowIdx, gAliensBottomRowIdx)) {
        gameOver()
        return
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

function isAlienAtHeroRow(board, heroRowIdx, bottomRowIdx) {
    for (var j = 0; j < BOARD_SIZE; j++) {
        if (board[bottomRowIdx][j].gameObject === ALIEN && bottomRowIdx === heroRowIdx) {
            return true
        }
    }
    return false
}

