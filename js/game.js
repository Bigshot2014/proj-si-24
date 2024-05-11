'use strict'

const BOARD_SIZE = 14
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3

const HERO = '♆'
const ALIEN = '👽'
const LASER = '⤊'
const SUPER_LASER = '^'
const BLAST = 'B'
const SPACE_CANDY = 'C'

const SKY = 'SKY'

const SPACE_CANDY_IMG = '<img src="img/space-candy.png">'

var gBoard
var gGame

var gCandiesInterval

function init() {

    gGame = {
        isOn: false,
        alienCount: 0,
        score: 0,
        dir: 'right'
    }

    gBoard = createBoard()

    createHero(gBoard)
    createAliens(gBoard)

    gIsAlienFreeze = false
    renderBoard(gBoard)

    hideModal()
    updateSuperAttacksCount(0)
}

function createBoard() {

    const board = []
    const size = BOARD_SIZE

    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = createCell()
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            const className = `cell cell-${i}-${j} `
            strHTML += `<td data-i="${i}" data-j="${j}" class="sky ${className}$">`
            if (cell.gameObject === HERO) {
                strHTML += getHeroHTML()
            } else if (cell.gameObject === ALIEN) {
                strHTML += getAlienHTML(i)
            } else if (cell.gameObject === LASER) {
                strHTML += getLaserHTML()
            } else if (cell.gameObject === SUPER_LASER) {
                strHTML += getSuperLaserHTML()
            } else if (cell.gameObject === BLAST) {
                strHTML += getBlastHTML()
            } else if (cell.gameObject === SPACE_CANDY) {
                strHTML += getSpaceCandyHTML()
            }
            `</td>`
        }
        strHTML += '</tr>'
    }
    const elBoardContainer = document.querySelector('.board-container')
    elBoardContainer.innerHTML = strHTML
}

function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject
    }
}

function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || ''
}

function startGame() {
    if (gGame.isOn) return
    gGame.isOn = true

    gIntervalAliens = setInterval(moveAliens, ALIEN_SPEED)
    placeSpaceCandies()

    document.querySelector('.start-btn').classList.add('disabled')
    document.querySelector('.restart-btn').classList.remove('disabled')

}

function restartGame() {
    clearInterval(gIntervalAliens)
    clearInterval(gCandiesInterval)

    init()
    gGame.isOn = true

    gIntervalAliens = setInterval(moveAliens, ALIEN_SPEED)
    placeSpaceCandies()

    var elStartBtn = document.querySelector('.start-btn')
    elStartBtn.classList.add('disabled')
    var elRestartBtn = document.querySelector('.restart-btn')

    elRestartBtn.classList.add('disabled')
    elRestartBtn.removeAttribute('onclick')

    setTimeout(() => {
        elRestartBtn.setAttribute('onclick', 'restartGame()')
        elRestartBtn.classList.remove('disabled')
    }, 5000)

}

function checkVictory() {
    if (gGame.alienCount !== 0) return
    gGame.isOn = false
    showModal('Victory')
}

function gameOver() {
    clearInterval(gIntervalAliens)
    clearInterval(gCandiesInterval)
    gGame.isOn = false
    showModal('Game Over')
}

function showModal(msg) {
    document.querySelector('.modal').classList.toggle('hidden')
    document.querySelector('span.msg').innerText = msg
}

function hideModal() {
    document.querySelector('.modal').classList.add('hidden')
    document.querySelector('.start-btn').classList.remove('disabled')
}

function placeSpaceCandies() {
    gCandiesInterval = setInterval(() => {
        if (gAliensTopRowIdx === 0) return

        const randomColIdx = getRandomIntInclusive(0, BOARD_SIZE - 1)

        for (var j = 0; j < BOARD_SIZE; j++) {
            if (gBoard[0][j].gameObject === null) {
                updateCell({ i: 0, j: randomColIdx }, SPACE_CANDY)
                renderBoard(gBoard)
                break;
            }
        }
    }, 10000)
}

function handleSpaceCandyHit(pos) {
    const currCell = gBoard[pos.i][pos.j]

    if (currCell.gameObject === SPACE_CANDY) {
        removeAlien(pos)
        clearInterval(gLaserInterval)

        updateScore(50)
        toggleFreeze()

        gHero.isShoot = false
    }
    renderBoard(gBoard)
}


function getSpaceCandyHTML() {
    return `<span class="space-candy">${SPACE_CANDY_IMG}</span>`
}
