import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare (i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRow (i) {
        //Renderiza a linha i
        let lines = [];
        i *= 3;
        for (let j = 0; j < 3; j++) {
            lines.push(this.renderSquare((i + j)));
        }
        return (
            <div className="board-row">{lines}</div>
        )
    }

    render () {
        //Renderiza o tabuleiro
        return (
            <div>
                {Array(3).fill(1).map((x, i) => this.renderRow(i))}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
            sortVal: true,  /* true p/ jogadas mostradas na ordem ascendente */
        };
    }

    handleClick (i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo (step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });

    }

    rowColPlaying (timeLine, curIndex) {
        //Função que retorna a linha, coluna e se 'X' ou 'O' foi feito na jogada
        //Para ser usado na funcionalidade 'viagem no tempo'
        if (curIndex < 1) return null;
        const a = timeLine[curIndex - 1].squares;
        const b = timeLine[curIndex].squares;
        let col, row, letter;
        letter = (curIndex % 2 === 0 ? 'O' : 'X');
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                row = Math.floor(i / 3) + 1;
                col = (i % 3) + 1;
                return "" + letter + " on row " + row + ", col " + col;
            }
        }
        return null;
    }



    render () {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move, timeLine) => {
            let desc = move ?
                'Go to move #' + move + ': ' + this.rowColPlaying(timeLine, move) :
                'Go to game start';

            return (
                <li key={move + 5}>
                    <button onClick={() => this.jumpTo(move)}
                        //Altera o botão que está selecionado para negrito via CSS- classe "bold"
                        className={move === this.state.stepNumber ? 'bold' : 'notBold'}>
                        {desc}</button>
                </li>
            );
        });
        if (!this.state.sortVal) moves.reverse();

        let status;
        if (winner) {
            status = `Winner: ${winner}`;
        }
        else {
            status = `Next player: ${(this.state.xIsNext ? 'X' : 'O')}`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div><button className="sort-toggle" onClick={() => this.setState({ sortVal: !this.state.sortVal })}>
                        {this.state.sortVal ? "Change to descending order" : "Change to ascending order"}
                    </button></div>
                    <ol className="moves-list">{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner (squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
