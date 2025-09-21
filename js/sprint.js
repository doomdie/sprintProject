//Line 166 what should I do when i have 2 for loops that have the same variable name but i need em different? what should I name i and j?
//Currently i am just Workshopping the code out it is VERY messy I know but when i'm finished with getting it working I will clean it up. 
//But thats another question.. Is that the right way to go? Probably not, right..? But I need to ask to be sure.
//Is it okay for the code to be messy at first but to clean it up later?
//Whats the difference between oncellclicked and expandreveal also?

const gMine =  	'&#169;'
const gFloor = '&#9829;'
var gBoard
var gFirstClick
var gExemptClick 

gLevel =  {
    SIZE: 4,
    MINES: 2
}


gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function onInit() {
    // renderBoard(createBoard(gLevel.SIZE))
    gFirstClick = true
    gBoard = buildBoard()
    renderBoard(gBoard)
}


function buildBoard() {
    const board = createBoard(gLevel.SIZE)
    for (var i = 0; i < board.length; i++){
        for (var j = 0 ; j < board.length; j++) {
            board[i][j] =  {
                minesAroundCount: 0,
                isRevealed: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    
    
    return board

}
// get a random empty spot using that one function to put how many mines, use glevel.mines to figure out how many 
function checkForMine(i, j) {
    if (gFirstClick == true) 
        { 
            gExemptClick = {i: i, j: j}
            renderBoab(gBoard)
            gFirstClick = false
        }
    else {

    }


   
}

function setMinesNegsCount(board){

for (var eye = 0; eye < board.length; eye++) {

for (var jay = 0; jay < board.length; jay++ )
{
    if (board[eye][jay].isMine == true) continue
var MineCount = 0
for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
        
          
            const nextI = eye + i
            const nextJ = jay + j
            if ((nextI >= board.length) || (nextI < 0 )|| (nextJ >= board.length) || (nextJ < 0) || (nextI == eye) && (nextJ == jay)) continue
            
            if (board[nextI][nextJ].isMine == true) 
                {
                MineCount++
                // console.log(MineCount)
             
                }
           
    }
    
     board[eye][jay].minesAroundCount = MineCount
}
   
}
}
}
function renderBoard(board) {
    
    
    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i ++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            
            const currCell  = board[i][j]
        // const cell = board[i][j].Texture
        var cellClass = getClassName({ i: i, j: j })
        
         cellClass += ' normal'
        // const className = `cell cell-${i}-${j}`
        
        strHTML += `<td class = "${cellClass}" onclick="onCellClicked(this,${i},${j})"></td>`
        // console.log(strHTML)
        }
        strHTML += '</tr>'
    }
     strHTML += '</tbody></table>'

     const elContainer = document.querySelector(".hi")
     elContainer.innerHTML = strHTML
}

//Second one for testing how to actually do this.. I think I should render all the board, make it all invisible and only set visibility on the path that is clicked
function renderBoab(board, elCell) {
    
    for (var i = 0; i < gLevel.MINES; i++)
    {
        var emptySpot = getRandEmptyLocation(gBoard)
        gBoard[emptySpot.i][emptySpot.j].isMine = true
        
    }
    setMinesNegsCount(board)
    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i ++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            var Breer =''
            const currCell  = board[i][j]
        // const cell = board[i][j].Texture
        var cellClass = getClassName({ i: i, j: j })
        if (currCell.isMine === true) {cellClass += ' mine'; Breer = "Mine"}
        else if (currCell.minesAroundCount  === 1)  { cellClass += ' one'; Breer = "1"}
        else if (currCell.minesAroundCount === 2) {cellClass += ' two'; Breer = "2"}
         else if (currCell.minesAroundCount === 0) cellClass += ' normal'
        // const className = `cell cell-${i}-${j}`
        cellClass += ' hidden'
        strHTML += `<td class = "${cellClass}" onclick="onCellClicked(this,${i},${j})"><span>${Breer}</span></td>`
        // console.log(strHTML)
        }
        strHTML += '</tr>'
    }
     strHTML += '</tbody></table>'
    
    
     const elContainer = document.querySelector(".hi")
     elContainer.innerHTML = strHTML
     var cellClass = getClassName(elCell)
    const cellSelector = '.' + cellClass // '.cell-3-5'
    const elHell = document.querySelector(cellSelector)
    elHell.classList.remove("hidden")
}







function onCellClicked(elCell, i, j) {

var cellClass = getClassName({ i: i, j: j })

const cellSelector = '.' + cellClass // '.cell-3-5'
const elHell = document.querySelector(cellSelector)
// elHell.classList.add('hah')
// cellClass.classList.remove('hidden')

 if (gFirstClick == true) 
        { 
            gExemptClick = {i: i, j: j}
            renderBoab(gBoard, gExemptClick)
            gFirstClick = false
            
           
        }
    if (gBoard[i][j].minesAroundCount > 0) elCell.classList.remove("hidden")
    if (gBoard[i][j].minesAroundCount == 0) {expandReveal(gBoard, elCell, i, j); console.log("hi")}
   

}



function onCellMarked(elCell, i, j) {

}


function checkGameover() {

}
function expandReveal(board, elCell, i, j) {
if (board[i][j].isMine == true) elCell.classList.add("blow")

if ((board[i][j].minesAroundCount > 0)  && (elCell.classList.contains("hidden"))) { elCell.classList.remove('hidden'); return } //Is it ok to write like this?
 for (var io = -1; io <= 1; io++) {
    for (var jo = -1; jo <= 1; jo++) { 
       var cellI = io + i
       var cellJ = jo + j
       
        if (cellI > board.length - 1 || cellI < 0 || cellJ > board.length - 1 || cellJ < 0) continue
        var cellClass = getClassName({ i: cellI, j: cellJ })
        const cellSelector = '.' + cellClass // '.cell-3-5'
        const elHell = document.querySelector(cellSelector)
        if (elHell.classList.contains('hidden'))  elHell.classList.remove('hidden')
        }
}
}
function getClassName(position) {
    return `cell-${position.i}-${position.j}`
}
