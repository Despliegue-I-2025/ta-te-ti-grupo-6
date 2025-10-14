const { checkWinner, findWinnerMove, chooseStrategicMove, togglePlayer, bestMove } = require('../tateti');

describe('checkWinner', () => {
    it('debe detectar ganador en fila', () => {
        const board = [
            1, 1, 1, 1, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ];
        expect(checkWinner(board)).toBe(1);
    });

    it('debe detectar ganador en columna', () => {
        const board = [
            2, 0, 0, 0, 0,
            2, 0, 0, 0, 0,
            2, 0, 0, 0, 0,
            2, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ];
        expect(checkWinner(board)).toBe(2);
    });

    it('debe detectar ganador en diagonal principal', () => {
        const board = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0,
            0, 0, 0, 0, 0
        ];
        expect(checkWinner(board)).toBe(1);
    });

    it('debe detectar ganador en diagonal secundaria', () => {
        const board = [
            0, 0, 0, 2, 0,
            0, 0, 2, 0, 0,
            0, 2, 0, 0, 0,
            2, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ];
        expect(checkWinner(board)).toBe(2);
    });

    it('debe devolver null cuando no hay ganador', () => {
        const board = [
            1, 2, 1, 2, 1,
            2, 1, 2, 1, 2,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ];
        expect(checkWinner(board)).toBeNull();
    });

    it('debe detectar ganador en diferentes combinaciones', () => {
        const board = [
            0, 1, 1, 1, 1,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ];
        expect(checkWinner(board)).toBe(1);
    });
});

describe('findWinnerMove', () => {
    it('debe encontrar jugada ganadora para el jugador 1', () => {
        const board = [
            1, 1, 1, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ];
        expect(findWinnerMove(board, 1)).toBe(3);
    });

    it('debe encontrar jugada ganadora para el jugador 2', () => {
        const board = [
            0, 0, 0, 0, 2,
            0, 0, 0, 0, 2,
            0, 0, 0, 0, 2,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ];
        expect(findWinnerMove(board, 2)).toBe(19);
    });

    it('debe devolver -1 cuando no hay jugada ganadora', () => {
        // Tablero donde el jugador 1 no puede ganar en un movimiento
        const board = [
            1, 2, 1, 2, 1,
            2, 1, 2, 1, 2,
            1, 2, 0, 2, 1,
            2, 1, 2, 0, 2,
            1, 2, 1, 2, 0
        ];
        expect(findWinnerMove(board, 1)).toBe(-1);
    });

    it('debe encontrar jugada ganadora en diagonal', () => {
        const board = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ];
        expect(findWinnerMove(board, 1)).toBe(18);
    });
});

describe('chooseStrategicMove', () => {
    it('debe priorizar el centro (posición 12) cuando está vacío', () => {
        const board = new Array(25).fill(0);
        expect(chooseStrategicMove(board)).toBe(12);
    });

    it('debe elegir una posición del centro expandido cuando el centro está ocupado', () => {
        const board = new Array(25).fill(0);
        board[12] = 1;
        const centerPositions = [6, 7, 8, 11, 13, 16, 17, 18];
        const move = chooseStrategicMove(board);
        expect(centerPositions).toContain(move);
    });

    it('debe elegir una esquina cuando el centro y centro expandido están ocupados', () => {
        const board = new Array(25).fill(0);
        [6, 7, 8, 11, 12, 13, 16, 17, 18].forEach(pos => board[pos] = 1);
        const corners = [0, 4, 20, 24];
        const move = chooseStrategicMove(board);
        expect(corners).toContain(move);
    });

    it('debe elegir un lado cuando otras posiciones prioritarias están ocupadas', () => {
        const board = new Array(25).fill(0);
        [0, 4, 6, 7, 8, 11, 12, 13, 16, 17, 18, 20, 24].forEach(pos => board[pos] = 1);
        const sides = [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23];
        const move = chooseStrategicMove(board);
        expect(sides).toContain(move);
    });

    it('debe devolver una posición vacía válida', () => {
        const board = new Array(25).fill(1);
        board[10] = 0;
        expect(chooseStrategicMove(board)).toBe(10);
    });
});

describe('togglePlayer', () => {
    it('debe devolver 1 cuando hay igual cantidad de jugadas', () => {
        const board = [
            1, 2, 1, 2, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ];
        expect(togglePlayer(board)).toBe(1);
    });

    it('debe devolver 2 cuando hay más jugadas del jugador 1', () => {
        const board = [
            1, 1, 2, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ];
        expect(togglePlayer(board)).toBe(2);
    });

    it('debe devolver 1 para tablero vacío', () => {
        const board = new Array(25).fill(0);
        expect(togglePlayer(board)).toBe(1);
    });

    it('debe alternar correctamente entre jugadores', () => {
        const board1 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const board2 = [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const board3 = [1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        
        expect(togglePlayer(board1)).toBe(2);
        expect(togglePlayer(board2)).toBe(1);
        expect(togglePlayer(board3)).toBe(2);
    });
});

describe('bestMove', () => {
    it('debe priorizar jugada ganadora', () => {
        const board = [
            1, 1, 1, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ];
        // Jugador actual debería ser 1 (tiene menos movimientos)
        expect(bestMove(board)).toBe(3);
    });

    it('debe priorizar bloquear jugada del oponente', () => {
        const board = [
            2, 2, 2, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ];
        // Jugador actual debería ser 1, debe bloquear en posición 3
        expect(bestMove(board)).toBe(3);
    });

    it('debe elegir movimiento estratégico cuando no hay jugadas ganadoras', () => {
        const board = new Array(25).fill(0);
        board[0] = 1;
        board[1] = 2;
        
        const move = bestMove(board);
        expect(move).toBeGreaterThanOrEqual(0);
        expect(move).toBeLessThan(25);
        expect(board[move]).toBe(0);
    });
});

describe('Juego completo', () => {
    it('debe detectar empate cuando no hay movimientos disponibles pero no hay ganador', () => {
          // Tablero realmente lleno sin 4 en línea
        const board = [
            1, 2, 1, 2, 1,
            2, 1, 2, 1, 2,
            1, 2, 2, 1, 2,
            2, 1, 1, 2, 1,
            1, 2, 2, 1, 2 
        ];
        expect(checkWinner(board)).toBeNull();
    });

    it('debe encontrar movimientos válidos en diferentes situaciones', () => {
        const board = new Array(25).fill(0);
        board[0] = 1;
        board[1] = 2;
        
        const move = bestMove(board);
        expect(move).toBeGreaterThanOrEqual(0);
        expect(move).toBeLessThan(25);
        expect(board[move]).toBe(0);
    });
});

// Test adicional para el endpoint (opcional, necesitarías supertest)
describe('API Endpoint', () => {
    it('debe manejar correctamente el flujo del juego', () => {
        // Este test verificaría la integración con Express
        // Necesitarías instalar y usar 'supertest' para probar el endpoint
        expect(true).toBe(true); // Placeholder
    });
});