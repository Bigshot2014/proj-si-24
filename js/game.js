'use strict'

const BOARD_SIZE = 14
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3

const HERO = '♆'
const ALIEN = '👽'
const LASER = '⤊'
const SUPER_LASER = '^'

const SKY = 'SKY'
const GROUND = 'GROUND'

var gBoard

var gGame = {
    isOn: false,
    alienCount: 0,
    score: 0
}

function init() {

    resetGame()
    gBoard = createBoard()

    createHero(gBoard)

    gGame.alienCount = 0
    createAliens(gBoard)

    renderBoard(gBoard)
}

function resetGame() {
    hideModal()
    updateScore(0)
}


function createBoard() {

    const board = []
    const size = BOARD_SIZE

    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = createCell()

            if (i === size - 1) board[i][j].type = GROUND
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

            var cellClass = ''
            if (cell.gameObject !== null || cell.gameObject === LASER) {
                cellClass = 'sky'
            } else {
                cellClass = (cell.type === SKY || cell.type !== GROUND) ? 'sky' : 'ground'
            }

            strHTML += `<td data-i="${i}" data-j="${j}" class="${className}${cellClass}">`
            if (cell.gameObject === HERO) {
                strHTML += getHeroHTML()
            } else if (cell.gameObject === ALIEN) {
                strHTML += getAlienHTML()
            } else if (cell.gameObject === LASER) {
                strHTML += getLaserHTML()
            } else if (cell.gameObject === SUPER_LASER) {
                strHTML += getSuperLaserHTML()
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
    moveAliens()

    document.querySelector('.start-btn').classList.add('disabled')
    document.querySelector('.restart-btn').classList.remove('disabled')

}

function restartGame() {
    clearInterval(gIntervalAliens)
    init()
    gGame.isOn = true
    moveAliens()

    document.querySelector('.start-btn').classList.add('disabled')
    document.querySelector('.restart-btn').classList.remove('disabled')
}

function checkVictory() {
    if (gGame.alienCount !== 0) return
    gGame.isOn = false
    showModal('Victory')
}

function gameOver() {
    clearInterval(gIntervalAliens)
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

