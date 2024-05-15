'use strict'

const HERO_IMG = '<img src="img/hero.png">'
const LASER_IMG = '<img src="img/laser.png">'
const SUPER_LASER_IMG = '<img src="img/super-laser.png">'
const BLAST_IMG = '<img src="img/blast.png">'


const LASER_SPEED = 80
const SUPER_LASER_SPEED = 60

var gLaserInterval
var gCurrLaserPos = { i: null, j: null }

var gShieldInterval

const BLAST_DURATION = 1000

var gHero = {
    pos: {
        i: 12,
        j: 5
    },
    isShoot: false,
    isSuper: false,
    isShield: false,

    superAttackCount: 3,
    life: 3,
    shields: 3

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
            blowUpNegs()
            break;
        case 'KeyX':
            if (gHero.superAttackCount === 0) return
            getSuperMode()
            break;
        case 'KeyZ':
            if (gHero.isShield) return
            getShield()
            break;
    }
}

function moveHero(dir) {
    if (!gGame.isOn) return

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
            var elSuperAttackCount = document.querySelector('.super-attacks-count')
            elSuperAttackCount.classList.remove('super-activated')
            elSuperAttackCount.innerText = 'No Super Attacks'
        }
    }
    gHero.isShoot = true

    var laserPos = { i: gHero.pos.i - 1, j: gHero.pos.j }
    gCurrLaserPos = laserPos

    const laserSpeed = gHero.isSuper ? SUPER_LASER_SPEED : LASER_SPEED

    gLaserInterval = setInterval(() => {
        laserPos.i--

        if (laserPos.i < 0) {
            clearInterval(gLaserInterval)
            gHero.isShoot = false
            return
        }

        handleAlienHit(laserPos, 1)

        handleSpaceCandyHit(laserPos)

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

    setTimeout(() => {
        if (gBoard[pos.i][pos.j].gameObject === laserMode) {
            updateCell(pos, null)
        }
    }, laserSpeed - 20)
}


function blowUpNegs() {
    if (gCurrLaserPos.i === null && gCurrLaserPos.j === null) return
    const negPositions = getNegsPos(gCurrLaserPos)

    var alienBlownCount = 0

    for (var k = 0; k < negPositions.length; k++) {
        const negPos = negPositions[k]

        if (negPos.i >= 0 && negPos.i < gBoard.length && negPos.j >= 0 && negPos.j < gBoard[0].length) {

            const currCell = gBoard[negPos.i][negPos.j]

            if (currCell.gameObject === ALIEN) {

                updateCell(negPos, BLAST)
                renderBoard(gBoard)


                setTimeout(() => {
                    updateCell(negPos, null)
                    renderBoard(gBoard)

                }, BLAST_DURATION)
            }
            alienBlownCount++

        }
        handleAlienHit(gCurrLaserPos, alienBlownCount)
    }
}

function getNegsPos(pos) {
    var negPositions = []

    for (var dirI = -1; dirI <= 1; dirI++) {
        for (var dirJ = -1; dirJ <= 1; dirJ++) {
            if (dirI === 0 && dirJ === 0) continue

            const laserNegPos = { i: pos.i + dirI, j: pos.j + dirJ }
            negPositions.push(laserNegPos)
        }
    }
    return negPositions
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


function getLives() {
    var life = gHero.life
    var elLifeSpan = document.querySelector('.lives-container span')

    var countHeartsHtml = ''
    for (var i = 0; i < life; i++) {
        countHeartsHtml += '<img src="img/heart.png">'
    }
    elLifeSpan.innerHTML = countHeartsHtml
}

function getShield() {
    if (gHero.shields === 0) return

    gHero.isShield = true
    gHero.shields--
    
    updateShieldDisplay()
    
    var elPlayerSpan = document.querySelector('.hero')
    elPlayerSpan.style.backgroundColor = 'yellow'

    setTimeout(() => {
        deactivateShield()
    }, 5000)
}

function updateShieldDisplay() {
    var shieldCount = gHero.shields
    var elShieldSpan = document.querySelector('.shield-container span')
    
    var countShieldHtml = ''
    for (var i = 0; i < shieldCount; i++) {
        countShieldHtml += '<img src="img/shield.png">'
    }
    elShieldSpan.innerHTML = countShieldHtml
}

function deactivateShield() {
    clearInterval(gShieldInterval)
    gHero.isShield = false
    updateShieldDisplay()
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
    return `<span class="blast">${BLAST_IMG}</span>`
}