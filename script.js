
function obtenerEnteroAleatorio(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  


function generarSecuencia() {
    const secuencia = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    while (secuencia.length) {
        const aleatorio = obtenerEnteroAleatorio(0, secuencia.length - 1);
        const nombre = secuencia.splice(aleatorio, 1)[0];
        secuenciaTetrominos.push(nombre);
    }
}
  

function obtenerSiguienteTetromino() {
    if (secuenciaTetrominos.length === 0) {
        generarSecuencia();
    }
  
    const nombre = secuenciaTetrominos.pop();
    const matriz = tetrominos[nombre];
  
  
    const col = Math.floor(campoDeJuego[0].length / 2 - matriz[0].length / 2);
  
    
    const fila = nombre === 'I' ? -1 : -2;
  
    return {
        nombre: nombre, 
        matriz: matriz,    
        fila: fila,        
        col: col      
    };
}
  

function rotar(matriz) {
    const N = matriz.length - 1;
    return matriz.map((fila, i) =>
        fila.map((valor, j) => matriz[N - j][i])
    );
}
  
// verifica si la nueva matriz/fila/columna es válida
function esMovimientoValido(matriz, filaCelda, colCelda) {
    for (let fila = 0; fila < matriz.length; fila++) {
        for (let col = 0; col < matriz[fila].length; col++) {
            if (matriz[fila][col] && (
                // fuera de los límites del juego
                colCelda + col < 0 ||
                colCelda + col >= campoDeJuego[0].length ||
                filaCelda + fila >= campoDeJuego.length ||
                // colisiona con otra pieza
                campoDeJuego[filaCelda + fila][colCelda + col])
            ) {
                return false;
            }
        }
    }
    return true;
}
  

function colocarTetromino() {
    for (let fila = 0; fila < tetromino.matriz.length; fila++) {
        for (let col = 0; col < tetromino.matriz[fila].length; col++) {
            if (tetromino.matriz[fila][col]) {
              
                if (tetromino.fila + fila < 0) {
                    return mostrarFinDelJuego();
                }
                campoDeJuego[tetromino.fila + fila][tetromino.col + col] = tetromino.nombre;
            }
        }
    }
  
  
    for (let fila = campoDeJuego.length - 1; fila >= 0; ) {
        if (campoDeJuego[fila].every(celda => !!celda)) {
           
            for (let f = fila; f >= 0; f--) {
                for (let c = 0; c < campoDeJuego[f].length; c++) {
                    campoDeJuego[f][c] = campoDeJuego[f - 1][c];
                }
            }
        } else {
            fila--;
        }
    }
  
    tetromino = obtenerSiguienteTetromino();
}
  

function mostrarFinDelJuego() {
    cancelAnimationFrame(rAF);
    finDelJuego = true;
  
    contexto.fillStyle = 'black';
    contexto.globalAlpha = 0.75;
    contexto.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
  
    contexto.globalAlpha = 1;
    contexto.fillStyle = 'white';
    contexto.font = '36px monospace';
    contexto.textAlign = 'center';
    contexto.textBaseline = 'middle';
    contexto.fillText('¡GAME OVER!', canvas.width / 2, canvas.height / 2);
}
  
const canvas = document.getElementById('game');
const contexto = canvas.getContext('2d');
const grid = 32;
const secuenciaTetrominos = [];
  

const campoDeJuego = [];
  

for (let fila = -2; fila < 20; fila++) {
    campoDeJuego[fila] = [];
    for (let col = 0; col < 10; col++) {
        campoDeJuego[fila][col] = 0;
    }
}
  

const tetrominos = {
    'I': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0],
    ],
    'L': [
        [0,0,1],
        [1,1,1],
        [0,0,0],
    ],
    'O': [
        [1,1],
        [1,1],
    ],
    'S': [
        [0,1,1],
        [1,1,0],
        [0,0,0],
    ],
    'Z': [
        [1,1,0],
        [0,1,1],
        [0,0,0],
    ],
    'T': [
        [0,1,0],
        [1,1,1],
        [0,0,0],
    ]
};
  

const colores = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
};
  
let conteo = 0;
let tetromino = obtenerSiguienteTetromino();
let rAF = null;  
let finDelJuego = false;
  
// bucle del juego
function bucle() {
    rAF = requestAnimationFrame(bucle);
    contexto.clearRect(0, 0, canvas.width, canvas.height);
  
    
    for (let fila = 0; fila < 20; fila++) {
        for (let col = 0; col < 10; col++) {
            if (campoDeJuego[fila][col]) {
                const nombre = campoDeJuego[fila][col];
                contexto.fillStyle = colores[nombre];
              
                contexto.fillRect(col * grid, fila * grid, grid - 1, grid - 1);
            }
        }
    }
  

    if (tetromino) {
      
        if (++conteo > 35) {
            tetromino.fila++;
            conteo = 0;
  
            // coloca la pieza si choca con algo
            if (!esMovimientoValido(tetromino.matriz, tetromino.fila, tetromino.col)) {
                tetromino.fila--;
                colocarTetromino();
            }
        }
  
        contexto.fillStyle = colores[tetromino.nombre];
  
        for (let fila = 0; fila < tetromino.matriz.length; fila++) {
            for (let col = 0; col < tetromino.matriz[fila].length; col++) {
                if (tetromino.matriz[fila][col]) {
                    // dibujar 1 px más pequeño que el grid crea un efecto de rejilla
                    contexto.fillRect((tetromino.col + col) * grid, (tetromino.fila + fila) * grid, grid - 1, grid - 1);
                }
            }
        }
    }
}
  

document.addEventListener('keydown', function (event) {
    if (finDelJuego) return;
  
    if (event.key === 'ArrowLeft') {
        if (esMovimientoValido(tetromino.matriz, tetromino.fila, tetromino.col - 1)) {
            tetromino.col--;
        }
    } else if (event.key === 'ArrowRight') {
        if (esMovimientoValido(tetromino.matriz, tetromino.fila, tetromino.col + 1)) {
            tetromino.col++;
        }
    } else if (event.key === 'ArrowDown') {
        if (esMovimientoValido(tetromino.matriz, tetromino.fila + 1, tetromino.col)) {
            tetromino.fila++;
        }
    } else if (event.key === 'ArrowUp') {
        const rotada = rotar(tetromino.matriz);
        if (esMovimientoValido(rotada, tetromino.fila, tetromino.col)) {
            tetromino.matriz = rotada;
        }
    }
});

await Swal.fire({
    title: "Bienvenido a mi tetris uwu",
    width: 600,
    padding: "3em",
    color: "#716add",
    background: "#fff",
    backdrop: `
      rgba(0,0,123,0.4)
      url("https://i.gifer.com/PYh.gif")
      left top
      no-repeat
    `
  });
bucle();



