//What to do about new versions of the project for git?
//Is my css styling and names fine?
//Is lines 96 to yknow a right way to do the brackets
//whats the sorting command again? Alt shift f?? I keep forgetting UGHH!!!!

//I put the gameover check EVERYWHERE but it doesn't feel right.
//ok finish this hint shit and then clean up the code and then you can replacde all the stuff you made code for with its functions

//Also to explain my reasoning for having the table render 2 images in one cell it's just something I thought would be easier to do. Might slightly regret working like this but whatever.
//Okay actual questions: Css styling names etc. What counts as a utility function ifi ts kind of specific? Are the brackets I did fine?
//What are the naming conventions again?
//if the hint stuff fails you can just disable clicking when a hint is on.. 
//Mine doesn't work with hint
//Do a flaggeed mine checker that only comes into play for the score
//how should the score thing even be calculcated? Im gonna do it so it doesn't matter time-wise and the whole if you won at first thing ill abandon
//OK YAIR SO FOR THE SCORE STUFF YOU CHECK IF ANYONE HAS WON YET. IF THEY HAVE THE HIGHEST SCORE WONT JUST BE OF MOST CLICKS ETC BUT WILL ALSO BE ABOUT TIME.
const gMine = '&#169;'
const gFloor = '&#9829;'
const TILE_IMG = '<img src="img/TileUnknown.png" class = "cellimage">'
const PRESSED_IMG = '<img src="img/TileEmpty.png" class = "cellimage">'
const BOOM_IMG = '<img src="img/TileExploded.png" class = "cellimage">'
const TILE_FLAG = '<img src="img/TileFlag.png" class = "cellimage">'
const LIGHT_BULB_OFF = '<img src="img/Hint.png" class = "hintUI">'
const TILE_WARNING = '<img src="img/TileWarning.png" class = "cellimage">'
//Is it normal to have this amount of global variables..?
//Still not fully sure how the source works but whatever..
//Remember to fix the victory screen 
//BUG: The light bulbs both disappear if you click on another while another one is in effect
var mineArray
var gTimedOut
var gBoard
var gFirstClick
var gExemptClick
var gLives
var gMines
var gIntervalId
var gLightBulb


const gSmileyState = document.querySelector(".smiley")
gLevel = {
    SIZE: 4,
    MINES: 2,
    BEATENONCE: false
}


gGame = {
    isOn: false,
    isVictory: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    hintsUsed: 0
}
//Make a grid table showing these off but the timer gotta be special

function onInit() {
    gLightBulb = false
    gGame.isVictory = false
    gHintUnitArray = []
    gGame.markedCount = 0
    gGame.revealedCount = 0
    clearInterval(gIntervalId);
    uiUpdater(".timer span","00 : 000")
    uiUpdater(".mineAmount span", gLevel.MINES)
     uiUpdater(".revealedCount span", gGame.revealedCount)
    
    gGame.isOn = true
    gSmileyState.innerText = "😃"
    gLives = 3
    const elLives = document.querySelector('.lifecounter span')
    elLives.innerText = gLives
    gFirstClick = true
    gBoard = buildBoard()
    renderBoard(gBoard)
     var sizeForUI = `/${(gLevel.SIZE * gLevel.SIZE) - gLevel.MINES}`
     
    uiUpdater(".revealedCount span:nth-child(2)", sizeForUI) 
    hideElement(".restartcontainer")
    //How am i supposed to call css elements and such.. Or like.. html classses.
   
    
}


function buildBoard() { 
    console.log(gLevel.SIZE)
    const board = createBoard(gLevel.SIZE)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false,
                isBlow: false
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
           

            strHTML += `<td  class = "unit ${cellClass}" onclick="onCellClicked(this,${i},${j})"> <span>${TILE_IMG}</span>  </td>`


        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(".hi")
    elContainer.innerHTML = strHTML
}

//Second one for testing how to actually do this.. I think I should render all the board, make it all invisible and only set visibility on the path that is clicked
function renderBoardUnits(board, elCell) {
    startTimer()
    mineArray = []
    for (var i = 0; i < gLevel.MINES; i++) {
        var emptySpot = getRandEmptyLocation(gBoard)
        gBoard[emptySpot.i][emptySpot.j].isMine = true
        mineArray.push({ i: emptySpot.i, j: emptySpot.j })

        if (gBoard[emptySpot.i][emptySpot.j].minesAroundCount > 2) alert("hi")

    }
    setMinesNegsCountTwo(gBoard)
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
                picName = `<img src="img/Tile${currCell.minesAroundCount}.png" class = "cellimage">`
            }
            console.log(picName)
            strHTML += `<td  class  = "unit ${cellClass}" onmousedown = "handleCellClick(event, this, ${i},${j})"><span class ="true-form"> ${picName}</span><span class = "tile-img">${TILE_IMG}</span></td>`

        }
        strHTML += '</tr>'

    }
    strHTML += '</tbody></table>'


    const elContainer = document.querySelector(".hi")
    elContainer.innerHTML = strHTML
    var cellClass = getClassName(elCell)
    const cellSelector = '.' + cellClass // '.cell-3-5'
    const elHell = document.querySelector(cellSelector)


}







function onCellClicked(elCell, i, j) {
   
    if (elCell.classList.contains("blow")) return
    var cellClass = getClassName({ i: i, j: j })

    if (gFirstClick == true) {
        gExemptClick = { i: i, j: j }
        renderBoardUnits(gBoard, gExemptClick)
        gFirstClick = false
        
    }

     
    if (gLightBulb == false ) {

    
    if (gBoard[i][j].isMine == true) { lossState(elCell, i, j); return }
    } //Line 188 to 210 are the qutoed stufff
        expandReveal(gBoard, elCell, i, j) 
        gameOverCheck()
         uiUpdater(".revealedCount span", gGame.revealedCount)


    }
   





function onCellMarked(elCell, i, j) { 
    //    if (elCell.classList.contains("flagged")) 

    if (gBoard[i][j].isRevealed == true) return
    if (gBoard[i][j].isBlow == true) return
    checkMines()
    console.log(gBoard[i][j])

    if (gBoard[i][j].isMarked == true) {
        const cellSelector = '.' + cellClass // '.cell-3-5'
        const elAllCell = document.querySelector(cellSelector)
        var trueForm = elCell.querySelector(".tile-img img")
        console.log(trueForm)

        if (trueForm) {
            trueForm.src = 'img/TileUnknown.png'
            gBoard[i][j].isMarked = false
            gGame.markedCount--
            uiUpdater(".markCount span", gGame.markedCount)
            
           
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
        uiUpdater(".markCount span", gGame.markedCount)
        gameOverCheck()

    }
    gameOverCheck()
}

function checkMines() { //This is just very debugging stuff, won't be in the final 'release'
    var flaggedMines = 0

    for (var i = 0; i < mineArray.length; i++) {


        var mineCell = gBoard[mineArray[i].i][mineArray[i].j]
        if (mineCell.isMarked == true) flaggedMines++


    }
    
   

}




function expandReveal(board, elCell, i, j) { 
    var cellClass = getClassName({ i: i, j: j })
    var cellSelector = '.' + cellClass // '.cell-3-5'
    var elHell = document.querySelector(cellSelector)
    var hintArray = []
     whaty = elHell.querySelector(".tile-img img")
    if (gBoard[i][j].minesAroundCount > 0 && gLightBulb == false) { 
        gGame.revealedCount++
        gBoard[i][j].isRevealed = true
        whaty.src = "img/TileNone.png"
        return
    }
   
    console.log(whaty)




    for (var io = -1; io <= 1; io++) {
        for (var jo = -1; jo <= 1; jo++) {
            var cellI = io + i
            var cellJ = jo + j


            if (cellI > board.length - 1 || cellI < 0 || cellJ > board.length - 1 || cellJ < 0) continue
            var currCell = gBoard[cellI][cellJ]
            var cellClass = getClassName({ i: cellI, j: cellJ })
            var cellSelector = '.' + cellClass // '.cell-3-5'
            var elSurroundCell = document.querySelector(cellSelector)
            var elTileReveal = elSurroundCell.querySelector(".tile-img img")
            if (elHell && currCell.isRevealed == false) {
                if (currCell.isMine == true && gLightBulb == false) continue
                hintArray.push({i : cellI, j : cellJ})
                elTileReveal.src = 'img/TileNone.png'
                if (gLightBulb == false) { currCell.isRevealed = true; gGame.revealedCount++}
            }

   

        }
        
    }
    if (gLightBulb == true) { setTimeout(() => { hintRemover(hintArray)}, 5000)}
     if (gLightBulb == true) gLightBulb = false
    gameOverCheck()

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
function setMinesNegsCountTwo(board) { //Can just use the global variable for board
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
function lossState(elCell, i, j) {
    if (gGame.isOn == false) return
    gLives -= 1

    uiUpdater(".lifecounter span", gLives)
    const rows = gBoard.length;
    const cols = gBoard[0].length;

    if (gLives > 0) {
        replaceImage(elCell, i, j, TILE_WARNING)
        gBoard[i][j].isBlow = true
        gTimedOut = setTimeout(() => {
            replaceImage(elCell, i, j, TILE_IMG)
    
            gBoard[i][j].isBlow = false
            console.log(elCell)
        }, 3000)
        return
    }
    //Instead, it calls for the score checker which does this
    var score = scoreCalculator()
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var revealAll = selector(i, j, ".tile-img")
            if (revealAll) {
                revealAll.remove()
                if (revealAll.classList.contains("mine")) replaceImage(elAllCell, i, j, BOOM_IMG)
            }
        }
    }

    if (gTimedOut) clearTimeout(gTimedOut)
    clearInterval(gIntervalId);
    showElement(".restartcontainer")
    gSmileyState.innerText = "🤯"
    gGame.isOn = false
    scoreChecker(score)
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
    onInit()
}
function setDifficulty(boardSize, mineAmount) {
    gLevel.SIZE = boardSize
    gLevel.MINES = mineAmount
    gLevel.BEATENONCE = localStorage.getItem(`beatenOnce${gLevel.SIZE}`)
    console.log(gLevel)

    onInit()
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




function getClassName(position) {
    return `cell-${position.i}-${position.j}`
}



function handleCellClick(event, cell, i, j) {
     uiUpdater(".revealedCount span", gGame.revealedCount)
    if (gBoard[i][j].isRevealed == true) return
    if (cell.classList.contains("blow")) return
    if ((gBoard[i][j].isMarked == true) && (event.button !== 1)) return
    if (gGame.isOn == false) return
    if (event.button === 1) { //This doesn't bring up the context menu which makes flagging less distracting. Setting up a disabler like I tried here would take too much work.
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
        console.log(trueForm)
        trueForm.src = replacer
    }
}
function sourceFinder(imagetoCut) {
    const startIndex = imagetoCut.indexOf("src=") + 5
    const endIndex = imagetoCut.indexOf('"', startIndex)
    const src = imagetoCut.slice(startIndex, endIndex)
    return src
}
function selector(i, j, stringtoselect) { //Is this like, ideal?


    var cellClass = getClassName({ i: i, j: j })
    const cellSelector = '.' + cellClass
    const elAllCell = document.querySelector(cellSelector)
    var selectedElement = elAllCell.querySelector(stringtoselect)

    return selectedElement


}
function victoryScreen() //Ask in general should i put these in util? Or like.. since theyre so specific.. I dont know!!! Ughhh
{
    console.log(gBoard)
    if (gTimedOut) clearTimeout(gTimedOut)
    gGame.isOn = false
    showElement(".restartcontainer")
    var restartContainerText = document.querySelector(".restarttext")
    restartContainerText.innerText = "YOU WON!!!"
    clearInterval(gIntervalId);
    gGame.isVictory = true
    scoreChecker()

}
function gameOverCheck() {

    var spoopy = 0

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine == false) {
                if (gBoard[i][j].isRevealed == false) return
            }
            if (gBoard[i][j].isMine == true) {

                if (gBoard[i][j].isMarked == false) return
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



function hintPress(thos){ //What should I call something like this in-code?
   
    if (gLightBulb == true) {
         if (!thos.classList.contains("REMOVAL")) return
        var Bleh = thos.querySelector(".hintUI img")
        Bleh.src = "img/Hint.png"
        gLightBulb = false
        thos.classList.remove("REMOVAL")
        return
    }   
    thos.classList.add("REMOVAL")
    var Bleh = thos.querySelector(".hintUI img")
    Bleh.src = "img/HintBright.png"
    gLightBulb = true
   
  
    
}
function hintRemover(hintArray){
    
    for (var i = 0; i < hintArray.length; i++)
    {
       var elHintLocation = selector(hintArray[i].i, hintArray[i].j, ".tile-img img")
       if (gBoard[hintArray[i].i][hintArray[i].j].isRevealed == true) continue
       elHintLocation.src = "img/TileUnknown.png"
   
    }
    console.log(gBoard)
    bulbRemoval()
    
 
}
function bulbRemoval(){
    const hintsButton = document.querySelectorAll(".hints button")
    for (var i = 0; i < hintsButton.length; i++){
        if (hintsButton[i].classList.contains("REMOVAL"))  hintsButton[i].remove()
           
    } gGame.hintsUsed++
}

function scoreChecker(score){

const boardScore = localStorage.getItem(`board${gLevel.SIZE}score`)
if (!boardScore){
    localStorage.setItem(`board${gLevel.SIZE}score`, score);
}
else {
    if (boardScore > score) return
    localStorage.setItem(`board${gLevel.SIZE}score`, score);
}

   uiUpdater(".bestScore span", score)

}


//1 - 0.TimePassed * Score
function scoreCalculator(){
    var score = 0
    for (var i = 0; i < gBoard.length; i++){
        for (var j = 0; j < gBoard[0].length; j++){
            var currCell = gBoard[i][j] 
            if (currCell.isRevealed == true) score += 1000
            if ((currCell.isMine == true) && (currCell.isMarked == true)) score += 5000

        }
    }
    
    score -= (gGame.hintsUsed * 750)
    if (score < 0) score = 0
    console.log(score)
    alert(score)
    return score
}