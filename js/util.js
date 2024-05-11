'use strict'

function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject
    }
}

function getElCell(pos) {
    return document.querySelector(`[data-i='${pos.i}'][data-j='${pos.j}']`)
}

function updateScore(diff) {
    if (!diff) {
        gGame.score = 0
    } else {
        gGame.score += diff
    }
    document.querySelector('span.score').innerText = gGame.score
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

