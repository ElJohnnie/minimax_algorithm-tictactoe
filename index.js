const readline = require('readline');

class TicTacToe {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.jogadorHumano = 'X';
        this.jogadorComputador = 'O';
    }

    async iniciarJogo() {
        const dimensao = await this.obterDimensaoTabuleiro();
        const tabuleiro = this.criarTabuleiro(dimensao);
        this.imprimirTabuleiro(tabuleiro);
        await this.jogadaHumano(tabuleiro);
    }

    async obterDimensaoTabuleiro() {
        return new Promise((resolve) => {
            this.rl.question(`Digite a dimensão do tabuleiro: `, (dimensao) => {
                if (isNaN(dimensao) || dimensao < 3) {
                    console.log('Dimensão inválida. A dimensão deve ser um número inteiro maior ou igual a 3.');
                    resolve(this.obterDimensaoTabuleiro());
                } else {
                    resolve(parseInt(dimensao));
                }
            });
        });
    }

    criarTabuleiro(dimensao) {
        return Array.from({ length: dimensao }, () => Array.from({ length: dimensao }, () => ""));
    }

    imprimirTabuleiro(tabuleiro) {
        const dimensao = tabuleiro.length;
        for (let i = 0; i < dimensao; i++) {
            console.log(tabuleiro[i].join(" | "));
        }
    }

    async jogadaHumano(tabuleiro) {
        const [linha, coluna] = await this.obterJogada();

        if (isNaN(linha) || isNaN(coluna) || linha < 1 || linha > tabuleiro.length || coluna < 1 || coluna > tabuleiro.length || tabuleiro[linha - 1][coluna - 1] !== "") {
            console.log('Movimento inválido. Tente novamente.');
            await this.jogadaHumano(tabuleiro);
        } else {
            tabuleiro[linha - 1][coluna - 1] = this.jogadorHumano;
            this.imprimirTabuleiro(tabuleiro);

            if (this.verificarVencedor(tabuleiro, this.jogadorHumano)) {
                console.log('Você ganhou!');
                this.rl.close();
            } else if (this.celulasVazias(tabuleiro).length === 0) {
                console.log('Empate!');
                this.rl.close();
            } else {
                await this.jogadaComputador(tabuleiro);
            }
        }
    }

    obterJogada() {
        return new Promise((resolve) => {
            this.rl.question(`Digite a linha e a coluna do seu movimento (separados por espaço): `, (input) => {
                const [linha, coluna] = input.split(' ').map(val => parseInt(val));
                resolve([linha, coluna]);
            });
        });
    }

    verificarVencedor(tabuleiro, jogador) {
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

    celulasVazias(tabuleiro) {
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

    async jogadaComputador(tabuleiro) {
        console.log("Vez do computador:");
        const profundidade = tabuleiro.length * tabuleiro.length;
        const resultado = this.miniMax(tabuleiro, this.jogadorComputador, profundidade, -Infinity, Infinity);
        const [linha, coluna] = resultado.indice;
        tabuleiro[linha - 1][coluna - 1] = this.jogadorComputador;
        this.imprimirTabuleiro(tabuleiro);

        if (this.verificarVencedor(tabuleiro, this.jogadorComputador)) {
            console.log('O computador ganhou!');
            this.rl.close();
        } else if (this.celulasVazias(tabuleiro).length === 0) {
            console.log('Empate!');
            this.rl.close();
        } else {
            await this.jogadaHumano(tabuleiro);
        }
    }

    miniMax(tabuleiro, jogador, profundidade, alpha, beta) {
        const max = (a, b) => a > b ? a : b;
        const min = (a, b) => a < b ? a : b;

        let vazias = this.celulasVazias(tabuleiro);

        if (this.verificarVencedor(tabuleiro, this.jogadorHumano)) {
            return { score: -1, indice: null };
        }
        if (this.verificarVencedor(tabuleiro, this.jogadorComputador)) {
            return { score: 1, indice: null };
        }
        if (vazias.length === 0 || profundidade === 0) {
            return { score: 0, indice: null };
        }

        profundidade--;

        let melhorMovimento = null;
        let melhorScore = jogador === this.jogadorComputador ? -Infinity : Infinity;

        for (let i = 0; i < vazias.length; i++) {
            let [x, y] = vazias[i];
            let novoTabuleiro = tabuleiro.map(row => [...row]);
            novoTabuleiro[x - 1][y - 1] = jogador;

            let resultado = this.miniMax(novoTabuleiro, jogador === this.jogadorComputador ? this.jogadorHumano : this.jogadorComputador, profundidade, alpha, beta);
            let score = resultado.score;

            if (jogador === this.jogadorComputador) {
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
}

const jogo = new TicTacToe();
jogo.iniciarJogo();
