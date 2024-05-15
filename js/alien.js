'use strict'


var gAliens = []
var gRemovedAliens = []

var gIntervalAliens

var gAliensTopRowIdx
var gAliensBottomRowIdx

var gIsAlienFreeze

var gAliensShotInterval
var gRockInterval
const ROCK_SPEED = 200
const ROCK_IMG = '<img src="img/rock.png">'


function createAliens(board) {
    gAliens = []
    for (var i = 0; i < gLevel.ALIEN_ROW_COUNT; i++) {
        for (var j = 0; j < gLevel.ALIEN_ROW_LENGTH; j++) {
            createAlien(board, i, j)
        }
    }
    updateAlienCount()
    if (gIntervalAliens) clearInterval(gIntervalAliens)

    gAliensTopRowIdx = 0
    gAliensBottomRowIdx = gAliensTopRowIdx + gLevel.ALIEN_ROW_COUNT - 1

    // if (gAliensShotInterval) clearInterval(gAliensShotInterval)
        gAliensShotInterval = setInterval(alienShoot, 4000)

}

function createAlien(board, row, col) {
    const alienImg =  `img/alien${row + 1}.png`
    
    const alien = {
        location: { i: row, j: col },
        image: alienImg,
        isShoot: false
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
    if (!gGame.isOn || gIsAlienFreeze) return

    if (gGame.dir === 'right') {
        
        for (var i = 0; i < gAliens.length; i++) {
            const alien = gAliens[i]
            const nextCol = alien.location.j + 1
            if (nextCol > BOARD_SIZE - 1) {
                moveDown()
                gGame.dir = 'left'
                return
            }
            alien.location.j++
        }
        shiftBoardRight(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
        renderBoard(gBoard)
   
    } else if (gGame.dir === 'left') {
        for (var i = 0; i < gAliens.length; i++) {
            const alien = gAliens[i]
            const nextCol = alien.location.j - 1
            if (nextCol < 0) {
                moveDown()
                gGame.dir = 'right'
                return
            }
            alien.location.j--
        }
        shiftBoardLeft(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
        renderBoard(gBoard)

    }

    for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
        for (var j = 0; j < BOARD_SIZE; j++) {
            if (gBoard[i][j].gameObject === LASER || gBoard[i][j].gameObject === SUPER_LASER || gBoard[i][j].gameObject === BLAST) {
                gBoard[i][j].gameObject = null
            }       
        }
    }
}

function moveDown() {

    for (var i = 0; i < gAliens.length; i++) {
        const alien = gAliens[i]
        alien.location.i++
    }
    
    gAliensBottomRowIdx++
    
    shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    gAliensTopRowIdx++
    renderBoard(gBoard)

    if (checkAliensOnHeroRow()) gameOver()
    renderBoard(gBoard)

    if (gBoard[gAliensTopRowIdx][BOARD_SIZE - 1].gameObject === ALIEN) {
        if (isBottomRowEmpty()) {
            gAliensBottomRowIdx--
        }
    }
}

function handleAlienHit(pos, alienHitCount) {
    const currCell = gBoard[pos.i][pos.j]
    var count = alienHitCount
    if (currCell.gameObject === ALIEN) {
        removeAlien(pos)
        clearInterval(gLaserInterval)

        gGame.alienCount -= alienHitCount
        updateAlienCount()

        updateScore(10 * alienHitCount)
        checkVictory()    

        gHero.isShoot = false
    }
    renderBoard(gBoard)
}


function removeAlien(location) {
    for (let i = 0; i < gAliens.length; i++) {
        const currAlien = gAliens[i]
        if (currAlien.location.i === location.i && currAlien.location.j === location.j) {
            gAliens.splice(i, 1)
            gRemovedAliens.push(currAlien)

            updateCell(location, null)
        }
    }

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

function toggleFreeze() {
    gIsAlienFreeze = true

    setTimeout (() => {
    gIsAlienFreeze = false
    }, 5000)
 
}

function updateAlienCount() {
    document.querySelector('span.aliens-count').innerText = gGame.alienCount
}

function getAlienHTML(row) {
    var alien = gAliens.find(alien => alien.location.i === row)
    if (!alien) return
    return `<span class="alien"><img src="${alien.image}"></span>`
}

function getRockHTML() {
    return `<span class="rock">${ROCK_IMG}</span>`
}


function getAlienShooterPos() {
    const rockPositions = []

    for (var k = 0; k < BOARD_SIZE; k++) {
        const currCell = gBoard[gAliensBottomRowIdx][k]
        if (currCell.gameObject === ALIEN) {
            rockPositions.push({ i: gAliensBottomRowIdx, j: k})
        }   
    }
    var randomIdx = getRandomIntInclusive(0, rockPositions.length - 1)
    var rockPos = rockPositions[randomIdx]
    return rockPos
}

function alienShoot() {
    if (!gGame.isOn) return
    var alienPos = getAlienShooterPos()

    

    var rockPos = { i: alienPos.i + 1, j: alienPos.j}
    
    function moveRock() {
        
        rockPos.i++
        
        if (rockPos.i >= BOARD_SIZE) {
            clearInterval(gAliensShotInterval)
            return
        }
        blinkRock(rockPos)
        handleRockHit(rockPos)

        setTimeout(moveRock, ROCK_SPEED)
    }
   
    moveRock()

}

function startAlienShootingInterval() {
    clearInterval(gAliensShotInterval)
    gAliensShotInterval = setInterval(alienShoot, 2000)
}

function handleRockHit(pos) {
    if (pos.i === gHero.pos.i && pos.j === gHero.pos.j) {
        updateCell(gHero.pos, HERO)
        gHero.life--
        gameOver()
        getLives()

        clearInterval(gRockInterval)
        setTimeout(startAlienShootingInterval, 1000)

    } else {
        clearInterval(gRockInterval)
    }
    renderBoard(gBoard)
   
}

function blinkRock(pos) {
    updateCell(pos, ROCK)
    renderBoard(gBoard)

    setTimeout(() => {
        if (gBoard[pos.i][pos.j].gameObject === ROCK) {
            updateCell(pos, null)
        }
    }, ROCK_SPEED)
}


