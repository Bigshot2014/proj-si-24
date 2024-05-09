'use strict'

const BOARD_SIZE = 14
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3

const HERO = '♆'
const ALIEN = '👽'
const LASER = '⤊'
const SUPER_LASER = '^'
const BLAST = '#'

const SKY = 'SKY'

var gBoard

var gGame 

function init() {

    gGame = {
        isOn: false,
        alienCount: 0,
        score: 0
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
                strHTML += getAlienHTML()
            } else if (cell.gameObject === LASER) {
                strHTML += getLaserHTML()
            } else if (cell.gameObject === SUPER_LASER) {
                strHTML += getSuperLaserHTML()
            } else if (cell.gameObject === BLAST) {
                strHTML += getBlastHTML()
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

