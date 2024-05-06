'use strict'

const HERO_IMG = '<img src="img/hero.png">'
const LASER_IMG = '<img src="img/laser.png">'
const SUPER_LASER_IMG = '<img src="img/super-laser.png">'

const LASER_SPEED = 80
const SUPER_LASER_SPEED = 120
var gLaserInterval

var gHero = {
    pos: {
        i: 12,
        j: 5
    },
    isShoot: false,
    isSuper: false,
    superAttacks: 3
}

function createHero(board) {
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO

}

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
        case 'KeyN':
            console.log('Blow up neighbors')
            break;
        case 'KeyX':
            getSuperMode()

            break;
    }
}



function moveHero(dir) {

    const currPosJ = gHero.pos.j
    const nextPosJ = currPosJ + dir

    if (nextPosJ < 0 || nextPosJ > BOARD_SIZE - 1) return

    updateCell(gHero.pos, null)

    gHero.pos.j = nextPosJ
    updateCell(gHero.pos, HERO)

    renderBoard(gBoard)

}

function shoot() {
    if (gHero.isShoot) return

    gHero.isShoot = true

    var laserPos = { i: gHero.pos.i - 1, j: gHero.pos.j }

    clearInterval(gLaserInterval)

    gLaserInterval = setInterval(() => {
        laserPos.i--

        if (laserPos.i >= 0) {

            if (gHero.isSuper) {
                blinkSuperLaser(laserPos)
            } else {
                blinkLaser(laserPos)
            }

        } else {
            clearInterval(gLaserInterval)
            gHero.isSuper = false

            gHero.isShoot = false
        }
    }, !gHero.isSuper ? LASER_SPEED : SUPER_LASER_SPEED)
}

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

function returnIfCanSuperAttack() {
    return gHero.superAttacks > 0
}

function getSuperMode() {
    if (returnIfCanSuperAttack()) {
        console.log('Activate Super Mode')
        gHero.isSuper = true
        gHero.superAttacks--
    } else {
        console.log('No attacks')
    }
}

function blinkSuperLaser(pos) {

    const currCell = gBoard[pos.i][pos.j]

    if (currCell.gameObject === ALIEN) {
        handleAlienHit(pos)
        clearInterval(gLaserInterval)

    } else {
        updateCell(pos, SUPER_LASER)
        renderBoard(gBoard)

        setTimeout(() => {
            updateCell(pos, null)
            renderBoard(gBoard)

        }, SUPER_LASER_SPEED - 20)
    }
}

function getHeroHTML() {
    return `<span class="hero">${HERO_IMG}</span>`
}

function getLaserHTML() {
    return `<span class="laser">${LASER_IMG}</span>`
}

function getSuperLaserHTML() {
    return `<span class="super-laser">${SUPER_LASER_IMG}</span>`
}