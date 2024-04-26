const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const jogadorHumano = 'X';
const jogadorComputador = 'O';

function verificarVencedor(tabuleiro, jogador) {
    const dimensao = tabuleiro.length;

    for (let i = 0; i < dimensao; i++) {
        let linhaVitoriosa = true;
        let colunaVitoriosa = true;

        for (let j = 0; j < dimensao; j++) {
            if (tabuleiro[i][j] !== jogador) {
                linhaVitoriosa = false;
            }
            if (tabuleiro[j][i] !== jogador) {
                colunaVitoriosa = false;
            }
        }

        if (linhaVitoriosa || colunaVitoriosa) {
            return true;
        }
    }

    let diagonal1Vitoriosa = true;
    let diagonal2Vitoriosa = true;

    for (let i = 0; i < dimensao; i++) {
        if (tabuleiro[i][i] !== jogador) {
            diagonal1Vitoriosa = false;
        }
        if (tabuleiro[i][dimensao - 1 - i] !== jogador) {
            diagonal2Vitoriosa = false;
        }
    }

    if (diagonal1Vitoriosa || diagonal2Vitoriosa) {
        return true;
    }

    return false;
}

function celulasVazias(tabuleiro) {
    let vazias = [];
    const dimensao = tabuleiro.length;

    for (let i = 0; i < dimensao; i++) {
        for (let j = 0; j < dimensao; j++) {
            if (tabuleiro[i][j] === "") {
                vazias.push([i + 1, j + 1]);
            }
        }
    }

    return vazias;
}

function imprimirTabuleiro(tabuleiro) {
    const dimensao = tabuleiro.length;

    for (let i = 0; i < dimensao; i++) {
        console.log(tabuleiro[i].join(" | "));
    }
}

function miniMax(tabuleiro, jogador, profundidade, alpha, beta) {
    const max = (a, b) => a > b ? a : b;
    const min = (a, b) => a < b ? a : b;

    let vazias = celulasVazias(tabuleiro);

    if (verificarVencedor(tabuleiro, jogadorHumano)) {
        return { score: -1, indice: null };
    }
    if (verificarVencedor(tabuleiro, jogadorComputador)) {
        return { score: 1, indice: null };
    }
    if (vazias.length === 0 || profundidade === 0) {
        return { score: 0, indice: null };
    }

    profundidade--;

    let melhorMovimento = null;
    let melhorScore = jogador === jogadorComputador ? -Infinity : Infinity;

    for (let i = 0; i < vazias.length; i++) {
        let [x, y] = vazias[i];
        let novoTabuleiro = tabuleiro.map(row => [...row]);
        novoTabuleiro[x - 1][y - 1] = jogador;

        let resultado = miniMax(novoTabuleiro, jogador === jogadorComputador ? jogadorHumano : jogadorComputador, profundidade, alpha, beta);
        let score = resultado.score;

        if (jogador === jogadorComputador) {
            if (score > melhorScore) {
                melhorScore = score;
                melhorMovimento = vazias[i];
            }
            alpha = max(alpha, melhorScore);
            if (beta <= alpha) {
                break;
            }
        } else {
            if (score < melhorScore) {
                melhorScore = score;
                melhorMovimento = vazias[i];
            }
            beta = min(beta, melhorScore);
            if (beta <= alpha) {
                break;
            }
        }
    }

    return { score: melhorScore, indice: melhorMovimento };
}

function jogadaHumano(tabuleiro) {
    rl.question(`Digite a linha e a coluna do seu movimento (separados por espaço): `, (input) => {
        const [linha, coluna] = input.split(' ').map(val => parseInt(val));

        if (isNaN(linha) || isNaN(coluna) || linha < 1 || linha > tabuleiro.length || coluna < 1 || coluna > tabuleiro.length || tabuleiro[linha - 1][coluna - 1] !== "") {
            console.log('Movimento inválido. Tente novamente.');
            jogadaHumano(tabuleiro);
        } else {
            tabuleiro[linha - 1][coluna - 1] = jogadorHumano;
            imprimirTabuleiro(tabuleiro);

            if (verificarVencedor(tabuleiro, jogadorHumano)) {
                console.log('Você ganhou!');
                rl.close();
            } else if (celulasVazias(tabuleiro).length === 0) {
                console.log('Empate!');
                rl.close();
            } else {
                jogadaComputador(tabuleiro);
            }
        }
    });
}

function jogadaComputador(tabuleiro) {
    console.log("Vez do computador:");
    let profundidade = tabuleiro.length * tabuleiro.length;
    let resultado = miniMax(tabuleiro, jogadorComputador, profundidade, -Infinity, Infinity);
    let [linha, coluna] = resultado.indice;
    tabuleiro[linha - 1][coluna - 1] = jogadorComputador;
    imprimirTabuleiro(tabuleiro);

    if (verificarVencedor(tabuleiro, jogadorComputador)) {
        console.log('O computador ganhou!');
        rl.close();
    } else if (celulasVazias(tabuleiro).length === 0) {
        console.log('Empate!');
        rl.close();
    } else {
        jogadaHumano(tabuleiro);
    }
}

function iniciarJogo() {
    rl.question(`Digite a dimensão do tabuleiro: `, (dimensao) => {
        if (isNaN(dimensao) || dimensao < 3) {
            console.log('Dimensão inválida. A dimensão deve ser um número inteiro maior ou igual a 3.');
            iniciarJogo();
        } else {
            let tabuleiro = Array.from({ length: dimensao }, () => Array.from({ length: dimensao }, () => ""));
            imprimirTabuleiro(tabuleiro);
            jogadaHumano(tabuleiro);
        }
    });
}

iniciarJogo();
