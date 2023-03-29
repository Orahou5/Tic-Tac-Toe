const players = {
    X: {
        player: 0,
        symbol: "X"
    },
    
    O: {
        player: 1,
        symbol: "O"
    }
}

const gameState = {
    grid: [
        [],
        [],
        []
    ],
    currentPlayer: undefined,
    winner: undefined,
    changePlayer(){
        if(this.currentPlayer === players.O) {
            this.currentPlayer = players.X
        } else {
            this.currentPlayer = players.O
        }
    }
};

function tickCell(element){
    if(gameState.winner !== undefined) return; 

    if(element.textContent === ""){
        element.textContent = gameState.currentPlayer.symbol
        
        processGame(element)
    }
}

function processGame(element){
    const currentMove = changeGrid(element);

    if(checkWinner(currentMove)){
        winGame();
        return
    }

    if(checkStalemate()){
        editAnnouncement("Match nul");
        return
    }
    
    gameState.changePlayer()
}

function checkStalemate(){
    console.log(gameState.grid.some(row => row.some(cell => cell === "")))
    return !gameState.grid.some(row => row.some(cell => cell === ""))
}

function winGame(){
    gameState.winner = gameState.currentPlayer

    editAnnouncement(`Joueur ${gameState.winner.symbol} a gagné`)

    console.log(gameState.winner)
}

function changeGrid(element){
    const row = element.parentNode.rowIndex;
    const cell = element.cellIndex;
    gameState.grid[row][cell] = gameState.currentPlayer.symbol

    return {row, cell, symbol: gameState.currentPlayer.symbol}
}

function initiateGame(){
    gameState.currentPlayer = players.X;
    gameState.grid = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    gameState.winner = undefined;
}

function checkWinner(currentMove){
    const {row: x, cell: y, symbol} = currentMove

    const checkGridBySymbol = checkGrid(symbol)

    let row = true;
    let line = true;
    const diagonal = {
        left : true,
        right : true
    }

    for(let i = 0; i<3; i++){
        row = checkGridBySymbol(i, y, row);
        line = checkGridBySymbol(x, i, line);
        diagonal.left = checkGridBySymbol(i, i, diagonal.left);
        diagonal.right = checkGridBySymbol(i, 2-i, diagonal.right);
    }

    return row || line || diagonal.left || diagonal.right
}

function checkGrid(symbol){
    return function(x, y, condition){
        if(condition === false) return false;

        if(gameState.grid[x][y] !== symbol){
            return false;
        }
    
        return condition;
    }
}

function editAnnouncement(string){
    document.getElementById('announcement').textContent = string;
}

document.addEventListener("DOMContentLoaded", function(event) {
    initiateGame();
    editAnnouncement(`Joueur ${gameState.currentPlayer.symbol} commence`)
});