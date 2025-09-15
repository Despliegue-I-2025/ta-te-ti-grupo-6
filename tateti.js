const express = require('express');
const app = express();
const PORT = 3000;
function verificarGanador(board) {
    // Todas las combinaciones posibles para ganar
    const combinacionesGanadoras = [
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
    for (let combo of combinacionesGanadoras) {
        const [a, b, c] = combo;
        if (tablero[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Devuelve "X" o "O"
        }
    }

    return null; // No hay ganador todavía
}

// Función para evaluar jugadas estratégicas
function evaluarJugadaEstrategica(board, player) {
    const oponente = player === 1 ? 2 : 1;
    const puntuaciones = Array(9).fill(0);

    // Priorizar el centro
    if (board[4] === 0) return 4;

    // Priorizar esquinas
    const esquinas = [0, 2, 6, 8];
    const esquinasVacias = esquinas.filter((pos) => board[pos] === 0);
    if (esquinasVacias.length > 0) {
      return esquinasVacias[Math.floor(Math.random() * esquinasVacias.length)];
    }

    // Priorizar lados
    const lados = [1, 3, 5, 7];
    const ladosVacios = lados.filter((pos) => board[pos] === 0);
    if (ladosVacios.length > 0) {
      return ladosVacios[Math.floor(Math.random() * ladosVacios.length)];
    }

    return -1;
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
    // Buscar posiciones vacías (asumiendo que 0 es vacío)
    const emptyPositions = board
        .map((v, i) => v === 0 ? i : null)
        .filter(i => i !== null);
    
    if (emptyPositions.length === 0) {
        return res.status(400).json({ error: 'No hay movimientos disponibles.' });
    }
    
    // Elegir una posición vacía al azar
    const move = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    res.json({ movimiento: move });
});

app.listen(PORT, () => {
    console.log(`Servidor de tateti escuchando en el puerto ${PORT}`);
});
