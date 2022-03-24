'use strict'

const MINE = '💥'
const FLAG = '🚩'

var gIsGameOver
var gIsGameOn
var gIsFirstMove
var gLives
var gLevel = {
    difficulty: 'easy',
    size: 8,
    mines: 12
}

var gHighscore = {
    easy: Infinity,
    medium: Infinity,
    expert: Infinity
}


var gBoard

var gNumOfCells

function initGame() {
    gIsFirstMove = true
    resetTimer()
    gLives = 3
    reviveHearts()
    gBoard = buildBoard(gLevel)
    gIsGameOn = true
    var elButton = document.querySelector('.smiley-button')
    elButton.innerText = '😀'
    gIsGameOver = false
    // gIsFirstMove = true
    gNumOfCells = 0
    renderBoard(gBoard)
}

function checkCellNegs(board, cellI, cellJ) {
    // debugger
    // console.log('i is :', cellI, 'j is :', cellJ)
    var mineCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine === true) {
                mineCount++
            }
        }
    }
    // console.log(mineCount)
    return mineCount
}



function setMinesNegCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j]
            currCell.minesAroundCount = checkCellNegs(board, i, j)
        }
    }
}


function buildBoard(level) {
    var board = []
    for (var i = 0; i < level.size; i++) {
        board[i] = []
        for (var j = 0; j < level.size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }

            board[i][j] = cell
        }
    }
    var randomLocations = getRandomLocations(gLevel)
    for (var i = 0; i < gLevel.mines; i++) {
        var currRandomLocation = randomLocations[i]
        board[currRandomLocation.i][currRandomLocation.j].isMine = true
    }

    setMinesNegCount(board)

    return board
}

// console.table(buildBoard(gLevel))


function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            // var className = (cell) ? 'occupied' : ''
            if (cell.isMine) {
                strHTML += `<td oncontextmenu="return false, cellMarked(this,${i}, ${j})" onclick="cellClicked(this, ${i}, ${j})"
                        class ="cell-${i}-${j} hidden"> ${MINE}  </td>`
            } else {
                strHTML += `<td oncontextmenu="return false, cellMarked(this,${i}, ${j})" onclick="cellClicked(this, ${i}, ${j}, event)"
                            class ="cell-${i}-${j} hidden"> ${cell.minesAroundCount} </td>`
            }
        }
        strHTML += '</tr>'
    }

    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

}



function cellClicked(elCell, i, j) {
    if (!gIsGameOn) return
    if (gBoard[i][j].isShown) return
    if (gIsFirstMove) {
        startClock()
        gIsFirstMove = false
    }


    if (gBoard[i][j].isMine) {
        if (gBoard[i][j].isMarked) {
            elCell.classList.toggle(`flagged`)
            elCell.innerText = MINE
        }
        var audio = new Audio('sounds/mine.mp3');
            audio.play();
        elCell.classList.toggle(`mine`)
        elCell.classList.toggle(`hidden`)
        var elLive = document.querySelector(`.live${gLives}`)
        elLive.innerText = ('🖤')
        gLives--
        if (gLives === 0) {
            gIsGameOver = true
        }

    } else {
        if (gBoard[i][j].isMarked) {
            return
            // elCell.classList.toggle(`flagged`)
            // elCell.innerText = gBoard[i][j].minesAroundCount
        }
        elCell.classList.toggle(`number${gBoard[i][j].minesAroundCount}`)
        elCell.classList.toggle(`hidden`)
        gBoard[i][j].isShown = true
    }
    if (gBoard[i][j].minesAroundCount === 0) expandShown(gBoard, i, j)
    checkGameOver()
    // if (gIsFirstMove) {
    //     plantMines(gLevel.mines)
    // }
}


function cellMarked(elCell, i, j) {
    if (!gIsGameOn) return

    if (gBoard[i][j].isMarked === false) {
        elCell.innerText = FLAG
        elCell.classList.toggle(`flagged`)
        elCell.classList.toggle(`hidden`)
        gBoard[i][j].isShown = false
        gBoard[i][j].isMarked = true
    } else {
        if (gBoard[i][j].isMine === true) {
            elCell.innerText = MINE
            elCell.classList.toggle(`flagged`)
            elCell.classList.toggle(`hidden`)
        } else {
            elCell.innerText = gBoard[i][j].minesAroundCount
            elCell.classList.toggle(`flagged`)
            elCell.classList.toggle(`hidden`)
        }
        gBoard[i][j].isMarked = false
    }
    checkGameOver()
    return false
}


function checkGameOver() {
    var elButton = document.querySelector('.smiley-button')
    console.log()
    if (gIsGameOver) {
        elButton.innerText = '🤯'
        var audio = new Audio('sounds/dead.mp3');
        audio.play();
        stopClock()
        gIsGameOn = false
    } else {
        if (checkBoard(gBoard)) {
            stopClock()
            elButton.innerText = '😎'
            var audio = new Audio('sounds/win.wav');
            audio.play();
            gIsGameOn = false
        }
    }
}


function checkBoard(gBoard) {
    var numOfFlaggedMines = 0
    var numOfShownCells = 0

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine && gBoard[i][j].isMarked) {
                numOfFlaggedMines++
            }
            if (gBoard[i][j].isShown) {
                numOfShownCells++
            }
        }
    }

    if (numOfFlaggedMines === gLevel.mines && numOfShownCells === (gLevel.size ** 2 - gLevel.mines)) {
        return true
    } else {
        return false
    }
}


function expandShown(board, cellI, cellJ) {
    // debugger
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine) continue
            if (board[i][j].isShown) continue

            if (board[i][j].isMarked === false) {
                var elCurrCell = document.querySelector(`.cell-${i}-${j}`)
                elCurrCell.classList.toggle(`number${gBoard[i][j].minesAroundCount}`)
                elCurrCell.classList.toggle(`hidden`)
                board[i][j].isShown = true
                if (board[i][j].minesAroundCount === 0) {
                    expandShown(board, i, j)
                }
            }

        }
    }
}


function reviveHearts() {
    for (var i = 1; i <= 3; i++) {
        var elLive = document.querySelector(`.live${i}`)
        elLive.innerText = ('❤️')
    }
}

// function checkHighscore(clockTime, gLevel) {
//     var currLvl = gLevel.difficulty
//     if (clockTime < gHighscore[currLvl]) {
//         gHighscore = clockTime
//     }
// }









