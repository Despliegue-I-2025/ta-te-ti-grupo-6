const express = require('express');
const app = express();
const PORT = 3000;

function togglePlayer(board) {
    const count1 = board.filter((cell) => cell === 1).length;
    const count2 = board.filter((cell) => cell ===2).length;
    return count1 <= count2 ?  1 : 2;
}

function checkWinner(board) {
    // Todas las combinaciones posibles para ganar
    const winnerCombinations = [
        [0, 1, 2], // fila superior
        [3, 4, 5], // fila del medio
        [6, 7, 8], // fila inferior
        [0, 3, 6], // columna izquierda
        [1, 4, 7], // columna central
        [2, 5, 8], // columna derecha
        [0, 4, 8], // diagonal principal
        [2, 4, 6]  // diagonal inversa
    ];

    // Revisar cada combinación
    for (let combo of winnerCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Devuelve "X" o "O"
        }
    }

    return null; // No hay ganador todavía
}

function findWinnerMove(board, player) {
    for (let i = 0; i < 9; i++) {
        if (board[i] === 0) {
            const temporaryBoard = [...board];
            temporaryBoard[i] = player;
            if (checkWinner(temporaryBoard) === player) {
                return i;
            }
        }
    }
    return -1;
}

// Función para evaluar jugadas estratégicas
function chooseStrategicMove(board) {
    // Priorizar el centro
    if (board[4] === 0) return 4;

    // Priorizar esquinas
    const corners = [0, 2, 6, 8];
    const emptyCorners = corners.filter((pos) => board[pos] === 0);
    if (emptyCorners.length > 0) {
      return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    }

    // Priorizar lados
    const sides = [1, 3, 5, 7];
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
        const strategicMove = chooseStrategicMove(actualPlayer);
        return strategicMove;
}

// Función para dibujar el tablero
function drawBoard(board, move = null) {
    const symbols = { 0: "·", 1: "X", 2: "O" };
    let output = "";
  
    for (let i = 0; i < 9; i++) {
      if (move === i) {
        output += `[${symbols[board[i]]}]`;
      } else {
        output += ` ${symbols[board[i]]} `;
      }
    
      if ((i + 1) % 3 === 0) {
        output += "\n";
      }
    }
    return output;
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
    if (!Array.isArray(board) || board.length !== 9) {
        return res.status(400).json({ error: 'El tablero debe ser un array de 9 posiciones.' });
    }
    
    const winner = checkWinner(board);
    if (winner !== null) {
    return res.status(400).json({
        error: 'El juego ya termino. Ganador: ${winner === 1 ? "X" : "O"}',
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
    jugador: player,
    tablero_ingresado: board,
    tablero_nuevo: newBoard,
    tablero: [
      newBoard.slice(0, 3),
      newBoard.slice(3, 6),
      newBoard.slice(6, 9),
    ],
    tablero_formateado: drawBoard(newBoard, move),
    estado_de_juego: newWinner !== null
        ? "victoria"
        : emptyPositions.length - 1 === 0
        ? "empate"
        : "en juego"
  });
});

app.listen(PORT, () => {
    console.log(`Servidor de tateti escuchando en el puerto ${PORT}`);
});
