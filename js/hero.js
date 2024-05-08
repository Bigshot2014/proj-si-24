'use strict'

const HERO_IMG = '<img src="img/hero.png">'
const LASER_IMG = '<img src="img/laser.png">'
const SUPER_LASER_IMG = '<img src="img/super-laser.png">'
const BLAST_IMG = '<img src="img/blast.png">'


const LASER_SPEED = 80
const SUPER_LASER_SPEED = 60
var gLaserInterval 

var gHero = {
    pos: {
        i: 12,
        j: 5
    },
    isShoot: false,
    isSuper: false,
    superAttackCount: 3
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
            blowUpNeg()
            break;
        case 'KeyX':
            if (gHero.superAttackCount === 0) return
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
    

    if (gHero.isSuper) {
        updateSuperAttacksCount(-1)

        if (gHero.superAttackCount < 0) {
            gHero.isSuper = false
            document.querySelector('.super-attacks-count').classList.remove('super-activated')
            document.querySelector('.super-attacks-count').innerText = 'No Super Attacks'
        }
    }

    gHero.isShoot = true
    var laserPos = { i: gHero.pos.i - 1, j: gHero.pos.j }
    getNegPos(laserPos)

    const laserSpeed = gHero.isSuper ? SUPER_LASER_SPEED : LASER_SPEED

    gLaserInterval = setInterval(() => {
        laserPos.i--

        if (laserPos.i < 0) {
            clearInterval(gLaserInterval)
            gHero.isShoot = false
            return
        }
        const currCell = gBoard[laserPos.i][laserPos.j]
        if (currCell.gameObject === ALIEN) {
            updateCell(laserPos, null)
            gGame.alienCount--
            updateAlienCount()
            checkVictory()
            gHero.isShoot = false
            clearInterval(gLaserInterval)
            renderBoard(gBoard)
            return
        }
        if (gHero.isSuper) {
            blinkLaser(laserPos, SUPER_LASER, laserSpeed)
        } else {
            blinkLaser(laserPos, LASER, laserSpeed)
        }
    }, laserSpeed)
}

function blinkLaser(pos, laserMode, laserSpeed) {
    updateCell(pos, laserMode)
    renderBoard(gBoard)
    setTimeout (() => {
        updateCell(pos, null)
        renderBoard(gBoard)

    }, laserSpeed - 20)
}


function getSuperMode() {
    if (gHero.isSuper || gHero.superAttackCount === 0 || gHero.isShoot) return
        gHero.isSuper = true
        document.querySelector('.super-attacks-count').classList.add('super-activated')
 }


function updateSuperAttacksCount(diff) {
    if (!diff) {
        gHero.superAttackCount = 3
    } else {
        gHero.superAttackCount += diff
    }
    document.querySelector('.super-attacks-count').innerText = `Super mode attacks: ${gHero.superAttackCount} (press x)`
}

function getNegPos(pos) {
    var negPositions = []

    for (var dirI = -1; dirI <= 1; dirI++) {
        for (var dirJ = -1; dirJ <= 1; dirJ++) {
            if (dirI === 0 && dirJ === 0) continue

            const laserNegPos = {i : pos.i + dirI, j: pos.j + dirJ}
            negPositions.push(laserNegPos)
        }
    }
    console.log('negPosition:', negPositions)
    return negPositions
}

function blowUpNeg() {
   if (!gHero.isShoot) return
   
    const negPositions = getNegPos()
    console.log('negPosition:', negPositions)

    for (var i = 0; i < negPositions.length; i++) {
        const negPos = negPositions[i]
        console.log('blow up::', negPos)
        const cell = gBoard[negPos.i][negPos.j]
        console.log('cell:', cell)

        if (cell.gameObject === ALIEN) {
            updateCell(negPos, BLAST)
        }
    }
    renderBoard(gBoard)
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
function getBlastHTML() {
    return `<span class="blast">${BLAST}</span>`
}