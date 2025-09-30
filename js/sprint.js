//What to do about new versions of the project for gi
//ok finish this hint shit and then clean up the code and then you can replacde all the stuff you made code for with its functions

//Also to explain my reasoning for having the table render 2 images in one cell it's just something I thought would be easier to do. Might slightly regret working like this but whatever.
//Okay actual questions: Css styling names etc. What counts as a utility function ifi ts kind of specific? Are the brackets I did fine?
//What are the naming conventions again?
//if the hint stuff fails you can just disable clicking when a hint is on.. 
//Mine doesn't work with hint
//Do a flaggeed mine checker that only comes into play for the score
//how should the score thing even be calculcated? Im gonna do it so it doesn't matter time-wise and the whole if you won at first thing ill abandon
//OK YAIR SO FOR THE SCORE STUFF YOU CHECK IF ANYONE HAS WON YET. IF THEY HAVE THE HIGHEST SCORE WONT JUST BE OF MOST CLICKS ETC BUT WILL ALSO BE ABOUT TIME.
//How do icall these variables where half of them are the same but for the html table
const gMine = '&#169;'
const gFloor = '&#9829;'
const TILE_IMG = '<img src="img/TileUnknown.png" class = "cell-image">'
const PRESSED_IMG = '<img src="img/TileEmpty.png" class = "cell-image">'
const BOOM_IMG = '<img src="img/TileExploded.png" class = "cell-image">'
const TILE_FLAG = '<img src="img/TileFlag.png" class = "cell-image">'
const LIGHT_BULB_OFF = '<img src="img/Hint.png" class = "hint-ui">'
const TILE_WARNING = '<img src="img/TileWarning.png" class = "cell-image">'
const TILE_NONE = "img/TileNone.png"
const TILE_EMPTY = "img/TileEmpty.png"
const TILE_UNKNOWN = "img/TileUnknown.png"
//Correct all the misleading/ vague names

//Check every useless piece of code
//Restructure all the codeeeee especially the image stuff

//fix undo
//ASK IN SLACK: IS TEXTCONTENT OR INNERTEXT PREFFERED???
//How should the ordering of functions be again

//In megaclick should it be able to reveal the *Entire* board?

//For the recalculator does it need to be  able to be pressed multiple times?
//re-add tile fix it


//Change the hard written text to variables.. Maybe? IMPORTANT
//ask if you can have basically the entire lesson be like, about ui
//
//Should the ui in the style css reflect its position  in the page? Like its placement in the code should reflect that

var mineArray
var gTimedOut
var gBoard
var gFirstClick
var gExemptClick
var gLives
var gSafeClicks
var gUndoArray
var gIntervalId
var gLightBulb
var gMegaHintArray
var gRecalculationArray
var gManualMode
var gUndoIndex = 0
var gLevel
var gGame
var gReAddHintTimeOut
const gSmileyState = document.querySelector(".smiley") //Not good just having stuff out of code (functions)

//What about type casing in the ggame thing? SHoudl everything in it also start with g

function onInit(boardSIZE, MINES) {
    gLevel = {
        SIZE: boardSIZE,
        MINES: MINES,
        SAFECLICKS: 3

    }
    gGame = {
    isOn: false,
    isVictory: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    megaHintMode: false,
    gManualMode: false
}
   
    gGame.gManualMode = false


    gMegaHintArray = []
    mineArray = []

    gRecalculationArray = []
    var restartContainerText = document.querySelector(".restart-text")
    restartContainerText.innerText = "YOU LOST!!!"
    const boardScoreFormat = getFormatedTimePassed(localStorage.getItem(`board${gLevel.SIZE}score`))
    uiUpdater(".best-score span", boardScoreFormat)
    gLightBulb = false
    gUndoArray = []
    gGame.isVictory = false
    gHintUnitArray = []
    gGame.markedCount = 0
    gGame.revealedCount = 0
    gSafeClicks = gLevel.SAFECLICKS
    showElement(".buttons-that-effect-game")
    clearInterval(gIntervalId);
    clearTimeout(gReAddHintTimeOut)
    uiUpdater(".timer span", "00 : 000")
    uiUpdater(".mine-amount span", gLevel.MINES)
    uiUpdater(".revealed-count span", gGame.revealedCount)
    uiUpdater(".safe-click span", gSafeClicks)
    bulbReset()
    gGame.isOn = true
    gSmileyState.innerText = "😃"
    gLives = 3
    const elLives = document.querySelector('.life-counter span')
    elLives.innerText = gLives
    gFirstClick = true
    gBoard = []
    gBoard = buildBoard()
    renderBoard(gBoard)
    var sizeForUI = `/${(gLevel.SIZE * gLevel.SIZE) - gLevel.MINES}`

    uiUpdater(".revealed-count span:nth-child(2)", sizeForUI)
    uiUpdater(".mode ", "NORMAL")
    hideElement(".restart-container")
    hideElement(".undo-button")
    hideElement(".mine-exterminator")
    showElement(".manual-mines")
    


}


function buildBoard() {
    const board = createBoard(gLevel.SIZE)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false,
                isBlow: false,
                isRevealedByHint: false
            }
        }
    }


    return board

}


function renderBoard(board) {


    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {

            const currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })

            cellClass += ' normal'


            strHTML += `<td  class = "unit ${cellClass}" onmousedown="handleCellClick(event,this,${i},${j})"> <span>${TILE_IMG}</span>  </td>`


        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(".game-board")
    elContainer.innerHTML = strHTML
}


function renderBoardUnits(board, elCell) {
    gRecalculationArray = []
    startTimer()
    hideElement(".manual-mines")
    showElement(".undo-button")
    showElement(".mine-exterminator")


    if (gGame.gManualMode === false) {
        for (var i = 0; i < gLevel.MINES; i++) {
            var emptySpot = getRandEmptyLocation(gBoard)
            gBoard[emptySpot.i][emptySpot.j].isMine = true
            mineArray.push({ i: emptySpot.i, j: emptySpot.j })

            if (gBoard[emptySpot.i][emptySpot.j].minesAroundCount > 2) alert("hi")

        }
    }
    setMinesNextToCount(gBoard)
    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {

            var picName = TILE_IMG
            const currCell = board[i][j]
            var cellClass = getClassName({ i: i, j: j })

            if (currCell.isMine === true) { cellClass += ' mine'; picName = BOOM_IMG }
            else if (currCell.minesAroundCount === 0) { cellClass += ' one'; picName = PRESSED_IMG }
            else (cellClass += ' one')

            if (currCell.minesAroundCount > 0) {
                picName = `<img src="img/Tile${currCell.minesAroundCount}.png" class = "cell-image">`
                gRecalculationArray.push({ i: i, j: j })
            }

            strHTML += `<td  class  = "unit ${cellClass}" onmousedown = "handleCellClick(event, this, ${i},${j})"><span class ="true-form"> ${picName}</span><span class = "tile-img">${TILE_IMG}</span></td>`

        }
        strHTML += '</tr>'

    }
    strHTML += '</tbody></table>'


    const elContainer = document.querySelector(".game-board")
    elContainer.innerHTML = strHTML
    var cellClass = getClassName(elCell)
    const cellSelector = '.' + cellClass // '.cell-3-5'
    const elHell = document.querySelector(cellSelector)


}







function onCellClicked(elCell, i, j) {

    if (gGame.gManualMode === true && mineArray.length < 1) return
    if (gBoard[i][j].isBlow == true) return
    if (gFirstClick === true) {
        gExemptClick = { i: i, j: j }
        renderBoardUnits(gBoard, gExemptClick)
        gFirstClick = false
    }
    if (gGame.gManualMode === true) {
        gGame.gManualMode = false; mineArray = []
        uiUpdater(".mode ", "NORMAL")
    }
    if (gGame.megaHintMode === true) {
        gMegaHintArray.push({ i: i, j: j })
        var elCell = SelectOnlyElement(i, j)
        var elCellImage = elCell.querySelector(".tile-img img")

        elCellImage.src = "img/TileMega.png"

        if (gMegaHintArray.length >= 2) { megaHintReveal(gMegaHintArray) }
        return
    }
    if (gLightBulb === false) {
        if (gBoard[i][j].isMine === true) { loseLife(elCell, i, j); return }
    }
    expandReveal(gBoard, elCell, i, j)
    gameOverCheck()
    uiUpdater(".revealed-count span", gGame.revealedCount)
}






function onCellMarked(elCell, i, j) {

    if (gGame.gManualMode === true) {
        manualPlacement(elCell, i, j)
        return
    }
    if (gBoard[i][j].isRevealed === true) return
    if (gBoard[i][j].isBlow === true) return
   


    if (gBoard[i][j].isMarked === true) {
        const cellSelector = '.' + cellClass // '.cell-3-5'
        const elAllCell = document.querySelector(cellSelector)
        var trueForm = elCell.querySelector(".tile-img img")


        if (trueForm) {
            trueForm.src = 'img/TileUnknown.png'
            gBoard[i][j].isMarked = false
            gGame.markedCount--
            uiUpdater(".mark-count span", gGame.markedCount)


            return
        }
    }

    var cellClass = getClassName({ i: i, j: j })

    const cellSelector = '.' + cellClass // '.cell-3-5'
    const elAllCell = document.querySelector(cellSelector)
    var trueForm = elAllCell.querySelector(".tile-img img")
    if (trueForm) {
        if (gGame.markedCount >= gLevel.MINES) return
        trueForm.src = 'img/TileFlag.png'
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        uiUpdater(".mark-count span", gGame.markedCount)
        gameOverCheck()

    }
    gameOverCheck()
}




function expandReveal(board, elCell, i, j) {

    var cellClass = getClassName({ i: i, j: j })
    var cellSelector = '.' + cellClass // '.cell-3-5'
    var elSurroundCell = document.querySelector(cellSelector)
    var hintArray = []
    var undoClick = [] //also undo array was here
    var elTileReveal = elSurroundCell.querySelector(".tile-img img")
    if (gBoard[i][j].minesAroundCount > 0 && gLightBulb === false) {
        gGame.revealedCount++
        gBoard[i][j].isRevealed = true
        elTileReveal.src = TILE_NONE
        undoClick.push({ i: i, j: j })
        gUndoArray.push(undoClick)
        return
    }
    var emptySpotArray = []
    emptySpotArray.push({ i: i, j: j })




    for (var c = 0; c < emptySpotArray.length; c++) {
        for (var io = -1; io <= 1; io++) {
            for (var jo = -1; jo <= 1; jo++) {

                var ie = emptySpotArray[c].i
                var je = emptySpotArray[c].j
                var cellI = io + ie
                var cellJ = jo + je

                if (cellI > board.length - 1 || cellI < 0 || cellJ > board.length - 1 || cellJ < 0) continue
                var currCell = gBoard[cellI][cellJ]

                var cellClass = getClassName({ i: cellI, j: cellJ })
                var cellSelector = '.' + cellClass // '.cell-3-5'
                var elSurroundCell = document.querySelector(cellSelector)
                var elTileReveal = elSurroundCell.querySelector(".tile-img img")
                if (elTileReveal && currCell.isRevealed === false) {
                    if (currCell.isMine === true && gLightBulb === false) continue
                    if (currCell.isMarked === true) gGame.markedCount--
                    if (gLightBulb === true) { hintArray.push({ i: cellI, j: cellJ }); currCell.isRevealedByHint = true }
                    elTileReveal.src = TILE_NONE   //gUndoArray.push({ i: cellI, j: cellJ }) } line below at the end
                    if (gLightBulb === false) { currCell.isRevealed = true; gGame.revealedCount++; undoClick.push({ i: cellI, j: cellJ }) }
                    if ((currCell.minesAroundCount === 0) && gLightBulb === false) { emptySpotArray.push({ i: cellI, j: cellJ }) }
                }



            }

        }

    }
    gUndoArray.push(undoClick)
    if (gLightBulb === true) { gReAddHintTimeOut = setTimeout(() => { readdTile(hintArray) }, 5000) }
    bulbRemoval()
    if (gLightBulb === true) gLightBulb = false

    uiUpdater(".mark-count span", gGame.markedCount)
    gameOverCheck()
    emptySpotArray = []

}
function getClassName(position) {
    return `cell-${position.i}-${position.j}`
}
function countNeighborMines(board, row, col) {
    var mineCount = 0
    const rows = board.length;
    const cols = board[0].length; //Doesn't really matter as both are the same length but y'know, future proofing.
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const nextRow = row + i;
            const nextCol = col + j;
            if (nextRow >= 0 && nextRow < rows && nextCol >= 0 && nextCol < cols) {
                if (board[nextRow][nextCol].isMine) {
                    mineCount++
                }
            }
        }
    }
    return mineCount
}
function setMinesNextToCount(board) { //Can just use the global variable for board
    const rows = board.length;
    const cols = board[0].length;

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = countNeighborMines(board, i, j);
            }
        }
    }
}
function loseLife(elCell, i, j) {
    if (gGame.isOn === false) return
    gLives -= 1

    uiUpdater(".life-counter span", gLives)
    if (gLives > 0) {
        replaceImage(elCell, i, j, TILE_WARNING)
        gBoard[i][j].isBlow = true
        gTimedOut = setTimeout(() => {
            console.log(elCell)
            if (gBoard[i][j].isMine == true) {
                replaceImage(elCell, i, j, TILE_IMG)

                gBoard[i][j].isBlow = false
            }

        }, 3000)
        return
    }
    gameOverLossState(i, j)

}

function hideElement(selector) {
    const el = document.querySelector(selector)
    el.classList.add('hide')
}

function showElement(selector) {
    const el = document.querySelector(selector)
    el.classList.remove('hide')
}
function restartGame() {
    clearTimeout(gReAddHintTimeOut)
    onInit(gLevel.SIZE, gLevel.MINES)
}
function setDifficulty(boardSize, mineAmount) {
    gLevel.SIZE = boardSize
    gLevel.MINES = mineAmount



    onInit(boardSize, mineAmount)
}





function lifeUpdater() {
    const elLives = document.querySelector('.lifecounter span')
    elLives.innerText = gLives
}



function uiUpdater(uitoUpdate, statNumber) {
    const elNumber = document.querySelector(uitoUpdate)
    elNumber.innerText = statNumber
}



function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // '.cell-3-5'
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}




function getClassName(position) { //Correct all the misleading names
    return `cell-${position.i}-${position.j}`
}



function handleCellClick(event, cell, i, j) {

    uiUpdater(".revealed-count span", gGame.revealedCount)

    if (gGame.gManualMode == false) {
        if (gBoard[i][j].isRevealed === true) return
        if (cell.classList.contains("blow")) return
        if ((gBoard[i][j].isMarked === true) && (event.button !== 2)) return
        if (gGame.isOn === false) return
    }

    if (event.button === 2) { //This doesn't bring up the context menu which makes flagging less distracting. Setting up a disabler like I tried here would take too much work.
        event.preventDefault();
        onCellMarked(cell, i, j)
    }
    if (event.button === 0) {
        onCellClicked(cell, i, j)
    }
}
function replaceImage(cell, i, j, replacer) {
    var replacer = sourceFinder(replacer)
    var trueForm = selector(i, j, ".tile-img img")
    if (trueForm) {

        trueForm.src = replacer
    }
}
function sourceFinder(imagetoCut) {
    const startIndex = imagetoCut.indexOf("src=") + 5
    const endIndex = imagetoCut.indexOf('"', startIndex)
    const src = imagetoCut.slice(startIndex, endIndex)
    return src
}
function selector(i, j, stringtoselect) {  //Find out how to specifically call all functions with this name


    var cellClass = getClassName({ i: i, j: j })
    const cellSelector = '.' + cellClass
    const elAllCell = document.querySelector(cellSelector)
    var selectedElement = elAllCell.querySelector(stringtoselect)

    return selectedElement


}
function SelectOnlyElement(i, j) {

    var cellClass = getClassName({ i: i, j: j })
    const cellSelector = '.' + cellClass
    const elAllCell = document.querySelector(cellSelector)
    return elAllCell
}
function victoryScreen() //Ask in general should i put these in util? Or like.. since theyre so specific.. I dont know!!! Ughhh
{
    console.log(gBoard)
    if (gTimedOut) clearTimeout(gTimedOut)
    hideElement(".buttons-that-effect-game")
    gGame.isOn = false
    showElement(".restart-container")
    var restartContainerText = document.querySelector(".restart-text")
    restartContainerText.innerText = "YOU WON!!!"
    clearInterval(gIntervalId);
    gGame.isVictory = true
    var score = actualScoreCalculator()
    scoreChecker(score)



}
function gameOverCheck() {


    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine === false) {
                if (gBoard[i][j].isRevealed === false) return
            }
            if (gBoard[i][j].isMine === true) {

                if (gBoard[i][j].isMarked === false) return
            }


        }


    }

    victoryScreen()
}
function startTimer() {
    const elTimer = document.querySelector(".timer span");
    const startTime = Date.now();

    gIntervalId = setInterval(() => {
        const timeDiff = Date.now() - startTime;
        const timePassed = getFormatedTimePassed(timeDiff);
        elTimer.innerText = timePassed;
    }, 10);
}



function hintPress(elCell) { //OG Name: hintPress
    if (gGame.megaHintMode == true) return
    if (gLightBulb) {
        if (!elCell.classList.contains("for-removal")) return
        var hintImage = elCell.querySelector(".hint-ui img")
        hintImage.src = "img/Hint.png"
        gLightBulb = false
        elCell.classList.remove("for-removal")
        return
    }
    elCell.classList.add("for-removal")
    var hintImage = elCell.querySelector(".hint-ui img")
    hintImage.src = "img/HintBright.png"
    gLightBulb = true



}
function readdTile(hintArray) {
    console.log(hintArray)
    for (var i = 0; i < hintArray.length; i++) {
        var elHintLocation = selector(hintArray[i].i, hintArray[i].j, ".tile-img img")
        if (gBoard[hintArray[i].i][hintArray[i].j].isRevealed === true) continue
        elHintLocation.src = "img/TileUnknown.png"
        gBoard[hintArray[i].i][hintArray[i].j].isRevealedByHint = false

    }




}
function bulbRemoval() { //Bulb remmoval
    const hintsButton = document.querySelectorAll(".hints button")
    for (var i = 0; i < hintsButton.length; i++) {
        if (hintsButton[i].classList.contains("for-removal")) hintsButton[i].style.display = 'none'
            // hintsButton[i].remove()

    }
}
function bulbReset() {
    
    const hintsButton = document.querySelectorAll(".hints button")

     
    for (var i = 0; i < hintsButton.length; i++) {
        var currentButton = hintsButton[i]
        if (currentButton.classList.contains("for-removal")) currentButton.classList.remove("for-removal")
            currentButton.style.display = ''
        
            var elImage = currentButton.querySelector("img")
            elImage.src = "img/Hint.png"
            
            // hintsButton[i].remove()

    }
}

function scoreChecker(score) {
  
    const formattedScore = getFormatedTimePassed(score)
    const boardScore = localStorage.getItem(`board${gLevel.SIZE}score`)
    if (boardScore == 0) {
        localStorage.setItem(`board${gLevel.SIZE}score`, score);
    }
    else {
        if ((boardScore < score)) return
        localStorage.setItem(`board${gLevel.SIZE}score`, score);
    }

    uiUpdater(".best-score span", formattedScore)

}





function actualScoreCalculator() {
    var elTimerText = document.querySelector(".timer span")
    var formattedElTimerText = String(elTimerText.innerText)

    var normalNumber = Number(formattedElTimerText.replace(" : ", ""));

    return normalNumber
}
function gameOverLossState(i, j) {
    const rows = gBoard.length;
    const cols = gBoard[0].length;
    hideElement(".buttons-that-effect-game")
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var revealAll = selector(i, j, ".tile-img")
            if (revealAll) {
                revealAll.remove()

            }
        }
    }

    if (gTimedOut) clearTimeout(gTimedOut)
    clearInterval(gIntervalId);
    showElement(".restart-container")
    gSmileyState.innerText = "🤯"
    gGame.isOn = false
    actualScoreCalculator()
}
function getRandomSafeCell() {
    if (gSafeClicks <= 0) return
    if (!gFirstClick) { var safeClick = getRandEmptyLocation(gBoard); if (!safeClick) return }
    if (gFirstClick === true) {

        var safeClick = getRandomEmptyLocationForBegginingHint()
        var elAllCell = SelectOnlyElement(safeClick.i, safeClick.j)
        gBoard[safeClick.i][safeClick.j].isRevealedByHint = true
        gExemptClick = { i: safeClick.i, j: safeClick.j }
        renderBoardUnits(gBoard, elAllCell); gFirstClick = false;
    }

    elImageCell = selector(safeClick.i, safeClick.j, ".tile-img")


    var singleHintArray = []

    var currCell = gBoard[safeClick.i][safeClick.j]
    singleHintArray.push(safeClick)
    elImageCell = selector(safeClick.i, safeClick.j, ".tile-img img")
    gBoard[safeClick.i][safeClick.j].isRevealedByHint = true
    elImageCell.src = TILE_NONE
    gSafeClicks--
    uiUpdater(".safe-click span", gSafeClicks)
    gReAddHintTimeOut = setTimeout(() => { readdTile(singleHintArray) }, 5000)
}



function undoAction() {
   
    
    var gUndoIndex = gUndoArray.length - 1
    if (gUndoIndex < 0) return
    for (var i = 0; i < gUndoArray[gUndoIndex].length; i++) {
        var elUndoCellLocation = selector(gUndoArray[gUndoIndex][i].i, gUndoArray[gUndoIndex][i].j, ".tile-img img")
        elUndoCellLocation.src = "img/TileUnknown.png"
        gBoard[gUndoArray[gUndoIndex][i].i][gUndoArray[gUndoIndex][i].j].isRevealed = false
        console.log(gBoard[gUndoArray[gUndoIndex][i].i][gUndoArray[gUndoIndex][i].j])
        gGame.revealedCount--
    }
    // gUndoIndex++
    gUndoArray.pop()
    console.log(gUndoArray)
    uiUpdater(".revealed-count span", gGame.revealedCount)
}
function megaHintBtn() {
    gGame.megaHintMode = true
    var welcomeChange = document.querySelector(".welcome")
    welcomeChange.innerText = "MEGA MODE ACTIVE"
}
function megaHintReveal(gMegaHintArray) {
    gGame.megaHintMode = false
    var hintArray = []
    //Change the variable names later to yknow rows and cols
    var towerFirst = gMegaHintArray[0].i
    var lengthFirst = gMegaHintArray[0].j
    var lengthSecond = gMegaHintArray[1].j
    var towerSecond = gMegaHintArray[1].i
    if (gFirstClick === true) {

        var safeClick = getRandomEmptyLocationForBegginingHint()
        var elAllCell = SelectOnlyElement(safeClick.i, safeClick.j)
        gBoard[safeClick.i][safeClick.j].isRevealedByHint = true
        gExemptClick = { i: safeClick.i, j: safeClick.j }
        renderBoardUnits(gBoard, elAllCell); gFirstClick = false;
    }

    if (lengthSecond < lengthFirst) { [lengthFirst, lengthSecond] = [lengthSecond, lengthFirst] }
    if (towerFirst > towerSecond) { [towerFirst, towerSecond] = [towerSecond, towerFirst] }
    for (var i = towerFirst; i <= towerSecond; i++) {
        for (var j = lengthFirst; j <= lengthSecond; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMarked == true) {currCell.isMarked = false; gGame.markedCount--}
            
            elCell = SelectOnlyElement(i, j)
            elImageCell = elCell.querySelector(".tile-img img")
            elImageCell.src = TILE_NONE
            if (currCell.isRevealed === false) { hintArray.push({ i: i, j: j }); currCell.isRevealedByHint = true }
        }
    }
    uiUpdater(".mark-count span", gGame.markedCount) //TO FIX: MAKE THE MARKED STAY WHERE THEY WERE!!!
    var elMegaHint = document.querySelector(".mega-hint")
    elMegaHint.style.display = 'none'
    setTimeout(() => { readdTile(hintArray) }, 5000)
}


function mineExterminator() {

    var MineDeleteAmount = 3
    if (gFirstClick === true) return

    if (mineArray.length < 3) MineDeleteAmount = mineArray.length
    for (var i = 0; i < MineDeleteAmount; i++) {
        var randInt = getRandomIntInclusive(0, mineArray.length - 1)
        var currCellPos = mineArray[randInt]

        var currCell = gBoard[currCellPos.i][currCellPos.j]
        var elCell = SelectOnlyElement(currCellPos.i, currCellPos.j)
        var elTileImage = elCell.querySelector(".true-form img")
        var elTileImagey = elCell.querySelector(".tile-img img")
        elTileImagey.src = "img/TileUnknown.png"
        elTileImage.src = TILE_EMPTY
        currCell.isMine = false
        gRecalculationArray.push(...mineArray.splice(randInt, 1))


    }
    setMinesNextToCount(gBoard)
    reCalculator()


}
function reCalculator() {
    for (var i = 0; i < gRecalculationArray.length; i++) {
        var currCellPos = gRecalculationArray[i]
        var currCell = gBoard[currCellPos.i][currCellPos.j]
        var elCell = SelectOnlyElement(currCellPos.i, currCellPos.j)
        var elTileImage = elCell.querySelector(".true-form img")
        if (currCell.minesAroundCount === 0) elTileImage.src = `img/TileEmpty.png`
        else
            elTileImage.src = `img/Tile${currCell.minesAroundCount}.png`
    }
    gameOverCheck()

}
function manualMode() {
    var lengthy = mineArray.length
    if (gGame.gManualMode === true) {
        gGame.gManualMode = false


        for (var i = 0; i <= lengthy - 1; i++) {


            var elCell = SelectOnlyElement(mineArray[i].i, mineArray[i].j)
            undoMine(elCell, mineArray[i].i, mineArray[i].j)
        }
        mineArray = []
        uiUpdater(".mode ", "NORMAL")
        return
    }
    gGame.gManualMode = true
    uiUpdater(".mode ", "MANUAL")
}
function manualPlacement(elCell, i, j) {
    if (gBoard[i][j].isMine == true) { undoMine(elCell, i, j); return }
    gBoard[i][j].isMine = true
    mineArray.push({ i: i, j: j })
    var elImage = elCell.querySelector("span img")
    elImage.src = `img/TileMega.png`
    gLevel.MINES = mineArray.length
    uiUpdater(".mine-amount span", gLevel.MINES)
}


function undoMine(elCell, i, j) {
    for (var k = 0; k < mineArray.length; k++) {
        if ((mineArray[k].i === i) && (mineArray[k].j === j) || gGame.gManualMode == false) {
            var currCell = gBoard[mineArray[k].i][mineArray[k].j]


            var elImage = elCell.querySelector("span img")
            elImage.src = 'img/TileUnknown.png'


            if (gGame.manualMode == true) { mineArray.splice(k, 1); currCell.isMine = false; return }
            else { gBoard[i][j].isMine = false; return }

        }
    }

}