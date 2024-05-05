'use strict'

const BOARD_SIZE = 14
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3

const HERO = '♆'
const ALIEN = '👽'
const LASER = '⤊'

const SKY = 'SKY'
const GROUND = 'GROUND'

// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}
var gBoard

var gGame

// Called when game loads
function init() {
    gGame = {
        isOn: true,
        alienCount: 0,
        score: 0
    }

    gBoard = createBoard()
    console.log(gBoard)

    createHero(gBoard)
    createAliens(gBoard)
    moveAliens()

    renderBoard(gBoard)

    hideModal()
    updateScore(0)
}

// Create and returns the board with aliens on top, ground at bottom
// use the functions: createCell, createHero, createAliens
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

// Render the board as a <table> to the page
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
            }
            `</td>`
        }
        strHTML += '</tr>'
    }
    const elBoardContainer = document.querySelector('.board-container')
    elBoardContainer.innerHTML = strHTML
}



// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject
    }
}

// position such as: {i: 2, j: 7}
function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || ''
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
}

