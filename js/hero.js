'use strict'

const HERO_IMG = '<img src="img/hero.png">'
const LASER_IMG = '<img src="img/laser.png">'

const LASER_SPEED = 80
var gLaserInterval

var gHero = { pos: { i: 12, j: 5 }, isShoot: false }

// creates the hero and place it on board

function createHero(board) {
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO

}
// Handle game keys
function onKeyDown(event) { 
    if (!gGame.isOn) return
    
    switch (event.code) {
        case 'ArrowLeft':
            moveHero(-1)
            break;
        case 'ArrowRight':
            moveHero(1) 
            break;
        case 'Space':
            shoot()
            break;
    }
}



// Move the hero right (1) or left (-1)
function moveHero(dir) { 

    const currPosJ = gHero.pos.j
    const nextPosJ = currPosJ + dir
    // console.log('nextPosJ:', nextPosJ)

    if (nextPosJ < 0 || nextPosJ > BOARD_SIZE - 1) return

    updateCell(gHero.pos, null)

    gHero.pos.j = nextPosJ
    updateCell(gHero.pos, HERO)

    renderBoard(gBoard)

}

// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() { 
    if (gHero.isShoot) return

    gHero.isShoot = true

    var laserPos = { i: gHero.pos.i - 1, j: gHero.pos.j }

    gLaserInterval = setInterval(() => {
        laserPos.i--
        if (laserPos.i >= 0) {
            blinkLaser(laserPos)

        } else {
            clearInterval(gLaserInterval)
            gHero.isShoot = false
        }
    }, LASER_SPEED)
}

// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {

    const currCell = gBoard[pos.i][pos.j]

    if (currCell.gameObject === ALIEN) {
        handleAlienHit(pos)
        clearInterval(gLaserInterval)
    } else {
        updateCell(pos, LASER)
        renderBoard(gBoard)

        setTimeout(() => {
            updateCell(pos, null)
            renderBoard(gBoard)
        }, LASER_SPEED - 20)
    }
}


function getHeroHTML() {
    return `<span class="hero">${HERO_IMG}</span>`
}

function getLaserHTML() {
    return `<span class="laser">${LASER_IMG}</span>`
}
