const express = require('express');
const app = express();
const PORT = 3000;

const WIN_LINES = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],  
  [0,4,8], [2,4,6]
  ];


  function checkWinner(b) {
  for (const [a, c, d] of WIN_LINES) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) {
      return { winner: b[a], line: [a, c, d] };
    }
  }
  return { winner: null, line: null };
}

function isDraw(b) {
  return b.every(v => v !== null);
}

boardEl.addEventListener('click', (e) => {
  if (gameOver) return;
  const cell = e.target.closest('.cell');
  if (!cell) return;

  const i = Number(cell.dataset.i);
  if (board[i] !== null) return;

  board[i] = currentPlayer;
  cell.textContent = currentPlayer;

   const { winner, line } = checkWinner(board);
  if (winner) {
    gameOver = true;
    line.forEach(idx => cells[idx].classList.add('win'));
    turnoEl.textContent = `¡Ganó ${winner}! 🎉`;
    return;
  }

  if (isDraw(board)) {
    gameOver = true;
    turnoEl.textContent = 'Empate 😅';
    return;
  }

   togglePlayer();
});

btnReiniciar.addEventListener('click', () => {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  cells.forEach(c => { c.textContent = ''; c.classList.remove('win'); });
  actualizarTurno();
});

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
