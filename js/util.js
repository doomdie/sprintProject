function createBoard(value) {
    const mat = []
    for (var i = 0; i < value; i++){
        const row = []
        for (var j = 0; j < value; j++) {
            row.push((''))
        }
          mat.push(row)
    }
  
    return mat
}
function getRandEmptyLocation(board) {

    const emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine === false && board[i][j] != board[gExemptClick.i][gExemptClick.j]) {
                emptyCells.push({ i, j })
            }
        }
    }

    const randIdx = getRandomIntInclusive(0, emptyCells.length - 1)
    return emptyCells[randIdx]
}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}