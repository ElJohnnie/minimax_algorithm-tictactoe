function jogar(tabuleiroAtualizado) {
    let jogada = encontrarMelhorJogada(tabuleiroAtualizado, proximoJogador);
    return jogada;
}

function encontrarMelhorJogada(tabuleiro, jogador) {
    let melhorPonto = [-1, -1];
    let melhorValor = -Infinity;

    for (let i = 0; i < tabuleiro.length; i++) {
        for (let j = 0; j < tabuleiro[0].length; j++) {
            if (tabuleiro[i][j] === "") {
                tabuleiro[i][j] = jogador;
                let valor = minimax(tabuleiro, 0, false);
                tabuleiro[i][j] = "";
                if (valor > melhorValor) {
                    melhorValor = valor;
                    melhorPonto = [i, j];
                }
            }
        }
    }

    return melhorPonto;
}

function minimax(tabuleiro, profundidade, isMaximizing) {

    if (isMaximizing) {
        let melhorValor = -Infinity;
        for (let i = 0; i < tabuleiro.length; i++) {
            for (let j = 0; j < tabuleiro[0].length; j++) {
                if (tabuleiro[i][j] === "") {
                    tabuleiro[i][j] = "x";
                    let valor = minimax(tabuleiro, profundidade + 1, false);
                    tabuleiro[i][j] = "";
                    melhorValor = Math.max(melhorValor, valor);
                }
            }
        }
        return melhorValor;
    } else {
        let melhorValor = Infinity;
        for (let i = 0; i < tabuleiro.length; i++) {
            for (let j = 0; j < tabuleiro[0].length; j++) {
                if (tabuleiro[i][j] === "") {
                    tabuleiro[i][j] = "o";
                    let valor = minimax(tabuleiro, profundidade + 1, true);
                    tabuleiro[i][j] = "";
                    melhorValor = Math.min(melhorValor, valor);
                }
            }
        }
        return melhorValor;
    }
}

function jogar(tabuleiroAtualizado) {
    let countX = 0;
    let countO = 0;

    for (let i = 0; i < tabuleiroAtualizado.length; i++) {
        for (let j = 0; j < tabuleiroAtualizado[i].length; j++) {
            if (tabuleiroAtualizado[i][j] === "x") {
                countX++;
            } else if (tabuleiroAtualizado[i][j] === "o") {
                countO++;
            }
        }
    }

    let jogada = encontrarJogadaAleatoria(tabuleiroAtualizado);

    return jogada;
}

function encontrarJogadaAleatoria(tabuleiro) {
    let linha;
    let coluna;

    do {
        linha = Math.floor(Math.random() * tabuleiro.length);
        coluna = Math.floor(Math.random() * tabuleiro[0].length);
    } while (tabuleiro[linha][coluna] !== "");

    return [linha, coluna];
}


