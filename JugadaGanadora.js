// Función para verificar si hay un ganador
// Recibe el tablero como un array de 9 posiciones
// Ejemplo de tablero: ["X", "O", "X", null, "O", null, "X", null, "O"]
// Retorna "X" o "O" si alguien ganó, o null si no hay ganador todavía

function verificarGanador(tablero) {
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
        if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
            return tablero[a]; // Devuelve "X" o "O"
        }
    }

    return null; // No hay ganador todavía
}
moduleexports = verificarGanador;
