const express = require('express');
const app = express();
const PORT = 3011;

function togglePlayer(board) {
    const count1 = board.filter((cell) => cell === 1).length;
    const count2 = board.filter((cell) => cell ===2).length;
    return count1 <= count2 ?  1 : 2;
}

// Facu y Lauty G
function checkWinner(board) {
    // Todas las combinaciones posibles para ganar
    const winnerCombinations = [
        [0, 6, 12, 18],
        [1, 7, 13, 19],
        [5, 11, 17, 23],
        [6, 12, 18, 24],
        [3, 7, 11, 15],
        [4, 8, 12, 16],
        [8, 12, 16, 20],
        [9, 13, 17, 21],
        [0, 1, 2, 3],
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [6, 7, 8, 9],
        [10, 11, 12, 13],
        [11, 12, 13, 14],
        [15, 16, 17, 18],
        [16, 17, 18, 19],
        [20, 21, 22, 23],
        [21, 22, 23, 24],
        [0, 5, 10, 15],
        [5, 10, 15, 20],
        [1, 6, 11, 16],
        [6, 11, 16, 21],
        [2, 7, 12, 17],
        [7, 12, 17, 22],
        [3, 8, 13, 18],
        [8, 13, 18, 23],
        [4, 9, 14, 19],
        [9, 14, 19, 24]
    ];

    // Revisar cada combinación
   for (let combo of winnerCombinations) {
        const [a, b, c, d] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === board[d]) {
            return board[a];
        }
    }

    return null; // No hay ganador todavía
}

function findWinnerMove(board, player) {
    for (let i = 0; i < 25; i++) {
        if (board [i] === 0 ) {
            const TemporaryBoard=[...board];
             TemporaryBoard[i] = player;
            if (checkWinner(TemporaryBoard) === player) {
                return i;
            }
        }
    }
    return -1;
}

// Función para evaluar jugadas estratégicas
// debemos hacer esta función con movimientos más erráticos
function chooseStrategicMove(board) {
    // Priorizar el centro
    if (board[12] === 0) return 12;

    // Centro expandido (posiciones alrededor del centro)
    const center = [6, 7, 8, 11, 13, 16, 17, 18];
    const emptyCenter = center.filter((pos) => board[pos] === 0);
    if (emptyCenter.length > 0) {
        return emptyCenter[Math.floor(Math.random() * emptyCenter.length)];
    }

    // Priorizar esquinas
    const corners = [0, 4, 20, 24];
    const emptyCorners = corners.filter((pos) => board[pos] === 0);
    if (emptyCorners.length > 0) {
      return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    }

    // Priorizar lados
    const sides = [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23];
    const emptySides = sides.filter((pos) => board[pos] === 0);
    if (emptySides.length > 0) {
      return emptySides[Math.floor(Math.random() * emptySides.length)];
    }
}

function bestMove(board) {
        const actualPlayer = togglePlayer(board);
        const adversary = actualPlayer === 1 ? 2 : 1;
        
        // 1. Buscar jugada ganadora
        const winnerMove = findWinnerMove(board, actualPlayer);
        if (winnerMove !== -1) return winnerMove;

        // 2. Bloquear jugada del oponente
        const blockMove = findWinnerMove(board, adversary);
        if (blockMove !== -1) return blockMove;

        // 3. Jugada estratégica
        const strategicMove = chooseStrategicMove(board);
        return strategicMove;
}

// GET /move?board=[0,1,0,2,0,0,0,0,0]
app.get('/move', (req, res) => {
    let boardParam = req.query.board;
    let board;
    try {
        board = JSON.parse(boardParam);
    } catch (e) {
        return res.status(400).json({ error: 'Parámetro board inválido. Debe ser un array JSON.' });
    }
    if (!Array.isArray(board) || board.length !== 25) {
        return res.status(400).json({ error: 'El tablero debe ser un array de 25 posiciones.' });
    }

    // Verificar si el juego ya terminó
    const winner = checkWinner(board);
    if (winner !== null) {
        return res.status(400).json({
            error: `El juego ya terminó. El ganador es el ${winner === 1 ? "Jugador 1 (X)" : "Jugador 2 (O)"}`,
        });
    }
    
    // Buscar posiciones vacías (asumiendo que 0 es vacío)
    const emptyPositions = board
        .map((v, i) => v === 0 ? i : null)
        .filter(i => i !== null);
    
    if (emptyPositions.length === 0) {
        return res.status(400).json({ error: 'No hay movimientos disponibles.' });
    }

    // Llamar la función que determina el mejor movimiento y el jugador actual
    const move = bestMove(board);
    const player = togglePlayer(board); 

    // Mostrar el tablero con el movimiento
    const newBoard = [...board];
    newBoard[move] = player;

    // Para mostrar el estado del juego
    const newWinner = checkWinner(newBoard);

    res.json({
        movimiento: move,
        tablero_para_pruebas: [
            newBoard.slice(0, 5),
            newBoard.slice(5, 10),
            newBoard.slice(10, 15),
            newBoard.slice(15, 20),
            newBoard.slice(20, 25)
        ]
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor de tateti escuchando en el puerto ${PORT}`);
    });
}

module.exports = { app, togglePlayer, checkWinner, findWinnerMove, chooseStrategicMove, bestMove };